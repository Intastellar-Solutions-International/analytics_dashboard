import "./Style.css";
export default function Email(props){
    return(
        <>
            <input className="intInput" autoComplete="off" type="email" onChange={props.onChange} />
        </>
    )
}