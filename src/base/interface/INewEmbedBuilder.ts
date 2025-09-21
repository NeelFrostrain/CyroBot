import { APIEmbedField, ColorResolvable } from "discord.js";

export default interface INewEmbedBuilder {
  author?: { name: string; url?: string; iconURL?: string } | null;
  color?: ColorResolvable | "#ff0000";
  title?: string | "Embed Title";
  titleURL?: string | null;
  description?: string | "Embed Description";
  thumbnail?: { url: string } | null;
  image?: { url: string } | null;
  footer?: { text: string; iconURL?: string };
  timestamp?: Date;
  fields?: APIEmbedField[];
}
