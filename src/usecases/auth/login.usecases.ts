export class LoginUseCases {
  constructor() {}

  async execute() {
    return {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
  }

  async updateLoginTime() {
    //
  }
}
