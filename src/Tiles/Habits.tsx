import { useState, useEffect } from "react";
import { collection, query, where, addDoc, getDocs } from "firebase/firestore";
import { fireDB as db } from '../firebaseConfig'

type myProps = {
    superPass: string
}
function Habits(props: React.PropsWithChildren<myProps>) {
    const [habit, setHabit] = useState('')
    const [habitList, setList] = useState([''])
    const [dateSel, setdateSel] = useState(new Date())
    useEffect(() => { setdateSel(new Date()) }, [habit])
    async function AddMood(newHabit: string) {
        let date = new Date()
        try {
            const docRef = await addDoc(collection(db, "habits"), {
                habitName: habit,
                user: props.superPass,
                date: date
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    async function getMoods(findHabit: string, date: Date) {
        const q = query(collection(db, "habits"), where("user", "==", props.superPass), where("habitName", "==", findHabit));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            let record = doc.data()
            habitList.push(record["date"])
            console.log(habitList)
        });
    }
    function renderWeek() {
        let week = habitList.map((e) => <p>{e}</p>)
        return <p>Week</p>
    }
    function handleButton() {
        getMoods(habit, dateSel)
    }
    function handleGet() {
        AddMood(habit)
    }
    function handleInput(input: string) {
        setHabit(input)
    }
    function handleDate() {
        let month = (dateSel.getMonth() + 1).toString()
        let x = month + "-" + dateSel.getDate() + "-" + dateSel.getFullYear()
        return <p>{x}</p>
    }
    return (
        <div className="habits">
            <p>SuperText</p>
            <div>
                <p>selected week</p>
                {renderWeek()}
                {handleDate()}
                <input value={habit} onInput={(e) => handleInput(e.currentTarget.value)} placeholder="habit"></input>
                <button onClick={handleButton}>Add Habit</button>
                <button onClick={handleGet}>Get Habits</button>
            </div>
        </div>
    );
}
export default Habits