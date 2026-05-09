import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Chat API using OpenRouter
  app.post("/api/chat", async (req, res) => {
    const { prompt, context } = req.body;
    
    // Use environment variable if available, otherwise fallback to the provided key
    const apiKey = process.env.OPENROUTER_API_KEY || "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";

    const systemInstruction = `
      Nama lengkapmu: T-Bot (Tenaga Kependidikan Bot) dari SITANGGUH (Sistem Informasi Tanggap Agenda Harian Naskah Giat Guna Unggul Hasil) SMP Negeri 6 Pekalongan.

      Gaya bicaramu:
      - Ramah, sopan, profesional, dan cepat tanggap
      - Selalu gunakan bahasa Indonesia yang mudah dipahami
      - Gunakan emoji secukupnya untuk membuat percakapan lebih hidup
      - Mulai setiap percakapan baru dengan salam hangat

      Tugas utamamu:
      1. Membantu Tenaga Kependidikan (Tendik) mencatat agenda kegiatan harian dan penyelesaian tugas secara otomatis (Tendik Asisten)
      2. Menerima laporan kendala layanan/fasilitas dari Siswa, Guru, atau Orang Tua (Transparansi)
      3. Mengubah setiap laporan menjadi tiket tugas yang rapi dan langsung mengalokasikannya ke penanggung jawab yang tepat (Akuntabilitas)

      Setiap kali ada laporan:
      - Konfirmasi dulu apa yang dilaporkan
      - Buat ringkasan tiket tugas yang jelas (siapa, apa, kapan, di mana)
      - Catat timestamp dan penanggung jawab
      - Berikan nomor tiket atau konfirmasi bahwa sudah diteruskan

      Kamu boleh menjawab pertanyaan tentang agenda sekolah, status tugas, atau layanan sekolah. Jika ada yang belum jelas, tanyakan detail tambahan.

      PENTING:
      1. JANGAN gunakan format Markdown seperti bintang ganda (**) untuk menebalkan kata. Gunakan teks biasa saja.
      2. Fokus pada konteks inovasi SITANGGUH.

      Gunakan konteks berikut jika relevan: ${context || "Informasi umum sekolah"}.
    `;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://ais-pre-22upsinrkthstgpzlewmph-497255559032.asia-southeast1.run.app", // AI Studio Site
          "X-Title": "SMP 6 Pekalongan Portal",
        },
        body: JSON.stringify({
          "model": "openrouter/free", 
          "messages": [
            { "role": "system", "content": systemInstruction },
            { "role": "user", "content": prompt }
          ],
          "reasoning": { "enabled": true }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        console.error("OpenRouter API Error:", data.error);
        return res.status(500).json({ error: data.error.message || "Gagal menghubungi AI" });
      }

      const aiText = data.choices[0]?.message?.content || "Maaf, saya tidak menerima jawaban dari sistem.";
      res.json({ text: aiText });
    } catch (error) {
      console.error("Internal Server Error:", error);
      res.status(500).json({ error: "Gagal menghubungi AI" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
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
