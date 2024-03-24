export type UsersCache = {
  [id: string]: {
    friend: boolean
    username: string,
    name: string,
    avatar_ref: string,
    avatar_url: string,
    avatar_blob: Blob,
  }
}