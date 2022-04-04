import { User } from "firebase/auth";
import { collection, addDoc, doc, getDoc, DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { fireDB } from '../firebaseConfig'
interface myProps {
    user: User | null
}

function Today(props: React.PropsWithChildren<myProps>) {
    const [mood, setMood] = useState('')
    useEffect(() => {
        GetMood()
    })
    async function AddMood(newMood: string) {
        console.log(newMood)
        if (props.user) try {
            const docRef = await addDoc(collection(fireDB, "mood"), {
                day: "today",
                mood: newMood,
                uid: props.user.uid,
                value: 2022
            });
            console.log("Document written with ID: ", docRef.id, newMood);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    async function GetMood() {
        let docRef = doc(fireDB, "mood")
        const myCollection = await getDoc(docRef)
        const x: DocumentData | undefined = myCollection.data()
        if (x != undefined) setMood(x['mood'])
        return "mood"
    }
    function moodSelecter() {
        const possibleMoods = ["Great", "Good", "Okay", "Bad"]
        let x = possibleMoods.map((e, i) => <button className="moodOption" key={i} onClick={() => AddMood(e)}>{e}</button>)
        return x
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
        </div>
    );
}
export default Today