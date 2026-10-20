import OpenAI from "openai";
import products from "./p.js"; // Assuming products is exported from p.js

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  defaultHeaders: {
    "HTTP-Referer": "<YOUR_SITE_URL>", // optional
    "X-Title": "<YOUR_SITE_NAME>"       // optional
  },
  dangerouslyAllowBrowser: true // For demo only; use backend in production
});

export async function aiSearch(query) {
  const productData = JSON.stringify(products);

  const prompt = `
  You are a product filter. Given the following JSON product list:
  ${productData}

  User query: "${query}"

  Return ONLY a JSON array of matching product IDs.
  Example: [1, 3, 5]
  `;

  const completion = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful product filtering assistant." },
      { role: "user", content: prompt }
    ]
  });

  try {
    const text = completion.choices[0].message.content.trim();
    console.log(text);
    return JSON.parse(text);
  } catch {
    return [];
  }
}
