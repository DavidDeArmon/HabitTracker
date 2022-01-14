type myProps={
    superPass:string
}
function Habits(props:React.PropsWithChildren<myProps>) {
    function renderWeek () {
        return <p>Week</p>
    }
    return (
        <div className="habits">
            <p>SuperText</p>
            <div>
                {renderWeek()}
                <button>Add Habit</button>
            </div>
        </div>
    );
  }
  export default Habits