import { WorkersKVStore } from "@hono-rate-limiter/cloudflare";
import type { Context, Next } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { createFactory } from "hono/factory";
import type { Bindings } from "./types";

const factory = createFactory<{ Bindings: Bindings }>();

export const gooseJokesRateLimiter = factory.createMiddleware(
  (c: Context, next: Next) =>
    rateLimiter({
      windowMs: 2 * 60 * 1000, // 2 minutes
      limit: 200, // Limit each IP to 100 requests per `window` (here, per 10 minutes).
      standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
      keyGenerator: (c) => c.req.header("cf-connecting-ip") ?? "", // Method to generate custom identifiers for clients.
      store: new WorkersKVStore({ namespace: c.env.GOOSE_JOKES_CACHE }), // Here GOOSE_JOKES_CACHE is your WorkersKV Binding.
    })(c, next),
);
