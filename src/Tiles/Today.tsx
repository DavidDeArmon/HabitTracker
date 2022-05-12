import { User } from "firebase/auth";
import { collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { fireDB } from '../firebaseConfig'
interface myProps {
    user: User | null
    isVerified: boolean
}

function Today(props: React.PropsWithChildren<myProps>) {
    const [savedMood, setMood] = useState('')

    useEffect(() => {
        GetMood()
    },[savedMood])

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
            console.log("getMood")
            const newQuery = query(collection(fireDB, "mood"), where("uid", "==", props.user?.uid), orderBy("date","desc"), limit(1));
            const moodQuerySnapshot = await getDocs(newQuery);
            moodQuerySnapshot.forEach((entry) => {
                let doc = entry.data()
                let today = new Date()
                today.setHours(0, 0, 0, 0)
                console.log(doc)
                let isTodaysMood = (doc['date'] >= Timestamp.fromDate(today))
                console.log(isTodaysMood+ " docDate: "+ doc['date']+"today:"+Timestamp.fromDate(today))
                if (isTodaysMood) { setMood(doc['mood']) }
            })
        } catch (e) {
            console.error("Error reading document: ", e);
        }
        return savedMood
    }

    function moodSelecter() {
        const possibleMoods = ["Great", "Good", "Okay", "Bad"]
        let moodSelecter = possibleMoods.map((e, i) =>{
            let disableButton = (e===savedMood);
            return <button className="moodOption" disabled={disableButton} key={i} onClick={() => AddMood(e)}>{e}</button>
        })
        return moodSelecter;
    }
    return (
        <div className="today">
            <p>What's your mood today?</p>
            <h5>{savedMood}</h5>
            <p>Todays Date</p>
            <p>{new Date().toDateString()}</p>
            <div>
                <button >Add Mood</button>
                {moodSelecter()}
            </div>
        </div>
    );
}
export default Today

