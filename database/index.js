const { Pool } = require("pg");
require("dotenv").config();


/**
 * Connection Pool
 */
let pool;

if (process.env.NODE_ENV === "development") {
    // Use SSL for local testing
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    // Added for troubleshooting queries during development
    module.exports = {
        async query(text, params) {
            try {
                const res = await pool.query(text, params);
                console.log("Executed query:", { text });
                return res;
            } catch (error) {
                console.error("Error in query:", { text });
                throw error;
            }
        },
    };
} else {
    // For production, use the default configuration
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });
    module.exports = pool;
}
