import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react';

const baseUrl = "http://localhost:4000";

function ignoreSubmit( event ) {
    event.preventDefault();
}

function App() {
    const [modelName, setModelName] = useState('');
    const [outputText, setOutputText] = useState('');
    const [inputText, setInputText] = useState('');

    fetch( `${baseUrl}/` ).then( r => r.json() ).then( info => {
        setModelName( info.name );
    });

    const dbTest = async () => {
        let result = await fetch( `${baseUrl}/test` ).then( r => r.json() );
        console.log( result );
        setOutputText( JSON.stringify( result, null, 2 ) );
    };

    const dbSearch = async () => {
        let result = await fetch( `${baseUrl}/search?text=${inputText}` ).then( r => r.json() );
        setOutputText( JSON.stringify( result, null, 2 ) );
    };

    const handleInputChange = e => {
        setInputText( e.target.value );
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>DB Hackathon Starter Kit (Loaded: {modelName})</p>
                <form onSubmit={ignoreSubmit}>
                    <button onClick={dbTest} type="button">Run Test</button>
                </form>
                <form onSubmit={ignoreSubmit}>
                    <label>
                    Search:
                    <input type="text" value={inputText} onChange={handleInputChange}/>
                    </label>
                    <button onClick={dbSearch} type="button">Run</button>
                </form>
                <pre>{outputText}</pre>
            </header>
        </div>
    );
}

export default App;
