export type User = {
  id: string,
  username: string,
  name: string,
  email: string,
  avatar_ref: string,
  avatar_url: string,
  avatar_blob: Blob,
  currentTarget: string | null,
}