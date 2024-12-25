import Redis from "ioredis";

let redis: Redis | null = null;

try {
  redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
  console.log("Connected to Redis!");
} catch (error) {
  console.error("Unable to connect to Redis!", error);
  redis = null;
}

export default redis;
