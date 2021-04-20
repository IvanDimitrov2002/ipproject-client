import Navbar from 'components/Navbar';
import { useRouter } from 'next/router';
import {
    FormEvent,
    Fragment,
    FunctionComponent,
    useEffect,
    useState,
} from 'react';
import styles from 'styles/Vote.module.scss';
import { Survey } from 'utils/interfaces';
import Image from 'next/image';

const Vote: FunctionComponent = () => {
    const router = useRouter();
    const { id } = router.query;
    const [survey, setSurvey] = useState<Survey | undefined>();
    const [success, setSuccess] = useState('');

    useEffect(() => {
        (async () => {
            if (id) {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/vote/${id}`
                );
                const data = await response.json();
                setSurvey(data);
            }
        })();
    }, [id]);

    const onCheck = (e: any) => {
        const tmp = survey;
        tmp?.questions?.forEach((question) => {
            question?.answers.forEach((answer) => {
                if (answer.id === parseInt(e.target.value)) {
                    answer.checked = e.target.checked;
                }
            });
        });
        setSurvey(tmp);
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        const requirement = survey?.questions
            .filter((question) => question.required)
            .map((question) =>
                question.answers.some((answer) => answer.checked)
            )
            .every((value) => value === true);
        if (requirement) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vote`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        survey?.questions
                            .map((question) =>
                                question.answers
                                    .filter((answer) => answer.checked)
                                    .map((answer) => answer.id)
                            )
                            .flat()
                    ),
                });
                setSuccess('successfully voted for the survey');
            } catch (error) {
                console.log(error);
            }
        } else {
            setSuccess('answer every required question');
        }
    };

    return (
        <>
            <Navbar />
            {survey && survey.open ? (
                <main className={styles.container}>
                    <h1 className={styles.heading}>vote for survey</h1>
                    <form
                        onSubmit={submit}
                        className={styles['form-container']}
                    >
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
                                {question.photo && (
                                    <div className={styles['image-container']}>
                                        <Image
                                            layout='fill'
                                            className={styles.image}
                                            src={question.photo}
                                        />
                                    </div>
                                )}
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
                                            <label
                                                key={j}
                                                className={`textfield ${styles.votes}`}
                                            >
                                                <input
                                                    required={
                                                        question.required &&
                                                        !question.multiple
                                                    }
                                                    type={
                                                        question.multiple
                                                            ? 'checkbox'
                                                            : 'radio'
                                                    }
                                                    value={answer.id}
                                                    onChange={onCheck}
                                                    name={`answers${i}`}
                                                />
                                            </label>
                                        </div>
                                    ))}
                            </Fragment>
                        ))}
                        <div className={styles['action-container']}>
                            <button
                                type='submit'
                                className={`button ${styles.submit}`}
                            >
                                submit
                            </button>
                        </div>
                        {success && <p>{success}</p>}
                    </form>
                </main>
            ) : (
                <main className={styles.container}>
                    <h1 className={styles.heading}>this survey is closed</h1>
                </main>
            )}
        </>
    );
};

export default Vote;
