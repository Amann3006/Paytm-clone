import { Appbar } from "../components/AppbarTemp"
import { Balance } from "../components/Balance"
import { Users } from "../components/Userstemp"

export const Dashboard = () => {
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={"10,000"} />
            <Users />
        </div>
    </div>
}