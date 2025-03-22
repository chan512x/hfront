import React from "react";
import * as Components from './comp.js';
import { useAuth } from "./context/authcontext.jsx";
import { StyleSheetManager } from 'styled-components';
import {useNavigate} from "react-router-dom"
import './styles/index.css'
function Ap() {
    const [signIn, toggle] = React.useState(true);
    const [name, setName] = React.useState(""); // State for user's name
    const [email, setEmail] = React.useState(""); // State for user's email
    const [password, setPassword] = React.useState(""); // State for user's password
    const [errorMessage, setErrorMessage] = React.useState("");
    const [error2,seterror2]=React.useState("")
    const {signup,currentUser,login}=useAuth()
    const [loading,setLoading]=React.useState(false)
    const navigate=useNavigate()
    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSignUp = async (event) => {
          event.preventDefault();
          setLoading(true)
          try{
            seterror2("")
            await signup(email,password)
            navigate("/home")
        }
        catch{
            seterror2("Failed to create an account")
        }
        setLoading(false)

    }
        
        const handleSignIn=async(event)=>{
            event.preventDefault();   
            setLoading(true)
          try{
            setErrorMessage("")
            await login(email,password)
            navigate("/home")

        }
        catch{
            setErrorMessage("Failed to sign in")
        }
        setLoading(false)    
    }
    //toggle(false);
        return(
            <div className='hello'>
            <StyleSheetManager shouldForwardProp={(prop) => prop !== 'signinIn'}>
                
            <Components.Container>
                <Components.SignUpContainer signinIn={signIn}>
                    <Components.Form>
                        <Components.Title>Create Account</Components.Title>
                        <Components.Input type='text' placeholder='Name'onChange={handleNameChange} />
                        <Components.Input type='email' placeholder='Email'onChange={handleEmailChange} />
                        <Components.Input type='password' placeholder='Password' onChange={handlePasswordChange}/>
                        <Components.Button onClick={handleSignUp} disabled={loading}>Sign Up</Components.Button>
                        {error2 && <Components.error2>{error2}</Components.error2>}

                    </Components.Form>
                </Components.SignUpContainer>

                <Components.SignInContainer signinIn={signIn}>
                    <Components.Form>
                        <Components.Title>Sign in</Components.Title>
                        <Components.Input type='email' placeholder='Email'onChange={handleEmailChange} />
                        <Components.Input type='password' placeholder='Password' onChange={handlePasswordChange}/>
                        <Components.Button onClick={handleSignIn}>Sign In</Components.Button>
                        {errorMessage && <Components.ErrorMessage>{errorMessage}</Components.ErrorMessage>}
                        
                        
                    </Components.Form>

                </Components.SignInContainer>

                <Components.OverlayContainer signinIn={signIn}>
                    <Components.Overlay signinIn={signIn}>

                    <Components.LeftOverlayPanel signinIn={signIn}>
                    <h1>LLG.</h1>
                        <Components.Title>Welcome Back!</Components.Title>
                        <Components.Paragraph>
                            To keep connected with us please login with your personal info
                        </Components.Paragraph>
                        <Components.GhostButton onClick={() => toggle(true)}>
                            Sign In
                        </Components.GhostButton>
                        </Components.LeftOverlayPanel>

                        <Components.RightOverlayPanel signinIn={signIn}>
                        <h1>LLG.</h1>
                        <Components.Title>Hello!</Components.Title>
                        <Components.Paragraph>
                            Enter Your personal details and start your journey with us
                        </Components.Paragraph>
                            <Components.GhostButton onClick={() => toggle(false)}>
                                Sign Up
                            </Components.GhostButton> 
                        </Components.RightOverlayPanel>

                    </Components.Overlay>
                </Components.OverlayContainer>

            </Components.Container>
            </StyleSheetManager>
            </div>
        )
}    export default Ap;