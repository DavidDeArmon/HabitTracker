import { useState, useEffect } from "react";
import { fireAuth } from "../firebaseConfig"
import { RecaptchaVerifier, signInWithPhoneNumber, UserCredential, ConfirmationResult } from "firebase/auth";

declare global {
    interface Window { recaptchaVerifier: RecaptchaVerifier; }
}
interface myProps {
    genUserInfo: (newLogin: UserCredential) => void,
    isVerified: boolean
}
function PhoneLogin(props: React.PropsWithChildren<myProps>) {
    const [authError, setAuthError] = useState(false)
    const [showInput, setShowInput] = useState(false)
    const [phoneInput, setPhoneInput] = useState('+1')
    const [codeSent, setCodeSent] = useState(false)
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult>()
    const [verificationCodeInput, setVerificationCodeInput] = useState('')
    useEffect(() => {
        //create a verifier if it doesn't exists, if it does then try to render recaptcha.
        if (window.recaptchaVerifier === undefined) try {
            window.recaptchaVerifier = new RecaptchaVerifier("g-recaptcha", {
                'size': 'small',
                'callback': (response: any) => {
                    setShowInput(true)
                    console.log('reCaptcha solved')
                }
            }, fireAuth)
            window.recaptchaVerifier.render().catch((error) => {
                console.log(error, window.recaptchaVerifier)
            })
        } catch (e) {
            console.log(e)
        }
    });
    // A function to format text to look like a phone number
    function phoneFormat(input: string) {
        let formattedInput = input
        // Strip all characters from the formattedInput except digits
        formattedInput = formattedInput.replace(/\D/g, '');
        // Trim the remaining formattedInput to preserve phone number format
        formattedInput = formattedInput.substring(0, 12);
        // Based upon the length of the string, we add formatting as necessary
        let charsEntered: number = formattedInput.length;
        if (charsEntered === 0) {
            return formattedInput;
        } else if (charsEntered < 2) {
            formattedInput = '+' + formattedInput;
        } else if (charsEntered < 5) {
            formattedInput = '+' + formattedInput.substring(0, 1) + ' (' + formattedInput.substring(1, 4);
        } else if (charsEntered < 8) {
            formattedInput = '+' + formattedInput.substring(0, 1) + ' (' + formattedInput.substring(1, 4) + ') ' + formattedInput.substring(4, 7);
        } else {
            formattedInput = '+' + formattedInput.substring(0, 1) + ' (' + formattedInput.substring(1, 4) + ') ' + formattedInput.substring(4, 7) + ' - ' + formattedInput.substring(7, 11);
        }
        //set number with formatting to the input
        setPhoneInput(formattedInput)
        //setCursor to avoid formatting
        let cursorPos: number = formattedInput.length
        let inputBox: HTMLInputElement | null = document.querySelector('#phoneInput');
        if (inputBox != null) {
            inputBox.focus();
            if (!(cursorPos < 8 || cursorPos >= 8)) inputBox.setSelectionRange(cursorPos - 1, cursorPos - 1)
        }
        return formattedInput;
    }
    async function handleConfirmation(): Promise<void> {
        console.log("signing in:" + phoneInput)
        try {
            confirmationResult!.confirm(verificationCodeInput).then((result) => {
                console.log("user:", result)
                props.genUserInfo(result)
            })
        }
        catch (e) {
            console.log(e)
            setAuthError(true)
        }
    }
    async function handleSignIn(): Promise<void> {
        try {
            console.log('signin', "phone:", phoneInput)
            signInWithPhoneNumber(fireAuth, phoneInput, window.recaptchaVerifier)
                .then((confirmationResult: ConfirmationResult) => {
                    setConfirmationResult(confirmationResult)
                    setCodeSent(true)

                }).catch((error) => {
                    console.log(error)
                })
        } catch (e) {
            console.log(e)
            setAuthError(true)
        }
    }
    if (!props.isVerified) {
        return (
            <div className="authBox">
                
                {showInput ?
                    <div className="phoneBox">
                        
                            <><label htmlFor="phoneInput">Phone Number:</label>
                                <input id="phoneInput" disabled={codeSent} value={phoneInput} title="phone" type={"tel"} onChange={(e) => phoneFormat(e.target.value)} />
                                <button onClick={handleSignIn} disabled={phoneInput.length !== 19}>Send Code</button></>
                            {codeSent?<>
                                <p>Code Sent!</p>
                                <label htmlFor="verificationCodeInput">Verification Code:</label>
                                <input id="verificationCodeInput" maxLength={6} title="verification code" onChange={(e) => setVerificationCodeInput(e.target.value)} />
                                <button onClick={handleConfirmation} disabled={verificationCodeInput.length !== 6}>Log In</button>
                                </>:<></>}
                    </div>
                    : <p><b>Please Log In "test:+13333334444", </b><br />Your changes will not be saved.</p>
                }
                <div id="g-recaptcha" data-sitekey="6LeCqiofAAAAALCzbTJyqOzafiV6rsiL-G3NpMpd" />
                {authError ? " There was an error signing into your profile." : ""}
            </div>
        );
    } else {
        return (
            <div></div>
        )
    }
}
export default PhoneLogin