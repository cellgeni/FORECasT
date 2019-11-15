import React from 'react';
import banner from "../images/Banner_FC2-min.jpg";

import Prediction from "./Prediction";
import Plot from "./Plot";
import Footer from "./Footer";

class ForecastApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            plot: ""
        };
        this.renderPlot = this.renderPlot.bind(this);
        this.setPlot = this.setPlot.bind(this);
    }

    setPlot(plot){
        this.setState({
            "plot": plot
        });
    }

    renderPlot(seq, pamIndex) {
        let MODEL_HOST = process.env.REACT_APP_MODEL_HOST;
        let data = {
            "seq": seq,
            "pam_idx": pamIndex
        };
        // let data = new FormData(event.target);
        let MODEL_URL = MODEL_HOST + "/plot";
        let request = new Request(MODEL_URL, {
                method: 'post',
                body: JSON.stringify(data),
                // body: data,
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'text/plain'
                }
            }
            );
        // let MODEL_URL = MODEL_HOST + "/plot?seq=" + seq + "&pam_idx=" + pamIndex;
        fetch(request).then(res => res.json()).then(
            (result) => {
                result.error ? this.setPlot(result.error) : this.setPlot(result.plot);
            }
        )
    }

    plotIsValid() {
        return this.state.plot && !this.state.plot.startsWith("Error");
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
                    plotIsValid={this.plotIsValid()}
                />
                <Plot data={this.state.plot}/>
            </div>
            <Footer/>
        </div>


    }
}

export default ForecastApp;
