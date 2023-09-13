import "./Style.css";
const useParams = window.ReactRouterDOM.useParams;
export default function Select(props){
    const { handle } = useParams();
    
    return <>
        <div className="selector">
            {(props?.title) ? <label>{props.title}</label> : null}
            <select name={(handle) ? handle : props?.defaultValue} value={(handle) ? handle : props?.defaultValue} onChange={props.onChange}>
                {
                    props?.items?.map((item, key) => {
                        item = (typeof item === "string") ? JSON.parse(item) : item;
                        if(typeof item === "string"){
                            return <>
                                <option key={item} value={item}>{item}</option>
                            </>
                        }else {
                            if(item.name){
                                return <>
                                    <option key={item.id} value={JSON.stringify({ id: item.id, name: item.name })}>{item.name}</option>
                                </>
                            }else{
                                let domain = (item[0] !== "") ? item[0] : null;
                                return <>
                                    
                                    <option key={domain} value={domain}>{domain}</option>
                                </>
                            }
                            
                        }
                        
                    })
                }
            </select>
        </div>
    </>
}