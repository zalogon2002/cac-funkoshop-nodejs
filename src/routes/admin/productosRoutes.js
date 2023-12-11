const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { body } = require("express-validator");

const validations = [
    body('nombre')
      .not()
      .isEmpty()
      .withMessage('El nombre es obligatorio')
      .bail()
      .isLength({ min: 3 })
      .withMessage('Tiene que tener 3 caracteres'),
    body('precio').not().isEmpty().withMessage('El precio es obligatorio')
    ];
    
    


const controller = require("../../controllers/admin/productoController")

// CRUD = Create, Read, Update, Delete

// ESTA ES LA RUTA PRINCIPAL DE PRODUCTOS
// QUIEN RESPONDE A ESO? ESTE METODO DE ESTE CONTROLADOR (QUE ES EL index)
router.get("/", controller.index);

router.get("/create", controller.create);
// EN LA RUTA CREAR TENGO QUE PODER SUBIR UNA IMAGEN Y PODER VALIDAR
router.post("/", upload.single("imagen"), validations, controller.store);

// ESTA ES LA RUTA DE EDITAR PRODUCTOS
router.get("/:id/edit", controller.edit);
// EN LA RUTA EDITAR TENGO QUE PODER SUBIR UNA IMAGEN Y PODER VALIDAR
router.put("/:id", upload.single("imagen"), validations, controller.store);

// LE TENGO QUE PASAR EL ID COMO PARAMENTRO EN LA RUTA O OCULTO DENTRO DEL INPUT DEL FORMULARIO EN edit.ejs
// router.put("/:id", controller.update);

// CUANDO BORRE UN PRODUCTO VA A LLEGAR A ESTA RUTA Y DE AQUI VA AL productoController.js (LINEA 156) Y BORRA EL ELEMENTO
router.delete("/:id", controller.destroy);

module.exports = router;
