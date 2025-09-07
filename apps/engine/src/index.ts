import { createClient } from "redis";

const redisClient = createClient();
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
    try {
      const trade = JSON.parse(message);
      console.log(trade);
    } catch (e) {
      console.log(e);
    }
  });
}
