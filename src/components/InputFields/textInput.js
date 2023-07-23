import "./Style.css";
export default function Text(props){
    return(
        <>
            <input className="intInput" autoComplete="off" type="text" onChange={props.onChange} />
        </>
    )
}