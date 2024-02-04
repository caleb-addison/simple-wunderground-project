import React, { useState } from 'react';
import ApiCaller from './components/ApiCaller';
import DataExporter from './components/DataExporter';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const App = () => {
    const [data, setData] = useState([]);

    const handleDataReceived = (newData) => {
        setData(newData);
    };

    return (
        <div>
            <Navbar variant="light" className="navbar-custom">
                <Container>
                    <Navbar.Brand>Wunderground API to .xlsx</Navbar.Brand>
                </Container>
            </Navbar>
            <ApiCaller onDataReceived={handleDataReceived} />
            <DataExporter data={data} />
        </div>
    );
};

export default App;
