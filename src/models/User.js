const { DataTypes } = require("sequelize");
const sequelize = require("./connection");

// REQUERIMOS EL BCRYPTJS
const bcryptjs = require("bcryptjs");

// CREAMOS UNA CONSTANTE User PARA QUE DEFINA UNA ENTIDAD "USER" EN LA BBDD, Y LOS DATOS QUE VA A TENER ESE USUARIO: EMAIL (QUE SEA STRING, REQUERIDO Y QUE SEA UNICO) Y PASSWORD (STRING Y REQUERIDO TB)
const User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      },
      password: {
       type: DataTypes.STRING,
      allowNull: false,
      },
});

// Y USAMOS EL BEFORE
// ANTES DE GUARDARSE EN LA BBDD YO DEL USUARIO VOY A DESESTRUCTURAR, VOY A UTILIZAR EL PASSWORD DEL USUARIO, VOY A UTILIZAR BCRYPT, (PROMESA CON await Y async) Y LE VOY A PASAR EL PASSWORD Y LAS VUELTAS QUE DEBE DAR EL PROCESO  - NOS VA A PASAR ESTA ENTIDAD QUE SE CREO (EN authController.js LINEA 29)
// EL PASSWORD QUE INGRESO EL USUARIO SE LO PISO CON ESTE HASH
User.beforeSave(async (user, options) => {
const { password } = user;

const hash = await bcryptjs.hash(password, 12);

user.password = hash;
});












// PARA QUE CUANDO YO REQUIERA EL MODELO LO CREE SI NO EXISTE - QUE VAYA CREANDO LA BBDD
(async () => {
    await sequelize.sync();
  })();


// EXPORTAMOS ESTE MODULO User PARA PODER USARLO FUERA
module.exports = User;