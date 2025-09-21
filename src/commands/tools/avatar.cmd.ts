import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import Command from "../../base/class/Command";
import NewEmbedBuilder from "../../base/class/NewEmbedBuilder";

export default class Avatar extends Command {
  public override data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder =
    new SlashCommandBuilder()
      .setName("avatar")
      .setDescription("Get Your Profile Avatar!")
      .addUserOption((options) =>
        options
          .setName("user")
          .setDescription("Select a user (defaults to yourself)")
          .setRequired(false)
      )
      .addStringOption((options) =>
        options
          .setName("size")
          .setDescription("Choose Your Size")
          .setRequired(false)
          .addChoices(
            { name: "16", value: "16" },
            { name: "32", value: "32" },
            { name: "64", value: "64" },
            { name: "128", value: "128" },
            { name: "256", value: "256" },
            { name: "512", value: "512" },
            { name: "1024", value: "1024" },
            { name: "2048", value: "2048" },
            { name: "4096", value: "4096" }
          )
      );

  public override async execute(
    interaction: ChatInputCommandInteraction,
    client: Client
  ): Promise<void> {
    try {
      const user =
        interaction.options.getUser("user", false) || interaction.user;
      const size = parseInt(
        interaction.options.getString("size", false) || "1024"
      );

      const avatarURL = user.displayAvatarURL({
        size,
        extension: "jpg",
        forceStatic: false,
      });

      const embedMessage = new NewEmbedBuilder({
        color: "Aqua",
        title: `${user.displayName}'s Avatar`,
        titleURL: avatarURL,
        description: `**${size.toString()}x${size.toString()}**`,
        image: { url: avatarURL },
        timestamp: new Date(),
        footer: {
          text: interaction.user.displayName,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
        },
      });

      await interaction.reply({ embeds: [embedMessage] });
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
