import React from 'react';
import banner from "../images/Banner_FC2-min.jpg";
import {withRouter} from "react-router-dom";

import Prediction from "./Prediction";
import Plot from "./Plot";
import Footer from "./Footer";
import Guide from "./Guide";
import Utils from "../utils/utils";

let MODEL_HOST = process.env.REACT_APP_MODEL_HOST;
let MODEL_URL = MODEL_HOST + "/plot";


class ForecastApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            plot: "",
            loading: false,
            plotIsValid: false,
            guide: {}
        };
        this.renderPlot = this.renderPlot.bind(this);
        this.setPlot = this.setPlot.bind(this);
        this.plotIsValid = this.plotIsValid.bind(this);
    }

    plotIsValid(plot) {
        return plot && typeof plot === "string" && plot.includes("!function");
    }

    setPlot(plot) {
        this.setState({
            "plot": plot,
            "plotIsValid": this.plotIsValid(plot)
        });
    }

    setGuide(guide) {
        this.setState({
            "guide": guide
        })
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

    async renderPrecalculatedPlot(wge, id, species) {
        this.setIsPlotLoading(true);
        let data = {
            "wge": wge,
            "id": id,
            "species": species
        };
        let request = new Request(MODEL_URL + Utils.createQueryString(data), {
                method: 'get',
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
                        if (result.error) {
                            this.setPlot(result.error);
                        } else {
                            this.setPlot(result.plot);
                            this.setGuide(result.guide);
                        }
                    }
                )
            }
        } catch (error) {
            this.setIsPlotLoading(false);
            this.setPlot(error.message);
            console.log('There has been a problem with your fetch operation: ', error.message);
        }
    }

    getPlot() {
        let query = new URLSearchParams(this.props.location.search);
        let wge = query.get("wge");
        let oligoId = query.get("id");
        let species = query.get("species");

        if (wge || oligoId || species) {

            if (species) {
                this.renderPrecalculatedPlot(wge, oligoId, species);
            } else {
                const errorMessage = <div className="errorMsg">
                    <p>Your request is malformed </p>
                    <p>The parameters you can include in the GET request:</p>
                    <ul>
                        <li>"wge" or "oligo_id" (one of those) - required</li>
                        <li>"species" (values 'human' or 'mouse') - required</li>
                    </ul>
                </div>;
                this.setPlot(errorMessage);
            }
        }
    }

    componentDidMount() {
        this.getPlot()
    }

    render() {

        const returnButton = <div className="under-plot">
            <a href="/FORECasT">
                <button type="button" className="btn btn-success">Predict mutations for another sequence</button>
            </a>
        </div>;

        return <div id="main-block">
            <div className="content">
                <a href="/">
                    <img src={banner}
                         className="logo"
                         alt="Forecast logo"/>
                </a>
                {Utils.isEmptyObject(this.state.guide) &&
                <Prediction
                    renderPlot={this.renderPlot}
                    plotIsValid={this.state.plotIsValid}
                    setPlot={this.setPlot}
                />}
                {!Utils.isEmptyObject(this.state.guide) && <Guide guide={this.state.guide}/>}
                <Plot data={this.state.plot}
                      loading={this.state.loading}
                      plotIsValid={this.state.plotIsValid}
                />
                {!Utils.isEmptyObject(this.state.guide) && returnButton}
            </div>
            <Footer/>
        </div>


    }
}

export default withRouter(ForecastApp);
