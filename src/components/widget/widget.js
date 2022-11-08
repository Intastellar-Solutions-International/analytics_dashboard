import "./Widget.css";
export default function Widget(props) {
    const overViewTotal = (props?.overviewTotal) ? " overviewTotal" : " overviewDistribution";
    return (
        <>
            <div className={"widget" + overViewTotal}>
                <h2 className="overvieTotal-num">{ props?.totalNumber }</h2>
                <p>{ props?.type }</p>
            </div>
        </>
    )
}