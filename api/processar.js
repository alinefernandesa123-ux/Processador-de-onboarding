// Importa a biblioteca do Google Generative AI
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Pega a chave da API que guardamos na Vercel
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Esta é a função principal que a Vercel vai executar
export default async function handler(request, response) {
  // Garante que o método da requisição seja POST (mais seguro para enviar dados)
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Pega o texto enviado pelo front-end
    const { textoParaProcessar, tipo } = request.body;

    // Prepara o prompt para a IA
    let prompt;
    if (tipo === 'resumir') {
      prompt = `Resuma o seguinte texto de forma concisa:\n\n${textoParaProcessar}`;
    } else if (tipo === 'acoes') {
      prompt = `Liste os pontos de ação (action items) do seguinte texto no formato de checklist:\n\n${textoParaProcessar}`;
    } else if (tipo === 'decisoes') {
      prompt = `Identifique e liste as principais decisões tomadas no seguinte texto:\n\n${textoParaProcessar}`;
    } else {
      return response.status(400).json({ error: 'Tipo de processamento inválido' });
    }

    // Pega o modelo da IA
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Pede para a IA gerar o conteúdo
    const result = await model.generateContent(prompt);
    const iaResponse = await result.response;
    const iaText = iaResponse.text();

    // Envia a resposta da IA de volta para o front-end
    return response.status(200).json({ resultado: iaText });

  } catch (error) {
    // Se der algum erro, informa no console e envia uma mensagem de erro
    console.error(error);
    return response.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
  }
}
