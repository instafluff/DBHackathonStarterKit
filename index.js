require( "dotenv" ).config();

const fetch = require( "node-fetch" );
const fs = require( "fs" );

const express = require( "express" );
const cookieParser = require( "cookie-parser" );
const compression = require( "compression" );
const helmet = require( "helmet" );
const cors = require( "cors" );
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use( cors() );
app.use( helmet() );
app.use( compression() );
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );
app.use( cookieParser() );

// -- TODO: SET YOUR DATABASE HERE --
// const { DB } = require( "./db/DB_Countries" );
const { DB } = require( "./db/DB_Languages" );
const db = new DB();
db.initialize(); // Note: This is an asynchronous function and can take some time to load

// -- TODO: EDIT ROUTES AND ACCESS HERE --
app.get( "/", async ( req, res ) => {
    res.json( db );
});

app.get( "/data", async ( req, res ) => {
    // Data
    res.json( await db.data() );
});
app.post( "/data", async ( req, res ) => {
    // Add to Data
    res.json( await db.add( req.body ) );
});
app.get( "/search", async ( req, res ) => {
    // Data
    res.json( await db.data( {
        "alpha2": `${req.query.text}`
    }) );
});

app.get( "/test", async ( req, res ) => {
    // Test
    res.json( await db.test() );
});

app.use( ( err, req, res, next ) => {
    console.error( err.stack );
    res.status( 500 ).send( "Server Error" );
})

app.listen( port, () => {
    console.log( `App listening at http://localhost:${port}` );
});
