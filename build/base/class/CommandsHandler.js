import { Collection, } from "discord.js";
import path from "node:path";
import fs from "node:fs";
export default class CommandHandler {
    //? Init Main commands Collection Like A Array
    commands = new Collection();
    client; //? Init The Local Client
    constructor(client) {
        this.client = client; //? Adding Main Client To Local Client
    }
    /** Command File Structure
     * src/
     * ├─ base/
     * │  └─ class/
     * │      └─ Command.ts                # Master command class
     * ├─ commands/
     * │  └─ fun/
     * │     └─ Ping.cmd.ts            # Example command
     */
    //? Load All Command From Command Dir
    async loadCommands() {
        const commandsDir = path.join(__dirname, "../../commands");
        const folders = fs.readdirSync(commandsDir);
        //? Looping For Folders
        for (const folder of folders) {
            const commandFiles = fs
                .readdirSync(path.join(commandsDir, folder))
                .filter((file) => file.endsWith(".cmd.ts") || file.endsWith(".cmd.js"));
            //? Looping For File Inside Folder
            for (const file of commandFiles) {
                const filePath = path.join(commandsDir, folder, file); //? Getting The File Path
                const { default: CommandClass } = await import(filePath); //? Dynamic Import
                const command = new CommandClass(); //? Creating New Command Class Based On Import
                this.commands.set(command.data.name, command); //? Send In Commands Collection
            }
        }
        console.log(`✅ Loaded ${this.commands.size} commands`);
    }
    //? Adding Listener For Command So They Can Execute
    listen() {
        this.client.on("interactionCreate", async (interaction) => {
            if (!interaction.isChatInputCommand())
                return;
            const chatInteraction = interaction; //? Switching In ChatCommandInteraction
            const command = this.commands.get(chatInteraction.commandName); //? Finding The Command form Collection Using Name
            if (!command)
                return; //? If Not Founded Or Non Valid Command
            try {
                await command.execute(chatInteraction, this.client); //? Execute Command
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
