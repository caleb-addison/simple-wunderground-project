import React, { useState } from 'react';
import ApiCaller from './components/ApiCaller';
import DataExporter from './components/DataExporter';
import './App.css';

const App = () => {
    const [data, setData] = useState([]);

    const handleDataReceived = (newData) => {
        setData(newData);
    };

    return (
        <div>
            <ApiCaller onDataReceived={handleDataReceived} />
            <DataExporter data={data} />
        </div>
    );
};

export default App;
