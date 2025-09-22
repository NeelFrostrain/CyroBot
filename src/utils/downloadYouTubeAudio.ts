import { exec } from "child_process";
import path from "path";
import fs from "fs";

function execCommand(
  command: string
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return reject(error); // Only reject on real errors
      }

      if (stderr) console.warn(`yt-dlp warning: ${stderr}`); // Just log, don't reject

      const videoTitle: string = stdout.trim().replace(/[^a-zA-Z0-9]/g, "_");
      resolve({ stdout, stderr });
    });
  });
}

async function downloadYouTubeAudio(videoUrl: string): Promise<string> {
  try {
    const ytDlpPath = path.resolve(__dirname, "../../", "yt-dlp.exe");
    console.log("yt-dlp path:", ytDlpPath);

    // Get the video title first
    const getTitleCommand = `"${ytDlpPath}" --get-title "${videoUrl}"`;
    console.log("Command to get title:", getTitleCommand);

    const { stdout: titleStdout, stderr: titleStderr } = await execCommand(
      getTitleCommand
    );
    if (titleStderr) console.warn(`yt-dlp warning: ${titleStderr}`);

    const videoTitle: string = titleStdout.trim().replace(/[^a-zA-Z0-9]/g, "_");
    const outputFileName = `../../audio/${videoTitle}.mp3`;
    const outputPath = path.resolve(__dirname, outputFileName);

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`Created directory: ${outputDir}`);
    }

    console.log("Starting download...");
    const downloadCommand = `"${ytDlpPath}" -x --audio-format mp3 -o "${outputPath}" "${videoUrl}"`;

    const { stderr: downloadStderr } = await execCommand(downloadCommand);
    if (downloadStderr) console.warn(`yt-dlp warning: ${downloadStderr}`);

    console.log(`Audio downloaded successfully. File saved at: ${outputPath}`);
    return outputPath;
  } catch (error: any) {
    console.error("Failed to download YouTube audio:", error.message);
    throw error;
  }
}

export default downloadYouTubeAudio;
