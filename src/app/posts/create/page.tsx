'use client';

import { createPost } from '@/actions/post';
import styles from '@/styles/post-form.module.css';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button className={styles.button} disabled={pending}>
            {pending ? 'Publishing...' : 'Publish Post'}
        </button>
    );
}

const initialState = {
    error: '',
};

export default function CreatePostPage() {
    const [state, dispatch, isPending] = useActionState(createPost, initialState);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create New Post</h1>
            <form action={dispatch}>
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="title">
                        Title
                    </label>
                    <input
                        className={styles.input}
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Enter post title"
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="content">
                        Content
                    </label>
                    <textarea
                        className={styles.textarea}
                        id="content"
                        name="content"
                        placeholder="Write your content here..."
                        rows={10}
                        required
                    />
                </div>
                {state?.error && <p style={{ color: 'red', marginBottom: '1rem' }}>{state.error}</p>}
                <SubmitButton />
            </form>
        </div>
    );
}
