import { createServer, init, router, ok, err, TaggedError } from "@alt-stack/server-hono";
import { serve } from "@hono/node-server";
import { z } from "zod";
import { env } from "./env.js";

// ============================================================================
// Types
// ============================================================================

const HealthSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.string().datetime(),
});

const MessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  createdAt: z.string().datetime(),
});

// ============================================================================
// Error Classes
// ============================================================================

class NotFoundError extends TaggedError {
  readonly _tag = "NotFoundError" as const;
  constructor(public readonly message: string = "Resource not found") {
    super(message);
  }
}

const NotFoundErrorSchema = z.object({
  _tag: z.literal("NotFoundError"),
  message: z.string(),
});

// ============================================================================
// In-Memory Store
// ============================================================================

interface StoredMessage {
  id: string;
  text: string;
  createdAt: Date;
}

const messages = new Map<string, StoredMessage>();

// ============================================================================
// Router
// ============================================================================

const factory = init();

const apiRouter = router({
  health: {
    get: factory.procedure.output(HealthSchema).handler(() => {
      return ok({
        status: "ok" as const,
        timestamp: new Date().toISOString(),
      });
    }),
  },

  messages: {
    "/": {
      get: factory.procedure.output(z.array(MessageSchema)).handler(() => {
        return ok(
          Array.from(messages.values()).map((m) => ({
            ...m,
            createdAt: m.createdAt.toISOString(),
          }))
        );
      }),

      post: factory.procedure
        .input({
          body: z.object({
            text: z.string().min(1).max(500),
          }),
        })
        .output(MessageSchema)
        .handler(({ input }) => {
          const id = crypto.randomUUID();
          const now = new Date();
          const message: StoredMessage = {
            id,
            text: input.body.text,
            createdAt: now,
          };
          messages.set(id, message);

          return ok({
            ...message,
            createdAt: message.createdAt.toISOString(),
          });
        }),
    },

    "{id}": {
      get: factory.procedure
        .input({ params: z.object({ id: z.string().uuid() }) })
        .output(MessageSchema)
        .errors({
          404: NotFoundErrorSchema,
        })
        .handler(({ input }) => {
          const message = messages.get(input.params.id);
          if (!message) {
            return err(new NotFoundError("Message not found"));
          }
          return ok({
            ...message,
            createdAt: message.createdAt.toISOString(),
          });
        }),

      delete: factory.procedure
        .input({ params: z.object({ id: z.string().uuid() }) })
        .output(z.object({ success: z.boolean() }))
        .errors({
          404: NotFoundErrorSchema,
        })
        .handler(({ input }) => {
          const message = messages.get(input.params.id);
          if (!message) {
            return err(new NotFoundError("Message not found"));
          }
          messages.delete(input.params.id);
          return ok({ success: true });
        }),
    },
  },
});

// ============================================================================
// Server
// ============================================================================

const app = createServer({ api: apiRouter });

export { apiRouter };
export default app;

console.log(`Server running at http://localhost:${env.PORT}`);
serve({ fetch: app.fetch, port: env.PORT });
