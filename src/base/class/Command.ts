import {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import ICommand from "../interface/ICommand";

//! Master Command Class
export default abstract class Command implements ICommand {
  public abstract data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;

  public abstract execute(
    interaction: ChatInputCommandInteraction,
    client: Client
  ): Promise<void>;
}
