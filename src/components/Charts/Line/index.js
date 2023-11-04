import Table from "../../Tabel";

export default function Line({data, title}){
    data = data?.map((d, i) => {
        return {
            "name": new Intl.DateTimeFormat('da-DK').format(new Date(d.date)),
            "domain": d.num
        }
    })
    return(
        <>
            <div className="line-chart">
                <div className="chart">
                    {(data !== null) ? <h2>{title}</h2> : null}
                    {(data !== null) ? <Table data={data} headers={["Day", "Amount"]}  /> : null}
                </div>
            </div>
        </>
    )
}