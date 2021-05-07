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
  scramble: string;
  time: string;
  time_millis: number;
  timestamp: string;
  comment: string;
}
