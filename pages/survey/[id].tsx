import Navbar from 'components/Navbar';
import { useRouter } from 'next/router';
import {
    FormEvent,
    Fragment,
    FunctionComponent,
    useEffect,
    useState,
} from 'react';
import styles from 'styles/Survey.module.scss';
import { Survey } from 'utils/interfaces';
import { useAuth } from 'utils/useAuth';
import Image from 'next/image';

const View: FunctionComponent = () => {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useAuth(false);
    const [survey, setSurvey] = useState<Survey | undefined>();
    const [success, setSuccess] = useState('');

    useEffect(() => {
        (async () => {
            if (id) {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/survey/${id}`
                );
                const data = await response.json();
                setSurvey(data);
            }
        })();
    }, [id]);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (user && token) {
            try {
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/survey/${survey?.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(survey),
                    }
                );
                setSuccess('successfully updated the survey');
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <>
            <Navbar />
            {survey && (
                <main className={styles.container}>
                    <h1 className={styles.heading}>view survey</h1>
                    <div className={styles['form-container']}>
                        <div className={styles['name-container']}>
                            <div
                                className={`textfield ${styles.name}`}
                                placeholder='name'
                            >
                                {survey.name}
                            </div>
                        </div>
                        {survey.questions?.map((question, i) => (
                            <Fragment key={i}>
                                <div className={styles['question-container']}>
                                    <div
                                        className={`textfield ${styles.question}`}
                                    >
                                        {question.question}
                                    </div>
                                    <label
                                        className={styles['question-checkbox']}
                                    >
                                        <input
                                            type='checkbox'
                                            checked={question.required}
                                            readOnly
                                            name='required'
                                        />{' '}
                                        required
                                    </label>
                                    <label
                                        className={styles['question-checkbox']}
                                    >
                                        <input
                                            type='checkbox'
                                            checked={question.multiple}
                                            readOnly
                                            name='multiple'
                                        />{' '}
                                        multiple
                                    </label>
                                </div>
                                <div className={styles['image-container']}>
                                    <Image
                                        layout='fill'
                                        className={styles.image}
                                        src={question.photo}
                                    />
                                </div>
                                {question.answers &&
                                    question.answers.map((answer, j) => (
                                        <div
                                            key={j}
                                            className={
                                                styles['answer-container']
                                            }
                                        >
                                            <div
                                                className={`textfield ${styles.answer}`}
                                            >
                                                {answer.answer}
                                            </div>
                                            <div
                                                className={`textfield ${styles.votes}`}
                                            >
                                                {answer.votes}
                                            </div>
                                        </div>
                                    ))}
                            </Fragment>
                        ))}
                        <div className={styles['action-container']}>
                            {user && (
                                <button
                                    type='submit'
                                    className={`button ${styles.submit}`}
                                    onClick={submit}
                                >
                                    submit
                                </button>
                            )}
                            <label className={styles.checkbox}>
                                <input
                                    type='checkbox'
                                    checked={survey.open}
                                    onChange={(e) =>
                                        setSurvey({
                                            ...survey,
                                            open: e.target.checked,
                                        })
                                    }
                                    name='open'
                                />{' '}
                                open
                            </label>
                        </div>
                        {success && <p>{success}</p>}
                    </div>
                </main>
            )}
        </>
    );
};

export default View;
