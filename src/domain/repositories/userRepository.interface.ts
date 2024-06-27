import { UserModel } from '../model/user';

export interface IUserRepository {
  create(data: Partial<UserModel>): Promise<UserModel>;

  getUserByEmail(email: string): Promise<UserModel>;

  checkExistsEmail(email: string): Promise<boolean>;

  updateLastLogin(username: string): Promise<void>;

  updateRefreshToken(username: string, refreshToken: string): Promise<void>;
}
