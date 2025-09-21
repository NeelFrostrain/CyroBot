import { SlashCommandBuilder, } from "discord.js";
import Command from "../../base/class/Command";
import NewEmbedBuilder from "../../base/class/NewEmbedBuilder";
export default class BulkDelete extends Command {
    data = new SlashCommandBuilder()
        .setName("bulk-delete")
        .setDescription("Delete messages in bulk")
        .addNumberOption((option) => option
        .setName("count")
        .setDescription("Number of messages to delete")
        .setRequired(true)
        .setMaxValue(100) // Discord enforces max 100 per fetch
        .setMinValue(1));
    async execute(interaction, client) {
        try {
            const channel = interaction.channel;
            const count = interaction.options.getNumber("count") || 1;
            let fetched;
            fetched = await channel?.messages.fetch({ limit: count });
            const embed = new NewEmbedBuilder({
                title: `Deleting All ${fetched.size} Messages...`,
                color: "#0048ff",
                timestamp: new Date(),
                footer: {
                    text: interaction.user.displayName,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                },
            });
            const tempReply = interaction.reply({
                content: `<@${interaction.user.id}>`,
                embeds: [embed],
            });
            const deletable = fetched?.filter((msg) => {
                return Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000;
            });
            if (deletable?.size || 0 > 0)
                await channel.bulkDelete(deletable);
            //   const oldMessage = fetched?.filter((msg) => {
            //     return Date.now() - msg.createdTimestamp >= 14 * 24 * 60 * 60 * 1000;
            //   });
            //   for (const msg of oldMessage.values()) {
            //     await msg.delete();
            //   }
            await new Promise((resolve) => setTimeout(resolve, 1000)); //? 1s
            embed
                .setTitle(`Deleted All ${fetched?.size} Messages`)
                .setColor("#00ff08");
            const successTempMsg = interaction.editReply({
                content: `<@${interaction.user.id}>`,
                embeds: [embed],
            });
            await new Promise((resolve) => setTimeout(resolve, 1000)); //? 1s
            try {
                if (successTempMsg)
                    (await successTempMsg).delete();
                return Promise.resolve();
            }
            catch (error) {
                return Promise.reject();
            }
        }
        catch (error) {
            interaction.reply({ content: `${error.messages}` });
            return Promise.reject();
        }
    }
}
