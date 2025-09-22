import { SlashCommandBuilder, } from "discord.js";
import Command from "../../base/class/Command";
import NewEmbedBuilder from "../../base/class/NewEmbedBuilder";
export default class Nick extends Command {
    data = new SlashCommandBuilder()
        .setName("nick")
        .setDescription("Change a user's nickname")
        .addUserOption((option) => option
        .setName("target")
        .setDescription("The user to change nickname for")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("nickname")
        .setDescription("The new nickname (leave empty to reset)")
        .setRequired(false));
    async execute(interaction, client) {
        const targetUser = interaction.options.getUser("target");
        const nickname = interaction.options.getString("nickname") ?? null;
        const member = interaction.member;
        if (!member.permissions.has("ManageNicknames")) {
            await interaction.reply({
                content: "❌ You don't have permission to change nicknames.",
                ephemeral: true,
            });
            return;
        }
        try {
            const targetMember = await interaction.guild.members.fetch(targetUser.id);
            await targetMember.setNickname(nickname);
            const embed = new NewEmbedBuilder({
                color: "Blue",
                title: "✏️ Nickname Changed",
                timestamp: new Date(),
                footer: {
                    text: `Changed by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                },
            }).addFields({ name: "👤 User", value: `${targetUser.tag}` }, { name: "🆕 New Nickname", value: nickname ?? "Reset to default" });
            await interaction.reply({ embeds: [embed] });
        }
        catch (error) {
            await interaction.reply({
                content: `⚠️ Failed to change nickname: ${error.message}`,
                ephemeral: true,
            });
        }
    }
}
