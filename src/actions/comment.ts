'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CommentSchema = z.object({
    content: z.string().min(1, 'Comment cannot be empty'),
    postId: z.string(),
});

export async function addComment(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: 'Not authenticated' };
    }

    const validatedFields = CommentSchema.safeParse({
        content: formData.get('content'),
        postId: formData.get('postId'),
    });

    if (!validatedFields.success) {
        return { error: 'Invalid fields' };
    }

    const { content, postId } = validatedFields.data;

    try {
        await prisma.comment.create({
            data: {
                content,
                post: { connect: { id: postId } },
                author: { connect: { email: session.user.email } },
            },
        });
    } catch (error) {
        return { error: 'Failed to add comment' };
    }

    revalidatePath(`/posts/${postId}`);
    return { success: 'Comment added' };
}
