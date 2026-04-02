import './ToolBar.css'
import {useEditorStore} from "../../store/useEditorStore.ts";
import ExportHTML from "./ExportHTML.tsx";
const ToolBar = () => {
    const add = useEditorStore(s=>s.addElement);
    const del = useEditorStore(s=>s.removeElement);
    const selectedId = useEditorStore(s=>s.selectedId);
    return (
        <div className="ToolBar">
            <button style={{height:"100px", width:"250px"}} onClick={()=>add("img")}>Добавить картинку</button>
            <button style={{height:"100px", width:"250px"}} onClick={()=>add("text")}>Добавить текст</button>

            {selectedId && (<button style={{height:"100px", width:"250px"}} onClick={()=>del(selectedId)}>Удалить</button>)}
            <ExportHTML/>
        </div>
    );
};

export default ToolBar;