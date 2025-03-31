const express = require('express');

// Initialize express
const app = express();

// Test route
app.get('/', (req, res) => {
  res.send('Express is working!');
});

// Define port
const PORT = 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Open your browser and go to: http://localhost:${PORT}`);
}); 