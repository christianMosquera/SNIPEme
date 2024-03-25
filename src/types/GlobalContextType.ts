import * as FirebaseAuth from "firebase/auth";
import { User } from "./User";
import { UsersCache } from "./UsersCache";
import { Snipe } from "./Snipe";

export type GlobalContextType = {
  authData: FirebaseAuth.User | null,
  userData: User | null,
  usersCache: UsersCache | null,
  snipesCache: Array<Snipe> | null,
}
  