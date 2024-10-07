import { configs } from "../config/configs";
import { IUser } from "../interfaces/user.interface";

class UserPresenter {
  toPublicResDto(entity: IUser) {
    return {
      _id: entity._id,
      name: entity.name,
      email: entity.email,
      age: entity.age,
      role: entity.role,
      avatar: entity.logo ? `${configs.AWS_S3_ENDPOINT}/${entity.logo}` : null,
      isDeleted: entity.isDeleted,
      isVerified: entity.isVerified,
    };
  }
}

export const userPresenter = new UserPresenter();
