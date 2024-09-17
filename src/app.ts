import express, { NextFunction, Request, Response } from "express";

import { ApiError } from "./errors/api.error";
import { userRouter } from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRouter);
//
// app.get("/users", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const users = await get();
//     res.send(users);
//   } catch (e) {
//     next(e);
//   }
// });
//
// app.post("/users", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { name, email, password }: IUser = req.body;
//     //TODO validate data
//     const newUser = await create({ name, email, password });
//     res.status(201).send(newUser);
//   } catch (e) {
//     next(e);
//   }
// });
//
// app.get(
//   "/users/:userId",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userId = Number(req.params.userId);
//       const user = await getById(userId);
//       if (!user) {
//         throw new ApiError("User not found", 404);
//         // return res.status(404).send("User not found");
//       }
//       res.send(user);
//     } catch (e) {
//       next(e);
//     }
//   },
// );
//
// app.put(
//   "/users/:userId",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userId = Number(req.params.userId);
//       const result = await update(userId, req.body);
//
//       if (result.error) {
//         throw new ApiError(result.error, 404);
//         // return res.status(404).send(result.error);
//       }
//       return res.status(201).send(result.message);
//       //TODO validate data
//     } catch (e) {
//       next(e);
//     }
//   },
// );
//
// app.delete(
//   "/users/:userId",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       //TODO validate data
//       const userId = Number(req.params.userId);
//       const result = await remove(userId);
//
//       if (result.error) {
//         throw new ApiError(result.error, 404);
//         // return res.status(404).send(result.error);
//       }
//       return res.status(200).send(result.message);
//     } catch (e) {
//       next(e);
//     }
//   },
// );

app.use(
  "*",
  (error: ApiError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500).json({
      message: error.message,
      status: error.status,
    });
  },
);
process.on("uncaughtException", (error) => {
  console.error("uncaughtException", error.message, error.stack);
  process.exit(1);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
