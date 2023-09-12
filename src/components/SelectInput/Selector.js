import "./Style.css";
export default function Select(props){
    return <>
        <div className="selector">
            <select onChange={props.onChange}>
                {
                    props?.items?.map((item, key) => {
                        item = (typeof item === "string") ? JSON.parse(item) : item;
                        if(typeof item === "string"){
                            return <>
                                <option key={key} value={item}>{item}</option>
                            </>
                        }else {
                            if(item.name){
                                return <>
                                    <option key={key} value={JSON.stringify({ id: item.id, name: item.name })}>{item.name}</option>
                                </>
                            }else{
                                return <>
                                    <option key={key} value={item[0]}>{item[0]}</option>
                                </>
                            }
                            
                        }
                        
                    })
                }
            </select>
        </div>
    </>
}