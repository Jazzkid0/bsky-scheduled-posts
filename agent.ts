import process from 'node:process';
import bsky from '@atproto/api';
const { BskyAgent } = bsky;
import * as dotenv from 'dotenv';
dotenv.config();

export const agent = new BskyAgent({
  service: 'https://bsky.social',
});
await agent.login({
  identifier: process.env.BSKY_USERNAME!,
  password: process.env.BSKY_PASSWORD!,
});
