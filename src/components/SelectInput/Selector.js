import "./Style.css";
export default function Select(props){
    return <>
        <div className="selector">
            <select >
                {
                    props.items.map((item, key) => {
                        item = JSON.parse(item);
                        console.log(item);
                        return <>
                            <option key={key} value={JSON.stringify({ id: item.id, name: item.name })}>{item.name}</option>
                        </>
                    })
                }
            </select>
        </div>
    </>
}