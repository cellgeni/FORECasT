import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch, useLocation   } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import ForecastApp from "./components/ForecastApp";


function App() {
    const forecast = "/FORECasT";
    return (
        <Router>
                <Switch>
                    <Route path={forecast}>
                        <ForecastApp />
                    </Route>
                    <Route path="/">
                        <Redirect to={forecast} />
                    </Route>
                </Switch>
        </Router>
    );
}

export default App;
