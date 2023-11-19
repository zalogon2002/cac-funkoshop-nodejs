const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const controller = require("../../controllers/admin/productoController")

// CRUD = Create, Read, Update, Delete

router.get("/", controller.index);

router.get("/create", controller.create)
router.post("/", upload.single("imagen"), controller.store);

router.put("/:id", controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;
