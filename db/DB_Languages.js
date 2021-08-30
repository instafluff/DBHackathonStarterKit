require( "dotenv" ).config();

const { CockroachDB, DataTypes, Op } = require( "./CockroachDB" );

const utils = require( "../utils/useful" );

class DB extends CockroachDB {
    constructor() {
        super( {
            "alpha2": DataTypes.STRING,
            "English": DataTypes.STRING,
        }, "LangCodes" );
    }
    async initialize() {
        await this.sync(); // Sync the DB
        await this.deleteAll(); // Clear everything

        // --- Load via CSV data ---
        await this.loadCSV( "data/languagecodes.csv" );
    }
    async test() {
        // await this.remove({
        //     "alpha2": "ie"
        // });
        await this.update({
            "English": "English (Updated)"
        }, {
            "alpha2": "en"
        });
        return await this.data( {
            // Use Op.iLike instead of Op.like for case-insensitive search
            "English": { [Op.iLike]: "%en%" }
        });
    }
}

module.exports = {
    DB
};
