import './App.css';
import React from 'react';
// import Calender from './Tiles/Calender'
import Today from './Tiles/Today'
import Habits from './Tiles/Habits'
import UserPane from './Tiles/UserPane'
import { UserCredential, RecaptchaVerifier, } from 'firebase/auth';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


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
const ExampleCustomInput = React.forwardRef<HTMLButtonElement, any>(({ value, onClick }, ref) => (
  <>
    <button className="dateSelectionButton" ref={ref} onClick={onClick}>{value}</button>
  </>
));

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
  }


  setUserInfo(newLogin: UserCredential) {

    this.setState({
      userID: newLogin.user.uid,
      userPhoneNumber: newLogin.user.phoneNumber,
      isVerified: true
    })
  }


  setDate(newDate: Date) {
    console.log("setDate : ", newDate)
    this.setState({ selectedDate: newDate })
  }


  render() {

    const userProps = {
      userID: this.state.userID,
      userPhoneNumber: this.state.userPhoneNumber,
      isVerified: this.state.isVerified
    }

    
    return (
      <div className="App">
        <div className='main'>
          <div className="tile">
            <h1 className='heading'>Profile</h1>
            <UserPane {...userProps} />
            <DatePicker selected={this.state.selectedDate} onChange={(dt: Date) => this.setDate(dt)} customInput={<ExampleCustomInput />} />
          </div>
          {/* <div className="tile">
            <h1 className='heading'>Calendar</h1>
            <Calender  />
          </div> */}
          <div className='tile'>
            <h1 className='heading'>Today</h1>
            <Today {...userProps} selectedDate={this.state.selectedDate} />
          </div>
          <div className='tile'>
            <h1 className='heading'>Habits</h1>
            <Habits {...userProps} selectedDate={this.state.selectedDate} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
