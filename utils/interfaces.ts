export interface User {
    id?: number;
    surveys: Survey[];
    username: string;
}

export interface Survey {
    id?: number;
    privateId: string;
    name: string;
    questions: Question[];
    open: boolean;
}

export interface Question {
    id?: number;
    question: string;
    answers: Answer[];
    required: boolean;
    multiple: boolean;
    photo: string;
    [key: string]: any;
}

export interface Answer {
    id?: number;
    answer: string;
    votes?: number;
    [key: string]: any;
}

export interface Token {
    sub: string;
    exp: number;
    iat: number;
}
