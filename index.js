const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


app.use (express.json());

app.get('/', (req,res)=> {
    res.send('¡Bienvenido a mi API REST en Windows!');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });

let productos = [
    { id: 1, nombre: 'Producto1', Descripcion : 'Prueba', stock: 10 , Imagen: ""},
    { id: 2, nombre: 'Producto2', Descripcion: 'Prueba', stock: 15 , Imagen : "" }
  ];
  
  // Obtener todos los productos
  app.get('/api/productos', (req, res) => {
    res.json(productos);
  });
  
  // Obtener un producto por ID
  app.get('/api/productos/:id', (req, res) => {
    const producto = productos.find(p => p.id === parseInt(req.params.id));
    if (!producto) return res.status(404).send('Producto no encontrado');
    res.json(producto);
  });
  
  // Crear un nuevo producto
  app.post('/api/productos', (req, res) => {
    const nuevoProducto = {
      id: productos.length + 1,
      nombre: req.body.nombre,
      precio: req.body.precio
    };
    productos.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
  });
  
  // Actualizar un producto
  app.put('/api/productos/:id', (req, res) => {
    const producto = productos.find(p => p.id === parseInt(req.params.id));
    if (!producto) return res.status(404).send('Producto no encontrado');
  
    producto.nombre = req.body.nombre;
    producto.precio = req.body.precio;
    res.json(producto);
  });
  
  // Eliminar un producto
  app.delete('/api/productos/:id', (req, res) => {
    const productoIndex = productos.findIndex(p => p.id === parseInt(req.params.id));
    if (productoIndex === -1) return res.status(404).send('Producto no encontrado');
  
    const productoEliminado = productos.splice(productoIndex, 1);
    res.json(productoEliminado);
  });
  