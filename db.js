// db.js
const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
};

async function connectToDatabase() {
    try {
        // Establecer conexión
        let pool = await sql.connect(config);
        console.log('Conectado a la base de datos');
        return pool;
    } catch (err) {
        console.error('Error conectando a la base de datos:', err);
    }
}

module.exports = { connectToDatabase };


