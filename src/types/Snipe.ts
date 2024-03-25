import { Timestamp } from "firebase/firestore";

export type Snipe = {
  id: string,
  approved: boolean,
  sniper_id: string,
  target_id: string,
  image_ref: string,
  image_url: string,
  image_blob: Blob,
  timestamp: Timestamp,
}