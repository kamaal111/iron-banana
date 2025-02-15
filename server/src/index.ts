import {serve} from '@hono/node-server';
import {zValidator} from '@hono/zod-validator';
import {PrismaClient} from '@prisma/client';
import {Hono} from 'hono';
import {z} from 'zod';

const app = new Hono();
const prisma = new PrismaClient();

const RegisterPayloadSchema = z.object({team: z.string().min(3)});

app.post('/register', zValidator('form', RegisterPayloadSchema), async c => {
    const {team} = c.req.valid('form');
    await prisma.user.create({data: {team}});

    return c.json({details: 'Created'}, 201);
});

const port = 8080;
console.log(`Server is running on http://localhost:${port}`);

serve({fetch: app.fetch, port});
