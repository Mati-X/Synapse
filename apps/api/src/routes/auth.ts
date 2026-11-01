import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { db } from '../db/index.js';
import { users, sessions } from '../db/schema.js';
import { hashPassword, verifyPassword, generateToken } from '../auth/security.js';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post('/register', async (request, reply) => {
    const parseResult = registerSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: parseResult.error.flatten() });
    }

    const { email, password, name } = parseResult.data;

    const [existing] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    if (existing) {
      return reply.status(409).send({ error: 'User with this email already exists' });
    }

    const passwordHash = hashPassword(password);
    const [user] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name,
        role: 'developer',
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.created_at,
      });

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(sessions).values({
      user_id: user.id,
      token,
      expires_at: expiresAt,
    });

    return reply.status(201).send({
      user,
      token,
    });
  });

  app.post('/login', async (request, reply) => {
    const parseResult = loginSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: parseResult.error.flatten() });
    }

    const { email, password } = parseResult.data;

    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    if (!user) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    const valid = verifyPassword(password, user.password_hash);
    if (!valid) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(sessions).values({
      user_id: user.id,
      token,
      expires_at: expiresAt,
    });

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  });

  app.post('/logout', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await db.delete(sessions).where(eq(sessions.token, token));
    }
    return reply.send({ success: true });
  });

  app.get('/me', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const [session] = await db.select().from(sessions).where(eq(sessions.token, token));

    if (!session || new Date() > session.expires_at) {
      return reply.status(401).send({ error: 'Invalid or expired session' });
    }

    const [user] = await db.select().from(users).where(eq(users.id, session.user_id));
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  });
};
