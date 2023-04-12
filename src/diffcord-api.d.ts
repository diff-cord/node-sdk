/**
 * @interface DiffcordVote Represents a user vote resource from the API.
 * @param vote_id The id of the vote
 * @param user_id The id of the user who voted
 * @param bot_id The id of the bot that was voted for
 * @param since_vote Seconds that have elapsed since the vote
 * @param rewarded Whether the user vote has been rewarded and/or aknowledged (this must be manually changed via an API request)
 * @param test Whether this is a testing bot vote (sent as a test via bot/server api dashboard) or not
 * @param monthly_votes Votes this month, excluding this vote.
 * @see https://docs.diffcord.com/diffcord-documentation/resources/vote
 */

export interface DiffcordVote {
    /** The id of the vote **/
    vote_id: string;
    /** The id of the user who voted **/
    user_id: string;
    /** The id of the bot that was voted for **/
    bot_id: string;
    /** Seconds that have elapsed since the vote **/
    since_vote: number | null;
    /** Whether the user vote has been rewarded and/or aknowledged (this must be manually changed via an API request) **/
    rewarded: boolean;
    /** Whether this is a testing bot vote (sent as a test via bot/server api dashboard) or not **/
    test: boolean;
    /** Votes this month, excluding this vote. **/
    monthly_votes: number;
}

/**
 * @interface DiffcordError Represents an error from the API.
 * @param code Code to identify the error type
 * @param message The error message
 * @see https://docs.diffcord.com/diffcord-documentation/resources/error
 */
export interface DiffcordError {
    /** Code to identify the error type **/
    code: string;
    /** The error message **/
    message: string;
}

/**
 * @interface VoteUser Represents a Diffcord user who has voted from the API.
 * @param user_id The id of the user who voted
 * @param bot_id The id of the bot that was voted for
 * @param monthly_votes Votes this month, excluding this vote.
 * @param since_last_vote Seconds that have elapsed since the last vote
 * @param next_vote Seconds until the next vote can be made
 * @see https://docs.diffcord.com/diffcord-documentation/resources/vote
 */
export interface VoteUser {
    /** The id of the user who voted **/
    user_id: string,
    /** The id of the bot that was voted for **/
    bot_id: string,
    /** Votes this month, excluding this vote. **/
    monthly_votes: number,
    /** Seconds that have elapsed since the last vote **/
    since_last_vote: number | null,
    /** Seconds until the next vote can be made **/
    next_vote: number
}

/**
 * @interface DiffcordResponse Represents a response from the API.
 * @param data The data from the API
 * @param error The error from the API
 */
export interface DiffcordResponse {
    /** The data from the API **/
    data: any,
    /** The error from the API **/
    error: DiffcordError | null
}

/**
 * @interface FetchBotVoteInfoResponse Represents a fetch bot vote info from the API.
 * @param month_votes Total votes this month for your bot
 */
export interface FetchBotVoteInfoResponse {
    /**Total votes this month for your bot **/
    month_votes: number,
}