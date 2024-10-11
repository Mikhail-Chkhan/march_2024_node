import { UploadedFile } from "express-fileupload";

import { FileItemTypeEnum } from "../enums/file-item-type.enum";
import { ApiError } from "../errors/api.error";
import { IPaginatorResponse } from "../interfaces/paginator.interface";
import {
  IUser,
  IUserListQuery,
  IUserResponse,
} from "../interfaces/user.interface";
import { userPresenter } from "../presenters/user.presenter";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { s3Service } from "./s3.service";

class UserService {
  public async get(): Promise<IUser[]> {
    return await userRepository.getList();
  }
  public async getListWithQueryParams(
    query: IUserListQuery,
  ): Promise<IPaginatorResponse<IUserResponse>> {
    const [entities, total] =
      await userRepository.getListWithQueryParams(query);
    return userPresenter.toListResDto(entities, total, query);
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
    const user = await userRepository.getByIdWithPassword(userId);
    const isMatched = await passwordService.comparePassword(
      updateData.password,
      user.password,
    );

    if (!isMatched) {
      throw new ApiError("Invalid password", 400);
    }
    const dtoWithoutPassword = { ...updateData };
    delete dtoWithoutPassword.password;
    return await userRepository.update(userId, dtoWithoutPassword);
  }

  public async updateSingleParams(
    userId: string,
    updateData: Partial<IUser>,
  ): Promise<{ message: string }> {
    if (!updateData) {
      throw new ApiError("body is required", 400);
    }
    return await userRepository.update(userId, updateData);
  }

  public async remove(userId: string): Promise<{ message: string }> {
    return await userRepository.remove(userId);
  }
  public async uploadLogo(
    userId: string,
    file: UploadedFile,
  ): Promise<{ message: string }> {
    const user = await userRepository.getById(userId);
    if (user.logo) {
      await s3Service.deleteFile(user.logo);
    }
    const logo = await s3Service.uploadFile(
      file,
      FileItemTypeEnum.USER,
      user._id,
    );

    return await userRepository.update(user._id, { logo });
  }

  public async removeLogo(userId: string): Promise<void> {
    const user = await userRepository.getById(userId);

    if (user.logo) {
      await s3Service.deleteFile(user.logo);
    }
    await userRepository.update(user._id, { logo: null });
  }
}
export const userService = new UserService();
