import React from 'react';
import HashLoader from 'react-spinners/HashLoader';


class Plot extends React.Component {

    componentDidUpdate() {
        let plot = this.props.data;
        if (plot) {
            let plotCodeWithoutNewLineChars = plot.replace(/\r?\n|\r/g, '');
            let plotBuildingFunction = /(!function.*mpld3\))/.exec(plotCodeWithoutNewLineChars)[0];
            new Function(plotBuildingFunction)();
        }

    }

    render() {
        const plotIsValid = this.props.plotIsValid;
        const plotHistory = plotIsValid ?
            <i>dashed line = cut site, red=inserted nucleotides, green=microhomology (location ambiguous)</i> :
            "";
        return <div className="plot">
            <div id="plot"></div>
            {!plotIsValid && this.props.data}
            {plotHistory}
            <div className="loadingSign">
                <HashLoader
                    sizeUnit={"px"}
                    color={'#21bc6b'}
                    loading={this.props.loading}
                />
            </div>
        </div>
    }
}

export default Plot;