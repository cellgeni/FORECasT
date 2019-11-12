import React from 'react';
import banner from "../images/Banner_FC2-min.jpg";

import Prediction from "./Prediction";
import Plot from "./Plot";

class ForecastApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            plot: ""
        };
        this.renderPlot = this.renderPlot.bind(this);
    }

    renderPlot(seq, pamIndex){

    }

    plotIsValid(){
        return this.state.plot && !this.state.plot.startsWith("Error");
    }

    render() {
        return <div className="content">
            <a href="/">
                <img src={banner}
                     className="logo"
                     alt="Forecast logo"/>
            </a>
            <Prediction
                renderPlot={this.renderPlot}
                plotIsValid={this.plotIsValid()}
            />
            <Plot data={this.state.plot}/>
        </div>
    }
}

export default ForecastApp
