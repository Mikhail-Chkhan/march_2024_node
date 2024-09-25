import * as bcrypt from "bcrypt";

class PasswordService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10); //round=10  10hashes/s
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}

export const passwordService = new PasswordService();
