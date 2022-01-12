function Calender() {
    function makeMonth(num:number) {
        let month = []
        for(let i=0;i<num;i++) month.push(<div key={i} className="dayBox"></div>)
        return month 
    }
    return (
        <div className="calender">
            {makeMonth(30)}
        </div>
    );
  }
  export default Calender