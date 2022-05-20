import React, { useState } from 'react';
import Input from '../components/Input/Input.js'
import Header from '../components/Header/Header.js'
import { createNewUser, signInUser } from '../assets/services.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const [ email, setEmail ] = useState()
    const [ password, setPassword ] = useState()
    const navigate = useNavigate()

    async function signIn() {
        try {
            await signInUser(email, password)
            navigate('/characters')

        }
        catch(error) {
            if(error.message === 'Bad Login Credentials')
                alert('Your email and password do not match any in our records')
            
            else
                alert("Authentication Error")
        }
    }

    async function signUp() {
        try {
            await createNewUser(email, password)
            navigate('/characters')

        }
        catch(error) {
            alert("There was an error, please try again")
        }
    }

    return ( 
        <div>
            <Header noActions={true} label="Login"></Header>
            <div className="page-content" style={{justifyContent: 'center'}}>
                <Input label="Email" field="email" val={email} onUpdate={setEmail} />
                <Input label="Password" field="password" val={password} hidden={true} onUpdate={setPassword} />
                <div className="button-box">
                    <button onClick={signIn} >Login</button>
                    <button className="flat-button" onClick={signUp} >Sign Up</button>
                </div>
            </div>
        </div>
    );
}