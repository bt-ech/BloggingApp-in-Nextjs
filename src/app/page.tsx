import { auth } from '@/auth';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import PostCard from '@/components/PostCard';
import styles from '@/styles/feed.module.css';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    author: true;
    _count: { select: { comments: true } };
  };
}>;

export default async function Home() {
  const session = await auth();
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: true,
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className={styles.feedContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Latest Posts</h1>
        {session?.user && (
          <Link href="/posts/create" className={styles.createButton}>
            <span>+</span> Create Post
          </Link>
        )}
      </header>
      {posts.length === 0 ? (
        <p>No posts yet. Be the first to write one!</p>
      ) : (
        posts.map((post: PostWithRelations) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
