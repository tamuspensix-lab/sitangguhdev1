/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const getGeminiResponse = async (prompt: string, context?: string) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, context }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("AI API Error:", data.error);
      return `Maaf, terjadi kesalahan: ${data.error}`;
    }

    return data.text || "Terjadi kesalahan saat memproses jawaban.";
  } catch (error) {
    console.error("AI Client Error:", error);
    return "Maaf, saya sedang mengalami kendala koneksi ke server AI.";
  }
};
