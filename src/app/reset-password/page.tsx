'use client';

import { useActionState } from 'react';
import { resetPassword } from '@/actions/auth';
import styles from '@/styles/auth.module.css';
import { useFormStatus } from 'react-dom';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button className={styles.button} disabled={pending}>
            {pending ? 'Resetting...' : 'Reset Password'}
        </button>
    );
}

import { Suspense } from 'react';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [state, dispatch] = useActionState(resetPassword, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state === 'success') {
            router.push('/login?reset=success');
        }
    }, [state, router]);

    if (!token) {
        return (
            <div className={styles.container}>
                <div className={styles.formCard}>
                    <h1 className={styles.title}>Invalid Link</h1>
                    <p>The password reset link is invalid or missing.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>Reset Password</h1>
                <form action={dispatch}>
                    <input type="hidden" name="token" value={token} />
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="password">
                            New Password
                        </label>
                        <input
                            className={styles.input}
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter new password"
                            required
                            minLength={6}
                        />
                    </div>
                    {state && state !== 'success' && (
                        <div className={styles.error}>
                            <p>{state}</p>
                        </div>
                    )}
                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
