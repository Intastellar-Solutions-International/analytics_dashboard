import "./Style.css";
const useParams = window.ReactRouterDOM.useParams;
export default function Select(props){
    const { handle } = useParams();
    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    return <>
        <div className="selectorContianer">
            {(props?.title) ? <label htmlFor={(handle) ? handle : props?.defaultValue} className="selectTitle">{props.title}</label> : null}
            <div className="selector">
                
                <select name={(handle) ? handle : props?.defaultValue} value={(handle) ? handle : props?.defaultValue} onChange={props.onChange}>
                    {
                        props?.items?.map((item, key) => {
                            if(isJson(item)){
                                item = JSON.parse(item);
                                return <>
                                    <option key={item.id} value={JSON.stringify({ id: item.id, name: item.name })}>{item.name}</option>
                                </>
                                
                            }else {
                                return <>
                                    <option key={item} value={item}>{item}</option>
                                </> 
                            }
                            
                        })
                    }
                </select>
            </div>
        </div>
    </>
}