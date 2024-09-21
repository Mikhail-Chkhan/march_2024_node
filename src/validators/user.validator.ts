import joi from "joi";

import { regexConstant } from "../constants/regex.constant";

export class UserValidator {
  public static create = joi.object({
    name: joi.string().min(3).max(25).trim().required(),
    age: joi.number().min(1).max(149).required(),
    email: joi.string().lowercase().regex(regexConstant.EMAIL).required(),
    password: joi.string().trim().regex(regexConstant.PASSWORD).required(),
    phone: joi.string().regex(regexConstant.PHONE),
  });

  public static update = joi.object({});
}

export const userValidator = new UserValidator();
