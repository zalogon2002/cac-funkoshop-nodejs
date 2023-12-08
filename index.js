// ESTE ES EL ENTRY POINT

require("dotenv").config();

const express = require("express");
const app = express();
const path  = require("path");
const methodOverride = require("method-override");

// EN EL ENTRY POINT TENGO QUE REQUERIR Y CONFIGURAR EL EXPRESS-SESSION
// const session = require("express-session");
// EN EL ENTRY POINT TENGO QUE REQUERIR Y CONFIGURAR EL COOKIE-SESSION
const session = require("cookie-session");

// app.use(
// session({
//   secret: "S3cr3t01",
//   resave: false,
//   saveUninitialized: false,
// })
// );

app.use(
  session({
    // keys: ["S3cr3t01", "S3cr3t02"],
    keys: ["crjo23u82yun309tv", "S3cr3t02"],
  })
);

// SI ESTA LOGUEADO, TENEMOS UN MIDDLEWARE (QUE ES UN req, res, next) - ESTA ESTE DATO EN LA Session, ENVIALO AL LOGIN - SINO, SEGUI
// SI EL USER ID ESTA GUARDADO, EL USUARIO ESTA LOGUEADO
const isLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  next();
};

// app.use((req, res, next) => {
//   res.send("Sitio en mantenimiento");
// });

const sequelize = require("./src/models/connection");

app.set("view engine", "ejs");
// app.set("views", "./src/views");
app.set("views", path.join(__dirname, "/src/views"));

// USO EL METODO OVERRIDE PARA SOBREESCRIBIR EL METODO PUT EN EL FILE edit.ejs (LINEA 22)
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.use(express.urlencoded({ extended: false }));

// LE INDICO QUE REQUIERA LA RUTA authRoutes - YA TENGO ESA RUTA DEFINIDA AQUI
app.use(require("./src/routes/authRoutes"));

const mainRoutes = require("./src/routes/mainRoutes");
app.use(mainRoutes);

app.use(
"/admin/productos", 
isLogin,
require("./src/routes/admin/productosRoutes")
);

app.use((req, res, next) => {
  res.status(404).send("La pagina no existe");
});

// const PORT = 3000;
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
try {
  // UTILIZA LOS DATOS QUE ESTAN EN .env, EN LA CONEXION, Y CON ESTO SE AUTENTICA - SI ESTA TODO BIEN, YA ESTAS CONECTADO A LA BBDD
  await sequelize.authenticate();
} catch(error) {
  console.log(error);
}

console.log(`http://localhost:${PORT}`);
});