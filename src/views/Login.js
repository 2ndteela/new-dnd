import React, { useState } from 'react';
import Input from '../components/Input/Input.js'
import { createNewUser, sendForgotPasswordEmail, signInUser } from '../assets/services.js';
import { useNavigate } from 'react-router-dom';
import { startGuestSession } from '../assets/storage.js';
import './Login.css'
import Button from '../components/Button/Button.js'

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
        <div className="page-content login-page">
            <div>
                <div className='full-width-row push-end login-links'>
                    <Button variant='text' onClick={() => setHidePassword(!hidePassword)}>{!hidePassword ? 'Forgot My Password' : 'Never mind'}</Button>
                    {!hidePassword && <Button variant="text" onClick={signUp}>Sign Up</Button>}
                </div>
                <form className='login-form' onSubmit={e => signIn(e)} >
                    <Input label="Email" field="email" val={email} onUpdate={setEmail} />
                    {!hidePassword && <Input label="Password" field="password" val={password} hidden={true} onUpdate={setPassword} />}
                    <div className="button-box push-end full-width">
                        {!hidePassword && <input type='submit' />}
                    </div>
                </form>
                <div className="button-box push-end">
                    {hidePassword && <Button onClick={sendForgotPassword}>Send Reset Email</Button>}
                </div>
                <div className="guest-mode-container">
                    <div className="guest-mode-divider">or</div>
                    <Button variant="flat" fullWidth onClick={enterGuestMode}>Use in guest mode</Button>
                    <div className="hint-text guest-mode-hint">Everything is saved on this device only. Sign in any time to sync.</div>
                </div>
            </div>
        </div>
    );
}