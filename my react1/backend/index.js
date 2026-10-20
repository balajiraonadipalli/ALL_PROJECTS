
const { OpenAI } = require("openai");
const express = require("express");
const cors = require("cors");



const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
});


app.post("/chat",async (req,res)=>{
  try {
    const {query} = req.body;
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `${query}`,
        },
      ],
    });

    console.log("Response:", completion.choices[0].message.content);
     return res.status(200).json({ message: completion.choices[0].message.content });
    
  } catch (err) {
    console.error("Error:", err);
    return res.status(400,{message:err})
  }
})


app.listen(3400,console.log("server Started at 3400"));



