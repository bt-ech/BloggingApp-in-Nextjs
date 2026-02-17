'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { updateProfile } from '@/actions/profile';
import styles from '@/styles/profile.module.css';

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (session?.user?.linkedinUrl) {
            setLinkedinUrl(session.user.linkedinUrl);
        }
    }, [session]);

    async function handleSubmit(formData: FormData) {
        const result = await updateProfile(formData);
        if (result?.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: result.success || 'Profile updated!' });
            // Update session to reflect changes immediately if needed, but session update might require backend data refresh
            // For now, revalidatePath in server action handles server side, client side session might need manual update or re-fetch.
            // We can force session update by calling update({ linkedinUrl: ... }) if we want to be optimistic.
            await update();
        }
    }

    if (!session) {
        return <div className={styles.container}>Please log in to view this page.</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>My Profile</h1>
                </div>
                <div className={styles.section}>
                    <label className={styles.label}>Name</label>
                    <div className={styles.value}>{session.user?.name}</div>
                </div>
                <div className={styles.section}>
                    <label className={styles.label}>Email</label>
                    <div className={styles.value}>{session.user?.email}</div>
                </div>
                <form action={handleSubmit}>
                    <div className={styles.section}>
                        <label className={styles.label} htmlFor="linkedinUrl">
                            LinkedIn URL
                        </label>
                        <input
                            className={styles.input}
                            id="linkedinUrl"
                            name="linkedinUrl"
                            type="url"
                            placeholder="https://www.linkedin.com/in/username"
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                        />
                    </div>
                    {message && (
                        <div className={`${styles.message} ${styles[message.type]}`}>
                            {message.text}
                        </div>
                    )}
                    <button type="submit" className={styles.button}>
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
