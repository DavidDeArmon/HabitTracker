import { collection, query, where, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import db from '../firestoreConfig'

interface myProps{
    superPass:any
}
function Calender(props:React.PropsWithChildren<myProps>) {
    const [Calender,setCalender] = useState([])
    const [myDate,setDate] = useState([])
    useEffect(()=>{
        makeMonth(34)
    },myDate)
    async function getMonthMoods(){
        const citiesRef = collection(db, "mood");

        const q = query(citiesRef, where("value", "==", 2022));
        const querySnapshot = await getDocs(q);
        let monthObjects:Array<object> = []
        await querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            monthObjects.push(doc.data())
        });
         let monthStrings:Array<string> = monthObjects.map((e:any) => e['mood'])
        return monthStrings
    }
    async function makeMonth(num:number) {
        const month:Promise<Array<string>> = getMonthMoods()
        const day:number = 1
        let monthArr:any = []
        let tempPos:number = 1
        for(let i = 0; i<num;i++){
            monthArr.push(<div key={i} className="dayBox">{day+i}</div>)
        }
        (await month).forEach((e,i)=>{
            monthArr.splice(tempPos,1,<div key={monthArr.length+i} className="dayBox">{e}</div>)
            tempPos++
        })
        // let renderMonth:any = (await month).map((e:any,i:number)=>{return <div key={i} className="dayBox"><p>{e['mood']}</p></div>})
        setCalender(monthArr)
        return monthArr
    }
    
    return (
        <div className="calender">
            {Calender}
        </div>
    );
  }
  export default Calender