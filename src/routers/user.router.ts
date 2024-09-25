import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get("/", authMiddleware.checkAccessToken, userController.getList);
router.get(
  "/:userId",
  authMiddleware.checkAccessToken,
  userMiddleware.checkId,
  userController.getById,
);
router.put(
  "/:userId",
  authMiddleware.checkAccessToken,
  userMiddleware.isBodyValid(UserValidator.create),
  userMiddleware.checkId,
  userController.update,
);
router.delete(
  "/:userId",
  authMiddleware.checkAccessToken,
  userMiddleware.checkId,
  userController.remove,
);

export const userRouter = router;
