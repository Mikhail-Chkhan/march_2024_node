import { IUser } from "../interfaces/user.interface";
import { Token } from "../models/token.model";
import { User } from "../models/user.model";

class UserRepository {
  public async getList(): Promise<IUser[]> {
    return await User.find({});
  }
  public async getById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }
  public async getByIdWithPassword(userId: string): Promise<IUser | null> {
    return await User.findById(userId).select("+password");
  }
  public async getByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select("+password");
  }
  public async create(user: IUser): Promise<IUser> {
    return await User.create(user);
  }
  public async update(
    userId: string,
    dataUser: Partial<IUser>,
  ): Promise<{ message: string }> {
    await User.findByIdAndUpdate(userId, dataUser, { new: false });
    return { message: `User with id ${userId} updated successfully` };
  }
  public async remove(userId: string): Promise<{ message: string }> {
    await User.deleteOne({ _id: userId });
    return { message: `User with id ${userId} removed successfully` };
  }
  public async findWithOutActivity(date: Date): Promise<IUser[]> {
    return await User.aggregate([
      {
        $lookup: {
          from: Token.collection.name,
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_userId", "$$userId"] } } },
            { $match: { createdAt: { $gt: date } } },
          ],
          as: "tokens",
        },
      },
      { $match: { tokens: { $size: 0 } } },
    ]);
  }
}

export const userRepository = new UserRepository();
