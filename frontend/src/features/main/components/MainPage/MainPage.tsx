import Logout from "../../../auth/components/Logout/Logout.tsx";
import {useAuth} from "../../../../contexts/AuthContext.tsx";
import {useNavigate} from "react-router-dom";

const MainPage = () => {
    const user = useAuth()
    const navigate = useNavigate();
    if (user) {
        console.log(user);
    }
    return (
        <div style={{ display: "flex", flexDirection: "row", width: "100%", height:"100vh" ,alignItems: "center",justifyContent: "center", margin:"0"}}>
                <div style={{width:"15%", height:"100%", display:"flex", flexDirection:"column", justifyContent:"space-between", alignItems:"center", backgroundColor:"cyan" }}>
                    <div style={{background:"black"}}>
                        <p style={{color:"white"}}>Роль: {user.user?.role}</p>
                        <p style={{color:"white"}}>Имя: {user.user?.name}</p>
                    </div>
                    <Logout/>
                </div>
                <div style={{width:"85%", display:"flex", flexDirection:"row",alignItems:"center",justifyContent:"center"}}><button style={{fontSize:"100px",backgroundColor:"inherit", border:"solid 1px black", fontStyle:"bold"}} onClick={()=> navigate('/editor')}>+</button></div>

        </div>
    );
};

export default MainPage;