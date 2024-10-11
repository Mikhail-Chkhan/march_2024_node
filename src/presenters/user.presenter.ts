import { configs } from "../config/configs";
import { IPaginatorResponse } from "../interfaces/paginator.interface";
import {
  IUser,
  IUserListQuery,
  IUserResponse,
} from "../interfaces/user.interface";

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
      createdAt: entity.createdAt,
    };
  }

  public toListResDto(
    entities: IUser[],
    total: number,
    query: IUserListQuery,
  ): IPaginatorResponse<IUserResponse> {
    return {
      data: entities.map((value) => this.toPublicResDto(value)),
      total,
      orderBy: query.orderBy, // Убедитесь, что это поле передается
      order: query.order, // То же самое для order
      limit: query.limit, // То же самое для limit
      page: query.page, // То же самое для page
    };
  }
}

export const userPresenter = new UserPresenter();
