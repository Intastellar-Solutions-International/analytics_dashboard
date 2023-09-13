const { useState, useEffect, useRef, useContext } = React;
import "./Style.css";
export default function UserProfile(props){
    return (
        <>
            <div className="user_content">
                <div className="dropdown-image-name">
                    <div className="dpde">Intastellar Accounts | Employee</div>
                    <div className="img" style={{position: "relative", width: "max-content", margin: "20px auto"}}>
                        <img src={props.profileImage} alt="" className="content-img" />
                    </div>
                    <div className="dropdown-name">
                        <div className="dpdn">Hi, {props.name}!</div>
                        <div className="dpde"></div>
                        <div className="acc">
                            <a href="https://my.intastellaraccounts.com" target="_blank"><img src="https://www.intastellarsolutions.com/assets/icons/fav/favicon-96x96.png" className="logo-icon" />Manage Your Intastellar Account</a>
                        </div>
                    </div>
                </div>
                <div className="dropdown-links">
                </div>
                <div className="sign_out_btn_container">
                    
                </div>
            </div>
        </>
    )
}