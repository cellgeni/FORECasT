import React from 'react';

function capitalize(s) {
    return s[0].toUpperCase() + s.substring(1);
}

class Guide extends React.Component {

    render() {
        let guide = this.props.guide;
        return guide && <table className="table under-plot">
            <tr>
                <th scope="col"></th>
                <th scope="col">Guide info</th>
                <th scope="col"></th>
            </tr>
            <tbody>
            <tr>
                <th scope="row">1</th>
                <td>WGE id</td>
                <td><a href={guide.wge_link}>{guide.wge_id}</a></td>
            </tr>
            <tr>
                <th scope="row">2</th>
                <td>Genome coordinates</td>
                <td>{guide.coordinates}</td>
            </tr>
            <tr>
                <th scope="row">3</th>
                <td>Strand</td>
                <td>{guide.strand}</td>
            </tr>
            <tr>
                <th scope="row">4</th>
                <td>Species</td>
                <td>{capitalize(guide.species)}</td>
            </tr>
            <tr>
                <th scope="row">5</th>
                <td>Gene</td>
                <td>{guide.gene}</td>
            </tr>
            </tbody>
        </table>
    }
}

export default Guide;