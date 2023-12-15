
const model = require("../models/Producto");

const index = async (req, res) => {

const productos = await model.findAll();
    res.render("inicio", { productos });
  };

  const cart = async (req, res) => {

       res.render("cart");
     };

  const shop = async (req, res, next ) => {
    let productos = await model.findAll();
    let mysort = null;
  
    if(req.query.cat){
     productos = await model.findAll({
      where: {categoria: req.query.cat}
   });
    }

    if(req.query.orden){

      switch (req.query.orden) {
        case 'a-z':
          mysort = ['nombre', 'ASC'];
          break;
        case 'z-a':
          mysort = ['nombre', 'DESC'];
          break;
        case 'down':
          mysort = ['precio', 'DESC'];
          break;
        case 'up':
          mysort = ['precio', 'ASC'];
          break;
      }
      
      productos = await model.findAll({
        order: [
          mysort
      ],
      });
     }
    


 
     if(req.query.search){
      const name = req.query.search;
      productos = await model.findAll( {where: {nombre: name}});

     }

       res.render("shop", {productos, val: req.query.orden, all: await model.findAll()});
     };
  

  module.exports = {
    index,
    shop,
    cart
  };
  
