import { Client, GatewayIntentBits } from "discord.js";
import config from "../../config";
import CommandHandler from "./CommandsHandler";
import { Player } from "discord-player";
import "@discord-player/extractor";
export default class CustomClient extends Client {
    config;
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
    commandHandler = new CommandHandler(this);
    Init() {
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
        // Listen for message commands
        this.on("messageCreate", async (message) => {
            if (message.author.bot)
                return;
            const args = message.content.split(" ");
            const command = args.shift()?.toLowerCase();
            if (command === "!play") {
                const query = args.join(" ");
                if (!query) {
                    message.channel.send("❌ Please provide a song name or URL!");
                    return;
                }
                if (!message.member?.voice.channel) {
                    message.channel.send("❌ You must be in a voice channel to play music!");
                    return;
                }
                try {
                    // Create or get the player instance (ideally, reuse a single instance globally)
                    const player = new Player(this);
                    const searchResult = await player.search(query, {
                        requestedBy: message.author,
                    });
                    const track = searchResult.tracks[0];
                    if (!track) {
                        message.channel.send("❌ No results found!");
                        return;
                    }
                    const queue = player.nodes.create(message.guild, {
                        metadata: message.channel,
                    });
                    if (!queue.connection)
                        await queue.connect(message.member.voice.channel);
                    await queue.play(track);
                    message.channel.send(`▶️ Now playing **${track.title}**`);
                }
                catch (err) {
                    console.error(err);
                    message.channel.send("❌ Error playing the track.");
                }
            }
        });
    }
}
