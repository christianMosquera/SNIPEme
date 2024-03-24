import * as FirebaseAuth from "firebase/auth";
import { User } from "./User";
import { UsersCache } from "./UsersCache";
import { SnipeCache } from "./SnipeCache";

export type GlobalContextType = {
  authData: FirebaseAuth.User | null,
  userData: User | null,
  usersCache: UsersCache | null,
  snipeCache: SnipeCache | null,
}
  