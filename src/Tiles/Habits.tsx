function Habits() {
    function renderWeek () {
        return <>Week</>
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