import {useAuth} from "../../../../contexts/AuthContext.tsx";

const Logout = () => {
    const {logout} = useAuth()
    return (
        <button onClick={logout} className="logout-button">ВЫЙТИ</button>
    );
};

export default Logout;