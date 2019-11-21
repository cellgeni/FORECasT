import React from 'react';
import banner from "../images/Banner_FC2-min.jpg";

import Prediction from "./Prediction";
import Plot from "./Plot";
import Footer from "./Footer";

let MODEL_HOST = process.env.REACT_APP_MODEL_HOST;
let MODEL_URL = MODEL_HOST + "/plot";


class ForecastApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            plot: "",
            loading: false,
            plotIsValid: false
        };
        this.renderPlot = this.renderPlot.bind(this);
        this.setPlot = this.setPlot.bind(this);
        this.plotIsValid = this.plotIsValid.bind(this);
    }

    setPlot(plot) {
        this.setState({
            "plot": plot,
            "plotIsValid": this.plotIsValid(plot)
        });
    }

    setIsPlotLoading(plotLoading) {
        this.setState({
            "loading": plotLoading
        });
        if (plotLoading)
            this.setPlot("");
    }

    async renderPlot(seq, pamIndex) {
        this.setIsPlotLoading(true);
        let data = {
            "seq": seq,
            "pam_idx": pamIndex
        };
        let request = new Request(MODEL_URL, {
                method: 'post',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        );


        try {
            const response = await fetch(request);
            if (!response) {
                throw new Error('Network response was not ok.');
            } else {
                response.json().then(
                    (result) => {
                        this.setIsPlotLoading(false);
                        result.error ? this.setPlot(result.error) : this.setPlot(result.plot);
                    }
                )
            }

        } catch (error) {
            this.setIsPlotLoading(false);
            this.setPlot(error.message);
            console.log('There has been a problem with your fetch operation: ', error.message);
        }
    }

    plotIsValid(plot) {
        return plot && plot.includes("!function");
    }

    render() {
        return <div id="main-block">
            <div className="content">
                <a href="/">
                    <img src={banner}
                         className="logo"
                         alt="Forecast logo"/>
                </a>
                <Prediction
                    renderPlot={this.renderPlot}
                    plotIsValid={this.state.plotIsValid}
                />
                <Plot data={this.state.plot}
                      loading={this.state.loading}
                      plotIsValid={this.state.plotIsValid}
                />
            </div>
            <Footer/>
        </div>


    }
}

export default ForecastApp;
