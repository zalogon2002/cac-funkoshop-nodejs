// VAMOS AL CONTROLADOR QUE YA LO REQUERIMOS

// ACA REQUERIMOS EL FILESYSTEM (PERMITE CREAR - MODIIFICAR - BORRAR ARCHIVOS O CARPETAS)
const fs = require ("fs");
const path = require("path");
const sharp = require("sharp");

// REQUERIS UN PEDACITO DE EXPRESS-VALIDATOR
const { validationResult } = require("express-validator");

// CREA LA ESTRUCTURA EN LA BBDD
// ACA TENGO EL MODELO QUE TRAIGO A TRAVES DE "PRODUCTO"
// VA A CARGAR ESTA FUNCION (LINEA 19) QUE ES CARGAR EL MODELO DEL PRODUCTO QUE ACABO DE CREAR Y QUE CUANDO ME TRAE LA INFORMACION ME LA MUESTRA EN LA CONSOLA
// model ES ESTE PRODUCTO QUE CREAMOS NOSOSTROS
const model = require("../../models/Producto");


// ACA QUIERO QUE ME TRAIGAN A ESA VISTA /productos LOS PRODUCTOS QUE ESTAN EN LA BBDD
// SIEMPRE PUEDE FALLAR, ASIQUE TENGO QUE UTILIZAR UN TRY Y UN CATCH (LINEA 16)
// QUE VOY A TRAER DE ESE LISTADO DE PRODUCTOS? EL MODELO (LINEA 17); ESTO ES UN PROMESA, ASIQUE LE PONEMOS EL await(LINEA 17) Y A LA FUNCION QUE LA CONTIENE EL async (LINEA 15)
// VAMOS A MOSTRAR ESOS PRODUCTOS (LINEA 19)
const index = async (req, res) => {
try {
const productos = await model.findAll();
    // console.log(productos);
    res.render("admin/index", { productos });
} catch (error) {
    console.log(error);
    res.status(500).send(error);
}
    res.send("Listado de productos");
};

const create = (req, res) => {
    res.render("admin/create");
};


const store = async (req, res) => {
    console.log(req.body, req.file);

    // VALIDACION DE FORMULARIO CREAR OBJETO
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render("admin/create", {
            values: req.body,
            errors: errors.array(),
        });
    }

    try {
      const producto = await model.create(req.body);
    //   console.log(producto);

     // SI SE CREO EL OBJETO, TENGO QUE CHEQUEAR SI SE SUBIO LA IMAGEN
      if (producto && req.file) {
        sharp(req.file.buffer)
        .resize(300)
        .toFile(
            path.resolve(
                __dirname, 
                `../../../public/uploads/productos/producto_${producto.id}.jpg`
            )
         );
    }

    res.redirect("/admin/productos")
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
    // res.send("Crear Producto");
};

