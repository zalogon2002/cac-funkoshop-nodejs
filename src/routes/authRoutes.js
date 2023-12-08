// ACA REQUIERO UN PEDACITO DEL EXPRESS (EL ROUTER) Y ABAJO LO EJECUTO - QUE ES LA PAGINA DE INICIO EN EL NAVEGADOR
const { Router } = require("express");
const router = Router();

// VAMOS A CREAR LAS REGLAS Y EL MODELO (DE LA ENTIDAD "USUARIO" QUE CREAMOS CON SEQUELIZE)
// ACA LO VOY A UTILIZAR PARA VER SI YA NO EXISTE ESE USUARIO
const model = require("../models/User");

// PARA VALIDAR EL FORMULARIO DE REGISTRO DEL USUARIO, USAMOS EL RQUEST BODY DE EXPRESS-VALIDATOR
const { body } = require("express-validator");

// VALIDACION PARA EL REGISTER
const registerValidations = [
body("email")
.isEmail()
.withMessage("Ingrese una dirección de correo electrónico válida")
.bail()
// LA VALIDACION CUSTOM NECESITO PASARLE UNA FUNCION, UN CALLBACK, PARA QUE ME DEVUELVA VERDADERO O FALSO
// COMO VOY A TRABAJAR A TRAVES DEL USUARIO, ESTE CUSTOM ME VA A DEVOLVER UNA PROMESA - ES ASINCRONICA XQ VOY A USAR LA BBDD, VOY A USAR EL MODELO PARA HACER EL FIND ONE (UN REGISTRO)
// LA CONDICION ES QUE EL EMAIL DE ESE USUARIO SEA IGUAL AL VALOR QUE INGRESO EL USUARIO EN EL FORMULARIO
// SI ES IGUAL, VOY A TENER UN USUARIO, QUE ES EL QUE ESTA REGISTRADO >> SI EL USUARIO YA EXISTE, LO RECHAZO
// SI NO HAY USUARIO, ME PUEDO REGISTRAR
.custom((value, { req }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await model.findOne({
                where: {
                    email: value,
            },
         });

         if (user) {
            console.log(user);
            return reject();
         } else {
            return resolve();
         }
        } catch (error) {
            console.log(error);
        }
    });
})
.withMessage("Dirección de correo electrónico duplicada"),
body("password")
.isStrongPassword({
    minLenght: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .withMessage("La contraseña debe tener ...")
  .bail()
//   NO NECESITO UNA PROMESA XQ NO HAY QUE COMPARAR NADA CON LA BBDD, SINO UNA SIMPLE COMPARACION DEL VALOR QUE TIENE EL PASSWORD CON LO QUE ESTA EN EL PASSWORD CONFIRMATION
//  LOS CAMPOS "CONTRASEÑA" Y "CONFIRMAR CONTRASEÑA" TIENEN QUE TENER EL MISMO VALOR
  .custom((value, { req }) => value === req.body.password_confirmation)
  .withMessage("Las contraseñas no coinciden"),       
];

// VALIDACION PARA EL LOGIN - LA PARTE DEL DUPLICADO LA PUEDO SACAR
const loginValidations = [
    body("email")
    .isEmail()
    .withMessage("Ingrese una dirección de correo electrónico válida"),
    body("password")
    .isStrongPassword({
        minLenght: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("La contraseña debe tener ..."),
    ];





// VINCULO AL CONTROLADOR CON LAS RUTAS
const controller = require("../controllers/authController");
const { ValidationErrorItemType } = require("sequelize");


// ACA VAMOS A TENER 5 RUTAS (2 REGISTRO - 2 LOGIN - 1 LOGOUT)

// MUESTRA EL FORMULARIO
router.get("/register", controller.register);
// PROCESA EL FORMULARIO - CON SU VALIDACION (ACA LA DEOY LAS REGLAS - LA VALIDACION SE PRODUCE EN EL CONTROLADOR authController.js)
router.post("/register", registerValidations, controller.postRegister);


// MUESTRA EL FORMULARIO
router.get("/login", controller.login);
// PROCESA EL FORMULARIO
router.post("/login", loginValidations, controller.postLogin);

// MUESTRA EL FORMULARIO
router.get("/logout", controller.logout);

// EXPORTAMOS ESTE MODULO router PARA PODER USARLO FUERA
module.exports = router;
