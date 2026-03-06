import {createPool} from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool =createPool({

    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    waitForConnections:true,
    port:process.env.DB_PORT||3306,
    connectionLimit:10,
    queueLimit:0
})

export const db = pool;