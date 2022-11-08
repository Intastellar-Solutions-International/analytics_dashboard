import "./Widget.css";
export default function Widget(props) {
    return (
        <>
            <div className="widget">
                <h2 className="overvieTotal-num">{ props?.totalNumber }</h2>
                <p>{ props?.type }</p>
            </div>
        </>
    )
}