
const model = require("../models/Producto");

const index = async (req, res) => {
 /*const productos = [
    // Se recuperan los datos de los productos en la base y se genera el json que se va a mostrar dinamicamente en el index o portada.
      { id: 1, nombre: "Producto 1" },
      { id: 2, nombre: "Producto 2" },
      { id: 3, nombre: "Producto 3" },
    ];
*/
const productos = await model.findAll();
    res.render("inicio", { productos });
  };


  const shop = async (req, res, next ) => {
    let productos = await model.findAll();
  
    if(req.query.cat){
     productos = await model.findAll({
      where: {categoria: req.query.cat}
   });
    }
       res.render("shop", {productos});
     };
  

  module.exports = {
    index,
    shop
  };
  
