import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Token, User } from './interfaces';
import jwt_decode from 'jwt-decode';

interface Auth {
    user: User | null;
    logout: () => void;
}

export const useAuth = (redirect = true, redirectUrl = '/login'): Auth => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    const logout = async () => {
        localStorage.clear();
        await router.push('/login');
    };

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem('token');
            if (token !== null) {
                const decoded: Token = jwt_decode(token);
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/user/${decoded.sub}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const data: User = await response.json();
                    setUser(data);
                } catch (error) {
                    console.log(error);
                }
            } else {
                if (redirect) {
                    await router.push(redirectUrl);
                }
            }
        })();
    }, []);

    return { user, logout };
};
