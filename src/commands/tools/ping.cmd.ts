import {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} from "discord.js";
import Command from "../../base/class/Command";

export default class PingCommand extends Command {
  public override data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!");

  public override async execute(
    interaction: ChatInputCommandInteraction,
    client: Client
  ): Promise<void> {
    if (interaction.user?.bot) return;
    await interaction.reply({ content: `Pong! ${client.user?.tag}` });
  }
}
