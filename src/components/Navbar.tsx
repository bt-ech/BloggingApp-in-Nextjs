'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const handleLogout = () => {
        signOut({ callbackUrl: '/login' });
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    BlogApp
                </Link>
                <div className={styles.links}>
                    <Link href="/" className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}>
                        Home
                    </Link>
                    {session?.user ? (
                        <>
                            <Link
                                href="/profile"
                                className={`${styles.link} ${pathname === '/profile' ? styles.active : ''}`}
                            >
                                Profile
                            </Link>
                            <button onClick={handleLogout} className={styles.button}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className={`${styles.link} ${pathname === '/login' ? styles.active : ''}`}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
