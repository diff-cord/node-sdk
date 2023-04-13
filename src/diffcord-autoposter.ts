import { DiffcordHTTPClient } from "./diffcord-client";

/**
 * @type Options for the DiffcordStatsAutoPoster class.
 * @property interval The interval to post the stats at in milliseconds. Defaults to 30 minutes.
 */
export type DiffcordStatsAutoPosterOptions = {
    /**The interval to post the stats at in milliseconds. Defaults to 30 minutes.**/
    interval?: number,
    /** Override function to get guild count, defaults to custom validation**/
    customGetGuildCount?: () => Promise<number>,
    /** Override function to get shard count, defaults to custom validation**/
    customGetShardCount?: () => Promise<number>,
    /** Function to run after posting stats**/
    onPost?: (() => Promise<void>) | undefined;
}

enum DiscordLibrary {
    DiscordJS = "discord.js",
    Eris = "eris"
}

export class DiffcordStatsAutoPoster {

    private discordClient: any;
    private getGuildCount: () => Promise<number>;
    private getShardCount: () => Promise<number>;
    private onPost: (() => Promise<void>) | undefined;
    private interval: number;
    private discordLibrary: DiscordLibrary | undefined;

    public diffcordClient: DiffcordHTTPClient;

    /**
     * @param discordClient Your discord libraries client (discord.js, eris, etc).
     * @param diffcordClient Your DiffcordHTTPClient instance.
     * @param options The options for the autoposter.
     */
    public constructor(diffcordClient: DiffcordHTTPClient, discordClient?: any, options?: DiffcordStatsAutoPosterOptions) {
        if (!diffcordClient) throw new Error("diffcordClient is required.");

        this.discordClient = discordClient;
        this.diffcordClient = diffcordClient;
        this.interval = options?.interval ?? 30 * 60 * 1000; // defaults to 30 minutes

        this.getGuildCount = options?.customGetGuildCount ?? this._defaultGetGuildCount;
        this.getShardCount = options?.customGetShardCount ?? this._defaultGetShardCount;
        this.onPost = options?.onPost;

        this.discordLibrary = this._getDiscordClientLibrary();

        // call method every 
        setInterval(async () => {
            await this._postStats();
        }, this.interval);
    }

    private async _postStats(): Promise<void> {
        const guildCount = await this.getGuildCount();
        const shardCount = await this.getShardCount();

        this.diffcordClient.updateStats(guildCount, shardCount);

        if (this.onPost) {
            await this.onPost();
        }
    }

    private _defaultGetGuildCount(): Promise<number> {
        switch (this.discordLibrary) {
            case DiscordLibrary.DiscordJS:
                return this.discordClient.guilds.cache.size;
            case DiscordLibrary.Eris:
                return this.discordClient.guilds.size;
            default:
                throw new Error("Could not get guild count, please provide a custom getGuildCount function.");
        }
    }

    private _defaultGetShardCount(): Promise<number> {
        switch (this.discordLibrary) {
            case DiscordLibrary.DiscordJS:
                return this.discordClient.shards.cache.size;
            case DiscordLibrary.Eris:
                return this.discordClient.shards.size;
            default:
                throw new Error("Could not get shard count, please provide a custom getShardCount function.");
        }
    }

    private _getDiscordClientLibrary(): DiscordLibrary | undefined {
        // TODO: this is not tested, please test and report any issues

        if (!this.discordClient) {
            return undefined
        }

        if (this.discordClient.shards) {
            return DiscordLibrary.DiscordJS
        }

        return DiscordLibrary.Eris
    }
}