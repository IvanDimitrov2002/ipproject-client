export interface User {
    id: number;
    surveys: Survey[];
    username: string;
}

export interface Survey {
    id: number;
    privateId: string;
    name: string;
    questions: Question[];
    open: boolean;
}

export interface Question {
    id: number;
    question: string;
    answers: Answer[];
    required: boolean;
    multiple: boolean;
    photo: string;
}

export interface Answer {
    id: number;
    answer: string;
    votes: number;
}

export interface Token {
    sub: string;
    exp: number;
    iat: number;
}
