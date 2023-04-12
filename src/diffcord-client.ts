import { DiffcordError, DiffcordResponse, FetchBotVoteInfoResponse, VoteUser } from "./diffcord-api";
import fetch, { HeadersInit } from 'node-fetch';


/**
 * @interface diffcordClientOptions Represents the options for the DiffcordClient. 
 * @param apiVersion The API version to use. Defaults to "v1".
 * @param basePath The base path to use. Defaults to "https://api.diffcord.com/". 
 */
export type diffcordClientOptions = {
    /**The API version to use. Defaults to "v1"**/
    apiVersion?: string,
    /**The base path to use. Defaults to "https://api.diffcord.com/"**/
    basePath?: string
}

export class DiffcordClient {

    private static readonly BASE_PATH: string = "https://api.diffcord.com/";

    private basePath: string;
    private apiKey: string;
    private apiVersion: string;
    private headers: HeadersInit | undefined;
    private base_url: string;

    /**
     * @param apiKey The API key for the bot from the Diffcord API Dashboard.
     * @param apiVersion The API version to use. Defaults to "v1".
     * @param basePath The base path to use. Defaults to "https://api.diffcord.com/".
     */
    public constructor(apiKey: string, clientOptions?: diffcordClientOptions) {
        this.apiKey = apiKey;
        this.apiVersion = clientOptions?.apiVersion ?? "v1";
        this.basePath = clientOptions?.basePath ?? DiffcordClient.BASE_PATH;
        this.headers = this.create_headers();
        this.base_url = this.create_base_url();
    }

    /**
     * Fetches the user vote info for the given user id.
     * @param userID The user id to fetch the vote info for.
     * @returns A VoteUser object.
     * @throws Error if the request fails.
     * @see https://docs.diffcord.com/diffcord-documentation/endpoints/users
     */
    public async getUserVoteInfo(userID: string): Promise<VoteUser> {

        const targetPath: string = `${this.base_url}/users/${userID}/votes`;

        const response = await fetch(targetPath, {
            method: "GET",
            headers: this.headers,
        });

        const json = await response.json() as DiffcordResponse;

        if (!response.ok) {
            throw DiffcordClient.handle_api_error(json.error as DiffcordError, response.status)
        }

        return json.data as VoteUser;
    }

    /**
     * Fetches the bot vote info 
     * @returns A FetchBotVoteInfoResponse object.
     * @throws Error if the request fails.
     * @see https://docs.diffcord.com/diffcord-documentation/endpoints/bots
     */
    public async getVoteInfo(): Promise<FetchBotVoteInfoResponse> {

        const targetPath: string = `${this.base_url}/votes`;

        const response = await fetch(targetPath, {
            method: "GET",
            headers: this.headers,
        });

        const json = await response.json() as DiffcordResponse;

        if (!response.ok) {
            throw DiffcordClient.handle_api_error(json.error as DiffcordError, response.status)
        }

        return json.data as FetchBotVoteInfoResponse;
    }

    /**
     * Updates the bot stats on the Diffcord API.
     * @param guilds The number of guilds the bot is in.
     * @param shards The number of shards the bot is using.
     * @throws Error if the request fails.
     * @see https://docs.diffcord.com/diffcord-documentation/endpoints/bots
     */
    public async updateStats(guilds: number, shards?: number) {

        const targetPath: string = `${this.base_url}/stats`;
        const targetUrl = new URL(targetPath);

        // add query params "guilds" and "shards" if they are defined
        if (guilds) {
            targetUrl.searchParams.append("guilds", guilds.toString());
        }

        if (shards) {
            targetUrl.searchParams.append("shards", shards.toString());
        }

        const response = await fetch(targetUrl.toString(), {
            method: "POST",
            headers: this.headers,
        });

        if (!response.ok) {
            const json = await response.json() as DiffcordResponse;
            throw DiffcordClient.handle_api_error(json.error as DiffcordError, response.status)
        }
    }

    /**
     * Creates base url for API requests.
     * @returns The base url for API requests.
     */
    private create_base_url(): string {
        return `${this.basePath}${this.apiVersion}`;
    }

    /**
     * Creates the headers for API requests.
     * @returns The headers for API requests.
     */
    private create_headers(): HeadersInit | undefined {
        return {
            "x-api-key": this.apiKey,
            "Content-Type": "application/json",
            "User-Agent": "Diffcord-Node-SDK"
        }
    }

    private static handle_api_error(error: DiffcordError, status: number): Error {
        return new Error(`Request failed with code ${error.code}, message: ${error.message} and http status ${status}`);
    }

}