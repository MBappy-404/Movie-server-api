
export interface IResetPassword {
    email: string;
    newPassword: string;
}

export interface IAuthUser {
    name: string;
    email: string;
    role: string;
    status: string;
    iat: number;
    exp: number;
}