import "./Style.css";
export default function SuccessWindow(props) {
    console.log(props.style)
    return (
        <>
            <div style={props?.style} className="successWindow">
                <div className="successWindow-content">
                    {props?.message}
                </div>
            </div>
        </>
    )
}