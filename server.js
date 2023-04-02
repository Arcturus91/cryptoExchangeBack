const app = require("./app");
const server = require("./routes/cryptoSockets.routes");

const PORT = process.env.PORT || 5005;
const PORTWS = process.env.PORTWS || 8080;

server.listen(PORTWS, () => {
  console.log("Websockets server listening on port 8080");
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
