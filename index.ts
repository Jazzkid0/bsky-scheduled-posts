import agent from './agent.js';
import { CronJob } from 'cron';
import readline from 'readline';


let handle: string
if(agent.session?.handle) {
  handle = agent.session.handle
}

const scheduledPost = async (postRecord, second, minute, hour) => {
  const job = new CronJob(`${second} ${minute} ${hour} * * *`, async () => {
    const resp = await agent.post(postRecord)
    if(resp){
      console.log("Content posted.")
    } else {
      console.error("Something went wrong. Nothing posted.")
    }
    if(handle){
      console.log(`Post content: ${postRecord.text}`)
      console.log(`Link to post: https://staging.bsky.app/profile/${handle}/post/${resp.uri.split("/")[4]}`)
    } else {
      console.log("Unable to grab link to post. Please check manually.")
    }
    process.exit(1)
  });
  job.start();
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const postInput = async () => {
  rl.question('What do you want to post?\n ', async (answer) => {
    const postRecord = {
      text: answer
    }
    rl.question('When do you want to post? (hour:minute:second)\n ', async (answer) => {
      const [hour, minute, second] = answer.split(":")
      rl.question(`At ${hour}:${minute}:${second}, you will post the following:\n${postRecord.text}\nType SEND to confirm: `, async (answer) => {
        if (answer === "SEND") {
          console.log("Scheduled post. Don't close this terminal, or the post won't be sent.")
          await scheduledPost(postRecord, second, minute, hour)
        } else {
          console.log("Aborting.")
          process.exit(1)
        }
      })
    })
  }
)}

await postInput()