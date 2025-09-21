import { SlashCommandBuilder, } from "discord.js";
import Command from "../../base/class/Command";
import NewEmbedBuilder from "../../base/class/NewEmbedBuilder";
import config from "../../config";
export default class Invite extends Command {
    data = new SlashCommandBuilder()
        .setName("invite-me")
        .setDescription("Invite this bot in your server");
    async execute(interaction, client) {
        if (interaction.user.bot)
            return Promise.resolve();
        try {
            const embed = new NewEmbedBuilder({
                title: "Bot Invite Link",
                color: "Blurple",
                description: `**[Invite Me](${config.OAUTH2_LINK})**`,
                timestamp: new Date(),
                footer: {
                    text: interaction.user.displayName,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                },
            });
            await interaction.reply({
                content: `<@${interaction.user.id}>`,
                embeds: [embed],
            });
        }
        catch (error) {
            const embedMessage = new NewEmbedBuilder({
                color: "Red",
                title: "❌ Error",
                description: "Unknown Error",
                timestamp: new Date(),
            });
            await interaction.reply({
                content: `<@${interaction.user.id}>`,
                embeds: [embedMessage],
            });
        }
    }
}
