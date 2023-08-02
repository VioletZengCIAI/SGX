

// app.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000; // You can change this port if needed

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.post('/getAnswer', async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: 'Please provide a valid question.' });
  }

  const apiUrl = 'https://0c77-13-64-93-174.ngrok-free.app/add?text=' + encodeURIComponent(question);

  try {
    const response = await axios.get(apiUrl);
    res.json({ answer: response.data[0] });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the answer.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

