import fs from "node:fs/promises";
import path from "node:path";

import { IUser } from "../interfaces/user.interface";

const usersFilePath = path.join(process.cwd(), "src/db", "users.json");

export const getUsers = async (): Promise<IUser[]> => {
  try {
    const data = await fs.readFile(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId: number): Promise<IUser> => {
  try {
    const data = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(data);
    return users.find((user) => user.id === userId);
  } catch (error) {
    throw error;
  }
};

export const createUser = async (newUser: IUser): Promise<IUser> => {
  try {
    const data = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(data);
    newUser.id = users[users.length - 1].id + 1;
    users.push(newUser);
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
    return newUser;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId, newUserData) => {
  try {
    const data = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(data);
    if (!users[userId]) {
      {
        return { error: "User not found" };
      }
    }
    const userIndex = users.findIndex((user) => user.id === userId);
    users[userIndex].name = newUserData.name;
    users[userIndex].email = newUserData.email;
    users[userIndex].password = newUserData.password;

    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
    return { message: `User with id ${userId} updated successfully` };
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const data = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(data);
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return { error: "User not found" };
    }
    users.splice(userIndex, 1);
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
    return { message: `User with id ${userId} removed successfully` };
  } catch (error) {
    throw error;
  }
};

exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
