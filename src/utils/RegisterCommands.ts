import "dotenv/config";
import path from "node:path";
import fs from "node:fs";
import ICommand from "../base/interface/ICommand";
import { REST, Routes } from "discord.js";

const commands: any[] = [];
const BOT_TOKEN = "DDDDDDDDDD"; //? Add form Dotenv when needed

const CLIENT_ID = "1418622840185421836"; //? Client id

//? LoadCommands Function
const loadCommands = async () => {
  try {
    if (!BOT_TOKEN || !CLIENT_ID)
      throw new Error("Bot token or Client id not found!"); //? Validate The TOKEN AND ID

    let loaded = 0; //* For Debug Only
    let totalCommandSize = 0; //* For Debug Only

    //! Read Commands Files
    const commandDir = path.join(__dirname, "../commands");
    const folders = fs.readdirSync(commandDir);

    //? Looping For Folders
    for (const folder of folders) {
      const commandFiles = fs
        .readdirSync(path.join(commandDir, folder))
        .filter((file) => file.endsWith(".cmd.ts") || file.endsWith(".cmd.js"));

      totalCommandSize += commandFiles.length;
    }

    //! If No Command File So Throw error
    if (totalCommandSize <= 0) throw new Error("No Command Founded!");

    //? Looping For Folders
    for (const folder of folders) {
      const commandFiles = fs
        .readdirSync(path.join(commandDir, folder))
        .filter((file) => file.endsWith(".cmd.ts") || file.endsWith(".cmd.js"));

      //? Looping For File Inside Folder
      for (const file of commandFiles) {
        const filePath = path.join(commandDir, folder, file); //? Getting The File Path
        const { default: CommandClass } = await import(filePath); //? Dynamic Import
        const command: ICommand = new CommandClass(); //? Creating New Command Class Based On Import

        commands.push(command.data.toJSON()); //? Send In Commands Array

        loaded++;
        console.log(
          `🟢 Loaded command: ${command.data.name} (${loaded}/${totalCommandSize})`
        );
      }
    }

    //! Init REST API
    const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });
    console.log(`🌍 Registered ${loaded} global commands successfully!`);
  } catch (error) {
    console.error("❌ Error registering commands:", error);
  }
};

loadCommands();
