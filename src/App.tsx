import './App.css';
import React from 'react';
import Calender from './Tiles/Calender'
import Today from './Tiles/Today'
import Habits from './Tiles/Habits'
import PhoneLogin from './Tiles/PhoneLogin';
interface iProps{

}
interface myState {
  superPass:string
}
class App extends React.Component<iProps,myState> {
  constructor(props:iProps){
    super(props)
    this.state={superPass:''}
  }
  getSuperPass(){
    this.setState({superPass:"uLYOy2d9sfqLzHitNbgw"})
  }
  componentDidMount() {
    this.getSuperPass()
  }
  render(){
    return (
      <div className="App">
        <div className='main'>
        <div className="tile">
            <p className='heading'>Login</p>
           <PhoneLogin/>
          </div>
          {/* <div className="tile">
            <p className='heading'>Calendar</p>
            <Calender superPass={this.state.superPass}/>
          </div> */}
          <div className='tile'>
            <p className='heading'>Today</p>
            <Today superPass={this.state.superPass}/>
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
