import { IPassword } from "../interfaces/password.interface";
import { Password } from "../models/password.model";

class PasswordRepository {
  public async create(dto: Partial<IPassword>): Promise<IPassword> {
    return await Password.create(dto);
  }

  public async findByParams(
    params: Partial<IPassword>,
  ): Promise<IPassword | null> {
    return await Password.findOne(params);
  }

  public async findAllByUserId(userId: string): Promise<IPassword[]> {
    return await Password.find({ _userId: userId });
  }
  public async deleteManyByParams(params: Partial<IPassword>): Promise<void> {
    await Password.deleteMany(params);
  }

  public async deleteBeforeDate(date: Date): Promise<number> {
    const { deletedCount } = await Password.deleteMany({
      createdAt: { $lt: date },
    });
    return deletedCount;
  }
}

export const passwordRepository = new PasswordRepository();
