# highlight-ai

inspired by grok analysis

to test, load the `chrome-extension` directory unpacked into `chrome://extensions/`. I recommend pinning the chrome extension for easy visibility.

add your `OPENAI_API_KEY=` to the `backend/.env` file

start the server with

```
cd backend
node server.js
```

Usage:
1. highlight any text and right click, and then select "Expand Meaning with Highlight-AI"
2. click the chrome extension to view the AI response.

you may host or keep the server running on some port in the background for personal usage. 

