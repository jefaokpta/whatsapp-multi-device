import express from 'express';
import {connectToWhatsApp} from "./whatsapp/whatsConnection";
const app = express();
const port = process.env.PORT || 3000


// run in main file
connectToWhatsApp()

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server iniciou na porta ${port}! 🚀`);
});
