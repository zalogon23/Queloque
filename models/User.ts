interface Props {
  id: string,
  username: string,
  description: string,
  avatar: string
}
export default class User {
  id: string;
  username: string;
  description: string;
  avatar: string;
  constructor(
    { id, username, description, avatar }: Props
  ) {
    this.username = username,
      this.id = id,
      this.description = description,
      this.avatar = avatar
  }
}