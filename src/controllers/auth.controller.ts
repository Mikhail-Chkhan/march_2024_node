import { NextFunction, Request, Response } from "express";

import { ITokenPayload } from "../interfaces/token.interface";
import {
  IResetPasswordSet,
  ISignIn,
  IUser,
} from "../interfaces/user.interface";
import { authService } from "../services/auth.service";

class AuthController {
  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as IUser;
      const result = await authService.signUp(dto);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as ISignIn;
      const result = await authService.signIn(dto);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.res.locals.refreshToken as string;
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;

      const result = await authService.refresh(token, jwtPayload);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
  public async changePassword(req: Request, res: Response, next: NextFunction) {
    const { userId: userId } = req.res.locals.jwtPayload as ITokenPayload;
    try {
      const dto = req.body;
      const result = await authService.changePassword(dto, userId);
      return res.status(200).json({ message: result.message, status: 200 });
    } catch (e) {
      next(e);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      await authService.resetPassword(user);
      return res
        .status(200)
        .json({ message: "Password recovery email sent", status: 200 });
    } catch (e) {
      next(e);
    }
  }
  public async forgotPasswordSet(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const dto = req.body as IResetPasswordSet;

      await authService.forgotPasswordSet(dto, jwtPayload);
      return res
        .status(200)
        .json({ message: "password successfully recovered", status: 200 });
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
