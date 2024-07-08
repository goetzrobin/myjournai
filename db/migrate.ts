import {migrate} from 'drizzle-orm/postgres-js/migrator';
import dotenv from "dotenv";

dotenv.config({
    path: ".env.local",
});

export const migrateDB = async () => {
    // This will run migrations on the database, skipping the ones already applied
    import('./client').then(async ({db, client}) => {
        await migrate(db, {migrationsFolder: './drizzle'});
        // Don't forget to close the connection, otherwise the script will hang
        await client.end();
    })
}

void migrateDB();