import React, { useState } from 'react';
import Input from '../components/Input/Input.js'
import { createNewUser, sendForgotPasswordEmail, signInUser } from '../assets/services.js';
import { useNavigate } from 'react-router-dom';
import { startGuestSession } from '../assets/storage.js';
import './Login.css'

export default function Login() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [hidePassword, setHidePassword] = useState(false)
    const navigate = useNavigate()

    async function signIn(e) {
        e.preventDefault()

        if (!email || !password) {
            alert('Please fill in email and password')
            return
        }

        try {
            await signInUser(email, password)
            navigate('/resources')

        }
        catch (error) {
            console.error(error)
            if (error.message === 'Bad Login Credentials')
                alert('Your email and password do not match any in our records')

            else
                alert("Authentication Error")
        }
    }

    async function signUp() {

        if (!email || !password) {
            alert('Please fill in email and password')
            return
        }

        try {
            await createNewUser(email, password)
            navigate('/resources')

        }
        catch (error) {
            alert("There was an error, please try again")
        }
    }

    function enterGuestMode() {
        startGuestSession()
        navigate('/resources')
    }

    async function sendForgotPassword() {

        if (!email) {
            alert('Please provide your email')
            return
        }

        try {
            await sendForgotPasswordEmail(email)
            setHidePassword(false)
            alert('A password reset email has been set to the email you provided.')
        }
        catch (error) {
            console.error(error)
            alert('There was an error sending your reset email, please try again later')
        }
    }

    return (
        <div className="page-content" style={{ justifyContent: 'center' }}>
            <div>
                <div className='full-width-row push-end' style={{ paddingBottom: '8px' }}>
                    <button className='text-button' onClick={() => setHidePassword(!hidePassword)} >{!hidePassword ? 'Forgot My Password' : 'Never mind'}</button>
                    {!hidePassword && <button className="text-button no-margin-button" onClick={signUp} >Sign Up</button>}
                </div>
                <form style={{ width: '680px' }} onSubmit={e => signIn(e)} >
                    <Input label="Email" field="email" val={email} onUpdate={setEmail} />
                    {!hidePassword && <Input label="Password" field="password" val={password} hidden={true} onUpdate={setPassword} />}
                    <div className="button-box push-end full-width">
                        {!hidePassword && <input type='submit' />}
                    </div>
                </form>
                <div className="button-box push-end">
                    {hidePassword && <button className="no-margin-button" onClick={sendForgotPassword} >Send Reset Email</button>}
                </div>
                <div className="guest-mode-container">
                    <div className="guest-mode-divider">or</div>
                    <button className="flat-button full-button guest-mode-button" onClick={enterGuestMode}>Use in guest mode</button>
                    <div className="guest-mode-hint">Everything is saved on this device only. Sign in any time to sync.</div>
                </div>
            </div>
        </div>
    );
}