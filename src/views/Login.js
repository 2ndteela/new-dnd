import React, { useState } from 'react';
import Input from '../components/Input/Input.js'
import Header from '../components/Header/Header.js'
import { createNewUser, sendForgotPasswordEmail, signInUser } from '../assets/services.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [ email, setEmail ] = useState()
    const [ password, setPassword ] = useState()
    const [hidePassword, setHidePassword] = useState(false)
    const navigate = useNavigate()

    async function signIn(e) {
        e.preventDefault()

        if(!email || !password) {
            alert('Please fill in email and password') 
            return
        }

        try {
            console.log(email, password)
            await signInUser(email, password)
            navigate('/characters')

        }
        catch(error) {
            console.error(error)
            if(error.message === 'Bad Login Credentials')
                alert('Your email and password do not match any in our records')
            
            else
                alert("Authentication Error")
        }
    }

    async function signUp() {

        if(!email || !password) {
            alert('Please fill in email and password') 
            return
        }

        try {
            await createNewUser(email, password)
            navigate('/characters')

        }
        catch(error) {
            alert("There was an error, please try again")
        }
    }

    async function sendForgotPassword() {

        if(!email) {
            alert('Please provide your email')
            return
        }

        try {
            await sendForgotPasswordEmail(email)
            setHidePassword(false)
            alert('A password reset email has been set to the email you provided.')
        }
        catch(error) {
            console.error(error)
            alert('There was an error sending your reset email, please try again later')
        }
    }

    return ( 
        <div>
                <div className="page-content" style={{justifyContent: 'center'}}>
                    <div className='full-width-row push-end' style={{paddingBottom: '8px'}}>
                        <button className='text-button' onClick={() => setHidePassword(!hidePassword)} >{!hidePassword ? 'Forgot My Password' : 'Never mind'}</button>
                        {!hidePassword && <button className="text-button no-margin-button" onClick={signUp} >Sign Up</button>}
                    </div>
                    <form className='full-width' onSubmit={e => signIn(e)} >
                        <Input label="Email" field="email" val={email} onUpdate={setEmail} />
                        {!hidePassword && <Input label="Password" field="password" val={password} hidden={true} onUpdate={setPassword} />}
                        <div className="button-box push-end">
                            {!hidePassword && <input type='submit' />}
                        </div>
                    </form>
                    <div className="button-box push-end">
                        {hidePassword && <button className="no-margin-button" onClick={sendForgotPassword} >Send Reset Email</button>}
                    </div>
                </div>
        </div>
    );
}