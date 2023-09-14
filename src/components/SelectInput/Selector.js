const { useState, useEffect, useRef, useContext } = React;
import "./Style.css";
const useParams = window.ReactRouterDOM.useParams;
export default function Select(props){
    const [isOpen, setIsOpen] = useState(false);
    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function openMenu(){
        setIsOpen(!isOpen);
    }

    function clickOutSide(e){
        if(e.target.className !== "dropdown-menu-button"){
            setIsOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("click", clickOutSide);
    }, []);

    return <>
        <div className="selectorContianer">
            <div className="selector">
                <button className="dropdown-menu-button" onClick={openMenu}>{(isJson(props.defaultValue) ? JSON.parse(props.defaultValue).name : props.defaultValue)}</button>
                {(isOpen) ? 
                <div className="dropdown-menu">
                    <ul className="dropdown-menu__content" style={props.style}>
                        {
                            props?.items?.map((item, key) => {
                                if(isJson(item)){
                                    item = JSON.parse(item);
                                    return <>
                                        <li onClick={() => props.onChange(JSON.stringify({ id: item.id, name: item.name }))} key={item.id}>{item.name}</li>
                                    </> 
                                }else {
                                    return <>
                                        <li onClick={(e) => props.onChange(e.target.innerText)} key={item} value={item}>{item}</li>
                                    </>
                                }
                            })
                        }
                    </ul>
                </div> : null
                }
            </div>
        </div>
    </>
}