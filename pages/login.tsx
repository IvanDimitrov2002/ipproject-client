import { useRouter } from 'next/router';
import { FormEvent, FunctionComponent, useState } from 'react';
import styles from 'styles/Login.module.scss';
import Link from 'next/link';

const Login: FunctionComponent = () => {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/login`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                }
            );
            const data = await response.json();
            localStorage.setItem('token', data.token);
            await router.push('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>survey.io</h1>
            <form onSubmit={submit} className={styles.form}>
                <span className={styles.title}>login</span>
                <input
                    className='textfield'
                    placeholder='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className='textfield'
                    placeholder='password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    className={`button ${styles.submit}`}
                    type='submit'
                    value='sign In'
                />
                <span className={styles.register}>
                    <Link href='/register'>register</Link>
                </span>
            </form>
        </div>
    );
};

export default Login;
