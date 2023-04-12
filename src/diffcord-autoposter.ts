import { DiffcordHTTPClient } from "./diffcord-client";

/**
 * @type Options for the DiffcordStatsAutoPoster class.
 * @property interval The interval to post the stats at in milliseconds. Defaults to 30 minutes.
 */
export type DiffcordStatsAutoPosterOptions = {
    /**The interval to post the stats at in milliseconds. Defaults to 30 minutes.**/
    interval?: number,
}

export class DiffcordStatsAutoPoster {

    private discordClient: any;
    public diffcordClient: DiffcordHTTPClient;

    private interval: number;

    /**
     * @param discordClient Your discord libraries client (discord.js, eris, etc).
     * @param diffcordClient Your DiffcordHTTPClient instance.
     * @param options The options for the autoposter.
     */
    public constructor(discordClient: any, diffcordClient: DiffcordHTTPClient, options?: any) {
        this.discordClient = discordClient;
        this.diffcordClient = diffcordClient;
        this.interval = options?.interval ?? 30 * 60 * 1000; // defaults to 30 minutes

        // call method every 
        setInterval(async () => {
            await this.postStats();
        }, this.interval);
    }

    private async postStats() {
        // TODO: implement posting of stats using the diffcord client
    }

}