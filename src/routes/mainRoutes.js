const { Router } = require("express");
const router = Router();

// const express = require("express");
// const router = express.Router();

const controller = require("../controllers/mainController");

router.get("/", controller.index);

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

