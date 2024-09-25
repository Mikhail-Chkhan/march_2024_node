import { NextFunction, Request, Response } from "express";
import { ObjectSchema, ValidationError } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { MasterTokenPayload } from "../constants/masterToken";
import { ApiError } from "../errors/api.error";

class UserMiddleware {
  public checkId(req: Request, res: Response, next: NextFunction) {
    try {
      const userKey = req.params.userId;
      const payloadToken = req.res.locals.jwtPayload;
      if (!isObjectIdOrHexString(userKey)) {
        throw new ApiError(`Invalid ID ${userKey}`, 400);
      }
      if (
        payloadToken.userId != userKey &&
        payloadToken.userId != MasterTokenPayload.userId
      ) {
        throw new ApiError(
          "Access denied. You do not have permission to view this data.",
          403,
        );
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
