import { SlashCommandBuilder, PermissionsBitField, } from "discord.js";
import Command from "../../base/class/Command";
import NewEmbedBuilder from "../../base/class/NewEmbedBuilder";
export default class Ban extends Command {
    data = new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban A User In This Server!")
        .addUserOption((options) => options
        .setName("target")
        .setDescription("Select The Target User!")
        .setRequired(true))
        .addStringOption((options) => options
        .setName("reason")
        .setDescription("Reason For Banning The User!")
        .setRequired(false));
    async execute(interaction, client) {
        const targetUser = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason") ??
            "No reason provided";
        const member = interaction.member;
        // Check if the user has the required permissions
        if (!member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            await interaction.reply({
                content: "❌ You don’t have permission to ban members.",
                ephemeral: true,
            });
            return;
        }
        // Check if the bot has the required permissions
        if (!interaction.guild?.members.me?.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            await interaction.reply({
                content: "❌ I don’t have permission to ban members.",
                ephemeral: true,
            });
            return;
        }
        try {
            await interaction.guild.members.ban(targetUser, { reason });
            const embed = new NewEmbedBuilder({
                color: "Red",
                title: "🚨 User Banned",
                timestamp: new Date(),
                footer: {
                    text: `Banned by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                },
            }).addFields({
                name: "👤 Banned User",
                value: `${targetUser.tag} (${targetUser.id})`,
            }, { name: "📝 Reason", value: reason });
            await interaction.reply({
                content: `<@${interaction.user.id}>`,
                embeds: [embed],
            });
        }
        catch (error) {
            interaction.reply({
                content: `Failed to ban ${targetUser.tag}. Error: ${error.message}`,
                ephemeral: true,
            });
        }
    }
}
