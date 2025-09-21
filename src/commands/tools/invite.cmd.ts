import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
} from "discord.js";
import Command from "../../base/class/Command";
import NewEmbedBuilder from "../../base/class/NewEmbedBuilder";
import config from "../../config";

export default class Invite extends Command {
  public override data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("invite-me")
    .setDescription("Invite this bot in your server");

  public override async execute(
    interaction: ChatInputCommandInteraction,
    client: Client
  ): Promise<void> {
    if (interaction.user.bot) return Promise.resolve();
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
    } catch (error) { 
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
