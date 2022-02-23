/* import jsonServer from "json-server";
import path from "path"; */

const jsonServer = require("json-server");
const path = require("path");

const filePath = path.join(path.resolve("src/db.json"));
const server = jsonServer.create();
const routerRes = jsonServer.router(filePath);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(routerRes);
server.listen(8080, () => {
  console.log("JSON Server is running");
});
