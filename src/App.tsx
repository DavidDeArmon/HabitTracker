import './App.css';
import React from 'react';
import Calender from './Tiles/Calender'
import Today from './Tiles/Today'
import Habits from './Tiles/Habits'
import PhoneLogin from './Tiles/PhoneLogin';
import UserPane from './Tiles/UserPane'
import { fireAuth } from "./firebaseConfig"
import { User, UserCredential, RecaptchaVerifier, } from 'firebase/auth';
declare global {
  interface Window { recaptchaVerifier: RecaptchaVerifier; }
}
interface iProps { }
interface myState {
  recapSolved: boolean,
  isVerified: boolean,
  user: User | null
}
class App extends React.Component<iProps, myState> {

  constructor(props: iProps) {
    super(props)
    this.state = {
      recapSolved: false,
      isVerified: false,
      user: null,
    }
    this.genUserInfo = this.genUserInfo.bind(this)
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

  genUserInfo(newLogin: UserCredential) {

    let userData: User = newLogin.user
    this.setState({
      user: userData,
      isVerified: true
    })
  }

  render() {

    const userProps = {
      user: this.state.user,
      isVerified: this.state.isVerified
    }

    const loginProps = {
      genUserInfo: this.genUserInfo,
      isVerified: this.state.isVerified,
      showInput: this.state.recapSolved
    }

    return (
      <div className="App">
        <div className='main'>
          <div className="tile">
            <h1 className='heading'>Profile</h1>
            <div hidden={this.state.recapSolved} title="recaptcha checkbox" id="g-recaptcha" data-sitekey="6LeCqiofAAAAALCzbTJyqOzafiV6rsiL-G3NpMpd" />
            <PhoneLogin {...loginProps} />
            {this.state.recapSolved ?
              this.state.isVerified ? <UserPane {...userProps} /> : <></>
              : <></>}
          </div>
          {/* <div className="tile">
            <h1 className='heading'>Calendar</h1>
            <Calender  />
          </div> */}
          <div className='tile'>
            <h1 className='heading'>Today</h1>
            <Today user={this.state.user} isVerified={this.state.isVerified} />
          </div>
          {/* <div className='tile'>
            <p className='heading'>Habits</p>
            <Habits superPass={this.state.superPass}/>
          </div> */}
        </div>
      </div>
    );
  }
}

export default App;
