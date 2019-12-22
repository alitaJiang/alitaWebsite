const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test', 'rain_drop.html'));
})

app.listen(PORT, () => {
    console.info(`Server listen on port ${PORT}`);
});