import { Request, Response} from "express";
import productsModel from "../Models/products";

//Controladora de Productos
const productController = {
    //Req tendrá la información sobre la petición HTTP del Evento
    //Res devolverá la repuesta HTTP deseada.
    
    allProducts: async (req: Request, res: Response) => {
        try
        {
            //Obtener Productos
            const buscarProductos = await productsModel.find()
            res.status(200).send(buscarProductos)
        }
        catch (error)
        {
            //Código de error 500
            res.status(500).send(error)
        }
    },

    //Getunique es utilizado para buscar un producto en especifico
    productByName: async (req: Request, res: Response) => {
        try
        {
            const buscarProductosUnique = await productsModel.findOne({... req.params})
            
            //Sí el producto no existe la API mandará un HTTP STATUS NOT FOUND
            if(buscarProductosUnique?.productName != undefined)
            {
                res.status(200).send(buscarProductosUnique)
            }else{
                res.status(404).send(`El producto escrito en los parametros no existe en la base de datos.`);
            }
        }
        catch (error)
        {
            res.status(500).send(error)
        }
    },

    //Para agregar productos
    newProduct: async (req: Request, res: Response) => {
        try 
        {
             //Aquí se programó para que se escriba en el body todo los datos deseados para agregar
            const existeProductos = await productsModel.findOne({productName: req.body.productName})
            if(existeProductos){
                //Solicitud Incorrecta HTTP STATUS 400, Server no procesa una solicitud por algo ya existente
                res.status(400).send(`El producto ${existeProductos.productName} ya se encuentra en la base de datos`)
            }else
            {
                const addProducto = new productsModel({... req.body})
                if(addProducto.amount > 0 && addProducto.productName != "" && addProducto.price >= 0)
                {
                await addProducto.save()
                res.status(200).send(addProducto)
                }else
                {
                    //BAD REQUEST 
                    res.status(400).send(`* La cantidad de productos que se desea agregar no puede ser de 0 ni inferior a este\n* Tampoco puede tener un nombre de caracter vacio\n* Los precios deben ser superior o igual a 0`);
                }                           
            }         
        } catch (error) {
            //Los valos de status son los tipos de errores que nosotros queremos que salga -> 500 es error de servidor
            res.status(500).send(error)
        }
    },

    //Para eliminar los productos
    deleteByName: async (req: Request, res: Response) => {
        try
        {
            //Aquí se programó para que sólo se escriba el parametro que se desea eliminar
            const BuscarProducto = await productsModel.findOne({... req.params})
            //Revisará sí existe el producto deseado
            if(BuscarProducto?.productName != undefined || BuscarProducto?.productName != null){
                const productoNombre = await productsModel.findOneAndDelete({... req.params});
                res.status(200).send(`Se elimino ${productoNombre?.productName} y sus respectivos valores de la base de datos.`);
            }
            else
            {
                res.status(404).send(`El producto ${req.params.productName} no existe en la base de datos.`)
                //HTTP STATUS NOT FOUND
                
            }
        }
        catch(error)
        {
            res.status(500);
        }
    },

    
}
//Exportar los controladores
export default productController