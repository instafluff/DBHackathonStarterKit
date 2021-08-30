require( "dotenv" ).config();

const { CockroachDB, DataTypes } = require( "./CockroachDB" );

const utils = require( "../utils/useful" );

class DB extends CockroachDB {
    constructor() {
        super( {
            "Name": DataTypes.STRING,
            "Code": DataTypes.STRING,
        }, "Countries" );
    }
    async initialize() {
        await this.sync(); // Sync the DB
        await this.deleteAll(); // Clear everything

        // --- Load via CSV data ---
        // Countries from https://datahub.io/core/country-list
        await this.loadCSV( "data/countries.csv" );
    }
    async test() {
        return await this.data( {
            where: { "Name": "Antarctica" }
        });
    }
}

module.exports = {
    DB
};
