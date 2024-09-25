import { ApiError } from "../errors/api.error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async get(): Promise<IUser[]> {
    return await userRepository.getList();
  }
  public async getUser(userId: string): Promise<IUser> {
    return await userRepository.getById(userId);
  }

  public async update(
    userId: string,
    updateData: IUser,
  ): Promise<{ message: string }> {
    const errors = [
      { condition: !updateData.password, message: "Password is required" },
      { condition: !updateData.name, message: "Name is required" },
      { condition: !updateData.email, message: "Email is required" },
      {
        condition:
          updateData.password.length < 8 || updateData.password.length > 15,
        message: "Password length must be between 8 and 15 characters",
      },
      {
        condition: !/\d/.test(updateData.password),
        message: "Password must contain at least one number",
      },
    ];

    for (const { condition, message } of errors) {
      if (condition) {
        throw new ApiError(`User data is invalid: ${message}`, 400);
      }
    }
    return await userRepository.update(userId, updateData);
  }

  public async remove(userId: string): Promise<{ message: string }> {
    return await userRepository.remove(userId);
  }
}
export const userService = new UserService();
