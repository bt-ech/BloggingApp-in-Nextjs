'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const ProfileSchema = z.object({
    linkedinUrl: z.string().url().optional().or(z.literal('')),
});

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: 'Not authenticated' };
    }

    const validatedFields = ProfileSchema.safeParse({
        linkedinUrl: formData.get('linkedinUrl'),
    });

    if (!validatedFields.success) {
        return { error: 'Invalid LinkedIn URL' };
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                linkedinUrl: validatedFields.data.linkedinUrl,
            },
        });
        revalidatePath('/profile');
        return { success: 'Profile updated successfully!' };
    } catch (error) {
        return { error: 'Failed to update profile' };
    }
}
