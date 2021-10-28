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
                table.string("tagname").unique();
                table.string("content")
                table.string("createdby");
                table.timestamps();
                table.string("aliases");
            })

            await knex.schema.createTable("aliases", table => {
                table.increments();
                table.string("aliasname").unique();
                table.string("tagname");
                table.string("createdby");
                table.timestamps();
            })
        }
    }

    static async insertIntoTableTag(tagname, content, createdby, aliases) {
        try {
            const newtag = {
                tagname,
                content,
                createdby,
                created_at: new Date(),
                aliases
            }
            await knex("aliases").insert({ aliasname: tagname, tagname, createdby, created_at: new Date() })
            return await knex("tags").insert(newtag);
        } catch (error) {
            console.log(error)
        }
    }
    static async getTag(tagname) {
        try {
            const aliasDetails = await knex("aliases").where("aliasname", tagname).first();
            console.log(aliasDetails.tagname);
            return await knex("tags").where("tagname", aliasDetails.tagname).first();
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = db