import { collection, addDoc, setDoc, doc, getDocs, query, where, limit, Timestamp} from "firebase/firestore";
import { useEffect, useState,forwardRef } from "react";
import { fireDB } from '../firebaseConfig'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface myProps {
    userID: string | null
    isVerified: boolean
    selectedDate: Date
    setDate:(newDate: Date)=>void
}

const ExampleCustomInput = forwardRef<HTMLButtonElement, any>(({ value, onClick }, ref) => (
    <>
      <button className="dateSelectionButton" ref={ref} onClick={onClick}>{value}</button>
    </>
  ));

function Today(props: React.PropsWithChildren<myProps>) {
    const [savedMood, setMood] = useState('n/a')
    const [selectedMoodDoc, setSelectedMoodDoc] = useState("")

    useEffect(() => {
        GetMood()
    })

    async function AddMood(newMood: string) {
        if (props.isVerified && props.userID) try {
            let writeData = {
                date: Timestamp.fromDate(props.selectedDate),
                mood: newMood,
                uid: props.userID,
            }
            if(selectedMoodDoc){
                let documentReference = doc(fireDB, "users", props.userID, "MoodRecords", selectedMoodDoc)
                await setDoc(documentReference, writeData)
            }else{
                let userMoodCollection = collection(fireDB, "users", props.userID, "MoodRecords")
                let moodDocument = await addDoc(userMoodCollection, writeData);
                setSelectedMoodDoc(moodDocument.id);
            }

        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    async function GetMood() {
        if (props.isVerified && props.userID) try {

            let queryDate = props.selectedDate
            queryDate.setHours(0, 0, 0, 0)
            let startOfSelectedDate = Timestamp.fromDate(queryDate)
            queryDate.setHours(23, 59, 59, 0)
            let endOfSelectedDate = Timestamp.fromDate(queryDate)

            const queryGetUsersMoods = query(collection(fireDB, "users", props.userID, "MoodRecords"), where("date", ">=", startOfSelectedDate), where("date", "<=", endOfSelectedDate), limit(1));
            await getDocs(queryGetUsersMoods).then((results) => {
                let newMood = "n/a";
                results.forEach((entry) => {
                    let doc = entry.data();
                    if (doc && doc['mood']) {
                        newMood = doc['mood'];
                        setSelectedMoodDoc(doc['ref']);
                    }
                })
                setMood(newMood);
            });

        } catch (e) {
            console.error("Error reading document: ", e);
            setMood('n/a')
        }
        return savedMood
    }

    function MoodSelecter() {
        const possibleMoods = ["Great", "Good", "Okay", "Bad"]
        let moodButtons = possibleMoods.map((e, i) => {
            let disableButton = (e === savedMood);
            return <button className="moodOption" disabled={disableButton} key={i} onClick={() => AddMood(e)}>{e}</button>
        })
        return moodButtons;
    }

    return (
        <div className="today">
            <DatePicker selected={props.selectedDate} onChange={(dt: Date) => props.setDate(dt)} customInput={<ExampleCustomInput />} />
            <p>
                <b>What's your mood today?</b>
                <br /><small>{savedMood}</small>
            </p>
            <div>
                {MoodSelecter()}
            </div>
        </div>
    );
}
export default Today

