import React from 'react';


class Plot extends React.Component {
    render() {
        const plotHistory = this.props.plotIsValid ?
            <i>dashed line = cut site, red=inserted nucleotides, green=microhomology (location ambiguous)</i>:
            "";
        return <div className="plot">
            {this.props.data}
            {plotHistory}
        </div>
    }
}

export default Plot;