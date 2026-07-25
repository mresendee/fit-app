import { Redis } from "@upstash/redis";

// Lê as credenciais que a integração Upstash/Redis da Vercel injeta
// automaticamente como variáveis de ambiente quando você conecta o banco
// pelo painel (Storage → conectar ao projeto).
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// GET  /api/sync?code=ABC123        → busca os dados salvos com essa chave
// POST /api/sync { code, data }     → salva/atualiza os dados dessa chave
//
// Cada "code" é uma chave curta que a pessoa usa pra parear os aparelhos —
// não tem conta nem senha, é basicamente um código de pareamento.
export default async function handler(req, res) {
  if (!process.env.KV_REST_API_URL) {
    return res.status(500).json({ erro: "Redis ainda não conectado a este projeto na Vercel (veja o README)." });
  }

  try {
    if (req.method === "GET") {
      const { code } = req.query;
      if (!code) return res.status(400).json({ erro: "code é obrigatório" });
      const data = await redis.get(`fitapp:${code}`);
      if (!data) return res.status(404).json({ erro: "Nenhum dado encontrado para essa chave" });
      return res.status(200).json({ data });
    }

    if (req.method === "POST") {
      const { code, data } = req.body ?? {};
      if (!code || !data) return res.status(400).json({ erro: "code e data são obrigatórios" });
      await redis.set(`fitapp:${code}`, data);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ erro: "Método não suportado" });
  } catch (e) {
    return res.status(500).json({ erro: "Erro no armazenamento remoto: " + e.message });
  }
}
