import Navbar from 'components/Navbar';
import Link from 'next/link';
import { FormEvent, Fragment, FunctionComponent, useState } from 'react';
import styles from 'styles/Create.module.scss';
import { Question, Survey } from 'utils/interfaces';
import { useAuth } from 'utils/useAuth';

const Create: FunctionComponent = () => {
    const { user } = useAuth(false);
    const [name, setName] = useState('');
    const [open, setOpen] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [viewId, setViewId] = useState('');
    const [voteId, setVoteId] = useState<number | undefined>();

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: '',
                answers: [],
                required: false,
                multiple: false,
                photo: '',
            },
        ]);
    };

    const editQuestion = (field: string, value: any, i: number) => {
        const tmp = questions;
        tmp[i][field] = value;
        setQuestions([...tmp]);
    };

    const addAnswer = (i: number) => {
        const tmp = questions;
        tmp[i].answers = [...tmp[i].answers, { answer: '' }];
        setQuestions([...tmp]);
    };

    const editAnswer = (value: string, i: number, j: number) => {
        const tmp = questions;
        tmp[i].answers[j].answer = value;
        setQuestions([...tmp]);
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        const tmp = questions;
        for (const question of tmp) {
            const formData = new FormData();
            if (question.image && question.image[0]) {
                formData.append('image', question.image[0]);
                try {
                    const response = await fetch(
                        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
                        {
                            method: 'POST',
                            body: formData,
                        }
                    );
                    const data = await response.json();
                    question.photo = data.data.url;
                } catch (error) {
                    console.log(error);
                }
            }
        }
        setQuestions([...tmp]);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/survey`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        userId: user?.id,
                        open,
                        questions,
                    }),
                }
            );
            const data: Survey = await response.json();
            setVoteId(data.id);
            setViewId(data.privateId);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                {voteId || viewId ? (
                    <>
                        <h1 className={styles.heading}>
                            survey created successfully
                        </h1>
                        <div
                            className={`textfield ${styles.name} ${styles['form-container']}`}
                        >
                            {voteId && (
                                <div>
                                    Vote Url:{'  '}
                                    <Link
                                        href={`/vote/${voteId}`}
                                    >{`http://localhost:3000/vote/${voteId}`}</Link>
                                </div>
                            )}
                            <br />
                            {viewId && (
                                <div>
                                    View Url:{'  '}
                                    <Link
                                        href={`/survey/${viewId}`}
                                    >{`http://localhost:3000/survey/${viewId}`}</Link>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className={styles.heading}>create survey</h1>
                        <div className={styles['form-container']}>
                            <div className={styles['name-container']}>
                                <input
                                    className={`textfield ${styles.name}`}
                                    placeholder='name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            {questions?.map((question, i) => (
                                <Fragment key={i}>
                                    <div
                                        className={styles['question-container']}
                                    >
                                        <input
                                            className={`textfield ${styles.question}`}
                                            placeholder='question'
                                            value={question.question}
                                            onChange={(e) =>
                                                editQuestion(
                                                    'question',
                                                    e.target.value,
                                                    i
                                                )
                                            }
                                        />
                                        <label
                                            className={`button ${styles['add-answer']}`}
                                        >
                                            ☁{' '}
                                            <input
                                                type='file'
                                                hidden
                                                accept='image/png, image/jpeg, image/webp'
                                                onChange={(e) =>
                                                    editQuestion(
                                                        'image',
                                                        e.target.files,
                                                        i
                                                    )
                                                }
                                            />
                                        </label>
                                        <button
                                            onClick={() => addAnswer(i)}
                                            className={`button ${styles['add-answer']}`}
                                        >
                                            +
                                        </button>
                                        <label
                                            className={
                                                styles['question-checkbox']
                                            }
                                        >
                                            <input
                                                type='checkbox'
                                                checked={question.required}
                                                onChange={(e) =>
                                                    editQuestion(
                                                        'required',
                                                        e.target.checked,
                                                        i
                                                    )
                                                }
                                                name='required'
                                            />{' '}
                                            required
                                        </label>
                                        <label
                                            className={
                                                styles['question-checkbox']
                                            }
                                        >
                                            <input
                                                type='checkbox'
                                                checked={question.multiple}
                                                onChange={(e) =>
                                                    editQuestion(
                                                        'multiple',
                                                        e.target.checked,
                                                        i
                                                    )
                                                }
                                                name='multiple'
                                            />{' '}
                                            multiple
                                        </label>
                                    </div>
                                    {question.answers &&
                                        question.answers.map((answer, j) => (
                                            <div
                                                key={j}
                                                className={
                                                    styles['answer-container']
                                                }
                                            >
                                                <input
                                                    className={`textfield ${styles.answer}`}
                                                    placeholder='Answer'
                                                    key={j}
                                                    value={answer.answer}
                                                    onChange={(e) =>
                                                        editAnswer(
                                                            e.target.value,
                                                            i,
                                                            j
                                                        )
                                                    }
                                                />
                                            </div>
                                        ))}
                                </Fragment>
                            ))}
                            <div className={styles['action-container']}>
                                <button
                                    onClick={addQuestion}
                                    className={`button ${styles.add}`}
                                >
                                    +
                                </button>
                                <button
                                    type='submit'
                                    className={`button ${styles.submit}`}
                                    onClick={submit}
                                >
                                    submit
                                </button>
                                <label className={styles.checkbox}>
                                    <input
                                        type='checkbox'
                                        checked={open}
                                        onChange={(e) =>
                                            setOpen(e.target.checked)
                                        }
                                        name='open'
                                    />{' '}
                                    open
                                </label>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    );
};

export default Create;
