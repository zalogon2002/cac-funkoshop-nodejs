// ACA REQUIERO UN PEDACITO DEL EXPRESS (EL ROUTER) Y ABAJO LO EJECUTO - QUE ES LA PAGINA DE INICIO EN EL NAVEGADOR
const { Router } = require("express");
const router = Router();

// const express = require("express");
// const router = express.Router();

// ACA SI TRAIGO TODO EL CONTROLADOR - PRIMERO LLAMO AL CORNTOLADOR Y DESPUES LLAMO A CADA METODO (EJ TRAER EL INDEX)
const controller = require("../controllers/mainController");

// ACA LLAMO AL METODO PARA TRAER EL INDEX
router.get("/", controller.index);


// EXPORTAMOS ESTE MODULO router PARA PODER USARLO FUERA
module.exports = router;



// app.set("views", "./src/views);

// app.use(methodOverride("_method"));
// app.use(express.static(__dirname + "/public"));

// app.use(express.urlencoded({ extended: false }));

// const mainRoutes = require("./src/routes/mainRoutes");
// const exp = require("constants");
// app.use(mainRoutes);

// app.use("/admin/productos", require("./src/routes/admin/productosRoutes"));

// app.use((req, res, next) => {
//   res.status(404).send("La pagina no existe");
// });

// const PORT = 3000;

// app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

