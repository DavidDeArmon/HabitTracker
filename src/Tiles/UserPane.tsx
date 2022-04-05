import { User } from "firebase/auth"

function UserPane(props: React.PropsWithChildren<{ user: User | null }>) {
    if (props.user && props.user && props.user.phoneNumber) {
       let phoneNumber = props.user.phoneNumber
        if (props.user.phoneNumber != null) phoneNumber = phoneNumber = phoneNumber!.substring(0, 2) + ' (' + phoneNumber!.substring(2, 5) + ') ' + phoneNumber!.substring(5, 8) + ' - ' + phoneNumber!.substring(8, 12);
        return (
            <>
                <p>Logged In:<br />{phoneNumber}</p>
                <button id="phoneInput" >Log Out</button>
            </>
        )
    } else {
        return <>auth error</>
    }
}
export default UserPane