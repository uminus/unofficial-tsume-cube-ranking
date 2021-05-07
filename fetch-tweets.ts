import {Res} from "./model.ts"

const token = "AAAAAAAAAAAAAAAAAAAAACXsPAEAAAAA5D0PiHG5l66SlNGe1sR%2Fc3faxLM%3DUtCjfLsvtUD6oyWHJHatvNGzfYmVawgWhXTMU4sseaPSfutgEh";
const query = encodeURIComponent("詰めキューブ");

export async function fetchTweets(lastUpdatedAt: string, nextToken?: string): Promise<Res> {
  const startTime = new Date(lastUpdatedAt);
  startTime.setMilliseconds(0);
  startTime.setSeconds(0);

  const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&max_results=100&tweet.fields=created_at&expansions=author_id&user.fields=profile_image_url&start_time=${startTime.toISOString()}${nextToken ? `&next_token=${nextToken}` : ""}`
  const res = await fetch(url, {
    headers: [["Authorization", `Bearer ${token}`]]
  });
  const json = await res.json() as Res;
  console.log(JSON.stringify(json));
  console.log(`count: ${json.meta.result_count}`);

  if (json.meta.next_token) {
    console.log(`next: ${json.meta.next_token}`);
    const next = await fetchTweets(lastUpdatedAt, json.meta.next_token);
    json.data.push(...next.data);
    json.includes.users.push(...next.includes.users);
    json.includes.users = json.includes.users.filter((u1, index, users) =>
      index === users.findIndex((u2) => (
        u1.id === u2.id
      ))
    );
    json.meta.oldest_id = next.meta.oldest_id;
    json.meta.result_count = json.data.length;
  }
  return json;
}
