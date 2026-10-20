

//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   openrouter



const { OpenAI } = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
});

async function main() {
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "What is the capital of India?",
        },
      ],
    });

    console.log("Response:", completion.choices[0].message.content);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();

