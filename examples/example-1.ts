import express from "express";
import { DiffcordHTTPClient } from "../src/diffcord-client";
import { DiffcordWebhook } from "../src/diffcord-webhook";
import { DiffcordVote } from "../src";

run()

async function run() {

    // client to make requests with
    const client = new DiffcordHTTPClient("84c60e1be09f41fab927cbb766575b62");

    // examples of client methods:

    const exampleDiscordUserID = "456029823537903361";
    // output will be similar to that of: https://docs.diffcord.com/diffcord-documentation/resources/vote-user
    const a = await client.getUserVoteInfo(exampleDiscordUserID);

    // output will be similar to that of: https://docs.diffcord.com/diffcord-documentation/endpoints/bots
    const b = await client.getVoteInfo();

    // webhook listener example:

    const webhook = new DiffcordWebhook("WEBHOOK_AUTH_CODE_HERE");
    const app = express();

    app.post(
        "/diffcordwebhook",
        webhook.listener(async (vote: DiffcordVote) => {
            // vote will be similar to that of: https://docs.diffcord.com/diffcord-documentation/resources/vote

            // handle logic here... give rewards, etc.
            console.log(vote);
        }
        ));

    const examplePort = 3000; // choose any open port you would like
    app.listen(examplePort, () => console.log(`Listening for Diffcord votes on port ${examplePort}`));
}