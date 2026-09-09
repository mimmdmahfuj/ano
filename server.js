const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static assets with .html extension fallback
app.use(express.static(__dirname, { extensions: ['html'] }));

// Fallback to 404.html if a route is not found
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
