const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");
const FileStore = require("session-file-store")(session);

app.use(session({
  secret: 'fane-hwsn-2tgb-3b23',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static("./app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rotas = require("./app/routes/router");
app.use("/", rotas);

const rotasAdm = require("./app/routes/routerAdm");
app.use("/", rotasAdm);

app.listen(port, () => {
  console.log(`Servidor online\nhttp://localhost:${port}`);
});
