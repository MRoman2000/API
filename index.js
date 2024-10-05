const express = require('express');
const { connectToDatabase } = require('./db');
const app = express();
const sql = require('mssql');
const port = process.env.PORT || 3000;


app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use(express.json());



app.get('/', (req, res) => {
    res.send('¡Bienvenido a mi API REST en Windows!!!!');
});


let pool;

// Conectar a la base de datos al iniciar el servidor
(async () => {
    pool = await connectToDatabase();

    if (pool) {
        console.log('Conectado a la base de datos');
    } else {
        console.error('No se pudo conectar a la base de datos');
    }
})();

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
      if (!pool) {
          return res.status(500).json({ message: 'Error de conexión a la base de datos' });
      }

      // Ejecutar la consulta para obtener productos
      const result = await pool.request().query('SELECT * FROM Productos');
      res.json(result.recordset); // Devuelve todos los productos desde la base de datos
  } catch (err) {
      console.error('Error al obtener productos1:', err);
      res.status(500).json({ message: 'Error al obtener productos1', error: err.message });
  }
});

// Crear un nuevo producto
app.post('/api/productos', async (req, res) => {
  const { nombre, descripcion, stock, imagen } = req.body;

  try {
      if (!pool) {
          return res.status(500).json({ message: 'Error de conexión a la base de datos' });
      }

      // Crear un nuevo request usando el pool conectado
      const request = pool.request();

      // Agregar los parámetros para la consulta
      request.input('Nombre', sql.VarChar, nombre);
      request.input('Descripcion', sql.VarChar, descripcion);
      request.input('Stock', sql.Int, stock);
      request.input('Imagen', sql.VarBinary, imagen); // Asegúrate de que el tipo de imagen es correcto

      // Ejecutar la consulta INSERT
      await request.query(`
          INSERT INTO Productos (Nombre, Descripcion, Stock, Imagen)
          VALUES (@Nombre, @Descripcion, @Stock, @Imagen)
      `);

      // Responder con éxito
      res.status(201).json({ message: 'Producto agregado' });
  } catch (err) {
      // Manejar errores
      console.error('Error al insertar producto:', err);
      res.status(500).json({ message: 'Error al insertar producto', error: err.message });
  }
});


// Obtener un producto por ID
app.get('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const request = new sql.Request();
        request.input('Id', sql.Int, id);
        const result = await request.query('SELECT * FROM Productos WHERE Id = @Id');
        
        if (result.recordset.length === 0) {
            return res.status(404).send('Producto no encontrado');
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error al obtener producto:', err);
        res.status(500).json({ message: 'Error al obtener producto', error: err });
    }
});

// Actualizar un producto
app.put('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, stock, imagen } = req.body;

    try {
        const request = new sql.Request();
        request.input('Id', sql.Int, id);
        request.input('Nombre', sql.VarChar, nombre);
        request.input('Descripcion', sql.VarChar, descripcion);
        request.input('Stock', sql.Int, stock);
        request.input('Imagen', sql.VarBinary, imagen);

        const result = await request.query(`
            UPDATE Productos SET 
                Nombre = @Nombre, 
                Descripcion = @Descripcion, 
                Stock = @Stock, 
                Imagen = @Imagen 
            WHERE Id = @Id
        `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Producto no encontrado');
        }
        res.json({ message: 'Producto actualizado' });
    } catch (err) {
        console.error('Error al actualizar producto:', err);
        res.status(500).json({ message: 'Error al actualizar producto', error: err });
    }
});

// Eliminar un producto
app.delete('/api/productos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const request = new sql.Request();
        request.input('Id', sql.Int, id);
        const result = await request.query('DELETE FROM Productos WHERE Id = @Id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Producto no encontrado');
        }
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({ message: 'Error al eliminar producto', error: err });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
