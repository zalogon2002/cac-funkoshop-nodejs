const index = (req, res) => {
  const productos = [
    // Se recuperan los datos de los productos en la base y se genera el json que se va a mostrar dinamicamente en el index o portada.
      { id: 1, nombre: "Producto 1" },
      { id: 2, nombre: "Producto 2" },
      { id: 3, nombre: "Producto 3" },
    ];
    res.render("inicio", { mensaje: "Hola EJS", productos });
  };
  
  module.exports = {
    index,
  };
  