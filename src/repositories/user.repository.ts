import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public async getList(): Promise<IUser[]> {
    return await User.find({});
  }
  public async getById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }
  public async create(user: IUser): Promise<IUser> {
    return await User.create(user);
  }
  public async update(
    userId: string,
    dataUser: IUser,
  ): Promise<{ message: string }> {
    await User.findByIdAndUpdate(userId, dataUser, { new: false });
    return { message: `User with id ${userId} updated successfully` };
  }
  public async remove(userId: string): Promise<{ message: string }> {
    await User.deleteOne({ _id: userId });
    return { message: `User with id ${userId} removed successfully` };
  }
}

export const userRepository = new UserRepository();
