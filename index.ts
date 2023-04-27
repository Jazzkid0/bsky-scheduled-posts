import bsky from '@atproto/api';
import agent from './agent.js';

const data = await agent.post({
  text: "other world",
})

console.log(data)
