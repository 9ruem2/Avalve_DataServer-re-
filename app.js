const express = require('express');
const deviceRoutes = require('./routes/deviceRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const errorMiddleware = require('./infrastructure/errorHandling/errorMiddleware');
const configs = require('./config/configs');

const app = express();

app.use(express.json());
app.use('/api/devices', deviceRoutes);
app.use('/api/upload', uploadRoutes);
app.use(errorMiddleware);

const port = configs.server.port;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
