require( "dotenv" ).config();

const fs = require( "fs" );
const _ = require( "lodash" );
const parse = require( "csv-parse/lib/sync" );
const utils = require( "../utils/useful" );

const { Sequelize, Model, DataTypes, Op } = require( "sequelize" );
const sequelize = new Sequelize( {
    dialect: "postgres",
    username: process.env.COCKROACHDB_USER,
    password: process.env.COCKROACHDB_PASS,
    host: process.env.COCKROACHDB_HOST,
    port: process.env.COCKROACHDB_PORT,
    database: process.env.COCKROACHDB_DATABASE,
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync( process.env.COCKROACHDB_CERTIFICATE ).toString()
      },
    },
    logging: false
} );

class DBData extends Model {}

class CockroachDB {
    constructor( schema, name = "CockroachDB" ) {
        this.name = name;
        this._schemaKeys = Object.keys( schema );
        this.schema = {};
        this._schemaKeys.forEach( k => {
            this.schema[ k ] = schema[ k ];
        });
        DBData.init( this.schema, { sequelize, modelName: name });
    }
    async sync() {
        // Synchronize the DB schema
        await sequelize.sync( { force: true } );
    }
    async deleteAll() {
        // Clear the data
        await DBData.destroy({
            truncate: true
        });
    }
    async loadCSV( filename, keyMap = {} ) {
        // Load the CSV data into Cockroach DB
        const input = fs.readFileSync( filename );
        const records = parse( input, {
            columns: true,
            skip_empty_lines: true
        });
        // Map keys
        const keys = Object.keys( keyMap );
        for( let i = 0; i < records.length; i++ ) {
            keys.forEach( k => {
                if( records[ i ][ k ] ) {
                    records[ i ][ keyMap[ k ] ] = records[ i ][ k ];
                }
            });
        }
        // Filter for schema-matching columns
        const cols = Object.keys( this.schema );
        const filtered = records.map( x => _.pick( x, cols ) );
        return await DBData.bulkCreate( filtered );
    }
    async data( options = {} ) {
        const data = await DBData.findAll({
            where: options
        });
        return data;
    }
    async add( data ) {
        if( !utils.isArray( data ) ) {
            data = [ data ];
        }
        return await DBData.bulkCreate( data );
    }
    async update( data, options = {} ) {
        return await DBData.update( data, {
            where: options
        });
    }
    async remove( options = {} ) {
        return await DBData.destroy({
            where: options,
            truncate: false
        });
    }
}

module.exports = {
    CockroachDB,
    DBData,
    DataTypes,
    Op
};