// CONTROLADOR DE EDITAR PRODUCTO - VA A MOSTRAR ESE FORMULARIO - FUNCION ANONIMA CON REQUEST Y RESPONSE
const edit = async (req, res) => {
    try{
        // ESTA CONSTANTE ME VA A TRAER UN PRODUCTO QUE CORRESPONDA CON ESTE id
    const producto = await model.findByPk(req.params.id); 
    // DEBEMOS CHEQUEAR SI EXISTE EL PRODUCTO
    if (producto){
// SI EL PRODUCTO EXISTE LO MUESTRO - DEBO RENDERIZAR LA VISTA DE edit CON LOS DATOS DEL PRODUCTO, Y AL OBJETO values LE ASIGNO EL PRODUCTO
       res.render("admin/edit", { values: producto });
    } else {
        // SI EL PRODUCTO NO EXISTE MUESTRO EL ERROR 404 O UNA VISTA CON DICHO ERROR
       res.status(404).send("El producto no existe");
    }

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

    res.render("admin/edit");
};

// CUANDO SE ENVIE ESTE FORMUARIO CON EL PRODUCTO EDITADO, SE VA A ENVIAR A ESTE UPDATE
const update = async (req, res) => {
    console.log(req.params, req.body);

    // VALIDACION DE FORMULARIO EDITAR OBJETO
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render("admin/edit", {
            values: req.body,
            errors: errors.array(),
        });
    }

//     // VAMOS AL MODELO CON EL METODO UPDATE Y LOS DATOS QUE QUIERO ES EL CUERPO DE LA PETICION (LOS DATOS DEL FORMULARIO)
//     ESTO ES UNA PROMESA (await) Y ENTONCES LA FUNCION QUE LA CONTIENE DEBE SER async (LINEA 93)
//     await model.update(req.body, {
// // ACA VA CON UNA CONDICION: CUANDO VAS A MODIFICAR LOS DATOS DEL FORMULARIO? CUANDO TENGA UN IDETIFICADOR QUE CORRESPONDA CON LO QUE VIENE DE PARAMETRO
//       where: {
//         id: req.params.id,
//     // USA ESE IDENTIFICADOR PARA MODIFICAR ESE REGISTRO EN LA BBDD
//     // XQ EN EL PARAMETRO DE LA FUNCION DE UPDATE (EN FILE productosRoutes.js - LINEA 37/39) YO TE PASE UN IDENTIFICADOR
//       },
//     });


// ESTO PUEDE FALLAR, ASIQUE TB VA UN try Y UN catch
try {
    // CREO LA CONSTANTE affected QUE DEVUELVE UN ARRAY (LINEA 127) QUE TIENE LA CANTIDAD DE FILAS AFECTADAS (DEBIERA SER 1 ARRAY DE 1 ELEMENTO CON EL NRO 1 XQ ESTOY MODIFICANDO UN SOLO PRODUCTO)
   const affected = await model.update(req.body, {
        where: {
          id: req.params.id,
        },
      });  
// [1] ENTONCES PONGO UNA CONDICION - SI AFFECTED EN EL INDICE 0 ES = A 1 (QUIERE DECIR "SI SE AFECTO EL PRODUCTO HAGO ALGO")
if (affected[0]==1) {
        // SI SE ACTUALIZO EL OBJETO, TENGO QUE CHEQUEAR SI SE SUBIO LA IMAGEN
        if (req.file) {
            sharp(req.file.buffer)
            .resize(300)
            .toFile(
                path.resolve(
                    __dirname, 
                    `../../../public/uploads/productos/producto_${req.params.id}.jpg`
                )
             );
        }

        // Y SI TODO ANDUVO BIEN (SE MODIFICO EL PRODUCTO Y SE CARG LA IMAGEN) PUEDO REDIRIGIR AL ADMIN
        res.redirect("/admin/productos");
} else {
    res.status(500).send("Error al actualizar el producto");
}

} catch (error) {
    console.log(error);
    res.status(500).send(error);
}
 
    // res.send("Producto modificado");
};

// BORRA EL PRODUCTO - COMO ES UNA PORMOESA DEBE TENER UN await Y LA FUNCION QUE LO CONTIENE DEBE TENER UN async
// ADEMAS, COMO PUEDE FALLAR DEBE TENER UN try Y UN catch
const destroy = async (req, res) => {
    console.log(req.params); 

    try {
// CON ESE OBJETO model VAMOS A CREAR UN DESTROY - CREO LA CONSTANTE result
const result = await model.destroy({
    where: {
      id: req.params.id,
    },
});
// console.log(result);

// BORRA EL REGISTRO - SI SE BORRA EL REGISTRO TB BORRA EL ARCHIVO (IMAGEN)
// SI QUIERO TB BORRAR LA IMAGEN PARA LIBERAR ESPACIO EN DISCO
if (result == 1) {
    // UNLINK ES QUE ARCHIVO QUIERO BORRAR, Y LE PASO TODA LA RUTA (ABSOLUTA) DE LO QUE QUIERO BORRAR
    // UNLINK TB ES UNA PROMESA ???   await fs.unlink(????
  fs.unlink(
    path.resolve(
        __dirname, 
                                //    ESTO ES PRODUCTO GUION EL ID DEL PRODUCTO
        `../../../public/uploads/productos/producto_${req.params.id}.jpg`
    ), 
        // Y ESTA FUMCION ME PIDE UN CALLBACLK QUE CHEQUEA EL ERROR
    (error) => {
        if (error) {
            console.log(error);
        }
    }
);
}

res.redirect("/admin/productos");
 } catch (error) {
    console.log(error);
    res.status(500).send(error);
 }

    // res.send("Producto borrado");
};

// LISTA DE FUNCIONES DEL CONTROLADOR A EXPORTAR
module.exports = { 
    index, 
    create,
    store,
    edit,
    update,
    destroy,
};


