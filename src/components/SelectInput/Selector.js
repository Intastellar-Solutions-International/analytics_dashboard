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
        <div className="selector">
            {(props?.title) ? <label>{props.title}</label> : null}
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
    </>
}