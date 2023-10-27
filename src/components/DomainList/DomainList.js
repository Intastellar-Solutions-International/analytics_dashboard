import "./DomainList.css";
import Button from "../Button/Button";
const { useState, useEffect, useRef, createContext } = React;
import SuccessWindow from "../SuccessWindow/index";
export default function DomainList(props){
    const currentDomain = props.domains;
    const [viewPopUp, setPopUp] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [savedDomains, setSavedDomains] = useState([]);

    function saveDomains(domains){
        setSavedDomains([...domains]);
        setPopUp(true);
        setSuccess(true);
    }

    return <>
        <div className="domain-list">
            <h2>Domains to add</h2>
            {
                (currentDomain.length === 0) ? "" : 
                <ul>
                    {
                        currentDomain.map((domain, index) => {
                            return <li key={index}>{domain}</li>
                        })
                    }
                </ul>
            }
            {
                (currentDomain.length > 0) ? 
                    <Button text="Save" onClick={ () => {
                        saveDomains(currentDomain);
                    }}  />
                : ""
            }
        </div>
        {
            (viewPopUp && success) ? 
            <SuccessWindow message={
                <>
                    <h2>Success!</h2>
                    <p>You have added the following domains:</p>
                    <ul>
                        {
                            savedDomains.map((domain, index) => {
                                return <li key={index}>{domain}</li>
                            })
                        }
                    </ul>
                </>
            } />
            : null
        }
    </>
}