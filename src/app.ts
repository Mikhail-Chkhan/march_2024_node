import express, { Request, Response } from "express";

import { IUser } from "./interfaces/user.interface";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./services/user.service";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.send(users);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password }: IUser = req.body;
    //TODO validate data
    const newUser = await createUser({ name, email, password });
    res.status(201).send(newUser);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.get("/users/:userId", async (req: Request, res) => {
  try {
    const userId = Number(req.params.userId);
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.put("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const result = await updateUser(userId, req.body);

    if (result.error) {
      return res.status(404).send(result.error);
    }
    return res.status(201).send(result.message);
    //TODO validate data
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.delete("/users/:userId", async (req: Request, res: Response) => {
  try {
    //TODO validate data
    const userId = Number(req.params.userId);
    const result = await deleteUser(userId);

    if (result.error) {
      return res.status(404).send(result.error);
    }
    return res.status(200).send(result.message);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
