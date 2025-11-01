import sql from 'mssql'
import dotenv from 'dotenv'
dotenv.config()

const DB_HOST = process.env.DB_HOST || 'Fasutto-Laptop'
const DB_INSTANCE = process.env.DB_INSTANCE || 'SERVER01'
const DB_USER = process.env.DB_USER || 'sa'
const DB_PASSWORD = process.env.DB_PASSWORD || 'sa123'
const DB_NAME = process.env.DB_NAME || 'TecCuliacan'

const dbSettings = {
    user: DB_USER,
    password: DB_PASSWORD,
    server: DB_HOST,
    database: DB_NAME,
    options: {
        // para instancia nombrada usamos instanceName en vez de puerto
        instanceName: DB_INSTANCE,
        encrypt: false,
        trustServerCertificate: true
    }
}

export const getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings)
        console.log('Conexión a la base de datos establecida');
        return pool;
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        throw err;
    }
};