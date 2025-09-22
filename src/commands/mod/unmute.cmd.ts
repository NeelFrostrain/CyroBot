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

export default class Unmute extends Command {
  public override data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder =
    new SlashCommandBuilder()
      .setName("unmute")
      .setDescription("Unmute a user in the server (voice unmute).")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user to unmute")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Reason for unmuting the user")
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

    // Check if the user has the required permissions
    if (!member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      await interaction.reply({
        content: "❌ You don’t have permission to unmute members.",
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
        content: "❌ I don’t have permission to unmute members.",
        ephemeral: true,
      });
      return;
    }

    // Defer the reply in case unmute takes time
    await interaction.deferReply();

    try {
      const targetMember = await interaction.guild.members.fetch(targetUser.id);

      await targetMember.voice.setMute(false, reason);

      const embed = new NewEmbedBuilder({
        color: "Green",
        title: "🔊 User Unmuted",
        timestamp: new Date(),
        footer: {
          text: `Unmuted by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
        },
      }).addFields(
        {
          name: "👤 Unmuted User",
          value: `${targetUser.tag} (${targetUser.id})`,
        },
        { name: "📝 Reason", value: reason }
      );

      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      await interaction.editReply({
        content: `⚠️ Failed to unmute ${targetUser.tag}. Error: ${error.message}`,
      });
    }
  }
}
