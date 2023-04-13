import bodyParser from "body-parser";
import { DiffcordVote } from "./diffcord-api";
import { Request, Response, NextFunction } from 'express';

export interface DiffcordWebhookOptions { }

export class DiffcordWebhook {

    private authCode: string | undefined;

    public constructor(authCode?: string, options?: DiffcordWebhookOptions) {
        this.authCode = authCode;
    }

    public listener(voteHandler: (vote: DiffcordVote) => Promise<void>) {
        const jsonParser = bodyParser.json()

        return async (req: Request, res: Response, next: NextFunction) => {

            // return with status 401 if authentication is not provided
            const sentAuthCode = req.headers.authorization;
            if (sentAuthCode && sentAuthCode !== this.authCode) {
                res.status(401).send("Unauthorized");
                return;
            }

            // get request json body
            jsonParser(req, res, async () => {
                const vote = req.body as DiffcordVote;

                try {
                    await voteHandler(vote);
                } catch (err) {
                    res.status(500).send('Error processing vote');
                }

                res.status(200).send('OK');
            });
        }
    }
}

