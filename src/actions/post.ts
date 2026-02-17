'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const PostSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
});

export async function createPost(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: 'Not authenticated' };
    }

    const validatedFields = PostSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
    });

    if (!validatedFields.success) {
        return { error: 'Invalid fields' };
    }

    try {
        await prisma.post.create({
            data: {
                title: validatedFields.data.title,
                content: validatedFields.data.content,
                published: true,
                author: { connect: { email: session.user.email } },
            },
        });
    } catch (error) {
        return { error: 'Failed to create post' };
    }

    revalidatePath('/');
    redirect('/');
}

export async function deletePost(postId: string) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: 'Not authenticated' };
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { author: true }
    });

    if (!post) {
        return { error: 'Post not found' };
    }

    if (post.author.email !== session.user.email) {
        return { error: 'Not authorized' };
    }

    await prisma.post.delete({ where: { id: postId } });
    revalidatePath('/');
    return { success: 'Post deleted' };
}
