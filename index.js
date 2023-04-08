const express = require('express');
const cors = require('cors');
const connection = require('./config/db');
const userRoute = require('./routes/userRoute');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/bank", userRoute);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(PORT, async() => { 
    try {
        await connection;
        console.log("DB-started");
    } catch (error) {
        console.log(error);
    }
    console.log(`Server is running at http://localhost:${PORT}`);
})

