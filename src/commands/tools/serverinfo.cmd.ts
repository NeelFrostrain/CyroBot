import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  ChannelType,
} from "discord.js";
import Command from "../../base/class/Command";
import NewEmbedBuilder from "../../base/class/NewEmbedBuilder";

export default class ServerInfo extends Command {
  public override data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("server-info")
    .setDescription("Get All Info About This Server!");
  public override async execute(
    interaction: ChatInputCommandInteraction,
    client: Client
  ): Promise<void> {
    try {
      const guild = interaction.guild;

      const totalTextChannelCount = guild?.channels.cache.filter(
        (c) => c.type === ChannelType.GuildText
      ).size;
      const totalVoiceChannelCount = guild?.channels.cache.filter(
        (c) => c.type === ChannelType.GuildVoice
      ).size;
      const totalAnnouncementChannelCount = guild?.channels.cache.filter(
        (c) => c.type === ChannelType.GuildAnnouncement
      ).size;
      const totalForumChannelCount = guild?.channels.cache.filter(
        (c) => c.type === ChannelType.GuildForum
      ).size;
      const totalStageVoiceChannelCount = guild?.channels.cache.filter(
        (c) => c.type === ChannelType.GuildStageVoice
      ).size;
      const totalPublicThreadChannelCount = guild?.channels.cache.filter(
        (c) => c.type === ChannelType.PublicThread
      ).size;
      const totalPrivateThreadChannelCount = guild?.channels.cache.filter(
        (c) => c.type === ChannelType.PrivateThread
      ).size;
      const totalCategoryCount = guild?.channels.cache.filter(
        (c) => c.type === ChannelType.GuildCategory
      ).size;

      const owner = await guild?.fetchOwner();
      const createTime = guild?.createdTimestamp;

      const dataToMsg: { name: string; value: string; inline?: boolean }[] = [
        {
          name: "📊 Members",
          value: `${guild?.memberCount.toLocaleString()}`,
        },
        {
          name: "📅 Creation Date",
          value: createTime
            ? `<t:${Math.floor(createTime / 1000)}:F>`
            : "Unknown",
        },
        {
          name: "🛡️ Roles",
          value: `${guild?.roles.cache.size}`,
          inline: true,
        },
        {
          name: "📁 Total Channels",
          value: `${
            guild?.channels.cache.filter(
              (channel) => channel.type !== ChannelType.GuildCategory
            ).size
          }`,
        },
        {
          name: "All Channels In This Server",
          value: " ",
          inline: false,
        },
        {
          name: "💬 Text",
          value: `${totalTextChannelCount}`,
          inline: true,
        },
        {
          name: "🔊 Voice",
          value: `${totalVoiceChannelCount}`,
          inline: true,
        },
        {
          name: "📂 Categories",
          value: `${totalCategoryCount}`,
          inline: true,
        },
        {
          name: "📢 Announcement",
          value: `${totalAnnouncementChannelCount}`,
          inline: true,
        },
        {
          name: "📝 Forum",
          value: `${totalForumChannelCount}`,
          inline: true,
        },
        {
          name: "🎤 Stage",
          value: `${totalStageVoiceChannelCount}`,
          inline: true,
        },
        {
          name: "🧵 Public Threads",
          value: `${totalPublicThreadChannelCount}`,
          inline: true,
        },
        {
          name: "🔒 Private Threads",
          value: `${totalPrivateThreadChannelCount}`,
          inline: true,
        },
        {
          name: "👑 Owner",
          value: `<@${owner?.user.id || "Unknown"}>`,
          inline: false,
        },
      ];

      const embed = new NewEmbedBuilder({
        color: "Blue",
        title: `${guild?.name}`,
        thumbnail: { url: guild?.iconURL({ size: 1024 }) ?? "" },
        footer: {
          text: interaction.user.displayName,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
        },
        timestamp: new Date(),
      }).addFields(dataToMsg);
      interaction.reply({ embeds: [embed] });
    } catch (error) {
      const embedMessage = new NewEmbedBuilder({
        color: "Red",
        title: "❌ Error",
        description: "Unknown Error",
        timestamp: new Date(),
      });

      await interaction.reply({
        embeds: [embedMessage],
      });
    }
  }
}
