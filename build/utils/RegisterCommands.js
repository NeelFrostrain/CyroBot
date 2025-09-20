import "dotenv/config";
import path from "node:path";
import fs from "node:fs";
import { REST, Routes } from "discord.js";
const commands = [];
const BOT_TOKEN = "Add When Needed";
const CLIENT_ID = "1418622840185421836";
const loadCommands = async () => {
    try {
        if (!BOT_TOKEN || !CLIENT_ID)
            throw new Error("Bot token or Client id not found!");
        let loaded = 0;
        let totalCommandSize = 0;
        // Read Commands Files
        const commandDir = path.join(__dirname, "../commands");
        const folders = fs.readdirSync(commandDir);
        for (const folder of folders) {
            const commandFiles = fs
                .readdirSync(path.join(commandDir, folder))
                .filter((file) => file.endsWith(".cmd.ts") || file.endsWith(".cmd.js"));
            totalCommandSize += commandFiles.length;
        }
        if (totalCommandSize <= 0)
            throw new Error("No Command Founded!");
        for (const folder of folders) {
            const commandFiles = fs
                .readdirSync(path.join(commandDir, folder))
                .filter((file) => file.endsWith(".cmd.ts") || file.endsWith(".cmd.js"));
            for (const file of commandFiles) {
                const filePath = path.join(commandDir, folder, file);
                const { default: CommandClass } = await import(filePath);
                const command = new CommandClass();
                commands.push(command.data.toJSON());
                loaded++;
                console.log(`🟢 Loaded command: ${command.data.name} (${loaded}/${totalCommandSize})`);
            }
        }
        // Init REST API
        const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);
        await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commands,
        });
        console.log(`🌍 Registered ${loaded} global commands successfully!`);
    }
    catch (error) {
        console.error("❌ Error registering commands:", error);
    }
};
loadCommands();
