import { User } from "firebase/auth"

function UserPane(props: React.PropsWithChildren<{ user: User | null }>) {
    
    function logOut(): void {
        console.log("logOut")
    }

    if (props.user && props.user.phoneNumber) {
       let phoneNumber = props.user.phoneNumber
        if (props.user.phoneNumber != null) phoneNumber = phoneNumber = phoneNumber!.substring(0, 2) + ' (' + phoneNumber!.substring(2, 5) + ') ' + phoneNumber!.substring(5, 8) + ' - ' + phoneNumber!.substring(8, 12);
        return (
            <div>
                <p>Logged In:<br />{phoneNumber}</p>
                <button id="phoneInput" onClick={()=>logOut()}>Log Out</button>
            </div>
        )
    } else {
        return <>auth error</>
    }
}
export default UserPane