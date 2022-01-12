import './App.css';
import Calender from './Tiles/Calender'
import Today from './Tiles/Today'
import Habits from './Tiles/Habits'

function App() {
  return (
    <div className="App">
      <div className='main'>
        <div className="tile">
          <a>Calander</a>
          <Calender />
        </div>
        <div className='tile'>
          <p>Today</p>
          <Today/>
        </div>
        <div className='tile'>
          <p >Habits</p>
          <Habits/>
        </div>
      </div>
    </div>
  );
}

export default App;
