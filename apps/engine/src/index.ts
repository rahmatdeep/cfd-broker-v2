import { createClient } from "redis";

interface Trade {
  market: string;
  price: number;
  decimals: number;
}

const redisClient = createClient();
const PRICES = {
  BTC: {
    price: 0,
    decimal: 0,
  },
  ETH: {
    price: 0,
    decimal: 0,
  },
  SOL: {
    price: 0,
    decimal: 0,
  },
};
(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
    subRedis();
  } catch (e) {
    console.log(e);
  }
})();

async function subRedis() {
  await redisClient.subscribe("priceUpdates", (message) => {
    updatePrice(message);
    console.log(PRICES);
  });
}

function updatePrice(message: string) {
  try {
    const trades = JSON.parse(message) as Trade[];
    trades.forEach((trade) => {
      const symbol = trade.market.split("_")[0] as keyof typeof PRICES; //
      if (PRICES[symbol]) {
        PRICES[symbol].price = trade.price;
        PRICES[symbol].decimal = trade.decimals;
      }
    });
  } catch (err) {
    console.log(err);
  }
}
