import { Router } from "express";
import { rateLimit } from "express-rate-limit";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { fileMiddleware } from "../middlewares/file.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();
// router.use(rateLimit({ windowMs: 2 * 60 * 1000, limit: 5 })); // at the level of the entire user.router
router.get(
  "/all",
  rateLimit({ windowMs: 2 * 60 * 1000, limit: 5 }),
  authMiddleware.checkAccessToken,
  userController.getList,
);
router.get(
  "/",
  authMiddleware.checkAccessToken,
  userMiddleware.isQueryValid(UserValidator.listQuery),
  userController.getListWithQueryParams,
);

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
router.patch(
  "/me",
  authMiddleware.checkAccessToken,
  userMiddleware.isBodyValid(UserValidator.updateForPatch),
  userController.updateSingleParams,
);
router.post(
  "/logo",
  authMiddleware.checkAccessToken,
  fileMiddleware.isLogoValid,
  userController.uploadLogo,
);
router.delete(
  "/remove-logo",
  authMiddleware.checkAccessToken,
  userController.removeLogo,
);
router.delete(
  "/:userId",
  authMiddleware.checkAccessToken,
  userMiddleware.checkId,
  userController.remove,
);

export const userRouter = router;
