import fs from 'fs/promises';

import {serve} from '@hono/node-server';
import {serveStatic} from '@hono/node-server/serve-static';
import {zValidator} from '@hono/zod-validator';
import {PrismaClient} from '@prisma/client';
import {Hono, type Context} from 'hono';
import {createMiddleware} from 'hono/factory';
import {z} from 'zod';

const app = new Hono();
const prisma = new PrismaClient();

const RegisterPayloadSchema = z.object({team: z.string().min(3)});

function noContent(c: Context) {
    return c.body(null, 204);
}

function hasExtension(filename: string) {
    return /\.\w+$/.test(filename);
}

const noFileMiddleware = createMiddleware(async (c, next) => {
    if (hasExtension(c.req.path)) {
        return c.text('', 404, {
            // TODO: It can be anything else, but will check on that later
            'Content-Type': 'text/javascript',
        });
    }

    await next();
});

app.post('/register', zValidator('form', RegisterPayloadSchema), async c => {
    const {team} = c.req.valid('form');
    await prisma.user.create({data: {team}});

    return c.json({details: 'Created'}, 201);
})
    .use('/static/*', serveStatic({root: './'}))
    .get('/favicon.ico', noContent)
    .get('/*', noFileMiddleware, async c => {
        const templatePath = 'index.html';
        const template = await fs.readFile(`static/${templatePath}`);

        return c.html(template.toString());
    });

const port = 8080;
console.log(`Server is running on http://localhost:${port}`);

serve({fetch: app.fetch, port});
