import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  Role,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import Command from "../../base/class/Command";
import NewEmbedBuilder from "../../base/class/NewEmbedBuilder";

export default class Roles extends Command {
  public override data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder =
    new SlashCommandBuilder()
      .setName("roles")
      .setDescription("Get Info About Roles In The Server!")
      .addRoleOption((options) =>
        options
          .setName("select-a-role")
          .setDescription("Get Info About A Specific Role In Server")
          .setRequired(false)
      );

  public override async execute(
    interaction: ChatInputCommandInteraction,
    client: Client
  ): Promise<void> {
    try {
      let roles: { id: string; members: number }[] = [];

      const embed = new NewEmbedBuilder({
        color: "DarkGold",
      });

      const selectedRole =
        (interaction.options.getRole("select-a-role") as Role) || undefined;

      if (!selectedRole) {
        const foundedRoles = interaction.guild?.roles.cache
          .filter((role) => role.name !== "@everyone")
          .sort((a, b) => b.members.size - a.members.size);

        foundedRoles?.forEach((role) => {
          roles.push({ id: role.id, members: role.members.size });
        });

        const roleAsMessage = roles
          ?.map((role) => `<@&${role.id}> -> Members: ${role.members}`)
          .join("\n");

        embed.setTitle(`All Roles Of This ${interaction.guild?.name}`);
        embed.setDescription(roleAsMessage);
        embed.setFooter({
          text: interaction.user.displayName,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
        });
        embed.setTimestamp(Date.now());

        await interaction.reply({
          content: `<@${interaction.user.id}>`,
          embeds: [embed],
        });
      } else {
        const foundedRoles = interaction.guild?.roles.cache.get(
          selectedRole.id
        );

        if (foundedRoles) {
          const roleAsMessage = `<@&${foundedRoles.id}> -> Members: ${foundedRoles.members.size}`;

          embed.setTitle(`Found role: ${foundedRoles?.name}`);
          embed.setDescription(roleAsMessage);

          await interaction.reply({
            content: `<@${interaction.user.id}>`,
            embeds: [embed],
          });
        }
      }
    } catch (error) {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "An error occurred while fetching roles.",
          ephemeral: true,
        });
      }
    }
  }
}

// <@&1418637454667157667>
