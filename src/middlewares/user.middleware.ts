import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api.error";

class UserMiddleware {
  public checkId(req: Request, res: Response, next: NextFunction) {
    try {
      const userKey = req.params.userId;
      if (!isObjectIdOrHexString(userKey)) {
        throw new ApiError(`Invalid ID ${userKey}`, 400);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const userMiddleware = new UserMiddleware();
