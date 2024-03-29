import { useState } from "react";
import { fireAuth } from "../firebaseConfig"
import { signInWithPhoneNumber, UserCredential, ConfirmationResult } from "firebase/auth";

interface myProps {
    getUserInfo: (newLogin: UserCredential) => void,
    isVerified: boolean,
    recapSolved: boolean,
}
function PhoneLogin(props: React.PropsWithChildren<myProps>) {
    const [authError, setAuthError] = useState(false)
    const [phoneInput, setPhoneInput] = useState('+1')
    const [codeSent, setCodeSent] = useState(false)
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult>()
    const [verificationCodeInput, setVerificationCodeInput] = useState('')

    function phoneFormat(input: string) {
        // A function to format text to look like a phone number
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
        try {
            confirmationResult!.confirm(verificationCodeInput).then((result) => {
                props.getUserInfo(result)
            })
        }
        catch (e) {
            console.log(e)
            setAuthError(true)
        }
    }

    async function handleSendCode(): Promise<void> {
        try {
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
    
    let displayDiv = <p><b>Please Log In "test:+13333334444", </b><br />Your changes will not be saved.</p>
    if (props.isVerified) {
        displayDiv = <></>
    } else if(props.recapSolved) {
        displayDiv = <div className="phoneBox">
            <label htmlFor="phoneInput">Phone Number:</label>
            <input id="phoneInput" disabled={codeSent} value={phoneInput} title="phone" type={"tel"} onChange={(e) => phoneFormat(e.target.value)} />
            <button onClick={handleSendCode} disabled={phoneInput.length !== 19}>Send Code</button>
        </div>
    }
    if (codeSent) displayDiv = <div className="phoneBox">
        <b>Code Sent!</b>
        <label htmlFor="verificationCodeInput">Verification Code:</label>
        <input id="verificationCodeInput" maxLength={6} title="verification code" onChange={(e) => setVerificationCodeInput(e.target.value)} />
        <button onClick={handleConfirmation} disabled={verificationCodeInput.length !== 6}>Log In</button>
    </div>
    return (
        <div className="authBox">
            {displayDiv}
            {authError ? " There was an error signing into your profile." : ""}
        </div>
    );

}
export default PhoneLogin