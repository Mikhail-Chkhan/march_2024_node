import { RoleEnum } from "../enums/role.enum";
import { ITokenPayload } from "../interfaces/token.interface";

export const MasterTokenPayload: ITokenPayload = {
  userId: "super-admin-dev",
  role: RoleEnum.SUPERADMIN,
};
