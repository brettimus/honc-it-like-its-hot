<div align="center">
  <h1>Honc Honc!</h1>
  <img src="https://github.com/brettimus/honc-it-like-its-hot/blob/8f49e07f6161267c93711c48b8f9c40aa571fc83/assets/honc.png" width="200" height="200" />
</div>

<p align="center">
    Recipe book for creating modular data APIs using TypeScript and the [HONC stack](https://honc.dev)
</p>

[HONC](https://honc.dev) is a modular collection of choice technologies for building lightweight, type-safe, edge-enabled data apis that scale seamlessly to their demand.

  🪿 **[Hono](https://hono.dev)** as an api framework  
  🪿 **[Neon](https://neon.tech)** for a relational Postgres database  
  🪿 **[Drizzle](https://orm.drizzle.team/)** as the ORM and migrations manager  
  🪿 **[Cloudflare](https://workers.cloudflare.com/)** Workers for deployment hosting  

HONC provides the tool to get running quickly, and this repo provides a collection of examples, templates, and recipes for common use cases for data apis.

## Templates

Accessible via the [Create HONC App](https://github.com/fiberplane/create-honc-app) CLI.

## Examples

Example applications built with the HONC stack that you could deploy to Cloudflare. Each example's README will explain why it was set up that way, as well as giving instructions on how to deploy.

## Recipes

Recipes for common use cases for data apis, including:

- [Authentication](./recipes/authentication)
- [Rate Limiting](./recipes/rate-limiting)
- [R2 Object Storage](./recipes/r2-object-storage)
- [WebSockets with Durable Objects](./recipes/durable-objects)
- [Scheduled Jobs](./recipes/scheduled-jobs)
