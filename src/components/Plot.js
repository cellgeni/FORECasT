import React from 'react';
import $ from 'jquery';

function nodeScriptReplace(node) {
    if ( nodeScriptIs(node) === true ) {
        node.parentNode.replaceChild( nodeScriptClone(node) , node );
    }
    else {
        let i = 0;
        let children = node.childNodes;
        while ( i < children.length ) {
            nodeScriptReplace( children[i++] );
        }
    }

    return node;
}
function nodeScriptIs(node) {
    return node.tagName === 'SCRIPT';
}
function nodeScriptClone(node){
    var script  = document.createElement("script");
    script.text = node.innerHTML;
    for( var i = node.attributes.length-1; i >= 0; i-- ) {
        script.setAttribute( node.attributes[i].name, node.attributes[i].value );
    }
    return script;
}

class Plot extends React.Component {

    componentDidMount() {
        // const plotCode = this.props.data;
        nodeScriptReplace($(".plotData"));
        new Function($(".plotData"))();
    }

    render() {
        const plotHistory = this.props.plotIsValid ?
            <i>dashed line = cut site, red=inserted nucleotides, green=microhomology (location ambiguous)</i> :
            "";
        // const data =
        return <div className="plot">
            <div className="plotData" dangerouslySetInnerHTML={{__html: this.props.data}}>
            </div>
            {plotHistory}
        </div>
    }
}

export default Plot;