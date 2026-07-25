import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT =
  "Você é uma API de análise nutricional. Sua única função é olhar a foto de um prato " +
  "de comida e responder com um JSON — nunca com texto explicativo, nunca com markdown, " +
  "nunca com frases antes ou depois. Apenas o objeto JSON puro, começando em { e terminando em }.";

const INSTRUCAO =
  "Identifique cada alimento visível nesta foto e estime a quantidade e as calorias de " +
  "cada um, de forma realista pro tamanho da porção que aparece na imagem. " +
  "Se não conseguir identificar nada com confiança, retorne um array de itens vazio. " +
  'Responda EXATAMENTE nesse formato, sem nada além disso: ' +
  '{"itens":[{"nome":"Nome do alimento com a quantidade estimada","kcal":000}],"total_kcal":000}';

// Extrai o primeiro objeto JSON válido de um texto, mesmo que venha com
// frases ou marcação markdown ao redor (a IA às vezes ignora a instrução de
// responder só com JSON).
function extrairJSON(texto) {
  const semMarkdown = texto.replace(/```json|```/gi, "").trim();
  const inicio = semMarkdown.indexOf("{");
  const fim = semMarkdown.lastIndexOf("}");
  if (inicio === -1 || fim === -1 || fim < inicio) {
    throw new Error("a resposta da IA não continha um JSON reconhecível");
  }
  return JSON.parse(semMarkdown.slice(inicio, fim + 1));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ erro: "Método não suportado" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ erro: "Chave da Anthropic ainda não configurada neste projeto (veja o README)." });
  }

  const { imagemBase64, mediaType } = req.body ?? {};
  if (!imagemBase64) return res.status(400).json({ erro: "imagemBase64 é obrigatório" });

  let respostaBruta = null;
  try {
    const resposta = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: imagemBase64 } },
            { type: "text", text: INSTRUCAO },
          ],
        },
      ],
    });

    const bloco = resposta.content.find((b) => b.type === "text");
    respostaBruta = bloco?.text ?? "";
    const dados = extrairJSON(respostaBruta);

    if (!Array.isArray(dados.itens)) throw new Error("formato inesperado (sem lista de itens)");
    return res.status(200).json(dados);
  } catch (e) {
    // Loga a resposta crua da IA nos logs da Vercel (Deployments → Functions)
    // pra facilitar diagnóstico caso aconteça de novo.
    if (respostaBruta) console.error("Resposta da IA que falhou ao interpretar:", respostaBruta);
    console.error("Erro em /api/analisar-foto:", e);
    return res.status(500).json({ erro: "Não consegui analisar essa foto: " + e.message });
  }
}
