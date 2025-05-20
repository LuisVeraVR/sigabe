export interface UserRegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface UserLoginDto {
    email: string;
    password: string;
}

export interface JwtPayload {
    userId: number;
    email: string;
    isAdmin: boolean;
}