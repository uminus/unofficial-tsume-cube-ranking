export interface Res {
  data: Array<Tweet>;
  includes: {
    users: Array<User>;
  };
  meta: {
    newest_id: string;
    oldest_id: string;
    result_count: number;
    next_token: string;
  }
}

export interface Tweet {
  id: string;
  author_id: string;
  text: string;
  created_at: string;
  referenced_tweets?: Array<ReferencedTweet>;
}

export interface ReferencedTweet {
  id: string;
  type: "retweeted" | "quoted" | "replied_to";
}

export interface User {
  id: string;
  name: string;
  username: string;
  image: string;
}

export interface Solve {
  tweet: string;
  author_id: string;
  te: number;
  is_virtual: boolean;
  is_only_scramble_image: boolean;
  scramble: string;
  time: string;
  time_millis: number;
  timestamp: string;
  comment: string;
}
