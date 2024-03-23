export type SnipeCache = {
  [id: string]: {
    approved: boolean,
    sniper_id: string,
    target_id: string,
    image_ref: string,
    image_url: string,
    image_blob: Blob,
    timestamp: number,
  }
}