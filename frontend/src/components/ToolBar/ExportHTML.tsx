import {useEditorStore} from "../../store/useEditorStore.ts";


const ExportHtml = () => {
    const elements = useEditorStore(state => state.elements);
    const canvasHeight = useEditorStore(state => state.canvasHeight);
    const canvasWidth = useEditorStore(state => state.canvasWidth);
    const exportHTML = () => {
        const s: string[] = []

        elements.forEach(element => {

            const baseStyle = `
            position:absolute;
            left:${element.x}px;
            top:${element.y}px;
            width:${element.width}px;
            height:${element.height}px;
            background:${element.styles.background};
            border-radius:${element.styles.borderRadius};
            box-sizing:border-box;
            `

            if (element.type === "text") {
                s.push(`
            <div style="
            ${baseStyle}
            color:${element.styles.color};
            font-size:${element.styles.fontSize};
            font-weight:${element.styles.fontWeight};
            overflow-wrap:break-word;
            ">
            ${element.text}
            </div>
            `)
                        }

            if (element.type === "img") {
                s.push(`<div>
            <img
            src="${element.src}"
            style="
            ${baseStyle}
            
            "
            />
            </div>
            `)
                        }

        })

        const html = `
<div style="
width:${canvasWidth}px;
height:${canvasHeight}px;
border:1px solid black;
margin:5px;
position:relative;
box-sizing:border-box;
">
${s.join("")}
</div>
`

        navigator.clipboard.writeText(html)
    }


    return (
        <div>
            <button onClick={()=>exportHTML()}> Экспортировать HTML(в буфер обмена)</button>
        </div>
    );
};

export default ExportHtml;