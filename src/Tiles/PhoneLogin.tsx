import { useState, useEffect } from "react";
import { fireAuth } from "../firebaseConfig"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

declare global {
    interface Window { recaptchaVerifier: RecaptchaVerifier; }
}

function PhoneLogin() {
    const [isVerified, setisVerified] = useState(false)
    const [authError, setauthError] = useState(false)
    const [phoneInput, setPhoneInput] = useState('')
    const [isStarted, setisStarted] = useState(false)
    // const [newApp, setnewApp] = useState(new RecaptchaVerifier("g-recaptcha", { }, fireAuth))
    useEffect(() => {
        if (!isVerified && !authError && !isStarted) {
            console.log('create appVerifier')
            try {
                window.recaptchaVerifier = new RecaptchaVerifier("g-recaptcha", { }, fireAuth)
                window.recaptchaVerifier.render().then((ID:Number) => {
                    setisStarted(true)
                    console.log("isstarted",ID)
                })
            } catch (e) {
                console.log(e)
                setauthError(true)
            }
        }
    });
    function handleSignIn() {
        try {
            console.log('signin',"phone:",phoneInput )
            signInWithPhoneNumber(fireAuth, "+13333334444",  window.recaptchaVerifier)
                .then((confirmationResult) => {
                    console.log("signing in:" + phoneInput)
                    confirmationResult.confirm("666666").then((result)=>{
                        console.log("user:",result)
                    })
                    setisVerified(true)
                }).catch((error) => {
                    console.log(error)
                    setauthError(true)
                })
        } catch (e) {
            console.log(e)
            setauthError(true)
        }
    }
    return (
        <div>
            {isVerified ? "verified" : "not-verified"}
                <div id="g-recaptcha" data-sitekey="6LeCqiofAAAAALCzbTJyqOzafiV6rsiL-G3NpMpd" />
                <input onChange={(e) => setPhoneInput(phoneInput + e.target.value)} />
                <button onClick={handleSignIn}>Submit</button>
                {authError ? " There was an error signing into your profile." : ""}
        </div>
    );
}
export default PhoneLogin