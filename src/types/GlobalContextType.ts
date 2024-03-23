import * as FirebaseAuth from "firebase/auth";
import { User } from "./User";
import { FriendsCache } from "./FriendsCache";
import { SnipeCache } from "./SnipeCache";

export type GlobalContextType = {
  authData: FirebaseAuth.User | null,
  userData: User | null,
  friendsCache: FriendsCache | null,
  snipeCache: SnipeCache | null,
}
  