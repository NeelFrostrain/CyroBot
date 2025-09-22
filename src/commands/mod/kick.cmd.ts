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

export default class Kick extends Command {
  public override data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder =
    new SlashCommandBuilder()
      .setName("kick")
      .setDescription("Kick a user from the server")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user to kick")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Reason for kicking the user")
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
    if (!member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      await interaction.reply({
        content: "❌ You don’t have permission to kick members.",
        ephemeral: true,
      });
      return;
    }

    // Check if the bot has the required permissions
    if (
      !interaction.guild?.members.me?.permissions.has(
        PermissionsBitField.Flags.KickMembers
      )
    ) {
      await interaction.reply({
        content: "❌ I don’t have permission to kick members.",
        ephemeral: true,
      });
      return;
    }

    try {
      // Fetch the target member to ensure they are in the guild
      const targetMember = await interaction.guild.members.fetch(targetUser.id);

      // Kick the user
      await targetMember.kick(reason);

      const embed = new NewEmbedBuilder({
        color: "Red",
        title: "👢 User Kicked",
        timestamp: new Date(),
        footer: {
          text: `Kicked by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
        },
      }).addFields(
        {
          name: "👤 Kicked User",
          value: `${targetUser.tag} (${targetUser.id})`,
        },
        { name: "📝 Reason", value: reason }
      );

      await interaction.reply({ embeds: [embed] });
    } catch (error: any) {
      if (error.code === 10007) {
        await interaction.reply({
          content: `⚠️ User ${targetUser.tag} is not in the server.`,
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: `⚠️ Failed to kick ${targetUser.tag}. Error: ${error.message}`,
        ephemeral: true,
      });
    }
  }
}
