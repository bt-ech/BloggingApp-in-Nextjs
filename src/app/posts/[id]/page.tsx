import { prisma } from '@/lib/prisma';
import styles from '@/styles/post.module.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import CommentSection from '@/components/CommentSection';
import { deletePost } from '@/actions/post';

export default async function PostPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await auth();
    const post = await prisma.post.findUnique({
        where: { id: params.id },
        include: {
            author: true,
            comments: {
                include: { author: true },
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!post) {
        notFound();
    }

    const isAuthor = session?.user?.email === post.author.email;

    return (
        <div className={styles.container}>
            <article className={styles.article}>
                <header className={styles.header}>
                    <h1 className={styles.title}>{post.title}</h1>
                    <div className={styles.meta}>
                        <div className={styles.authorInfo}>
                            <span>By {post.author.name}</span>
                            {post.author.linkedinUrl && (
                                <a href={post.author.linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.linkedinLink}>
                                    LinkedIn Profile
                                </a>
                            )}
                        </div>
                        <time className={styles.date}>
                            {new Date(post.createdAt).toLocaleDateString()}
                        </time>
                    </div>
                </header>
                <div className={styles.content}>{post.content}</div>

                {isAuthor && (
                    <div className={styles.actions}>
                        <form action={async () => {
                            'use server';
                            await deletePost(post.id);
                        }}>
                            <button className={styles.deleteButton}>Delete Post</button>
                        </form>
                    </div>
                )}
            </article>

            <CommentSection postId={post.id} comments={post.comments} />
        </div>
    );
}
