import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import '../Styles/sign-in.css'
import {auth, googleProvider} from '../firebase-config'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import Cookies from 'universal-cookie';

const cookies = new Cookies();
export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //Function to sign in with email and password
    async function signIn(e){
        e.preventDefault();
            try{
            await signInWithEmailAndPassword(auth, email, password)
            .then(res =>{
                localStorage.setItem('name', res.user.displayName)
                localStorage.setItem('email', res.user.email)
                cookies.set("auth-token", res.user.refreshToken)
                navigate('/chat-app/')
            })
            }catch(err){
                if(err.code === "auth/wrong-password"){
                    setError("Incorrect Password")
                  }else if(err.code === "auth/user-not-found"){
                    setError('Email not found')
                  }else if(err.message === "auth/invalid-email"){
                    setError('Invalid Email')
                  }
            }
    }

    //Function to sign in with Google
    async function signInWithGoogle(){
        await signInWithPopup(auth, googleProvider)
        .then(res => {
            localStorage.setItem('name', res.user.displayName)
            localStorage.setItem('email', res.user.email)
            cookies.set("auth-token", res.user.refreshToken)
            navigate('/chat-app/')
        })
    }
  return (
    <div className='sign-in-container'>
        <div className="sign-in-div">
            <h1>Welcome Back!</h1>
            <span>Sign in With</span>
            <div className="sign-in-with-google-div" onClick={signInWithGoogle}>
                <div className="google-icon-wrapper">
                <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                </div>
                <p>Google</p>
            </div>
            <form onSubmit={e => signIn(e)}>
            <input className="email-input" type="email" placeholder='Email' required value={email} onChange={e => setEmail(e.target.value)} />
            <input className="password-input" type="password" placeholder='Password' required value={password} onChange={e => setPassword(e.target.value)}/>
            <span className='error-span'>{error}</span>
            <button className='sign-in-btn'>Sign In</button>
            </form>
            <div className="dont-have-acc-div">
                <span>Don't have an account? <Link to="/chat-app/signUp">Sign Up</Link></span>
            </div>
        </div>
    </div>
  )
}
