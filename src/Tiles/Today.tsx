import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs, doc, getDoc  } from "firebase/firestore"; 
import { useEffect, useState } from "react";
import db from '../firestoreConfig'
interface myProps{
    superPass:any
}
function Today(props:React.PropsWithChildren<myProps>) {
    const [mood,setMood] = useState('')
    useEffect(()=>{
        GetMood()
    })
    async function AddMood(newMood:string) {
        console.log(newMood)
        try {
            const docRef = await addDoc(collection(db, "mood"), {
              day: "today",
              mood: newMood,
              user:props.superPass,
              value: 2022
            });
            console.log("Document written with ID: ", docRef.id, newMood);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }
    async function GetMood() {
        let docRef = doc(db, "mood","mvVJnzgIR1uW1jfu8JbK")
        let e = await getDoc(docRef)
        const x:any = e.data()
        setMood(x['mood'])
        return "mood"
    }
    function moodSelecter(){
        const possibleMoods = ["Great","Good","Okay","Bad"]
        let x = possibleMoods.map((e,i)=><button className ="moodOption" key={i} onClick={()=>AddMood(e)}>{e}</button>)
        return x
    }
    function GetHabit(){
        return
    }
    return (
        <div className="today">
            <p>What's your mood today?</p>
            <h5>{mood}</h5>
            <p>Todays Date</p>
            <div>
                <button >Add Mood</button>
                {moodSelecter()}
            </div>
                <button onClick={GetHabit}>Track Habit</button>
        </div>
    );
  }
  export default Today