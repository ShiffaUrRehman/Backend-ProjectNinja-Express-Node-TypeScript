import { Request } from "express"
import { User } from "../user/user_interface";
export interface RequestWithUser extends Request {
  user: User
}