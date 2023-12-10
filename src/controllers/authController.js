// CREO EL CONTROLADOR PARA RESPONDER A ESAS 5 RUTAS DEL FILE authRoutes.js

// REQUERIMOS BCRYPTJS
const bcryptjs = require("bcryptjs");

// LA VALIDACION DEL FORMUARIO REGISTER SE PRODUCE AQUI, EN EL CONTROLADOR
const { validationResult } = require("express-validator");

// TRAEMOS EL MODELO PARA EL REGISTRO DEL USUARIO
const model = require("../models/User");

// UNA RUTA PARA EL register Y EL POST DE register CON UNA FUNCION (CON REQUEST Y RESPONSE)
const register = (req, res) => {
    // res.send("register");
    res.render("auth/register");
};

// MENSAJE DE QUE EL USUARIO ESTA REGISTRADO (AL ENVIAR EL FORMULARIO DE register.ejs)
const postRegister = async (req, res) => {

const errors = validationResult(req);


if (!errors.isEmpty()) {
return res.render("auth/register", {
    values: req.body,
    errors: errors.array(),
});
}

// CREO UN USER, QUE ES UNA PROMESA, CON async Y await Y COMO PUEDE FALLAR, CON try AND catch
try {
    const user = await model.create(req.body);

    console.log(req.body, user);
    res.send("Registrado");
  } catch(error) {
    console.error(error);
    res.send(error);
  }
};

// IDEM PARA EL LOGIN
const login = (req, res) => {
    // EN LA RUTA DEL LOGIN authController.js VAMOS A PONER ESA VISTA
    res.render("auth/login");
};

const postLogin = async (req, res) => {
    const errors = validationResult(req);

if (!errors.isEmpty()) {
return res.render("auth/login", {
    values: req.body,
    errors: errors.array(),
});
}

// VAMOS A BUSCAR AL USUARIO A TRAVES DE SU EMAIL (que ingreso en el login) LA CONDICION ES QUE EL EMAIL SEA IGUAL A req.body.email - PROMESA (await Y async)  Y PUERDE FALLAR (try AND catch)
try {
    const user = await model.findOne({
        where: {
            email: req.body.email,
        },
    });

    // SI EL USUARIO NO EXISTE RENDEREO UNA VISTA CON UN MENSAJITO

    if (!user) {
      res.render("auth/login", {
      values: req.body,
    //   LO IDEAL ES PONERLE UNA PISTA DE QUE ALGO FALLO, PERO SIN DAR DEMASIADA INFO (lo del parentesis es para las clases) - msg (LINEA 19 DE login.ejs) EXPRESS VALIDATOR DEVUELVE UN ARRAY DE OBJETOS PERMITE TENER VARIOS DATOS, Y UNO DE ELLOS ES EL MENSAJE
      errors: [{ msg: "El correo y/o contraseña son incorrectos (email) "}],
    });
// ENCONTRO EL USUARIO - TIENE QUE VALIDAR LA CONTRASEÑA CON OTRO if
// USO EL BCRYPT PARA COMPARAR UNA CONTRASEÑA DE TEXTO PLANO (LO QUE INGRESE EN EL FORMULARIO) CON UNA CONTRASEÑA HASHEADA
   } /*else if (!(await bcryptjs.compare(req.body.password, user.password))) {
    res.render("auth/login", {
        values: req.body,
        errors: [{ msg: "El correo y/o contraseña son incorrectos (password) "}],
   });
   } */else {
    // CUANDO EL USUARIO ES VALIDO Y LA CONTRASEÑA ES VALIDA, CREO ESTA SESSION - ME GUARDA EL USER ID Y ME REDIRECCIONA A LA PAGINA PRINCIPAL
    req.session.userId = user.id;
    // ESTARIA GUARDANDO UNA SESION DEL LOGIN
    // res.send("Login");
    res.redirect("/");
   }
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

// 1 PARA EL LOGOUT - ANULO TODA LA SESSION Y ME REDIRIGE A LA PAGINA PRINCIPAL
const logout = (req, res) => {
    req.session = null;
    res.redirect("/");
};


// VA A EXPORTAR EL OBJETO CON TODAS LAS FUNCIONES
module.exports = {
    register,
    postRegister,
    login,
    postLogin,
    logout,
};