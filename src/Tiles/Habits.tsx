import { useState, useEffect } from "react";
import { collection, setDoc, doc, getDocs, query, Timestamp } from "firebase/firestore";
import { fireDB } from '../firebaseConfig'

interface myProps {
    userID: string | null
    isVerified: boolean
    selectedDate: Date
}
function Habits(props: React.PropsWithChildren<myProps>) {
    const [habitNameInput, setHabit] = useState('')
    const [habitList, setList] = useState([''])

    useEffect(() => {
        getHabitList()
    })

    async function AddNewHabit() {
        if (props.isVerified && props.userID) try {
            let writeData = {
                dateAdded: Timestamp.now(),
                habitName: habitNameInput,
                habitType: "boolean",
            }
            if (habitNameInput.length > 2) {
                let documentReference = doc(fireDB, "users", props.userID, "HabitList", habitNameInput)
                await setDoc(documentReference, writeData)
            }

        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    async function getHabitList() {
        if (props.isVerified && props.userID) try {

            const queryGetUsersHabits = query(collection(fireDB, "users", props.userID, "HabitList"));
            let newHabitList: Array<string> = [];
            await getDocs(queryGetUsersHabits).then((results) => {
                results.forEach((entry) => {
                    let doc = entry.data();
                    if (doc && doc['habitName']) {
                        newHabitList.push(doc['habitName'])
                    }
                })
            });
            if (newHabitList.length > 0)
                setList(newHabitList);

        } catch (e) {
            console.error("Error reading document: ", e);
        }
    }

    async function recordHabitInstance(habitID:string) {

        return habitID

    }

    function renderHabitList() {
        let disableButton = false;
        let habitsMapped = habitList.map((e, index) => <button className="moodOption" disabled={disableButton} key={index} onClick={() => recordHabitInstance(e)}>{e}</button>)
        return habitsMapped
    }

    function handleHabitNameInput(input: string) {
        setHabit(input)
    }

    return (
        <div className="habits">
            <div>
                <div>
                    <p>Add a new habit to track:</p>
                    <input value={habitNameInput} onInput={(e) => handleHabitNameInput(e.currentTarget.value)} placeholder="Meditation"></input>
                    <button onClick={AddNewHabit}>Add Habit</button>
                </div>
                <p>Your Habits:</p>
                {renderHabitList()}
            </div>
        </div>
    );
}
export default Habits