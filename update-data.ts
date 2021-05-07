import {Solve, Tweet, User} from "./model.ts"
import {fetchTweets} from "./fetch-tweets.ts"

console.log("Run update-data.ts");

const timestamp = new Date().toISOString();

const prevSolves: { updated_at: string; solves: Array<Solve> } = await Deno.readTextFile('./solves.json').then(f => JSON.parse(f));
const lastUpdatedAt = prevSolves.updated_at;

const tweets = await fetchTweets(lastUpdatedAt);
const regex = /(?<comment1>[\s\S]*)(?<te>\d+)手の(?<is_virtual>バーチャル)?詰めキューブを(?<time>(\d+:)?\d*\.\d*)で[\s\S]*解いた問題: (?<scramble>[UDFBLR' 2]*)[\s\S]*(#詰めキューブ)?(?<comment2>[\s\S]*)/;
const solves = (tweets.data || [])
  .filter(t => regex.test(t.text))
  .map(t => {
    const g = t.text.match(regex)!.groups!;
    return {
      tweet: t!.id,
      author_id: t!.author_id,
      te: parseInt(g.te),
      is_virtual: !!g.is_virtual,
      scramble: g.scramble,
      time: g.time,
      timestamp: t!.created_at,
      comment: `${g.comment1} ${g.comment2}`.trim()
    } as Solve
  });


// update .json

prevSolves.updated_at = timestamp;
prevSolves.solves.push(...solves)
Deno.writeTextFileSync("./solves.json", JSON.stringify(prevSolves));

const prevUsers: { updated_at: string; users: Array<User> } = await Deno.readTextFile('./users.json').then(f => JSON.parse(f));
prevUsers.updated_at = timestamp;
prevUsers.users.push(...(tweets.includes?.users || []));
Deno.writeTextFileSync("./users.json", JSON.stringify(prevUsers));

const prevErrors: { updated_at: string; tweets: Array<Tweet> } = await Deno.readTextFile('./errors.json').then(f => JSON.parse(f));
prevErrors.updated_at = timestamp;
prevErrors.tweets.push(...(tweets.data || []).filter(t => !regex.test(t.text)));
Deno.writeTextFileSync("./errors.json", JSON.stringify(prevErrors));


