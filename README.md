# Diffcord Node SDK

## Installation

```
npm install diffcord
```

## General Example

```ts
import express from "express";
import { DiffcordHTTPClient } from "diffcord";
import { DiffcordWebhook } from "diffcord";
import { DiffcordStatsAutoPoster, DiffcordVote } from "diffcord";

run();

async function run() {
  // client to make requests with
  const diffClient = new DiffcordHTTPClient("YOUR_DIFFCORD_API_TOKEN");

  // examples of client methods:

  const exampleDiscordUserID = "456029823537903361";
  // output will be similar to that of: https://docs.diffcord.com/diffcord-documentation/resources/vote-user
  const a = await diffClient.getUserVoteInfo(exampleDiscordUserID);

  // output will be similar to that of: https://docs.diffcord.com/diffcord-documentation/endpoints/bots
  const b = await diffClient.getVoteInfo();

  // auto poster example:

  const discordClient: any = null; // replace with your current discord client or use options to pass in custom get guild count and shard count functions

  const autoPoster = new DiffcordStatsAutoPoster(diffClient, discordClient);

  // webhook listener example:

  const webhook = new DiffcordWebhook("WEBHOOK_AUTH_CODE_HERE");
  const app = express();

  app.post(
    "/diffcordwebhook",
    webhook.listener(async (vote: DiffcordVote) => {
      // vote will be similar to that of: https://docs.diffcord.com/diffcord-documentation/resources/vote

      // handle logic here... give rewards, etc.
      console.log(vote);
    })
  );

  const examplePort = 3000; // choose any open port you would like
  app.listen(examplePort, () =>
    console.log(`Listening for Diffcord votes on port ${examplePort}`)
  );
}
```
