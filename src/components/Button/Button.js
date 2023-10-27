export default function Button(props){
    return <>
        <button className="cta" onClick={props.onClick}>{props.text}</button>
    </>
}