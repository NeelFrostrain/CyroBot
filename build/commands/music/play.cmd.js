import { SlashCommandBuilder, } from "discord.js";
import Command from "../../base/class/Command";
import NewEmbedBuilder from "../../base/class/NewEmbedBuilder";
import fs from "fs";
import { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, } from "@discordjs/voice";
import downloadYouTubeAudio from "../../utils/downloadYouTubeAudio";
const queueMap = new Map();
export default class Play extends Command {
    data = new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song in the voice channel")
        .addStringOption((option) => option.setName("url").setDescription("Audio URL").setRequired(true));
    async execute(interaction, client) {
        const url = interaction.options.getString("url", true);
        const member = interaction.member;
        const voiceChannel = member.voice.channel;
        if (!voiceChannel) {
            await interaction.reply({
                embeds: [
                    new NewEmbedBuilder({
                        color: "Red",
                        description: "❌ You need to be in a voice channel to play music.",
                    }),
                ],
                ephemeral: true,
            });
            return;
        }
        await interaction.deferReply();
        const guildId = interaction.guildId;
        if (!queueMap.has(guildId)) {
            queueMap.set(guildId, {
                connection: null,
                player: createAudioPlayer(),
                queue: [],
                isPlaying: false,
            });
        }
        const guildQueue = queueMap.get(guildId);
        if (!guildQueue.connection) {
            guildQueue.connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            guildQueue.connection.on(VoiceConnectionStatus.Disconnected, () => {
                queueMap.delete(guildId);
            });
            guildQueue.connection.on(VoiceConnectionStatus.Ready, () => {
                console.log("The bot has connected to the channel.");
            });
        }
        const audioPath = await downloadYouTubeAudio(url);
        if (!audioPath) {
            await interaction.followUp({
                embeds: [
                    new NewEmbedBuilder({
                        color: "Red",
                        description: "❌ Failed to download audio from the URL.",
                    }),
                ],
            });
            return;
        }
        guildQueue.queue.push({
            title: "YouTube Audio",
            path: audioPath,
            deleteAfterPlay: true,
        });
        await interaction.followUp({
            embeds: [
                new NewEmbedBuilder({
                    color: "Green",
                    title: "🎶 Song Added to Queue",
                    description: `**Audio from the provided URL:** ${url}`,
                }),
            ],
        });
        if (!guildQueue.isPlaying) {
            this.playNextSong(guildQueue, guildId);
        }
    }
    playNextSong(guildQueue, guildId) {
        if (guildQueue.queue.length === 0) {
            guildQueue.isPlaying = false;
            guildQueue.connection?.destroy();
            queueMap.delete(guildId);
            return;
        }
        guildQueue.isPlaying = true;
        const currentSong = guildQueue.queue.shift();
        const resource = createAudioResource(currentSong.path);
        guildQueue.player.play(resource);
        guildQueue.connection?.subscribe(guildQueue.player);
        guildQueue.player.once(AudioPlayerStatus.Idle, () => {
            console.log(`Finished playing: ${currentSong.title}`);
            if (currentSong.deleteAfterPlay) {
                fs.unlink(currentSong.path, (err) => {
                    if (err)
                        console.error(`Failed to delete file: ${currentSong.path}`);
                    else
                        console.log(`Deleted file: ${currentSong.path}`);
                });
            }
            this.playNextSong(guildQueue, guildId);
        });
        guildQueue.player.on("error", (error) => {
            console.error(`Error with audio player: ${error.message}`);
            this.playNextSong(guildQueue, guildId);
        });
        console.log(`Now playing: ${currentSong.title}`);
    }
}
