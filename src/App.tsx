import './App.css';
import React from 'react';
import Calender from './Tiles/Calender'
import Today from './Tiles/Today'
import Habits from './Tiles/Habits'
import PhoneLogin from './Tiles/PhoneLogin';
import UserPane from './Tiles/UserPane'
import { User, UserCredential } from 'firebase/auth';
interface iProps { }
interface myState {
  isVerified: boolean
  user: User|null
}
class App extends React.Component<iProps, myState> {
  constructor(props: iProps) {
    super(props)
    this.state = {
      isVerified: false,
      user:null,
    }
    this.genUserInfo = this.genUserInfo.bind(this)
  }
  genUserInfo(newLogin: UserCredential) {
    let userData:User = newLogin.user
    this.setState({ 
      user: userData,
      isVerified:true
    })
  }
  render() {
    const userProps = {
      user:this.state.user,
      isVerified:this.state.isVerified
    }
    const loginProps = {
      genUserInfo: this.genUserInfo
    }
    return (
      <div className="App">
        <div className='main'>
          <div className="tile">
            <h1 className='heading'>Profile</h1>
            {this.state.isVerified ? <UserPane {...userProps} />:<PhoneLogin {...loginProps} />}
          </div>
          {/* <div className="tile">
            <h1 className='heading'>Calendar</h1>
            <Calender superPass={this.state.superPass}/>
          </div> */}
          <div className='tile'>
            <h1 className='heading'>Today</h1>
            <Today user={this.state.user}/>
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
