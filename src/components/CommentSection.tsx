'use client';

import { useSession } from 'next-auth/react';
import { addComment } from '@/actions/comment';
import { useRef } from 'react';
import styles from '@/styles/post.module.css';

// We can define the type for comments here or import from Prisma
type CommentWithAuthor = {
    id: string;
    content: string;
    createdAt: Date;
    author: {
        name: string | null;
        image: string | null;
    };
};

export default function CommentSection({
    postId,
    comments,
}: {
    postId: string;
    comments: CommentWithAuthor[];
}) {
    const { data: session } = useSession();
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(formData: FormData) {
        await addComment(formData);
        formRef.current?.reset();
    }

    return (
        <div className={styles.commentsSection}>
            <h3>Comments</h3>
            <div className={styles.commentList}>
                {comments.map((comment) => (
                    <div key={comment.id} className={styles.commentCard}>
                        <div className={styles.commentHeader}>
                            <strong>{comment.author.name || 'Anonymous'}</strong>
                            <span className={styles.commentDate}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p>{comment.content}</p>
                    </div>
                ))}
                {comments.length === 0 && <p>No comments yet.</p>}
            </div>

            {session?.user ? (
                <form action={handleSubmit} ref={formRef} className={styles.commentForm}>
                    <input type="hidden" name="postId" value={postId} />
                    <textarea
                        name="content"
                        className={styles.commentInput}
                        placeholder="Add a comment..."
                        required
                        rows={3}
                    />
                    <button type="submit" className={styles.button}>
                        Post Comment
                    </button>
                </form>
            ) : (
                <p>Please log in to comment.</p>
            )}
        </div>
    );
}
