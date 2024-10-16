import { instrument } from "@fiberplane/hono-otel";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { jokes } from "./db/schema";
import { desc, count } from "drizzle-orm";
import { HomePage } from "./HomePage";

type Bindings = {
  DATABASE_URL: string;
  AI: Ai; // Cloudflare AI binding, enabled in wrangler.toml
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  let joke: string;

  // 50/50 chance to either generate a new joke or get a random joke
  if (Math.random() < 0.5) {
    joke = await generateGooseJoke(db, c.env.AI);
    // Insert the new joke into the database
    await db.insert(jokes).values({ content: joke });
  } else {
    joke = await getRandomJoke(db, c.env.AI);
  }

  return c.html(
    <HomePage joke={joke} />
  );
});

/**
 * Retrieves all jokes from the database
 * 
 * @param db - The drizzle neon wrapper
 * @returns A Promise that resolves to an array of jokes
 */
app.get("/api/jokes", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  return c.json({
    jokes: await db.select().from(jokes),
  });
});

app.post("/api/generate-joke", async (c) => {
  const ai = c.env.AI;
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const joke = await generateGooseJoke(db, ai);

  if (!joke) {
    return c.json({
      error: "No joke generated",
    }, 500);
  }

  const [newJoke] = await db.insert(jokes).values({
    content: joke,
  }).returning();

  return c.json({
    joke: newJoke,
  });
});

export default instrument(app);


/**
 * Retrieves a random joke from the database or generates a new one if there are fewer than 50 jokes.
 * 
 * @param db - The database connection object
 * @param ai - The AI object used for generating new jokes
 * @returns A Promise that resolves to a string containing the joke
 */
async function getRandomJoke(db: NeonHttpDatabase, ai: Ai): Promise<string> {
  // Get the total count of jokes in the database
  const [{ count: jokeCount }] = await db.select({ count: count() }).from(jokes);

  // If there are fewer than 50 jokes, generate a new one instead
  if (jokeCount < 50) {
    return generateGooseJoke(db, ai);
  }

  // Generate a random offset to select a random joke
  const randomOffset = Math.floor(Math.random() * jokeCount);

  // Fetch a random joke using OFFSET
  const [randomJoke] = await db
    .select()
    .from(jokes)
    .limit(1)
    .offset(randomOffset);

  // Return the joke content or an empty string if no joke was found
  return randomJoke?.content ?? "";
}

/**
 * Generates a new goose joke using AI
 * 
 * @param db - The drizzle neon wrapper
 * @param ai - Cloudflare AI binding
 * @returns A Promise that resolves to a string containing the generated goose joke
 */
async function generateGooseJoke(db: NeonHttpDatabase, ai: Ai): Promise<string> {
  // Fetch the 5 most recent jokes
  const recentJokes = await db.select().from(jokes).orderBy(desc(jokes.createdAt)).limit(5);

  const recentJokesContent = recentJokes.map(joke => joke.content).join('\n');

  const systemPrompt = `
    You are an kitschy stand-up comedian.
    Craft a joke about a goose in the style of a 1970s Saturday Night Live skit or Jerry Seinfeld.
    The joke should be short and family-friendly.
    Bad puns are allowed.
    Do not end with "Say HONK" or "Said HONK!".

    Here is a good example:
    
    "Why did the goose cross the road? To prove he wasn't chicken!"

    Here are some recent jokes to avoid repeating:
    ${recentJokesContent}
  `.trim();
  const userPrompt = `
    Generate me a funny joke about a goose.
    Do not repeat any of these recent jokes or puns:\n${recentJokesContent}
  `.trim();

  const response: AiTextGenerationOutput = await ai.run("@cf/meta/llama-3.1-8b-instruct-fast" as BaseAiTextGenerationModels, {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.72,
  });

  let joke = "";
  if (response instanceof ReadableStream) {
    const textStream = response.pipeThrough(new TextDecoderStream());
    const text = await textStream.getReader().read();
    joke = text.value ?? "";
  } else {
    joke = response.response ?? "";
  }

  return joke;
}
