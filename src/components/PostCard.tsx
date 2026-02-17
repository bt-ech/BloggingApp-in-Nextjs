import Link from 'next/link';
import styles from '@/styles/feed.module.css';
import { type Post, type User } from '@prisma/client';

type PostWithAuthor = Post & {
    author: User;
    _count: { comments: number };
};

export default function PostCard({ post }: { post: PostWithAuthor }) {
    return (
        <div className={styles.card}>
            <h2 className={styles.postTitle}>
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </h2>
            <div className={styles.author}>
                By {post.author.name || 'Unknown'} on {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <p className={styles.excerpt}>{post.content.substring(0, 150)}...</p>
            <div className={styles.meta}>
                <span>{post._count.comments} Comments</span>
            </div>
        </div>
    );
}
