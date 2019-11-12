import React from 'react';

const MIN_INDEX = 11;

function Caption() {
    return <div className="caption">
        <p>FORECasT is a tool for predicting the mutational outcomes resulting from double stranded
            breaks induced by CRISPR/Cas9. </p>
        <p>Please enter a target DNA sequence and the location of the NGG PAM sequence below, and this
            tool will compute an in-silico predicted profile of resulting mutations in the targeted
            DNA.</p>
    </div>;
}

class Validator{

    validate(seq, pamIndex){

    }
}

class PredictionForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "seq": "",
            "pamIndex": ""
        };
        this.suggestExample = this.suggestExample.bind(this);
        this.downloadReport = this.downloadReport.bind(this);
        this.suggestIndex = this.suggestIndex.bind(this);
        this.onSeqChange = this.onSeqChange.bind(this);
        this.onPamIndexChange = this.onPamIndexChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.setSeq = this.setSeq.bind(this);
        this.setPamIndex = this.setPamIndex.bind(this);
        this.findNewPamIndex = this.findNewPamIndex.bind(this);
    }

    setSeq(newValue) {
        this.setState({
            "seq": newValue,
            "pamIndex": ""
        })
    }

    setPamIndex(newValue) {
        this.setState({
            "pamIndex": newValue
        })
    }

    onSeqChange(event) {
        this.setSeq(event.target.value);
    }

    onSubmit(event){
        this.props.renderPlot(this.state.seq, this.state.pamIndex)
    }

    onPamIndexChange(event) {
        this.setPamIndex(event.target.value);
    }

    downloadReport() {
        window.open("/profile?seq=" + this.state.seq + "&pam_idx=" + this.state.pamIndex);
    }

    suggestExample() {
        const EXAMPLE_SEQ = "ATGCTAGCTAGGGCATGAGGCATGCTAGTGACTGCATGGTAC";
        const EXAMPLE_PAM_IDX = 17;
        this.setSeq(EXAMPLE_SEQ);
        this.setPamIndex(EXAMPLE_PAM_IDX);
    }


    findNewPamIndex(seq, current_idx) {
        if (!current_idx)
            current_idx = 0;
        current_idx = parseInt(current_idx);
        let new_idx = seq.indexOf("GG", current_idx + 2) - 1;
        if (new_idx > 0 && new_idx < MIN_INDEX) {
            let next_idx = seq.indexOf("GG", new_idx + 2) - 1;
            if (next_idx && next_idx > 0)
                return this.findNewPamIndex(seq, new_idx);
            else
                this.setPamIndex("Sequence too short or PAM too close to edge of sequence (must have at least 10nt either side of cut site)");
        } else if (new_idx < 0)
            return this.findNewPamIndex(seq, 0);
        else
            return new_idx;
    }

    suggestIndex() {
        const seq = this.state.seq;
        const pamIndex = this.state.pamIndex;
        let matches = seq.match(/GG+/gm);
        if ((matches == null) || !(matches.length)) {
            this.setState({
                "pamIndex": "Empty or non-PAM sequence"
            });
            return;
        }
        let newPamIndex = this.findNewPamIndex(seq, pamIndex);
        if (newPamIndex)
            this.setState({
                "pamIndex": newPamIndex
            });
    }


    render() {
        return <form action="#results" method="post" className="main-form" name="results">

            <div className="form-group">
                <label htmlFor="seq">Target DNA sequence</label>
                <input id="seq" name="seq" required size="45" type="text"
                       value={this.state.seq}
                       onChange={this.onSeqChange}
                />
                <button
                    type="button"
                    className="btn btn-light"
                    id="show-example"
                    onClick={this.suggestExample}
                >
                    Example
                </button>
            </div>

            <div className="form-group">
                <label htmlFor="pam_idx">Index of PAM (0-based)</label>
                <input id="pam_idx" name="pam_idx" required type="text"
                       value={this.state.pamIndex}
                       onChange={this.onPamIndexChange}
                />
                <button type="button" className="btn btn-light" id="suggest-idx" onClick={this.suggestIndex}>Suggest
                </button>
                <button type="submit" className="btn btn-primary" id="submit-seq" onClick={this.onSubmit}>Submit</button>

                {this.props.plotIsValid && <button type="button" className="btn btn-primary" id="download-report"
                        onClick={this.downloadReport}
                >Download
                </button> }
            </div>
            {/*{{show_errors(form.seq)}}*/}
            {/*{{show_errors(form.pam_idx)}}*/}
        </form>
    }
}

class Prediction extends React.Component {
    render() {
        return <div className="row">
            <div className="content">
                <Caption/>
                <PredictionForm
                    renderPlot={this.props.renderPlot}
                    plotIsValid={this.props.plotIsValid}
                />
            </div>
        </div>
    }
}

export default Prediction;
