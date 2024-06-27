export class UserWithoutPassword {
  id: number;
  email: string;
  username: string;
  createDate: Date;
  updatedDate: Date;
  lastLogin: Date;
  hashRefreshToken: string;
}

export class UserModel extends UserWithoutPassword {
  password: string;
}
