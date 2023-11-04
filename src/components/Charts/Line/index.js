
export default function Line({data, title}){
    console.log(data);
    return(
        <>
            <div className="line-chart">
                <div className="chart">
                    {(data !== null) ? <h2>{title}</h2> : null}
                    <div id="my-chart">
                        <table className="charts-css line">
                            <thead>
                                <tr>
                                    <th scope="col">Day</th>
                                    <th scope="col">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.map((item, index) => {
                                        return(
                                            <tr key={index}>
                                                <td>{item.date}</td>
                                                <td style={{"--start": 0.2, "--end": item.num}}><span className="data">{item.num}</span></td>
                                            </tr>
                                        )
                                    })
                                
                                }
                            </tbody>
                        </table>
                        <ul className="charts-css legend">

                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}