import React from 'react';
import HashLoader from 'react-spinners/HashLoader';


class Plot extends React.Component {

    componentDidUpdate(prevProps) {
        let plot = this.props.data;
        let prevPlot = prevProps.data;
        if (plot !== prevPlot && plot && this.props.plotIsValid) {
            console.log(plot);
            let plotCodeWithoutNewLineChars = plot.replace(/\r?\n|\r/g, '');
            let plotBuildingFunction = /(!function.*mpld3\))/.exec(plotCodeWithoutNewLineChars)[0];
            new Function(plotBuildingFunction)();
        }
    }

    render() {
        const plotIsValid = this.props.plotIsValid;
        const plotError = plotIsValid ? <div id="plot"></div> : this.props.data;
        const plotHistory = plotIsValid ?
            <i>dashed line = cut site, red=inserted nucleotides, green=microhomology (location ambiguous)</i> :
            "";
        return <div className="plot">
            {plotError}
            {plotHistory}
            <div className="loading-sign">
               <div id="loading-sign">
                   <HashLoader
                       sizeUnit={"px"}
                       color={'#4B8C92'}
                       loading={this.props.loading}
                   />
               </div>
            </div>
        </div>
    }
}

export default Plot;