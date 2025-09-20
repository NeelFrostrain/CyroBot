import { Client, GatewayIntentBits, } from "discord.js";
import config from "../../config";
export default class CustomClient extends Client {
    config;
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessagePolls,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildScheduledEvents,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.MessageContent,
            ],
        });
        this.config = config;
    }
    Init() {
        this.login(this.config.BOT_TOKEN)
            .then(() => {
            this.once("clientReady", async () => {
                console.log(`Logged In ${this.user?.tag}`);
                //#region TEMP
                //   const channelID = "1418641110980624545";
                //   const channel = this.channels.cache.get(channelID) as TextChannel;
                //   if (channel) {
                //     try {
                //       let fetched;
                //       do {
                //         fetched = await channel.messages.fetch({ limit: 100 });
                //         if (fetched.size > 0) {
                //           const deletable = fetched.filter(
                //             (msg) =>
                //               Date.now() - msg.createdTimestamp <
                //               14 * 24 * 60 * 60 * 1000
                //           );
                //           if (deletable.size > 0) await channel.bulkDelete(deletable);
                //           const oldMessage = fetched.filter(
                //             (msg) =>
                //               Date.now() - msg.createdTimestamp >=
                //               14 * 24 * 60 * 60 * 1000
                //           );
                //           for (const msg of oldMessage.values()) {
                //             await msg.delete();
                //           }
                //         }
                //       } while (fetched.size >= 2);
                //     } catch (error) {
                //       console.error("Error deleting messages:", error);
                //     }
                //     channel.send("Logged In " + this.user?.tag)
                //     const embed = new EmbedBuilder()
                //       .setTitle("Hello World!")
                //       .setDescription(`**✅ Ready ${this.user?.tag}**`)
                //       .setColor("Green")
                //       .setFooter({ text: "Bot Online" })
                //       .setTimestamp();
                //     channel.send({ content: "@everyone", embeds: [embed] });
                //   }
                //#endregion
                //   this.guilds.cache.forEach((guild) => console.log(guild.name));
            });
        })
            .catch(() => {
            console.error("Logged In Failed");
        });
        this.on("messageCreate", (msg) => {
            console.log(msg.content);
        });
    }
}
