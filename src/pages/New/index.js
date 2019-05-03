import React, { Component } from 'react';
import Edit from '../../comp/Edit'

class NewCharacter extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                <Edit title="New Character" />
            </div>
         );
    }
}
 
export default NewCharacter;