import "./Style.css";
export default function SuccessWindow(props) {
    return (
        <>
            <div style={props.style} className="successWindow">
                <div className="successWindow-content">
                    {props?.message}
                </div>
            </div>
        </>
    )
}