import React, { Component } from 'react';
import Edit from '../../comp/Edit'
import BottomNav from '../../comp/BottomNav'

class EditPage extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    render() { 
        return ( 
            <div>
                <Edit title="Edit" />
                <BottomNav />
            </div>
         );
    }
}
 
export default EditPage; 