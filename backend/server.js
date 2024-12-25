require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to expand understanding of highlighted text
app.post("/expand-text", async (req, res) => {
  const { text } = req.body;

  // Log request received
  console.log(`[${new Date().toISOString()}] POST /expand-text`);
  console.log(`Received text: "${text}"`);

  if (!text) {
    console.log(`[${new Date().toISOString()}] Error: Text is required`);
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
              You are a helpful assistant that expands on a given piece of highlighted text. 
              Your goal is to provide a detailed explanation of the meaning, context, and key ideas or concepts within the text. 
              Additionally, identify any important keywords and explain their significance.
              Format your response as:
              Explanation: [Expanded meaning and context]
              Keywords: [Keyword1, Keyword2, ...] - [Brief explanation of each keyword]
            `,
          },
          {
            role: "user",
            content: `Expand on the following highlighted text and explain its context:\n\n"${text}"`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const expandedText = openaiResponse.data.choices[0].message.content;

    // Log success response
    console.log(`[${new Date().toISOString()}] Response sent successfully`);

    res.json({ expandedText });
  } catch (error) {
    // Log error details
    console.error(`[${new Date().toISOString()}] Error with OpenAI API:`, error.message);
    res.status(500).json({ error: "Failed to process the highlighted text" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on http://localhost:${PORT}`);
});

