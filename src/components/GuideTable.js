import React from 'react';


class GuideTable extends React.Component {

    render() {
        return <table className="table under-plot">
            <tr>
                <th scope="col"/>
                <th scope="col">Guide info</th>
                <th scope="col"/>
            </tr>
            <tbody>
            <tr>
                <th scope="row">1</th>
                <td>WGE id</td>
                <td><a href={this.props.guide.wgeLink}>{this.props.guide.wgeId}</a></td>
            </tr>
            <tr>
                <th scope="row">2</th>
                <td>Genome coordinates</td>
                <td>{this.props.guide.coordinates}</td>
            </tr>
            <tr>
                <th scope="row">3</th>
                <td>Strand</td>
                <td>{this.props.guide.strand}</td>
            </tr>
            <tr>
                <th scope="row">4</th>
                <td>Species</td>
                <td>{this.props.guide.species}</td>
            </tr>
            <tr>
                <th scope="row">5</th>
                <td>Gene</td>
                <td>{this.props.guide.gene}</td>
            </tr>
            </tbody>
        </table>
    }
}

export default GuideTable;