import "./Style.css";
export default function Highlighter(props){
    return <>
        <span class={"highlight " + props.type} >{props.children}</span>
    </>
}