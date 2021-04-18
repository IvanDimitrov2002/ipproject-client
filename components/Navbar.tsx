import { FunctionComponent } from 'react';
import styles from 'styles/Navbar.module.scss';
import Link from 'next/link';
import { useAuth } from 'utils/useAuth';

const Navbar: FunctionComponent = () => {
    const { user, logout } = useAuth(false);

    return (
        <nav className={styles.navbar}>
            <span className={styles.logo}>survey.io</span>
            <div className={styles.links}>
                <div className={styles.left}>
                    {user && <Link href='/'>home</Link>}
                    <Link href='/create'>create</Link>
                </div>
                <div className={styles.right}>
                    {user ? (
                        <a onClick={logout}>logout</a>
                    ) : (
                        <>
                            <Link href='/login'>login</Link>
                            <Link href='/register'>register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
