import process from 'node:process';
import bsky, { AtpSessionEvent, AtpSessionData } from '@atproto/api';
const { BskyAgent } = bsky;
import * as dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';

const agent = new BskyAgent({
  service: 'https://bsky.social',
  persistSession: (evt: AtpSessionEvent, sess?: AtpSessionData) => {
    if (evt === 'create') {
      fs.writeFileSync('sessiondata/session.json', JSON.stringify(sess))
    } 
  }
});

// load session from file
let session;
try {
  session = JSON.parse(fs.readFileSync('sessiondata/session.json', 'utf8'));
} catch (err) {
  console.error(err);
}

// try to resume session
try {
  await agent.resumeSession(session);
} catch (err) {
  console.error(err);
}

if (!agent.hasSession) {
  console.log('Logging in...');
  await agent.login({
    identifier: process.env.BSKY_USERNAME!,
    password: process.env.BSKY_PASSWORD!,
  });
  console.log('Logged in.');
} else {
  console.log("Session resumed.")
}

export default agent
