// Autenticacao via JWT. Cada token carrega tenant_id, garantindo o
// isolamento multi-tenant em todas as rotas.
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db.js';

const SECRET = process.env.JWT_SECRET || 'dev-secret-troque-em-producao';
const EXPIRES = '30d';

export function login(email, password) {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return null;
  }
  const token = jwt.sign(
    { uid: user.id, tenant: user.tenant_id, role: user.role },
    SECRET,
    { expiresIn: EXPIRES }
  );
  return {
    token,
    user: {
      id: user.id, name: user.name, email: user.email,
      role: user.role, tenant_id: user.tenant_id, max_discount: user.max_discount,
    },
  };
}

// Hook Fastify: exige token valido e injeta req.user.
export function authGuard(req, reply, done) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    reply.code(401).send({ error: 'Token ausente.' });
    return;
  }
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.uid);
    if (!req.user) throw new Error('user gone');
    done();
  } catch {
    reply.code(401).send({ error: 'Token invalido.' });
  }
}
