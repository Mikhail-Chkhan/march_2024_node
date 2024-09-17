import { ApiError } from "../errors/api.error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async get(): Promise<IUser[]> {
    return await userRepository.getList();
  }
  public async getUser(userId: number): Promise<IUser> {
    return await userRepository.getById(userId);
  }

  public async create(userData: IUser): Promise<IUser> {
    const errors = [
      { condition: !userData.password, message: "Password is required" },
      { condition: !userData.name, message: "Name is required" },
      { condition: !userData.email, message: "Email is required" },
      {
        condition:
          userData.password.length < 8 || userData.password.length > 15,
        message: "Password length must be between 8 and 15 characters",
      },
      {
        condition: !/\d/.test(userData.password),
        message: "Password must contain at least one number",
      },
    ];
    for (const { condition, message } of errors) {
      if (condition) {
        throw new ApiError(`User data is invalid: ${message}`, 400);
      }
    }
    return await userRepository.create(userData);
  }

  public async update(
    userId: number,
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

  public async remove(userId: number): Promise<{ message: string }> {
    return await userRepository.remove(userId);
  }
}
export const userService = new UserService();
