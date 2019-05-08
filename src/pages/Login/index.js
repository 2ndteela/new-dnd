import React, { Component } from 'react';
import Input from '../../comp/Input';
import './style.css'
import firebase from '../../firebase'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {  }

        this.updateState = this.updateState.bind(this)
    }

    componentDidMount() {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    }

    updateState(value, feild) {
        this.setState({
            [feild]: value
        })
    }

    signIn() {
        firebase.auth().signInAndRetrieveDataWithEmailAndPassword(this.state.email, this.state.password)
        .then(data => {
            this.props.history.push('/characters')
        })
        .catch(err => {
            alert(err.message)
        })
    }

    signUp() {

        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(data => {
            const split = this.state.email.split('@')
            localStorage['firebaseKey'] = split[0]
        })
    }

    render() { 
        return ( 
            <div>
                <h1 className="header">Login</h1>
                <div className="page-content" style={{justifyContent: 'center'}}>
                    <Input label="Email" field="email" val={this.state.email} onUpdate={this.updateState} />
                    <Input label="Password" field="password" val={this.state.password} hidden={true} onUpdate={this.updateState} />
                    <div className="button-box">
                        <button onClick={() => this.signIn()} >Login</button>
                        <button className="flat-button" onClick={() => this.signUp()} >Sign Up</button>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default Login;