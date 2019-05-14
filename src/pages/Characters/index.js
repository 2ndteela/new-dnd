import React, { Component } from 'react';
import firebase from '../../firebase'
import {NavLink} from 'react-router-dom';
import Header from '../../comp/Header' 
import './style.css'


class Characters extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            characters: []
         }
    }

    componentDidMount() {
        try {
            localStorage['tempCharacter'] = null
            const split = firebase.auth().currentUser.email.split('@')
            //const split = ['2ndteela', 'gmail']
            firebase.database().ref('/users/' + split[0] + '/characters'  ).once('value')
            .then(data => {
                const temp = data.val()
                let arr =[]

                for(const v in temp) {
                    temp[v].key = v
                    arr.push(temp[v])
                }

                if(temp) 
                    this.setState({
                        characters: arr
                })
            })
        }
        catch(err) {
            this.props.history.push('/')
        }
    }   

    goToCharacter(char) {
        localStorage['tempCharacter'] = JSON.stringify(char)
        this.props.history.push('/skills')
    }

    render() { 
        return ( 
            <div>
                <Header label="Characters">
                    <NavLink to='/' >Logout</NavLink>
                </Header>
                <div className="page-content">
                    {this.state.characters.map( (char, i) => {
                        return <div className="char-card" key={"char-" + i} onClick={() => this.goToCharacter(char)} >
                            <h3>{char.name}</h3>
                            <div>Level {char.level} {char.race} {char.class}</div>
                        </div>
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