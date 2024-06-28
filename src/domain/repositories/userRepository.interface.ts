import { UserModel } from '../model/user';

export interface IUserRepository {
  create(data: Partial<UserModel>): Promise<UserModel>;

  getUserByEmail(email: string): Promise<UserModel>;

  checkExistsEmail(email: string): Promise<boolean>;

  updateLastLogin(email: string): Promise<void>;

  updateRefreshToken(email: string, refreshToken: string): Promise<void>;

  clearRefreshToken(email: string): Promise<void>;
}
