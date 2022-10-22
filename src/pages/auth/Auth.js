import React from 'react'
import './Auth.css'
import GoogleIcon from '@mui/icons-material/Google';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from '../../firebase/FirebaseSetup';
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

function Auth() {

    // handle Signin
    const handleSignin = async () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async(result) => {
                const user = result.user;
                // added user collection if doesnot exists
                try {
                    const userDocRef = doc(db, "users", user.uid)
                    const userexistscheck = await getDoc(userDocRef)
                    if (!userexistscheck.exists()) {
                        await setDoc(userDocRef, {
                            uid: user.uid,
                            displayName: user.displayName,
                            photoURL: user.photoURL,
                            email: user.email,
                            username: '',
                            profilePhoto: user.photoURL,
                            cretedDT: Timestamp.fromDate(new Date())
                          });
                    }
                  } catch (e) {
                    console.log( e);
                  }
            }).catch((error) => {
                console.log(error)
            });
    }

    return (
        <div className="auth">
            {/* intro logo */}
            <div className="auth__logo">
                <div className="circle">
                    <h1 className='logo'>dmz</h1>
                </div>
            </div>
            {/* google Button */}
            <div className="auth__google">
                <button className='googleBtn' onClick={handleSignin}>
                    <GoogleIcon />
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>
    )
}

export default Auth