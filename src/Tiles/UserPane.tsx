import React from 'react';
import { fireDB, fireAuth } from '../firebaseConfig'
import { UserCredential, RecaptchaVerifier, } from 'firebase/auth';
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import PhoneLogin from './PhoneLogin';

interface iProps {
    userID: string | null,
    userPhoneNumber: string | null
}
interface myState {
    recapSolved: boolean,
    isVerified: boolean,
    userID: string | null,
    userPhoneNumber: string | null,
    displayName: string | null,
    selectedDate: Date
}
class UserPane extends React.Component<iProps, myState> {
    constructor(props: iProps) {
        super(props)
        this.state = {
            recapSolved: false,
            isVerified: false,
            userID: null,
            userPhoneNumber: null,
            displayName:null,
            selectedDate: new Date()
        }
        this.getUserInfo = this.getUserInfo.bind(this)
    }
    componentDidMount() {

        //create a verifier if it doesn't exists, if it does then try to render recaptcha.
        if (window.recaptchaVerifier === undefined) try {
            window.recaptchaVerifier = new RecaptchaVerifier("g-recaptcha", {
                'size': 'small',
                'callback': (response: any) => {
                    this.setState({ recapSolved: true })
                    console.log('reCaptcha solved')
                }
            }, fireAuth)
            window.recaptchaVerifier.render().catch((error) => {
                console.log(error, window.recaptchaVerifier)
            })
        } catch (e) {
            console.log(e)
        }
    }

    logOut(): void {
        this.setState({
            userID: null,
            userPhoneNumber: null,
            isVerified: false
        })
        console.log("logOut")
    }

    async getUserInfo(newLogin: UserCredential): Promise<object> {
        this.setState({
            userID: newLogin.user.uid,
            userPhoneNumber: newLogin.user.phoneNumber,
            isVerified: true
        })
        let userInfo = {
            displayName: null,
            phoneNumber: null,
        }
        const queryGetUserInfo = query(collection(fireDB, "users"), where("uid", "==", this.props.userID), limit(1));
        await getDocs(queryGetUserInfo).then((results) => {
            results.forEach((entry) => {
                let doc = entry.data();
                userInfo.displayName = doc.displayName;
                userInfo.phoneNumber = doc.phoneNumber
            })
        });
        return userInfo
    }
    render() {
        const loginProps = {
            getUserInfo: this.getUserInfo,
            isVerified: this.state.isVerified,
            recapSolved: this.state.recapSolved
        }

        let phoneNumber = this.state.userPhoneNumber
        let displayName = this.state.displayName
        if (this.props.userPhoneNumber != null) phoneNumber = phoneNumber = phoneNumber!.substring(0, 2) + ' (' + phoneNumber!.substring(2, 5) + ') ' + phoneNumber!.substring(5, 8) + ' - ' + phoneNumber!.substring(8, 12);
        let phonePane = <PhoneLogin {...loginProps} />;
        
        if (this.state.recapSolved && this.state.isVerified) {
            phonePane = <p>Logged In:<br />{displayName? displayName: phoneNumber}</p>
        }
        return (
            <div>
                <div hidden={this.state.recapSolved} title="recaptcha checkbox" id="g-recaptcha" data-sitekey="6LeCqiofAAAAALCzbTJyqOzafiV6rsiL-G3NpMpd" />
                {phonePane}
                <button id="phoneInput" onClick={() => this.logOut()}>Log Out</button>
            </div>
        )
    }
}
export default UserPane