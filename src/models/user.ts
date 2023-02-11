export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    address: string;
    phone: string;
}

export type UserCreateInput = Omit<User, 'id'>;
