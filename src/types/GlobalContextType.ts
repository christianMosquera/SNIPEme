import { User } from "firebase/auth";
import { FriendsCache } from "./FriendsCache";
import { SnipeCache } from "./SnipeCache";

export type GlobalContextType = {
  userData: User | null,
  friendsCache: FriendsCache | null,
  snipeCache: SnipeCache | null,
}
  