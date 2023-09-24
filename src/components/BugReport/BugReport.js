const { useState, useEffect, useRef, useContext } = React;
import "./BugReport.css"
export default function BugReport(){
    const [isOpen, setIsOpen] = useState(false);

    function openMenu(){
        setIsOpen(!isOpen);
    }

    function clickOutSide(e){
        if(e.target.className !== "send-feedback" && e.target.className !== "bugReport-input" && e.target.className !== "bugReport-send"){
            setIsOpen(false);
        }
    }

    function sendFeedback(e){
        e.preventDefault();
        setIsOpen(false);

    }

    useEffect(() => {
        document.addEventListener("click", clickOutSide);
    }
    , []);

    return <>
        <div className="bug-container">
            {(isOpen) ?
            <div className="bug-menu">
                <div className="bug-menu-header">
                    <h2>Feedback</h2>
                </div>
                <div className="bug-menu-body">
                    <p>Thank you for your feedback. We will try to fix the problem as soon as possible.</p>
                    <form className="bugSubmitForm" onSubmit={sendFeedback}>
                        <textarea className="bugReport-input" col="50" placeholder="Please describe your problem here..."></textarea>
                        <button className="bugReport-send">Send feedback</button>
                    </form>
                </div>
            </div> : null
            }
            <button className="send-feedback" onClick={openMenu}>
                Feedback
            </button>
        </div>
    </>
}