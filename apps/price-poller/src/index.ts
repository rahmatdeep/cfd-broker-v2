import { WebSocket } from "ws";
import { createClient } from "redis";

const client = createClient();
(async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
    publishPrice();
  } catch (e) {
    console.log(e);
  }
})();

const priceUpdates: [
  { market: "BTC_USDC"; price: number; decimals: number },
  { market: "SOL_USDC"; price: number; decimals: number },
  { market: "ETH_USDC"; price: number; decimals: number },
] = [
  { market: "BTC_USDC", price: 0, decimals: 0 },
  { market: "SOL_USDC", price: 0, decimals: 0 },
  { market: "ETH_USDC", price: 0, decimals: 0 },
];

const ws = new WebSocket("wss://ws.backpack.exchange/");

ws.on("open", function open() {
  console.log("Connected to backpack");
  ws.send(
    JSON.stringify({
      method: "SUBSCRIBE",
      params: ["bookTicker.BTC_USDC"],
      id: 1,
    })
  );
  ws.send(
    JSON.stringify({
      method: "SUBSCRIBE",
      params: ["bookTicker.SOL_USDC"],
      id: 2,
    })
  );
  ws.send(
    JSON.stringify({
      method: "SUBSCRIBE",
      params: ["bookTicker.ETH_USDC"],
      id: 3,
    })
  );
});
ws.on("message", function incoming(data: any) {
  //current price is being calculated based on asks
  const bookTicker = JSON.parse(data);
  // console.log(trade.data.a);
  if (bookTicker.stream == "bookTicker.BTC_USDC") {
    const { scaled, decimals } = scaleNumber(bookTicker.data.a);
    priceUpdates[0].price = scaled;
    priceUpdates[0].decimals = decimals;
  } else if (bookTicker.stream == "bookTicker.SOL_USDC") {
    const { scaled, decimals } = scaleNumber(bookTicker.data.a);
    priceUpdates[1].price = scaled;
    priceUpdates[1].decimals = decimals;
  } else if (bookTicker.stream == "bookTicker.ETH_USDC") {
    const { scaled, decimals } = scaleNumber(bookTicker.data.a);
    priceUpdates[2].price = scaled;
    priceUpdates[2].decimals = decimals;
  }
  // console.log(priceUpdates);
});

function scaleNumber(num: number) {
  const numStr = num.toString();
  const decimals = numStr.includes(".") ? numStr.split(".")[1]!.length : 0;
  const scaleFactor = 10 ** decimals;
  const scaled = Math.round(num * scaleFactor);
  return { scaled, decimals };
}

function publishPrice() {
  setInterval(() => {
    client.publish("priceUpdates", JSON.stringify(priceUpdates));
    // console.log(priceUpdates);
  }, 100);
}
