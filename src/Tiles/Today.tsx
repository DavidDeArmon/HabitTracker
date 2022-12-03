import { User } from "firebase/auth";
import { collection, addDoc, setDoc, doc, getDocs, query, where, limit, Timestamp} from "firebase/firestore";
import { useEffect, useState, forwardRef } from "react";
import { fireDB } from '../firebaseConfig'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


interface myProps {
    user: User | null
    isVerified: boolean
}


function Today(props: React.PropsWithChildren<myProps>) {
    const [savedMood, setMood] = useState('n/a')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedMoodDoc, setSelectedMoodDoc] = useState("")

    useEffect(() => {
        GetMood()
    })

    async function AddMood(newMood: string) {
        if (props.isVerified && props.user) try {
            let writeData = {
                date: Timestamp.fromDate(selectedDate),
                mood: newMood,
                uid: props.user.uid,
            }
            if(selectedMoodDoc){
                let documentReference = doc(fireDB, "users", props.user.uid, "moods", selectedMoodDoc)
                await setDoc(documentReference, writeData)
            }else{
                let userMoodCollection = collection(fireDB, "users", props.user.uid, "moods")
                let moodDocument = await addDoc(userMoodCollection, writeData);
                setSelectedMoodDoc(moodDocument.id);
            }

        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    async function GetMood() {
        if (props.isVerified && props.user) try {

            let queryDate = selectedDate
            queryDate.setHours(0, 0, 0, 0)
            let startOfSelectedDate = Timestamp.fromDate(queryDate)
            queryDate.setHours(23, 59, 59, 0)
            let endOfSelectedDate = Timestamp.fromDate(queryDate)

            const queryGetUsersMoods = query(collection(fireDB, "users", props.user.uid, "moods"), where("date", ">=", startOfSelectedDate), where("date", "<=", endOfSelectedDate), limit(1));
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

    const ExampleCustomInput = forwardRef<HTMLButtonElement, any>(({ value, onClick }, ref) => (
        <>
            <button className="dateSelectionButton" ref={ref} onClick={onClick}>{value}</button>
        </>
    ));


    return (
        <div className="today">
            <DatePicker selected={selectedDate} onChange={(date: Date) => setSelectedDate(date)} customInput={<ExampleCustomInput />} />
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

