import { NextFunction, Request, Response } from "express";
import { ObjectSchema, ValidationError } from "joi";
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

  public isBodyValid(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = await validator.validateAsync(req.body); // проверяем и обновляем модифицированные данные
        next();
      } catch (e) {
        if (e instanceof ValidationError) {
          const errorMessage = e.details.map((err) => err.message).join(", ");
          // console.log(errorMessage);
          next(new ApiError(errorMessage, 400));
        } else {
          next(e);
        }
      }
    };
  }
}

export const userMiddleware = new UserMiddleware();
