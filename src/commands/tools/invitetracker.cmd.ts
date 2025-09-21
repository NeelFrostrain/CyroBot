import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
} from "discord.js";
import Command from "../../base/class/Command";
import NewEmbedBuilder from "../../base/class/NewEmbedBuilder";

export default class InviteTracker extends Command {
  public override data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("invite-tracker")
    .setDescription("Get Your All Invite Links");

  public override async execute(
    interaction: ChatInputCommandInteraction,
    client: Client
  ): Promise<void> {
    if (interaction.user?.bot) return Promise.resolve();

    let trackInfo: { name: string; value: string; url: string }[] = [];

    try {
      const guild = interaction.guild;
      const invites = (await guild?.invites.fetch())?.filter(
        (i) => i.inviter?.id === interaction.user.id
      );

      invites?.forEach((inv) => {
        trackInfo.push({
          name: inv.url.replace("https://discord.gg/", ""),
          value: `**User Joined ${inv.uses ?? 0}** \n Created At <t:${
            inv.createdTimestamp
          }>`,
          url: inv.url,
        });
      });

      const embed = new NewEmbedBuilder({
        title: `📨 Invite Tracker for ${interaction.user.displayName}`,
        description: `Here are all the invites you created in **${interaction.guild?.name}**:`,
        color: "Yellow",
        timestamp: new Date(),
        footer: {
          text: "Invite Tracker • Discord Bot",
          iconURL: interaction.user.displayAvatarURL(),
        },
      });

      // Add fields dynamically
      trackInfo?.forEach((info) => {
        embed.addFields({
          name: ``, // adds an invite icon
          value: `**[🔗 ${info.name}](${info.url})** \n ${info.value}`,
          inline: false, // makes it look compact in multiple columns
        });
      });

      interaction.reply({ embeds: [embed] });
    } catch (error) {}
  }
}
