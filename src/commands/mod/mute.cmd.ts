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

export default class Mute extends Command {
  public override data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder =
    new SlashCommandBuilder()
      .setName("mute")
      .setDescription("Mute a user in the server (voice mute).")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user to mute")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Reason for muting the user")
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
        content: "❌ You don’t have permission to mute members.",
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
        content: "❌ I don’t have permission to mute members.",
        ephemeral: true,
      });
      return;
    }

    // Defer the reply in case mute takes time
    await interaction.deferReply();

    try {
      const targetMember = await interaction.guild.members.fetch(targetUser.id);

      await targetMember.voice.setMute(true, reason);

      const embed = new NewEmbedBuilder({
        color: "Red",
        title: "🔇 User Muted",
        timestamp: new Date(),
        footer: {
          text: `Muted by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
        },
      }).addFields(
        {
          name: "👤 Muted User",
          value: `${targetUser.tag} (${targetUser.id})`,
        },
        { name: "📝 Reason", value: reason }
      );

      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      await interaction.editReply({
        content: `⚠️ Failed to mute ${targetUser.tag}. Error: ${error.message}`,
      });
    }
  }
}
