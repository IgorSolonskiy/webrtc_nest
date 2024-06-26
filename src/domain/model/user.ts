export class UserWithoutPassword {
    id: number;
    username: string;
    createDate: Date;
    updatedDate: Date;
    lastLogin: Date;
    hashRefreshToken: string;
}

export class User extends UserWithoutPassword {
    password: string;
}