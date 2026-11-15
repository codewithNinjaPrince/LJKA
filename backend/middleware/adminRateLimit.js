import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

let limiters;

const getLimiters = () => {
  if (limiters) return limiters;

  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    throw new Error("Shared Upstash Redis rate-limit credentials are missing");
  }

  const redis = Redis.fromEnv();

  limiters = {
    loginIp: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "15 m"),
      prefix: "ljka:admin-login:ip",
    }),
    loginUsername: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "15 m"),
      prefix: "ljka:admin-login:user",
    }),
    adminApi: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(600, "1 m"),
      prefix: "ljka:admin-api:admin",
    }),
  };

  return limiters;
};

const sendRateLimitResponse = (res, result) => {
  const retryAfter = Math.max(
    1,
    Math.ceil(((result?.reset || Date.now() + 60000) - Date.now()) / 1000)
  );

  res.set("Retry-After", String(retryAfter));
  return res.status(429).json({
    success: false,
    message: "Too many requests. Please try again later.",
  });
};

const rateLimitServiceUnavailable = (res) =>
  res.status(503).json({
    success: false,
    message: "Security rate-limiting service is temporarily unavailable",
  });

export const adminLoginRateLimit = async (req, res, next) => {
  try {
    const { loginIp, loginUsername } = getLimiters();

    const ip = String(req.ip || "unknown").slice(0, 100);
    const username = String(req.body?.username || "")
      .trim()
      .toLowerCase()
      .slice(0, 150);

    // Hash usernames so raw login identifiers are not stored in Redis keys.
    const usernameKey = createHash("sha256")
      .update(username || "missing-username")
      .digest("hex");

    const [ipResult, usernameResult] = await Promise.all([
      loginIp.limit(ip),
      loginUsername.limit(usernameKey),
    ]);

    if (!ipResult.success) return sendRateLimitResponse(res, ipResult);
    if (!usernameResult.success) return sendRateLimitResponse(res, usernameResult);

    return next();
  } catch (error) {
    console.error("Admin login rate-limit failure:", error?.message || "Unknown error");
    // Fail closed: do not allow unlimited login attempts if Redis is unavailable.
    return rateLimitServiceUnavailable(res);
  }
};

export const adminApiRateLimit = async (req, res, next) => {
  try {
    if (!req.admin?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { adminApi } = getLimiters();
    const result = await adminApi.limit(String(req.admin._id));

    if (!result.success) return sendRateLimitResponse(res, result);

    return next();
  } catch (error) {
    console.error("Admin API rate-limit failure:", error?.message || "Unknown error");
    return rateLimitServiceUnavailable(res);
  }
};
