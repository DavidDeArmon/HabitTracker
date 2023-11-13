import './App.css';
import React from 'react';
// import Calender from './Tiles/Calender'
import Today from './Tiles/Today'
import Habits from './Tiles/Habits'
import UserPane from './Tiles/UserPane'
import { UserCredential, RecaptchaVerifier, } from 'firebase/auth';



declare global {
  interface Window { recaptchaVerifier: RecaptchaVerifier; }
}
interface iProps { }
interface myState {
  recapSolved: boolean,
  isVerified: boolean,
  userID: string | null,
  userPhoneNumber: string | null,
  selectedDate: Date
}


class App extends React.Component<iProps, myState> {

  constructor(props: iProps) {
    super(props)
    this.state = {
      recapSolved: false,
      isVerified: false,
      userID: null,
      userPhoneNumber: null,
      selectedDate: new Date()
    }
    this.setUserInfo = this.setUserInfo.bind(this)
    this.setDate = this.setDate.bind(this)
  }

  setUserInfo(newLogin: UserCredential) {
    this.setState({
      userID: newLogin.user.uid,
      userPhoneNumber: newLogin.user.phoneNumber,
      isVerified: true
    })
  }

  setDate(newDate: Date) {
    this.setState({ 
      selectedDate: newDate 
    })
  }


  render() {
    const {userID,userPhoneNumber,isVerified,selectedDate} = this.state
    const userProps = {
      userID,
      userPhoneNumber,
      isVerified,
      selectedDate
    }

    
    return (
      <div className="App">
        <div className='main'>
          <div className="tile">
            <h2 className='heading'>Habit Tracker</h2>
            <UserPane {...userProps} setUserInfo={this.setUserInfo}/>
            <Today {...userProps} setDate={this.setDate}/>
            <h3 className='heading'>Habits</h3>
            <Habits {...userProps} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
