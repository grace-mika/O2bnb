require("dotenv").config();

const { createApp } = require("./app");

const app = createApp();
const PORT = process.env.PORT;

app.listen(3000, () => {
  console.log(`Listening to request on 127.0.0.1:3000`);
});

startServer();