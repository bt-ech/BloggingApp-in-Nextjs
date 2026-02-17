'use client';

import { useRef, useState, useEffect } from 'react';
import { register } from '@/actions/auth';
import styles from '@/styles/auth.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';

function RegisterButton() {
    const { pending } = useFormStatus();
    return (
        <button className={styles.button} aria-disabled={pending}>
            {pending ? 'Creating Account...' : 'Register'}
        </button>
    );
}

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    async function clientAction(formData: FormData) {
        const result = await register(formData);
        if (result?.error) {
            setError(result.error);
        } else {
            // Ideally redirect or show success
            router.push('/login');
        }
    }

    if (!mounted) return null;

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>Create Account</h1>
                <form action={clientAction} ref={formRef}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="name">
                            Name
                        </label>
                        <input
                            className={styles.input}
                            id="name"
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            required
                        />
                    </div>
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
                    </div>
                    <div className={styles.error} aria-live="polite" aria-atomic="true">
                        {error && <p>{error}</p>}
                    </div>
                    <RegisterButton />
                </form>
                <p className={styles.linkText}>
                    Already have an account?{' '}
                    <Link href="/login" className={styles.link}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
