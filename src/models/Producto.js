// CREAMOS EL PRODUCTO
const { DataTypes } = require("sequelize");
const sequelize = require("./connection");

// DEFINIMOS LA ENTIDAD/TABLA "PRODUCTO" CON TODOS LOS DATOS QUE NECESITAMOS
const Producto = sequelize.define("Producto", {
  codigo: {
    type: DataTypes.STRING,
  allowNull: true,
  },
  categoria: {
    type: DataTypes.TINYINT,
  allowNull: false,
  },
  nombre: {
      type: DataTypes.STRING,
    allowNull: false,
    },
    precio: {
     type: DataTypes.FLOAT,
    allowNull: true,
    },
});

// PARA QUE CUANDO YO REQUIERA EL MODELO LO CREE SI NO EXISTE
(async () => {
  await sequelize.sync();
  // await sequelize.sync({ force: true });
  // await sequelize.sync({ alter: true });
})();


module.exports = Producto;