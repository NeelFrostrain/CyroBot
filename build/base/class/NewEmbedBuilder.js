import { EmbedBuilder } from "discord.js";
export default class NewEmbedBuilder extends EmbedBuilder {
    title;
    description;
    constructor({ author, title, titleURL, color, description, thumbnail, image, footer, timestamp, fields, }) {
        super();
        this.title = title;
        this.description = description;
        this.setTitle(title ?? null)
            .setColor(color ?? null)
            .setDescription(description ?? null);
        if (timestamp)
            this.setTimestamp(timestamp);
        if (titleURL)
            this.setURL(titleURL);
        if (author) {
            this.setAuthor({
                name: author.name,
                iconURL: author.iconURL ?? undefined,
                url: author.url ?? undefined,
            });
        }
        if (thumbnail)
            this.setThumbnail(thumbnail.url ?? null);
        if (image)
            this.setImage(image.url ?? null);
        if (footer) {
            this.setFooter({
                text: footer.text,
                iconURL: footer.iconURL,
            });
        }
        if (fields?.length) {
            this.addFields(fields);
        }
    }
}
