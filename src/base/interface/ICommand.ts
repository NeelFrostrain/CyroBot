import {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export default interface ICommand {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute(
    interaction: ChatInputCommandInteraction,
    client: Client
  ): Promise<void>;
}
