import "dotenv/config";
export default class config {
    static BOT_TOKEN = process.env.BOT_TOKEN;
    static CLIENT_ID = process.env.CLIENT_ID;
    static CLIENT_SECRET = process.env.CLIENT_SECRET;
    static OAUTH2_LINK = process.env.OAUTH2_LINK;
}
