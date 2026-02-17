'use client';

import { useActionState } from 'react';
import { forgotPassword } from '@/actions/auth';
import styles from '@/styles/auth.module.css';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button className={styles.button} disabled={pending}>
            {pending ? 'Sending...' : 'Send Reset Link'}
        </button>
    );
}

export default function ForgotPasswordPage() {
    const [message, dispatch] = useActionState(forgotPassword, undefined);

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>Forgot Password</h1>
                <form action={dispatch}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="email">
                            Email Address
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
                    {message && (
                        <div className={styles.error} style={{ backgroundColor: message.includes('sent') ? '#dcfce7' : undefined, color: message.includes('sent') ? '#166534' : undefined }}>
                            <p>{message}</p>
                        </div>
                    )}
                    <SubmitButton />
                </form>
                <p className={styles.linkText}>
                    <Link href="/login" className={styles.link}>
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
