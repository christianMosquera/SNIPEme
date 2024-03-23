export type FriendsCache = {
  [id: string]: {
    username: string,
    name: string,
    avatar_url: string,
    avatar_blob: Blob,
  }
}