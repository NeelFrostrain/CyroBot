import {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} from "discord.js";

export default interface ICommand {
  data: SlashCommandBuilder;
  execute(
    interaction: ChatInputCommandInteraction,
    client: Client
  ): Promise<void>;
}
