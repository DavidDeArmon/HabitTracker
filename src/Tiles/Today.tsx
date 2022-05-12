import { User } from "firebase/auth";
import { collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp } from "firebase/firestore";
import { useEffect, useState, forwardRef, createRef } from "react";
import { fireDB } from '../firebaseConfig'
import DatePicker, { ReactDatePicker, ReactDatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
interface myProps {
    user: User | null
    isVerified: boolean
}

function Today(props: React.PropsWithChildren<myProps>) {
    const [savedMood, setMood] = useState('n/a')
    const [selectedDate, setSelectedDate] = useState(new Date)

    useEffect(() => {
        GetMood()
        return setSelectedDate(new Date)
    }, [savedMood])

    async function setDate(newDate: Date) {
        setSelectedDate(newDate)
        GetMood()
    }

    async function AddMood(newMood: string) {
        if (props.user) try {
            const docRef = await addDoc(collection(fireDB, "mood"), {
                date: Timestamp.now(),
                mood: newMood,
                uid: props.user.uid,
            });
            setMood(newMood)
            console.log("Document written with ID: ", docRef.id, newMood);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    async function GetMood() {
        if (props.isVerified) try {
            const newQuery = query(collection(fireDB, "mood"), where("uid", "==", props.user?.uid), orderBy("date", "desc"), limit(1));
            const moodQuerySnapshot = await getDocs(newQuery);
            moodQuerySnapshot.forEach((entry) => {
                let doc = entry.data()
                let today = selectedDate
                today.setHours(0, 0, 0, 0)
                console.log(doc)
                let isTodaysMood = (doc['date'] >= Timestamp.fromDate(today))
                console.log(isTodaysMood + " docDate: " + doc['date'] + "today:" + Timestamp.fromDate(today))
                if (isTodaysMood) { setMood(doc['mood']) }
            })
        } catch (e) {
            console.error("Error reading document: ", e);
        }
        return savedMood
    }

    function moodSelecter() {
        const possibleMoods = ["Great", "Good", "Okay", "Bad"]
        let moodSelecter = possibleMoods.map((e, i) => {
            let disableButton = (e === savedMood);
            return <button className="moodOption" disabled={disableButton} key={i} onClick={() => AddMood(e)}>{e}</button>
        })
        return moodSelecter;
    }
    const ExampleCustomInput = forwardRef<HTMLButtonElement, any>(({ value, onClick }, ref) => (
        <>
            <button className="dateSelectionButton" ref={ref} onClick={onClick}>{value}</button>
        </>
    ));
    return (
        <div className="today">
            <DatePicker selected={selectedDate} onChange={(dt: Date) => setDate(dt)} customInput={<ExampleCustomInput />} />
            <p>
                <b>What's your mood today?</b>
                <br /><small>{savedMood}</small>
            </p>

            <div>
                <button >Add Mood</button>
                {moodSelecter()}
            </div>
        </div>
    );
}
export default Today

