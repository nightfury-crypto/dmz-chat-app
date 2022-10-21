import React from 'react'
import './Auth.css'
import GoogleIcon from '@mui/icons-material/Google';

function Auth({setisLogging}) {
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
                <button className='googleBtn'onClick={() => setisLogging(true)}>
                    <GoogleIcon />
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>
    )
}

export default Auth