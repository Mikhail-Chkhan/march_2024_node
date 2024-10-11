import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { MasterTokenPayload } from "../constants/masterToken";
import { ApiError } from "../errors/api.error";
import { ITokenPayload } from "../interfaces/token.interface";
import { IUserListQuery } from "../interfaces/user.interface";
import { userPresenter } from "../presenters/user.presenter";
import { userService } from "../services/user.service";

class UserController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    const token = req.res.locals.jwtPayload;
    {
      try {
        if (token.userId !== MasterTokenPayload.userId) {
          throw new ApiError(
            "Access denied. You do not have permission to view this data.",
            403,
          );
        }
        const users = await userService.get();
        res.json(users);
      } catch (e) {
        next(e);
      }
    }
  }

  public async getListWithQueryParams(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const token = req.res.locals.jwtPayload;
    {
      try {
        if (token.userId !== MasterTokenPayload.userId) {
          throw new ApiError(
            "Access denied. You do not have permission to view this data.",
            403,
          );
        }
        const query = req.query as unknown as IUserListQuery;
        console.log(query);
        const users = await userService.getListWithQueryParams(query);
        res.json(users);
      } catch (e) {
        next(e);
      }
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const user = await userService.getUser(userId);
      const result = userPresenter.toPublicResDto(user);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const result = await userService.update(userId.toString(), req.body);
      return res.status(200).json({ message: result.message, status: 200 });
    } catch (e) {
      next(e);
    }
  }

  public async updateSingleParams(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const result = await userService.updateSingleParams(
        jwtPayload.userId,
        req.body,
      );
      return res.status(200).json({ message: result.message, status: 200 });
    } catch (e) {
      next(e);
    }
  }

  public async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const result = await userService.remove(userId.toString());
      return res.status(200).json({ message: result.message, status: 200 });
    } catch (e) {
      next(e);
    }
  }

  public async uploadLogo(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const logo = req.files.logo as UploadedFile;

      await userService.uploadLogo(jwtPayload.userId, logo);
      const user = await userService.getUser(jwtPayload.userId);
      const result = userPresenter.toPublicResDto(user);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async removeLogo(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      await userService.removeLogo(jwtPayload.userId);
      const user = await userService.getUser(jwtPayload.userId);
      const result = userPresenter.toPublicResDto(user);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
