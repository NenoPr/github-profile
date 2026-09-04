export type GitHubUser = {
  login: string;
  avatar_url: string;
  followers: number;
  following: number;
  location: string | null;
  name: string | null;
  bio: string | null;
};
