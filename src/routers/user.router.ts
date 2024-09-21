import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { userMiddleware } from "../middlewares/user.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get("/", userController.getList);
router.post(
  "/",
  userMiddleware.isBodyValid(UserValidator.create),
  userController.create,
);
router.get("/:userId", userMiddleware.checkId, userController.getById);
router.put("/:userId", userMiddleware.checkId, userController.update);
router.delete("/:userId", userMiddleware.checkId, userController.remove);

export const userRouter = router;
