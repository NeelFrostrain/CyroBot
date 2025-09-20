import { Collection, } from "discord.js";
import path from "node:path";
import fs from "node:fs";
export default class CommandHandler {
    commands = new Collection();
    client;
    constructor(client) {
        this.client = client;
    }
    async loadCommands() {
        const commandsDir = path.join(__dirname, "../../commands");
        const folders = fs.readdirSync(commandsDir);
        for (const folder of folders) {
            const commandFiles = fs
                .readdirSync(path.join(commandsDir, folder))
                .filter((file) => file.endsWith(".cmd.ts") || file.endsWith(".cmd.js"));
            for (const file of commandFiles) {
                const filePath = path.join(commandsDir, folder, file);
                const { default: CommandClass } = await import(filePath);
                const command = new CommandClass();
                this.commands.set(command.data.name, command);
            }
        }
        console.log(`✅ Loaded ${this.commands.size} commands`);
    }
    listen() {
        this.client.on("interactionCreate", async (interaction) => {
            if (!interaction.isChatInputCommand())
                return;
            const chatInteraction = interaction;
            const command = this.commands.get(chatInteraction.commandName);
            if (!command)
                return;
            try {
                await command.execute(chatInteraction, this.client);
            }
            catch (error) {
                console.error(error);
                if (chatInteraction.replied || chatInteraction.deferred) {
                    await chatInteraction.followUp({
                        content: "❌ Error executing command",
                        ephemeral: true,
                    });
                }
                else {
                    await chatInteraction.reply({
                        content: "❌ Error executing command",
                        ephemeral: true,
                    });
                }
            }
        });
    }
}
