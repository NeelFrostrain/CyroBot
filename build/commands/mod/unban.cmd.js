import { SlashCommandBuilder, PermissionsBitField, } from "discord.js";
import Command from "../../base/class/Command";
import NewEmbedBuilder from "../../base/class/NewEmbedBuilder";
export default class Unban extends Command {
    data = new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user from the server")
        .addStringOption((option) => option
        .setName("user_id")
        .setDescription("The ID of the user to unban")
        .setRequired(true));
    async execute(interaction, client) {
        const userId = interaction.options.getString("user_id");
        const member = interaction.member;
        // Check if the user has the required permissions
        if (!member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            await interaction.reply({
                content: "❌ You don’t have permission to unban members.",
                ephemeral: true,
            });
            return;
        }
        // Check if the bot has the required permissions
        if (!interaction.guild?.members.me?.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            await interaction.reply({
                content: "❌ I don’t have permission to unban members.",
                ephemeral: true,
            });
            return;
        }
        // Defer reply since unban may take time
        await interaction.deferReply();
        try {
            // Fetch the ban list and check if user is banned
            const banList = await interaction.guild.bans.fetch();
            const ban = banList.get(userId);
            if (!ban) {
                await interaction.editReply({
                    content: "⚠️ This user is not banned.",
                });
                return;
            }
            // Unban the user
            await interaction.guild.members.unban(userId);
            const embed = new NewEmbedBuilder({
                color: "Green",
                title: "✅ User Unbanned",
                description: `Successfully unbanned <@${userId}>.`,
                timestamp: new Date(),
                footer: {
                    text: `Unbanned by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                },
            });
            await interaction.editReply({ embeds: [embed] });
        }
        catch (error) {
            await interaction.editReply({
                content: `⚠️ There was an error trying to unban the user. Error: ${error.message}`,
            });
        }
    }
}
