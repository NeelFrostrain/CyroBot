import {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  ChatInputCommandInteraction,
  Client,
  User,
  GuildMember,
  PermissionsBitField,
} from "discord.js";
import Command from "../../base/class/Command";
import NewEmbedBuilder from "../../base/class/NewEmbedBuilder";

export default class Timeout extends Command {
  public override data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder =
    new SlashCommandBuilder()
      .setName("timeout")
      .setDescription("Timeout a user in the server")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user to timeout")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Reason for timing out the user")
          .setRequired(false)
      )
      .addIntegerOption((option) =>
        option
          .setName("duration")
          .setDescription("Duration for the timeout in minutes (optional)")
          .setRequired(false)
      );

  public override async execute(
    interaction: ChatInputCommandInteraction,
    client: Client
  ): Promise<void> {
    const targetUser = interaction.options.getUser("target") as User;
    const reason =
      interaction.options.getString("reason") ?? "No reason provided";
    const duration = interaction.options.getInteger("duration");
    const member = interaction.member as GuildMember;

    // Check if the user has the required permissions
    if (!member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      await interaction.reply({
        content: "❌ You don’t have permission to timeout members.",
        ephemeral: true,
      });
      return;
    }

    // Check if the bot has the required permissions
    if (
      !interaction.guild?.members.me?.permissions.has(
        PermissionsBitField.Flags.MuteMembers
      )
    ) {
      await interaction.reply({
        content: "❌ I don’t have permission to timeout members.",
        ephemeral: true,
      });
      return;
    }

    try {
      const targetMember = await interaction.guild.members.fetch(targetUser.id);

      if (!targetMember) {
        await interaction.reply({
          content: `⚠️ Could not find the user ${targetUser.tag}.`,
          ephemeral: true,
        });
        return;
      }

      await targetMember.timeout(
        duration ? duration * 60 * 1000 : null, // Convert minutes → ms
        reason
      );

      const embed = new NewEmbedBuilder({
        color: "Red",
        title: "⏳ User Timed Out",
        timestamp: new Date(),
        footer: {
          text: `Timed out by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
        },
      }).addFields(
        {
          name: "👤 Timed Out User",
          value: `${targetUser.tag} (${targetUser.id})`,
        },
        { name: "📝 Reason", value: reason },
        {
          name: "⏱ Duration",
          value: duration ? `${duration} minutes` : "Permanent",
        }
      );

      await interaction.reply({ embeds: [embed] });
    } catch (error: any) {
      await interaction.reply({
        content: `⚠️ Failed to timeout ${targetUser.tag}. Error: ${error.message}`,
        ephemeral: true,
      });
    }
  }
}
