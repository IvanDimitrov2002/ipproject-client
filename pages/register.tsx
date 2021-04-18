import { useRouter } from 'next/router';
import { FormEvent, FunctionComponent, useState } from 'react';
import styles from 'styles/Register.module.scss';
import Link from 'next/link';

const Register: FunctionComponent = () => {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            await router.push('/login');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>survey.io</h1>
            <form onSubmit={submit} className={styles.form}>
                <span className={styles.title}>register</span>
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
                    value='sign up'
                />
                <span className={styles.login}>
                    <Link href='/login'>login</Link>
                </span>
            </form>
        </div>
    );
};

export default Register;
