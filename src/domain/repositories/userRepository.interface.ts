import { UserModel } from '../model/user';

export interface IUserRepository {
  create(data: Partial<UserModel>): Promise<UserModel>;

  getUserById(id: number): Promise<UserModel>;

  checkExistsEmail(email: string): Promise<boolean>;

  updateLastLogin(username: string): Promise<void>;

  updateRefreshToken(username: string, refreshToken: string): Promise<void>;
}
