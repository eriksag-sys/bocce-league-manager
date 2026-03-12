import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from '../firebase/config';

// ─── ADMIN WHITELIST ────────────────────────────────────────────────────────
// Only these email addresses get admin access.
// Everyone else sees the read-only public view.
const ADMIN_EMAILS = [
    'esagerdahl@gmail.com', 'ejsgolf@gmail.com'
];

/**
 * Hook to track Firebase auth state.
 * Returns { user, loading, isAdmin }
 */
export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return unsub;
    }, []);

    return {
        user,
        loading,
        isAdmin: !!user && ADMIN_EMAILS.includes(user.email),
    };
}

export const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(err => {
        console.error("Popup sign in failed", err);
    });
};

export const signOut = () => {
    firebaseSignOut(auth).catch(err => console.error("Sign out failed", err));
};
