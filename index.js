import Binance from "binance-api-node";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { formatMoney } from "./utils/money.js";

// required to running in cloud
import http from "http";
http.createServer().listen(process.env.PORT);

dotenv.config();

// API keys can be generated here https://www.binance.com/en/my/settings/api-management
const binanceClient = Binance.default({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
});

// The bot token can be obtained from BotFather https://core.telegram.org/bots#3-how-do-i-create-a-bot
const bot = new TelegramBot(process.env.TELEGRAMM_BOT_TOKEN, { polling: true });

// Matches "/price [symbol]"
bot.onText(/\/price (.+)/, (msg, data) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Wait...");

  // data[1] can be single token (i.e. "BTC") or pair ("ETH BTC")
  const [cryptoToken1, cryptoToken2 = "USDT"] = data[1].split(" ");

  binanceClient
    .avgPrice({ symbol: `${cryptoToken1}${cryptoToken2}`.toUpperCase() }) // example, { symbol: "BTCUSTD" }
    .then((avgPrice) => {
      bot.sendMessage(chatId, formatMoney(avgPrice["price"]));
    })
    .catch((error) => bot.sendMessage(chatId, `Error retrieving the price for ${cryptoToken1}${cryptoToken2}: ${error}`));
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  switch (msg.text) {
    case "/start":
      bot.sendMessage(chatId, "Hi there! I am Alice Crypto Bot.");
      break;

    default:
      break;
  }
});
