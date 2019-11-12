import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import Footer from "./components/Footer";
import ForecastApp from "./components/ForecastApp";

function App() {
    return (
        <div id="main-block">
            <ForecastApp/>
            <Footer/>
        </div>
    );
}

export default App;
