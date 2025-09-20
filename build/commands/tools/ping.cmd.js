import { SlashCommandBuilder, } from "discord.js";
import Command from "../../base/class/Command";
export default class PingCommand extends Command {
    data = new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!");
    async execute(interaction, client) {
        if (interaction.user?.bot)
            return;
        await interaction.reply({ content: `Pong! ${client.user?.tag}` });
    }
}
