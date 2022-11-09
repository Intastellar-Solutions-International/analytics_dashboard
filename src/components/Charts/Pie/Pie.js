import "./Style.css";
export default function PieChart(props) {
    const data = Object.keys(props.data);

    return (
        <>
            <div className="pieChart">
                {data?.map((chart, key) => {
                    return (
                        <>
                            <div className="" key={key}>{ data[chart] }</div>
                        </>
                    )
                })}
            </div>
        </>
    )
}