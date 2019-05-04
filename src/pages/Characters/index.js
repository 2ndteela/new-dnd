import React, { Component } from 'react';
import firebase from '../../firebase'
import {NavLink} from 'react-router-dom';
import './style.css'


class Characters extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            characters: []
         }
    }

    componentDidMount() {

        const split = firebase.auth().currentUser.email.split('@')

        firebase.database().ref('/users/' + split[0] + '/characters'  ).once('value')
        .then(data => {
            const temp = data.val()
            console.log(temp)
            let arr =[]

            for(const v in temp) {
                arr.push(temp[v])
            }

            if(temp) 
                this.setState({
                    characters: arr
                })
        })
    }

    render() { 
        return ( 
            <div>
                <h1 className="header">Characters</h1>
                <div className="page-content">
                    {this.state.characters.map( char => {
                        return <div>{char.name}</div>
                    })}
                </div>
                <div id="full-bottom-button">
                    <NavLink to="/new" >New Character</NavLink>
                </div>
            </div>
         );
    }
}
 
export default Characters;