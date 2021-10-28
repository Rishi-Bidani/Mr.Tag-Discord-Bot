const fs = require("fs/promises")
const path = require("path")

const DB_FILE = path.join(__dirname, "db.sqlite3")

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: DB_FILE
    },
    useNullAsDefault: true
});

class db {
    static async createDBIfNotExist() {
        try {
            await fs.access(DB_FILE)
            console.log("Database file exists!")
        } catch (error) {
            await knex.schema.createTable("tags", table => {
                table.increments();
                table.string("tagname");
                table.string("createdby");
                table.timestamps();
                table.string("aliases");
            })
        }
    }

    static async insertIntoTableTag(tagname, createdby, aliases) {
        try {
            const newtag = {
                tagname,
                createdby,
                created_at: new Date(),
                aliases
            }
            await knex("tags").insert(newtag);
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = db