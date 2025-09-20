import { Client, GatewayIntentBits } from "discord.js";
import ICustomClient from "../interface/ICustomClient";
import IConfig from "../interface/IConfig";
import config from "../../config";
import CommandHandler from "./CommandsHandler";

export default class CustomClient extends Client implements ICustomClient {
  config: IConfig;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds, //? For Having Guild
        GatewayIntentBits.GuildMembers, //? For Checking Guild Member
        GatewayIntentBits.GuildMessagePolls, //? For Managing Guild Polls
        GatewayIntentBits.GuildMessageReactions, //? For Managing Guild Reactions
        GatewayIntentBits.GuildMessageTyping, //? For Watching Typing Status
        GatewayIntentBits.GuildMessages, //? For Managing Guild Message
        GatewayIntentBits.GuildModeration, //? For Guild Moderation
        GatewayIntentBits.GuildScheduledEvents, //? For Scheduled A Event
        GatewayIntentBits.GuildVoiceStates, //? For Managing Voice State
        GatewayIntentBits.GuildWebhooks, //? For Webhooks Management
        GatewayIntentBits.MessageContent, //? For Managing Guild Or DM Message Content
      ],
    });

    this.config = config;
  }

  commandHandler: CommandHandler = new CommandHandler(this);

  Init(): void {
    this.login(this.config.BOT_TOKEN)
      .then(() => {
        this.once("clientReady", async () => {
          //! Wakeup Message
          console.log(`Logged In ${this.user?.tag}`);

          //! Handle Commands
          await this.commandHandler.loadCommands().then(() => {
            this.commandHandler.listen(); //? Listen For Responding On Commands
          });
        });
      })
      .catch(() => {
        console.error("Logged In Failed");
      });

    this.on("messageCreate", (msg) => {
      if (msg.author.bot) return;

      console.log(msg.content);
    });
  }
}
