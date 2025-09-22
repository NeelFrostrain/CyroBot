import {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  ChatInputCommandInteraction,
  Client,
  User,
  GuildMember,
  ChannelType,
  VoiceChannel,
} from "discord.js";
import Command from "../../base/class/Command";
import NewEmbedBuilder from "../../base/class/NewEmbedBuilder";

export default class Move extends Command {
  public override data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder =
    new SlashCommandBuilder()
      .setName("move")
      .setDescription("Move a user to another voice channel")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user to move")
          .setRequired(true)
      )
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The voice channel to move the user to")
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildVoice)
      );

  public override async execute(
    interaction: ChatInputCommandInteraction,
    client: Client
  ): Promise<void> {
    const targetUser = interaction.options.getUser("target") as User;
    const channel = interaction.options.getChannel("channel") as VoiceChannel;
    const member = interaction.member as GuildMember;

    if (!member.permissions.has("MoveMembers")) {
      await interaction.reply({
        content: "❌ You don't have permission to move members.",
        ephemeral: true,
      });
      return;
    }

    if (channel?.type !== ChannelType.GuildVoice) {
      await interaction.reply({
        content: "⚠️ The selected channel must be a voice channel.",
        ephemeral: true,
      });
      return;
    }

    try {
      const targetMember = await interaction.guild!.members.fetch(
        targetUser.id
      );

      if (!targetMember.voice.channel) {
        await interaction.reply({
          content: `⚠️ ${targetUser.tag} is not in a voice channel.`,
          ephemeral: true,
        });
        return;
      }

      await targetMember.voice.setChannel(channel);

      const embed = new NewEmbedBuilder({
        color: "Purple",
        title: "🎵 User Moved",
        timestamp: new Date(),
        footer: {
          text: `Moved by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
        },
      }).addFields(
        { name: "👤 User", value: `${targetUser.tag}` },
        { name: "📌 Moved To", value: `${channel.name}` }
      );

      await interaction.reply({ embeds: [embed] });
    } catch (error: any) {
      await interaction.reply({
        content: `⚠️ Failed to move user: ${error.message}`,
        ephemeral: true,
      });
    }
  }
}
