export class LoginUseCases {
  constructor() {}

  async execute() {
    await this.updateLoginTime();
    return {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
  }

  async updateLoginTime() {
    //
  }
}
