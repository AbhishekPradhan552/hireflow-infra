import { Redis } from "ioredis";

const isProd = process.env.NODE_ENV === "production";

let redis;

if (isProd) {
  const url = new URL(process.env.REDIS_URL);

  redis = new Redis({
    host: url.hostname,
    port: Number(url.port),
    username: url.username,
    password: url.password,
    tls: {},
    maxRetriesPerRequest: null,
    connectTimeout: 10000,
    lazyConnect: false,
  });
} else {
  redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
  });
}

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("ready", () => {
  console.log("🚀 Redis ready");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

export { redis };
