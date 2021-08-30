module.exports = {
    getRandomInt: ( num ) => { return Math.floor( num * Math.random() ); },
    getRandomElement: ( array ) => {
        return array[ getRandomInt( array.length ) ];
    },
    isArray: ( o ) => {
        return ( !!o ) && ( o.constructor === Array );
    },
    shuffleArray: ( array ) => {
        for( let i = array.length - 1; i > 0; i-- ) {
            const j = Math.floor( Math.random() * ( i + 1 ) );
            [ array[ i ], array[ j ] ] = [ array[ j ], array[ i ] ];
        }
    },
    getOneHotLabel: ( array, labels ) => {
        let i = array.indexOf( Math.max( ...array ) );
        return labels[ i ];
    },
}
