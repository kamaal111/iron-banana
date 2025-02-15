import fs from 'fs/promises';

import {serve} from '@hono/node-server';
import {serveStatic} from '@hono/node-server/serve-static';
import {zValidator} from '@hono/zod-validator';
import {PrismaClient} from '@prisma/client';
import {Hono} from 'hono';
import {createMiddleware} from 'hono/factory';
import {z} from 'zod';

const app = new Hono();
const prisma = new PrismaClient();

const EventPayloadSchema = z.object({command: z.literal('GOT_HIT'), team: z.number()});

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

app.post('/event', zValidator('json', EventPayloadSchema), async c => {
    const payload = c.req.valid('json');
    if (payload.command === 'GOT_HIT') {
        const score = await prisma.scores.findFirst({where: {team: payload.team}});
        if (score != null) {
            await prisma.scores.update({where: {team: payload.team}, data: {score: score.score + 1}});
        } else {
            await prisma.scores.create({data: {team: payload.team, score: 1}});
        }
        return c.body(null, 204);
    }

    return c.json({details: 'Not Found'}, 404);
})
    .use('/static/*', serveStatic({root: './'}))
    .get('/favicon.ico', c => c.body(null, 204))
    .get('/*', noFileMiddleware, async c => {
        const templatePath = 'index.html';
        const template = await fs.readFile(`static/${templatePath}`);

        return c.html(template.toString());
    });

const port = 8080;
console.log(`Server is running on http://localhost:${port}`);

serve({fetch: app.fetch, port});
