import "./DomainList.css";
import Button from "../Button/Button";
const { useState, useEffect, useRef, createContext } = React;
import SuccessWindow from "../SuccessWindow/index";
import API from "../../API/api";
import Fetch from "../../Functions/fetch";
export default function DomainList(props){
    const currentDomain = props.domains;
    const [viewPopUp, setPopUp] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [savedDomains, setSavedDomains] = useState([]);
    const organisationId = (localStorage.getItem("organisation") != null) ? JSON.parse(localStorage.getItem("organisation")).id : null;

    function saveDomains(domains){

        Fetch(API.settings.addDomain.url, API.settings.addDomain.method,
            API.settings.addDomain.headers,
            JSON.stringify(
                {
                    organisationId: organisationId,
                    domains: domains
                }
            )
        ).then(
           re => {
                console.log(re);
                if(re === "success"){
                    setSuccess(true);
                    setPopUp(true);
                    setSavedDomains(domains);
                } else if(re === "error"){
                    setError(true);
                    setErrorMessage("Something went wrong, please try again later");
                } else {
                    setError(true);
                }
           }
        ).catch(setErrorMessage);

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