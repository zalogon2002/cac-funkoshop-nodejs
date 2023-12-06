// CREAMOS LA CONFIGURACION DE LA CONEXION
// REQUIERO UN PEDACITO DE SEQUELIZE (QUE ES UN OBJETO) PARA CREAR LA CONEXION
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(

process.env.DB_NAME,
process.env.DB_USER,
process.env.DB_PASS,

    {
      host: process.env.DB_HOST,
      dialect: "mysql",
    }
);

module.exports = sequelize;