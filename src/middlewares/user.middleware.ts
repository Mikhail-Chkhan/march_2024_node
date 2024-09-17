import fs from "node:fs/promises";
import path from "node:path";

import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api.error";

const usersFilePath = path.join(process.cwd(), "src/db", "users.json");

class UserMiddleware {
  public async checkId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const fileData = await fs.readFile(usersFilePath, "utf-8");
      const data = JSON.parse(fileData);
      const currentUser = await data.find((user) => user.id == userId);
      if (!currentUser) {
        throw new ApiError("User not found", 404);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const userMiddleware = new UserMiddleware();
