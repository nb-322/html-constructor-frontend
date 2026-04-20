import {useAuth} from "../../../../contexts/AuthContext.tsx";

const Logout = () => {
    const {logout} = useAuth()
    return (
        <div>
            <button onClick={logout}> ВЫЙТИ</button>
        </div>
    );
};

export default Logout;