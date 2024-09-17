import { IUser } from "../interfaces/user.interface";
import { create, get, getById, remove, update } from "../services/fs.service";

class UserRepository {
  public async getList(): Promise<IUser[]> {
    return await get();
  }
  public async getById(userId: number): Promise<IUser> {
    return await getById(userId);
  }
  public async create(user: IUser): Promise<IUser> {
    return await create(user);
  }
  public async update(
    userId: number,
    dataUser: IUser,
  ): Promise<{ message: string }> {
    return await update(userId, dataUser);
  }
  public async remove(userId: number): Promise<{ message: string }> {
    return await remove(userId);
  }
}

export const userRepository = new UserRepository();
