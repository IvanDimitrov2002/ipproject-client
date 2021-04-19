import Navbar from 'components/Navbar';
import { FunctionComponent } from 'react';
import { useAuth } from 'utils/useAuth';
import styles from 'styles/Index.module.scss';
import { Survey } from 'utils/interfaces';
import Link from 'next/link';

const Index: FunctionComponent = () => {
    const { user } = useAuth(undefined, '/create');

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                {user &&
                    user.surveys?.map((survey: Survey) => (
                        <div key={survey.id} className={styles.card}>
                            <span className={styles.name}>{survey.name}</span>
                            <div className={styles.links}>
                                <div>
                                    <span>vote url:</span>
                                    {'  '}
                                    <Link
                                        href={`/vote/${survey.id}`}
                                    >{`http://localhost:3000/vote/${survey.id}`}</Link>
                                </div>
                                <div>
                                    <span>view url:</span>
                                    {'  '}
                                    <Link
                                        href={`/survey/${survey.privateId}`}
                                    >{`http://localhost:3000/survey/${survey.privateId}`}</Link>
                                </div>
                            </div>
                            <Link href={`/survey/${survey.privateId}`}>
                                <button className={`button ${styles.visit}`}>
                                    visit
                                </button>
                            </Link>
                        </div>
                    ))}
            </main>
        </>
    );
};

export default Index;
