export type User = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
};


export type LoginData = {
    email: string;
    password: string;
};


export type LoginResponse = {
    access: string;
    refresh: string;
};


export type RegisterData = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
};