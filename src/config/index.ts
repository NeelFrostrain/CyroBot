import "dotenv/config";

export default class config {
  static readonly BOT_TOKEN = process.env.BOT_TOKEN as string;
  static readonly CLIENT_ID = process.env.CLIENT_ID as string;
  static readonly CLIENT_SECRET = process.env.CLIENT_SECRET as string;
  static readonly OAUTH2_LINK = process.env.OAUTH2_LINK as string;
}
