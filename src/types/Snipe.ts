export type Snipe = {
  id: string;
  approved: boolean;
  image_ref: string;
  image_url: string;
  target_id: string;
  sniper_id: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}