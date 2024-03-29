import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import '../Styles/sign-up.css'
import {auth, googleProvider, storage} from '../firebase-config'
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage'

export default function SignUp() {
    
    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged(() => {
            if(auth.currentUser){
                localStorage.setItem('name', registerName)
                localStorage.setItem('email', registerEmail)
                navigate('/')
            } 
        })
    }, [])

    const [registerName, setRegisterName] = useState('')
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerProfilePicture, setRegisterProfilePicture] = useState();
    const [error, setError] = useState('');
    

    //Function to sign up with email and password
    async function signUp(e){
        e.preventDefault();
        try{
                await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
                .then(res => {
                    localStorage.setItem('name', registerName)
                    localStorage.setItem('email', registerEmail)
                });

                const storageRef = ref(storage, `Profile Pictures/ProfilePictureOf${auth.currentUser.uid}`)
                const metadata = {
                    customMetadata:{
                      "uploaderName":auth.currentUser.displayName,
                      "uploaderId":auth.currentUser.uid
                    }
                  }
                await uploadBytes(storageRef, registerProfilePicture, metadata)
                const pictureUrl = await getDownloadURL(storageRef)
                await updateProfile(auth.currentUser, {displayName:registerName, photoURL:pictureUrl})
                .then(() => navigate('/'))
            }catch(err){
                if(err.code === "auth/invalid-email"){
                    setError('Invalid Email!')
                  }else if(err.code === "auth/email-already-in-use"){
                    setError('Email already in use!')
                  }else if(err.code === "auth/weak-password."){
                    setError('Please type in a password')
                  }
            }
    }
    //Function to sign up with Google
    async function signUpWithGoogle(){
        await signInWithPopup(auth, googleProvider)
        .then(res => {
            localStorage.setItem('name', res.user.displayName)
            localStorage.setItem('email', res.user.email)
            navigate('/')
        })
    }
  return (  
    <div className='sign-up-container'>
        <div className="sign-up-div">
        <h1>Welcome!</h1>
            <span>Sign up With</span>
            <div className="sign-up-with-google-div" onClick={signUpWithGoogle}>
                <div className="google-icon-wrapper">
                <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google"/>
                </div>
                <p>Google</p>
            </div>
            <form onSubmit={e => signUp(e)}>
            <input className="name-input" type="text" placeholder="Name" required value={registerName} onChange={e => {setRegisterName(e.target.value)}}/>
            <input className="email-input" type="email" placeholder='Email' required value={registerEmail} onChange={e => setRegisterEmail(e.target.value)}/>
            <input className="password-input" type="password" placeholder='Password' required value={registerPassword} onChange={e => setRegisterPassword(e.target.value)}/>
            <input className='picture-input' type="file" required onChange={e => setRegisterProfilePicture(e.target.files[0])}/>
            <span className='error-span'>{error}</span>
            <button className='sign-in-btn'>Sign up</button>
            </form>
           
            <div className="already-have-acc-div">
                <span>Already have an account? <Link to="/signIn">Sign In</Link></span>
            </div>
        </div>
    </div>
  )
}
