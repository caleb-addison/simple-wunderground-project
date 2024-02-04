import React, { useState } from 'react';
import ApiCaller from './components/ApiCaller';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Footer from './components/Footer';

const App = () => {
    return (
        <div>
            <Navbar variant="light" className="navbar-custom">
                <Container>
                    <Navbar.Brand>Wunderground API Tool</Navbar.Brand>
                </Container>
            </Navbar>
            <ApiCaller />
            <Footer />
        </div>
    );
};

export default App;
