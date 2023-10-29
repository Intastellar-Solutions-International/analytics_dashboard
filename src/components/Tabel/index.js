import "./Style.css";
export default function Table(props){
    const data = props.data;
    const headers = props.headers;
    return <>
        <article className="table">
            <header className="table-header">
                <div className="table-row">
                    {
                        headers.map((d, i) => {
                            return <div className="table-cell" key={i}>{d}</div>
                        })
                    }
                </div>
            </header>
            <section className="table-body">
                {
                    <div className="table-row">
                        {
                            data.map((d, i) => {
                                return <>
                                    <div className="table-cell" key={i}>{d.name}</div>
                                    <div className="table-cell" key={i}>{d.domain}</div>
                                    <div className="table-cell" key={i}>{d.expires}</div>
                                </>
                            })
                        }
                    </div>
                }
            </section>
        </article>
    </>
}