import {Solve, Tweet, User} from "./model.ts"
import {fetchTweets} from "./fetch-tweets.ts"

console.log("Run update-data.ts");

const timestamp = new Date().toISOString();

const lastUpdatedAt = await Deno.readTextFile("./updated_at") as string;

function ignoreTweet(t: Tweet): boolean {
  return !(t.referenced_tweets || []).find(r => r.type === "retweeted") && regex.test(t.text);
}

const tweets = await fetchTweets(lastUpdatedAt);
const regex = /(?<comment1>[\s\S]*)(?<te>\d+)手の(?<is_virtual>バーチャル)?詰めキューブを(?<is_only_scramble_image>.*スクランブル画像のみで)?(?<time>(\d+:)?\d*\.\d*)で[\s\S]*解いた問題: (?<scramble>[UDFBLR' 2]*)[\s\S]*(#詰めキューブ)(?<comment2>[\s\S]*)/;
const solves = (tweets.data || [])
  .filter(ignoreTweet)
  .map(t => {
    const g = t.text.match(regex)!.groups!;
    return {
      tweet: t!.id,
      author_id: t!.author_id,
      te: parseInt(g.te),
      is_virtual: !!g.is_virtual,
      is_only_scramble_image: !!g.is_only_scramble_image,
      scramble: g.scramble,
      time: g.time,
      timestamp: t!.created_at,
      comment: `${g.comment1} ${g.comment2}`.trim()
    } as Solve
  });


// update .json
Deno.writeTextFileSync("./updated_at", timestamp);

const prevSolves: { solves: Array<Solve> } = await Deno.readTextFile('./solves.json').then(f => JSON.parse(f));
prevSolves.solves.push(...solves)
Deno.writeTextFileSync("./solves.json", JSON.stringify(prevSolves));

const prevUsers: { users: Array<User> } = await Deno.readTextFile('./users.json').then(f => JSON.parse(f));
prevUsers.users.push(...(tweets.includes?.users || []));
Deno.writeTextFileSync("./users.json", JSON.stringify(prevUsers));

const prevErrors: { tweets: Array<Tweet> } = await Deno.readTextFile('./errors.json').then(f => JSON.parse(f));
prevErrors.tweets.push(...(tweets.data || []).filter(t => !ignoreTweet(t)));
Deno.writeTextFileSync("./errors.json", JSON.stringify(prevErrors));


