'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/mail';
import bcrypt from 'bcryptjs';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
});

export async function register(formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        name: formData.get('name'),
    });

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' };
    }

    const { email, password, name } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: 'Email already in use!' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    try {
        await signIn('credentials', {
            email,
            password,
            redirect: false,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials after registration.' };
                default:
                    return { error: 'Something went wrong.' };
            }
        }
        throw error;
    }

    return { success: 'User created!' };
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', { ...Object.fromEntries(formData), redirectTo: '/' });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

import { randomBytes } from 'crypto';

export async function forgotPassword(prevState: string | undefined, formData: FormData) {
    const email = formData.get('email') as string;

    if (!email) {
        return 'Please provide an email address.';
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        // For security, don't reveal that the user exists, but for this demo ensuring it works is fine.
        // Usually return "If an account exists, an email has been sent."
        return 'If an account exists, an email has been sent.';
    }

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600 * 1000);

    await prisma.verificationToken.deleteMany({
        where: { identifier: email },
    });

    await prisma.verificationToken.create({
        data: {
            identifier: email,
            token,
            expires,
        },
    });

    // Send email
    try {
        await sendPasswordResetEmail(email, token);
        return 'Password reset link sent! Check your email.';
    } catch (error) {
        console.error('Failed to send email:', error);
        return 'Failed to send email. Please try again later.';
    }
}

export async function resetPassword(prevState: string | undefined, formData: FormData) {
    const token = formData.get('token') as string;
    const password = formData.get('password') as string;

    if (!token || !password) {
        return 'Missing token or password.';
    }

    if (password.length < 6) {
        return 'Password must be at least 6 characters.';
    }

    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
    });

    if (!verificationToken) {
        return 'Invalid or expired token.';
    }

    if (new Date() > verificationToken.expires) {
        return 'Token has expired.';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { email: verificationToken.identifier },
        data: { password: hashedPassword },
    });

    await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: verificationToken.identifier, token } },
    });

    return 'success'; // Special string to indicate success for redirect in client
}
