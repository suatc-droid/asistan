import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client (requires GEMINI_API_KEY env var)
  const ai = process.env.GEMINI_API_KEY 
    ? new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      }) 
    : null;

  app.post("/api/chat", async (req, res) => {
    try {
      if (!ai) {
        return res.status(503).json({ error: "Gemini API key is not configured." });
      }

      const { message, context } = req.body;

      const systemInstruction = `
Sen Türkiye Cumhuriyeti Sağlık Bakanlığı teşkilatına (İl Sağlık Müdürlükleri, Hastaneler) özel olarak tasarlanmış bir Kurumsal Asistansın (AI Assistant v2.4).
Amacın personele atama, yer değiştirme, DHY, eş durumu, sürekli işçi işlemleri, SGK ve özlük mevzuatı gibi konularda yol göstermek, mevzuat odaklı fikirler vermek ve gerektiğinde resmi yazışma / tebligat örnekleri için dikkat edilmesi gerekenleri sunmaktır.
KVKK ve Bilgi Güvenliği kurallarına son derece hassassın. Dışarıya veri sızdırılmaz.
Karşındaki kişi özlük ve atama işlemlerini yürüten bir kamu çalışanı. Profesyonel, mevzuata uygun, net ve faydalı cevaplar vermelisin.
Eğer kullanıcı sana bir süreç (context) sağlamışsa, cevabını bu sürece göre şekillendir.

Mevcut Süreç/Bağlam:
${context || 'Genel Soru'}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2,
        },
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "İşlem sırasında bir hata oluştu." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = __dirname;
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
