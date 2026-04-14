import './ToolBar.css'
import {useEditorStore} from "../../store/useEditorStore.ts";
import ExportHTML from "./ExportHTML.tsx";
import { useNavigate} from "react-router-dom";
const ToolBar = () => {
    const add = useEditorStore(s=>s.addElement);
    const del = useEditorStore(s=>s.removeElement);
    const selectedId = useEditorStore(s=>s.selectedId);

    const navigate = useNavigate();

    return (
        <div className="ToolBar">
            <button className="toolbar-button" onClick={()=>add("img")}>Добавить картинку</button>
            <button className="toolbar-button" onClick={()=>add("text")}>Добавить текст</button>

            {selectedId && (<button className="toolbar-button" onClick={()=>del(selectedId)}>Удалить</button>)}
            <button className="toolbar-button" onClick={()=>navigate('/main', { replace: true })}>Выйти на глав экран</button>
            <ExportHTML/>
        </div>
    );
};

export default ToolBar;