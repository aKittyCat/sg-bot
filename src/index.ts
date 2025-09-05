import "./keepalive";
import { Client, GatewayIntentBits } from "discord.js";
import { DISCORD_BOT_TOKEN } from "@/config";
import onReady from "@/events/ready";
// --- Force first-run post (one time) ---
import fs from "fs";
import path from "path";

// สร้างไฟล์สถานะแบบ "ว่าง" เพื่อข้ามเส้นทาง First run ที่จะไม่โพสต์ทันที
if (process.env.FORCE_FIRST_RUN === "1") {
  try {
    const statePath = path.resolve(process.cwd(), "last_processed_guid.json");
    if (!fs.existsSync(statePath)) {
      // ใส่ค่า GUID ว่าง ๆ ไว้ก่อน (ให้โปรแกรมคิดว่าเคยมี state แล้ว แต่ยังไม่เคยโพสต์อะไร)
      fs.writeFileSync(
        statePath,
        JSON.stringify({ lastProcessedGuid: null }, null, 2),
        "utf8"
      );
      console.log("[GUID] Created empty state file to bypass first-run skip.");
    } else {
      console.log("[GUID] State file already exists; leaving as-is.");
    }
  } catch (e) {
    console.error("[GUID] Failed to prepare empty state:", e);
  }
}
// --- end: force first-run block ---

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.on("ready", () => onReady(client));

client.on("error", (error) => {
  console.error("Discord client encountered an error:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

if (DISCORD_BOT_TOKEN) {
  client.login(DISCORD_BOT_TOKEN);
} else {
  console.error(
    "Error: DISCORD_BOT_TOKEN environment variable not set. Please set it before running the bot."
  );
}
