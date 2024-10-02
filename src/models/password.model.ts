import { model, Schema } from "mongoose";

import { IPassword } from "../interfaces/password.interface";
import { User } from "./user.model";

const passwordSchema = new Schema(
  {
    password: { type: String, required: true },

    _userId: { type: Schema.Types.ObjectId, required: true, ref: User },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Password = model<IPassword>("passwords", passwordSchema);
