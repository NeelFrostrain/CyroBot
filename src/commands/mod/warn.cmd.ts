import {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  ChatInputCommandInteraction,
  Client,
  User,
  GuildMember,
} from "discord.js";
import Command from "../../base/class/Command";
import NewEmbedBuilder from "../../base/class/NewEmbedBuilder";

export default class Warn extends Command {
  public override data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder =
    new SlashCommandBuilder()
      .setName("warn")
      .setDescription("Warn a user in the server")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user to warn")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Reason for the warning")
          .setRequired(false)
      );

  public override async execute(
    interaction: ChatInputCommandInteraction,
    client: Client
  ): Promise<void> {
    const targetUser = interaction.options.getUser("target") as User;
    const reason =
      interaction.options.getString("reason") ?? "No reason provided";
    const member = interaction.member as GuildMember;

    if (!member.permissions.has("ModerateMembers")) {
      await interaction.reply({
        content: "❌ You don't have permission to warn members.",
        ephemeral: true,
      });
      return;
    }

    const embed = new NewEmbedBuilder({
      color: "Yellow",
      title: "⚠️ User Warned",
      timestamp: new Date(),
      footer: {
        text: `Warned by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
      },
    }).addFields(
      { name: "👤 User", value: `${targetUser.tag}` },
      { name: "📝 Reason", value: reason }
    );

    await interaction.reply({ embeds: [embed] });
  }
}
