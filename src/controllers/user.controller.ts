import { NextFunction, Request, Response } from "express";

import { MasterTokenPayload } from "../constants/masterToken";
import { ApiError } from "../errors/api.error";
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

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const user = await userService.getUser(userId);
      res.json(user);
    } catch (e) {
      next(e);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const result = await userService.update(userId.toString(), req.body);
      return res.status(201).json(result.message);
    } catch (e) {
      next(e);
    }
  }

  public async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const result = await userService.remove(userId.toString());
      return res.status(200).json(result.message);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
