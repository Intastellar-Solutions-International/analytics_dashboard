export default function Button(props){
    return <>
        <button className="cta" disabled={props.disabled} onClick={props?.onClick}>{props.text}</button>
    </>
}