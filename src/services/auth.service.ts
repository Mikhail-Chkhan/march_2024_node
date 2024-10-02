import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiError } from "../errors/api.error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import {
  IResetPasswordSet,
  ISignIn,
  IUser,
} from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { passwordRepository } from "../repositories/password.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUp(
    dto: Partial<IUser>,
  ): Promise<{ tokens: ITokenPair; user: Partial<IUser> }> {
    if (!dto.email || !dto.password) {
      throw new ApiError("Email and password required", 400);
    }
    await this.isEmailExistOrThrow(dto.email);
    const password = await passwordService.hashPassword(dto.password);
    const user: Partial<IUser> = await userRepository.create({
      ...dto,
      password,
    } as IUser);

    const tokens = tokenService.generateTokens({
      userId: user._id,
      role: user.role,
    });
    await tokenRepository.create({ ...tokens, _userId: user._id });

    const token = tokenService.generateActionTokens(
      { userId: user._id, role: user.role },
      ActionTokenTypeEnum.VERIFY_EMAIL,
    );
    await actionTokenRepository.create({
      type: ActionTokenTypeEnum.VERIFY_EMAIL,
      _userId: user._id,
      token,
    });

    await this.checkAndSavePassword({
      userId: user._id,
      password: dto.password,
    });

    await emailService.sendMail(user.email, EmailTypeEnum.WELCOME, {
      name: user.name,
      email: user.email,
      actionToken: token,
    });
    return { user, tokens };
  }

  public async signIn(
    dto: ISignIn,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    const user = await userRepository.getByEmail(dto.email);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const isPasswordCorrect = await passwordService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new ApiError("Invalid credentials", 401);
    }

    const tokens = tokenService.generateTokens({
      userId: user._id,
      role: user.role,
    });
    await tokenRepository.create({ ...tokens, _userId: user._id });
    return { user, tokens };
  }
  public async refresh(
    refreshToken: string,
    payload: ITokenPayload,
  ): Promise<ITokenPair> {
    await tokenRepository.deleteByParams({ refreshToken });
    const tokens = tokenService.generateTokens({
      userId: payload.userId,
      role: payload.role,
    });
    await tokenRepository.create({ ...tokens, _userId: payload.userId });
    return tokens;
  }

  private async isEmailExistOrThrow(email: string): Promise<void> {
    const user = await userRepository.getByEmail(email);
    if (user) {
      throw new ApiError("Email already exists", 409);
    }
  }

  public async changePassword(
    dto: { oldPassword: string; newPassword: string },
    userId: string,
  ): Promise<{ message: string }> {
    try {
      const user = await userRepository.getByIdWithPassword(userId);
      console.log(user);
      const isMatched = await passwordService.comparePassword(
        dto.oldPassword,
        user.password,
      );

      if (!isMatched) {
        throw new ApiError("Invalid password", 400);
      }
      const hashedNewPassword = await passwordService.hashPassword(
        dto.newPassword,
      );
      await this.checkAndSavePassword({
        userId: userId,
        password: dto.newPassword,
      });

      return await userRepository.update(userId, {
        password: hashedNewPassword,
      });
    } catch (e) {
      throw new ApiError(e.message, e.status | 500);
    }
  }

  public async resetPassword(user: IUser) {
    try {
      const actionToken = tokenService.generateActionTokens(
        {
          userId: user._id,
          role: user.role,
        },
        ActionTokenTypeEnum.FORGOT_PASSWORD,
      );
      // console.log("actionToken", actionToken);
      await actionTokenRepository.create({
        type: ActionTokenTypeEnum.FORGOT_PASSWORD,
        _userId: user._id,
        token: actionToken,
      });
      await emailService.sendMail(user.email, EmailTypeEnum.FORGOT_PASSWORD, {
        token: actionToken,
        name: user.name,
      });
    } catch (e) {
      throw new ApiError(e.message, e.status | 500);
    }
  }
  public async forgotPasswordSet(
    dto: IResetPasswordSet,
    jwtPayload: ITokenPayload,
  ): Promise<void> {
    const password = await passwordService.hashPassword(dto.password);

    await this.checkAndSavePassword({
      userId: jwtPayload.userId,
      password: dto.password,
    });

    await userRepository.update(jwtPayload.userId, { password });

    await actionTokenRepository.deleteManyByParams({
      _userId: jwtPayload.userId,
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
    });
    await tokenRepository.deleteManyByParams({ _userId: jwtPayload.userId });
  }
  public async logout(
    jwtPayload: ITokenPayload,
    tokenId: string,
  ): Promise<void> {
    const user = await userRepository.getById(jwtPayload.userId);
    await tokenRepository.deleteByParams({ _id: tokenId });
    await emailService.sendMail(user.email, EmailTypeEnum.LOGOUT, {
      name: user.name,
    });
  }

  public async logoutAll(jwtPayload: ITokenPayload): Promise<void> {
    const user = await userRepository.getById(jwtPayload.userId);
    await tokenRepository.deleteManyByParams({ _userId: jwtPayload.userId });
    await emailService.sendMail(user.email, EmailTypeEnum.LOGOUT, {
      name: user.name,
    });
  }
  public async verify(jwtPayload: ITokenPayload): Promise<void> {
    await userRepository.update(jwtPayload.userId, { isVerified: true });
    await actionTokenRepository.deleteManyByParams({
      _userId: jwtPayload.userId,
      type: ActionTokenTypeEnum.VERIFY_EMAIL,
    });
  }
  public async verificationRequest(jwtPayload: ITokenPayload) {
    const actionToken = tokenService.generateActionTokens(
      {
        userId: jwtPayload.userId,
        role: jwtPayload.role,
      },
      ActionTokenTypeEnum.VERIFY_EMAIL,
    );
    // console.log("actionToken", actionToken);
    await actionTokenRepository.create({
      type: ActionTokenTypeEnum.VERIFY_EMAIL,
      _userId: jwtPayload.userId,
      token: actionToken,
    });
    const user = await userRepository.getById(jwtPayload.userId);
    await emailService.sendMail(user.email, EmailTypeEnum.VERIFY_EMAIL, {
      token: actionToken,
      name: user.name,
      email: user.email,
    });
  }
  catch(e) {
    throw new ApiError(e.message, e.status | 500);
  }

  private async checkAndSavePassword(dto: {
    userId: string;
    password: string;
  }) {
    try {
      const previousPasswords = await passwordRepository.findAllByUserId(
        dto.userId,
      );

      for (const oldPassword of previousPasswords) {
        const isMatched = await passwordService.comparePassword(
          dto.password,
          oldPassword.password,
        );
        if (isMatched) {
          throw new ApiError("You have already used this password before", 422);
        }
      }
      const hashedPassword = await passwordService.hashPassword(dto.password);
      await passwordRepository.create({
        password: hashedPassword,
        _userId: dto.userId,
      });
    } catch (e) {
      throw new ApiError(e.message, e.status || 500);
    }
  }
}

export const authService = new AuthService();
