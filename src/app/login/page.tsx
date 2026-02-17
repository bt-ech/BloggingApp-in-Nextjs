'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { authenticate } from '@/actions/auth';
import styles from '@/styles/auth.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <button className={styles.button} aria-disabled={pending}>
            {pending ? 'Logging in...' : 'Login'}
        </button>
    );
}

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>Welcome Back</h1>
                <form action={dispatch}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="email">
                            Email
                        </label>
                        <input
                            className={styles.input}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="user@example.com"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="password">
                            Password
                        </label>
                        <input
                            className={styles.input}
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                            <Link href="/forgot-password" className={styles.link} style={{ fontSize: '0.875rem' }}>
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                    {errorMessage && (
                        <div className={styles.error} aria-live="polite" aria-atomic="true">
                            <p>{errorMessage}</p>
                        </div>
                    )}
                    <LoginButton />
                </form>
                <p className={styles.linkText}>
                    Don't have an account?{' '}
                    <Link href="/register" className={styles.link}>
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
