import Authentication from "../../Authentication/Auth";
import "./Style.css";
const { useState, useEffect, useRef, useContext } = window.React;
const Link = window.ReactRouterDOM.Link;
export default function Account(props){
    function clickOutSide(e){
        if(e.target.className !== "user_content" || e.target.className !== "content-img"){
            props.setIsOpen(false);
        }
    }

    /* useEffect(() => {
        document.addEventListener("click", clickOutSide);
    }, []); */

    console.log(JSON.parse(localStorage.getItem("globals"))?.access.type);

    return  <>
        <div className="user_content">
            <div className="dropdown-image-name">
                <div className="dpde">
                    <svg className="intastellaraccounts-logo" viewBox="0 0 2939.64 480.18"><g id="Layer_4"><path d="m1154.98,442.31c0,24.75-15.04,37.87-33.39,37.87s-32.32-14.72-32.32-36.48c0-22.83,14.19-37.77,33.39-37.77s32.32,15.04,32.32,36.38Zm-55.79,1.17c0,15.36,8.32,29.12,22.94,29.12s23.04-13.55,23.04-29.87c0-14.29-7.47-29.23-22.94-29.23s-23.04,14.19-23.04,29.98Z" style={{fill:"#222d64"}}></path><path d="m1168.54,441.35c0-5.33-.11-9.71-.43-13.97h8.32l.53,8.53h.21c2.56-4.91,8.53-9.71,17.07-9.71,7.15,0,18.24,4.27,18.24,21.97v30.83h-9.39v-29.76c0-8.32-3.09-15.26-11.95-15.26-6.19,0-10.99,4.37-12.59,9.6-.43,1.17-.64,2.77-.64,4.37v31.04h-9.39v-37.66Z" style={{fill:"#222d64"}}></path><path d="m1234.79,454.9c.21,12.69,8.32,17.92,17.71,17.92,6.72,0,10.77-1.17,14.29-2.67l1.6,6.72c-3.31,1.49-8.96,3.2-17.18,3.2-15.9,0-25.39-10.45-25.39-26.03s9.17-27.84,24.22-27.84c16.86,0,21.34,14.83,21.34,24.32,0,1.92-.21,3.41-.32,4.37h-36.27Zm27.52-6.72c.11-5.97-2.45-15.25-13.01-15.25-9.49,0-13.65,8.75-14.4,15.25h27.42Z" style={{fill:"#222d64"}}></path><path d="m1321.2,456.39l-7.47,22.62h-9.6l24.43-71.9h11.2l24.54,71.9h-9.92l-7.68-22.62h-25.5Zm23.58-7.25l-7.04-20.7c-1.6-4.69-2.67-8.96-3.73-13.12h-.21c-1.07,4.27-2.24,8.64-3.63,13.01l-7.04,20.8h21.66Z" style={{fill:"#222d64"}}></path><path d="m1411.88,477.09c-2.45,1.28-7.89,2.99-14.83,2.99-15.57,0-25.71-10.56-25.71-26.35s10.88-27.41,27.74-27.41c5.55,0,10.45,1.39,13.01,2.67l-2.13,7.26c-2.24-1.28-5.76-2.45-10.88-2.45-11.84,0-18.24,8.75-18.24,19.52,0,11.95,7.68,19.31,17.92,19.31,5.33,0,8.85-1.39,11.52-2.56l1.6,7.04Z" style={{fill:"#222d64"}}></path><path d="m1460.85,477.09c-2.45,1.28-7.89,2.99-14.83,2.99-15.57,0-25.71-10.56-25.71-26.35s10.88-27.41,27.74-27.41c5.55,0,10.45,1.39,13.01,2.67l-2.13,7.26c-2.24-1.28-5.76-2.45-10.88-2.45-11.84,0-18.24,8.75-18.24,19.52,0,11.95,7.68,19.31,17.92,19.31,5.33,0,8.85-1.39,11.52-2.56l1.6,7.04Z" style={{fill:"#222d64"}}></path><path d="m1519.73,452.77c0,19.09-13.23,27.42-25.71,27.42-13.97,0-24.75-10.24-24.75-26.56,0-17.28,11.31-27.42,25.6-27.42s24.86,10.77,24.86,26.56Zm-40.96.53c0,11.31,6.51,19.84,15.68,19.84s15.68-8.43,15.68-20.05c0-8.75-4.37-19.84-15.47-19.84s-15.9,10.24-15.9,20.06Z" style={{fill:"#222d64"}}></path><path d="m1576.6,464.93c0,5.33.11,10.03.43,14.08h-8.32l-.53-8.43h-.21c-2.45,4.16-7.89,9.6-17.07,9.6-8.11,0-17.82-4.48-17.82-22.62v-30.19h9.39v28.59c0,9.81,2.99,16.43,11.52,16.43,6.29,0,10.67-4.37,12.37-8.53.53-1.39.85-3.09.85-4.8v-31.68h9.39v37.55Z" style={{fill:"#222d64"}}></path><path d="m1593.99,441.35c0-5.33-.11-9.71-.43-13.97h8.32l.53,8.53h.21c2.56-4.91,8.53-9.71,17.07-9.71,7.15,0,18.24,4.27,18.24,21.97v30.83h-9.39v-29.76c0-8.32-3.09-15.26-11.95-15.26-6.19,0-10.99,4.37-12.59,9.6-.43,1.17-.64,2.77-.64,4.37v31.04h-9.39v-37.66Z" style={{fill:"#222d64"}}></path><path d="m1665.89,412.55v14.83h13.44v7.15h-13.44v27.84c0,6.4,1.81,10.03,7.04,10.03,2.45,0,4.27-.32,5.44-.64l.43,7.04c-1.81.75-4.69,1.28-8.32,1.28-4.37,0-7.89-1.39-10.13-3.95-2.67-2.77-3.63-7.36-3.63-13.44v-28.16h-8v-7.15h8v-12.37l9.17-2.45Z" style={{fill:"#222d64"}}></path><path d="m1744.73,479.01l-.75-6.51h-.32c-2.88,4.05-8.43,7.68-15.79,7.68-10.45,0-15.79-7.36-15.79-14.83,0-12.48,11.09-19.31,31.04-19.2v-1.07c0-4.27-1.17-11.95-11.73-11.95-4.8,0-9.81,1.49-13.44,3.84l-2.13-6.19c4.27-2.77,10.45-4.59,16.96-4.59,15.79,0,19.63,10.77,19.63,21.12v19.31c0,4.48.21,8.85.85,12.37h-8.53Zm-1.39-26.35c-10.24-.21-21.87,1.6-21.87,11.63,0,6.08,4.05,8.96,8.85,8.96,6.72,0,10.99-4.27,12.48-8.64.32-.96.53-2.03.53-2.99v-8.96Z" style={{fill:"#222d64"}}></path><path d="m1769.38,403.27h9.39v75.74h-9.39v-75.74Z" style={{fill:"#222d64"}}></path><path d="m1796.37,403.27h9.39v75.74h-9.39v-75.74Z" style={{fill:"#222d64"}}></path><path d="m1894.51,452.77c0,19.09-13.23,27.42-25.71,27.42-13.97,0-24.75-10.24-24.75-26.56,0-17.28,11.31-27.42,25.6-27.42s24.86,10.77,24.86,26.56Zm-40.96.53c0,11.31,6.51,19.84,15.68,19.84s15.68-8.43,15.68-20.05c0-8.75-4.37-19.84-15.47-19.84s-15.9,10.24-15.9,20.06Z" style={{fill:"#222d64"}}></path><path d="m1909.13,479.01v-44.49h-7.25v-7.15h7.25v-2.45c0-7.25,1.6-13.87,5.97-18.03,3.52-3.41,8.21-4.8,12.59-4.8,3.31,0,6.19.75,8,1.49l-1.28,7.26c-1.39-.64-3.31-1.18-5.97-1.18-8,0-10.03,7.04-10.03,14.93v2.77h12.48v7.15h-12.48v44.49h-9.28Z" style={{fill:"#222d64"}}></path><path d="m1975.16,407.11v71.9h-9.28v-71.9h9.28Z" style={{fill:"#222d64"}}></path><path d="m1993.94,441.35c0-5.33-.11-9.71-.43-13.97h8.32l.53,8.53h.21c2.56-4.91,8.53-9.71,17.07-9.71,7.15,0,18.24,4.27,18.24,21.97v30.83h-9.39v-29.76c0-8.32-3.09-15.26-11.95-15.26-6.19,0-10.99,4.37-12.59,9.6-.43,1.17-.64,2.77-.64,4.37v31.04h-9.39v-37.66Z" style={{fill:"#222d64"}}></path><path d="m2065.84,412.55v14.83h13.44v7.15h-13.44v27.84c0,6.4,1.81,10.03,7.04,10.03,2.45,0,4.27-.32,5.44-.64l.43,7.04c-1.81.75-4.69,1.28-8.32,1.28-4.37,0-7.89-1.39-10.13-3.95-2.67-2.77-3.63-7.36-3.63-13.44v-28.16h-8v-7.15h8v-12.37l9.17-2.45Z" style={{fill:"#222d64"}}></path><path d="m2120.25,479.01l-.75-6.51h-.32c-2.88,4.05-8.43,7.68-15.79,7.68-10.45,0-15.79-7.36-15.79-14.83,0-12.48,11.09-19.31,31.04-19.2v-1.07c0-4.27-1.17-11.95-11.73-11.95-4.8,0-9.81,1.49-13.44,3.84l-2.13-6.19c4.27-2.77,10.45-4.59,16.96-4.59,15.79,0,19.63,10.77,19.63,21.12v19.31c0,4.48.21,8.85.85,12.37h-8.53Zm-1.39-26.35c-10.24-.21-21.87,1.6-21.87,11.63,0,6.08,4.05,8.96,8.85,8.96,6.72,0,10.99-4.27,12.48-8.64.32-.96.53-2.03.53-2.99v-8.96Z" style={{fill:"#222d64"}}></path><path d="m2143.62,469.41c2.77,1.81,7.68,3.73,12.37,3.73,6.83,0,10.03-3.41,10.03-7.68,0-4.48-2.67-6.93-9.6-9.49-9.28-3.31-13.65-8.43-13.65-14.62,0-8.32,6.72-15.15,17.81-15.15,5.23,0,9.81,1.49,12.69,3.2l-2.35,6.83c-2.03-1.28-5.76-2.99-10.56-2.99-5.55,0-8.64,3.2-8.64,7.04,0,4.27,3.09,6.19,9.81,8.75,8.96,3.41,13.55,7.89,13.55,15.57,0,9.07-7.04,15.47-19.31,15.47-5.65,0-10.88-1.39-14.51-3.52l2.35-7.15Z" style={{fill:"#222d64"}}></path><path d="m2200.26,412.55v14.83h13.44v7.15h-13.44v27.84c0,6.4,1.81,10.03,7.04,10.03,2.45,0,4.27-.32,5.44-.64l.43,7.04c-1.81.75-4.69,1.28-8.32,1.28-4.37,0-7.89-1.39-10.13-3.95-2.67-2.77-3.63-7.36-3.63-13.44v-28.16h-8v-7.15h8v-12.37l9.17-2.45Z" style={{fill:"#222d64"}}></path><path d="m2230.67,454.9c.21,12.69,8.32,17.92,17.71,17.92,6.72,0,10.77-1.17,14.29-2.67l1.6,6.72c-3.31,1.49-8.96,3.2-17.18,3.2-15.9,0-25.39-10.45-25.39-26.03s9.17-27.84,24.22-27.84c16.86,0,21.34,14.83,21.34,24.32,0,1.92-.21,3.41-.32,4.37h-36.27Zm27.52-6.72c.11-5.97-2.45-15.25-13.01-15.25-9.49,0-13.65,8.75-14.4,15.25h27.42Z" style={{fill:"#222d64"}}></path><path d="m2280.7,403.27h9.39v75.74h-9.39v-75.74Z" style={{fill:"#222d64"}}></path><path d="m2307.69,403.27h9.39v75.74h-9.39v-75.74Z" style={{fill:"#222d64"}}></path><path d="m2363.27,479.01l-.75-6.51h-.32c-2.88,4.05-8.43,7.68-15.79,7.68-10.45,0-15.79-7.36-15.79-14.83,0-12.48,11.09-19.31,31.04-19.2v-1.07c0-4.27-1.17-11.95-11.73-11.95-4.8,0-9.81,1.49-13.44,3.84l-2.13-6.19c4.27-2.77,10.45-4.59,16.96-4.59,15.79,0,19.63,10.77,19.63,21.12v19.31c0,4.48.21,8.85.85,12.37h-8.53Zm-1.39-26.35c-10.24-.21-21.87,1.6-21.87,11.63,0,6.08,4.05,8.96,8.85,8.96,6.72,0,10.99-4.27,12.48-8.64.32-.96.53-2.03.53-2.99v-8.96Z" style={{fill:"#222d64"}}></path><path d="m2387.92,443.49c0-6.08-.11-11.31-.43-16.11h8.21l.32,10.13h.43c2.35-6.93,8-11.31,14.29-11.31,1.07,0,1.81.11,2.67.32v8.85c-.96-.21-1.92-.32-3.2-.32-6.61,0-11.31,5.01-12.59,12.05-.21,1.28-.43,2.77-.43,4.37v27.52h-9.28v-35.52Z" style={{fill:"#222d64"}}></path><path d="m2448.09,467.7c4.16,2.56,10.24,4.69,16.64,4.69,9.49,0,15.04-5.01,15.04-12.27,0-6.72-3.84-10.56-13.55-14.29-11.74-4.16-18.99-10.24-18.99-20.37,0-11.2,9.28-19.52,23.26-19.52,7.36,0,12.69,1.71,15.9,3.52l-2.56,7.57c-2.35-1.28-7.15-3.41-13.65-3.41-9.81,0-13.55,5.87-13.55,10.78,0,6.72,4.37,10.03,14.29,13.87,12.16,4.69,18.35,10.56,18.35,21.12,0,11.09-8.21,20.7-25.18,20.7-6.93,0-14.51-2.03-18.35-4.59l2.35-7.79Z" style={{fill:"#222d64"}}></path><path d="m2550.82,452.77c0,19.09-13.23,27.42-25.71,27.42-13.97,0-24.75-10.24-24.75-26.56,0-17.28,11.31-27.42,25.6-27.42s24.86,10.77,24.86,26.56Zm-40.96.53c0,11.31,6.51,19.84,15.68,19.84s15.68-8.43,15.68-20.05c0-8.75-4.37-19.84-15.47-19.84s-15.9,10.24-15.9,20.06Z" style={{fill:"#222d64"}}></path><path d="m2564.48,403.27h9.39v75.74h-9.39v-75.74Z" style={{fill:"#222d64"}}></path><path d="m2634.67,464.93c0,5.33.11,10.03.43,14.08h-8.32l-.53-8.43h-.21c-2.45,4.16-7.89,9.6-17.07,9.6-8.11,0-17.82-4.48-17.82-22.62v-30.19h9.39v28.59c0,9.81,2.99,16.43,11.52,16.43,6.29,0,10.67-4.37,12.37-8.53.53-1.39.85-3.09.85-4.8v-31.68h9.39v37.55Z" style={{fill:"#222d64"}}></path><path d="m2663.37,412.55v14.83h13.44v7.15h-13.44v27.84c0,6.4,1.81,10.03,7.04,10.03,2.45,0,4.27-.32,5.44-.64l.43,7.04c-1.81.75-4.69,1.28-8.32,1.28-4.37,0-7.89-1.39-10.13-3.95-2.67-2.77-3.63-7.36-3.63-13.44v-28.16h-8v-7.15h8v-12.37l9.17-2.45Z" style={{fill:"#222d64"}}></path><path d="m2699.64,412.87c.11,3.2-2.24,5.76-5.97,5.76-3.31,0-5.65-2.56-5.65-5.76s2.45-5.87,5.87-5.87,5.76,2.56,5.76,5.87Zm-10.45,66.14v-51.63h9.39v51.63h-9.39Z" style={{fill:"#222d64"}}></path><path d="m2762.69,452.77c0,19.09-13.23,27.42-25.71,27.42-13.97,0-24.75-10.24-24.75-26.56,0-17.28,11.31-27.42,25.6-27.42s24.86,10.77,24.86,26.56Zm-40.96.53c0,11.31,6.51,19.84,15.68,19.84s15.68-8.43,15.68-20.05c0-8.75-4.37-19.84-15.47-19.84s-15.9,10.24-15.9,20.06Z" style={{fill:"#222d64"}}></path><path d="m2776.35,441.35c0-5.33-.11-9.71-.43-13.97h8.32l.53,8.53h.21c2.56-4.91,8.53-9.71,17.07-9.71,7.15,0,18.24,4.27,18.24,21.97v30.83h-9.39v-29.76c0-8.32-3.09-15.26-11.95-15.26-6.19,0-10.99,4.37-12.59,9.6-.43,1.17-.64,2.77-.64,4.37v31.04h-9.39v-37.66Z" style={{fill:"#222d64"}}></path><path d="m2836.09,469.41c2.77,1.81,7.68,3.73,12.37,3.73,6.83,0,10.03-3.41,10.03-7.68,0-4.48-2.67-6.93-9.6-9.49-9.28-3.31-13.65-8.43-13.65-14.62,0-8.32,6.72-15.15,17.81-15.15,5.23,0,9.81,1.49,12.69,3.2l-2.35,6.83c-2.03-1.28-5.76-2.99-10.56-2.99-5.55,0-8.64,3.2-8.64,7.04,0,4.27,3.09,6.19,9.81,8.75,8.96,3.41,13.55,7.89,13.55,15.57,0,9.07-7.04,15.47-19.31,15.47-5.65,0-10.88-1.39-14.51-3.52l2.35-7.15Z" style={{fill:"#222d64"}}></path><path d="m1374.98,221.74h-168.57l-36.31,80.83h-33.28L1275.14,0h31.55l138.32,302.57h-33.72l-36.31-80.83Zm-11.67-25.93l-72.62-162.52-72.62,162.52h145.23Z" style={{fill:"#222d64"}}></path><path d="m1463.59,188.89c0-67.86,49.27-115.41,117.14-115.41,38.47,0,70.89,15.13,89.04,44.95l-22.91,15.56c-15.56-22.91-39.77-33.71-66.13-33.71-49.71,0-86.01,35.44-86.01,88.61s36.31,88.61,86.01,88.61c26.37,0,50.57-10.37,66.13-33.28l22.91,15.56c-18.15,29.39-50.57,44.95-89.04,44.95-67.86,0-117.14-47.98-117.14-115.84Z" style={{fill:"#222d64"}}></path><path d="m1703.05,188.89c0-67.86,49.27-115.41,117.14-115.41,38.47,0,70.89,15.13,89.04,44.95l-22.91,15.56c-15.56-22.91-39.77-33.71-66.13-33.71-49.71,0-86.01,35.44-86.01,88.61s36.31,88.61,86.01,88.61c26.37,0,50.57-10.37,66.13-33.28l22.91,15.56c-18.15,29.39-50.57,44.95-89.04,44.95-67.86,0-117.14-47.98-117.14-115.84Z" style={{fill:"#222d64"}}></path><path d="m1942.5,188.89c0-67.43,49.27-115.41,115.84-115.41s115.41,47.98,115.41,115.41-48.84,115.84-115.41,115.84-115.84-48.41-115.84-115.84Zm200.12,0c0-53.16-35.87-88.61-84.29-88.61s-84.72,35.44-84.72,88.61,36.31,88.61,84.72,88.61,84.29-35.44,84.29-88.61Z" style={{fill:"#222d64"}}></path><path d="m2441.3,75.21v227.36h-29.39v-41.5c-15.99,27.66-45.38,43.66-81.69,43.66-57.92,0-95.96-32.42-95.96-97.69V75.21h30.69v128.81c0,48.41,25.07,73.05,68.29,73.05,47.55,0,77.37-30.69,77.37-82.56v-119.3h30.69Z" style={{fill:"#222d64"}}></path><path d="m2736.5,170.73v131.83h-30.69v-128.81c0-47.98-25.07-72.62-68.29-72.62-48.84,0-79.53,30.26-79.53,82.12v119.3h-30.69V75.21h29.39v41.93c16.43-27.66,47.11-43.66,86.45-43.66,55.33,0,93.36,31.99,93.36,97.25Z" style={{fill:"#222d64"}}></path><path d="m2939.64,288.73c-12.1,10.81-30.26,15.99-47.98,15.99-42.79,0-66.56-24.21-66.56-66.13V101.14h-40.63v-25.93h40.63V25.5h30.69v49.71h69.16v25.93h-69.16v135.72c0,26.8,13.83,41.49,39.33,41.49,12.53,0,25.07-3.89,33.71-11.67l10.81,22.04Z" style={{fill:"#222d64"}}></path><path d="m474.8,329.94l-82.47-24.44c65.79,174.4,223.86,158.83,223.86,158.83-71.52-34.73-141.4-134.39-141.4-134.39Z" style={{fill:"#222d64", fillRule:"evenodd"}}></path><path d="m384.03,183.33l76.81,29.67s8.54-182.05,217.58-200.63c0,0-213.56-67.84-294.39,170.95Z" style={{fill:"#222d64", fillRule:"evenodd"}}></path><path d="m427.39,224.82c-400.77-153.72-33.52-119.24-33.52-119.24,0,0-524.4-69.84,19.86,144.37,321.12,126.39,626.36,63.36,626.36,63.36,0,0-253.17,49.4-612.7-88.5Z" style={{fill:"#3f60ac", fillRule:"evenodd"}}></path><path d="m351.34,242.54c-508.95-205.63-59.73-158.5-59.73-158.5,0,0-668.48-106.33,18.82,188.85,409.6,175.91,778.85,67.3,778.85,67.3,0,0-287.5,84.35-737.94-97.65Z" style={{fill:"#3f60ac", fillRule:"evenodd"}}></path></g></svg>
                </div>
                <div className="img" style={
                    {
                        position: "relative",
                        width: "max-content",
                        margin: "20px auto"
                    }
                }>
                    <img src={props.profile.image} className="content-img" />
                    <div className="ziuVxb" style={{position: "absolute", bottom: "10px", right: "20px"}}>
                        <button jsaction="click:lj3vef" aria-label="Change profile picture" className="GXg3Le LgkqPe" jsname="twx2Pc" data-cat="profile" data-cp=""
                        style={{
                            border: "none",
                            borderRadius: "50%",
                            boxShadow: "0 0 9px rgba(0, 0, 0, 0.14), 0 2px 1px rgba(0, 0, 0, 0.28)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#fff",
                            padding: "10px"
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" className="uarSJe NMm5M"><path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 14H4V7h16v12z"></path><path d="M12 9c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"></path></svg>
                        </button>
                    </div>
                </div>
                <div className="dropdown-name">
                    <div className="dpdn">Hi, {props.profile.name}!</div>
                    <div className="dpde">{props.profile.email}</div>
                    <div className="acc">
                        <a href="https://my.intastellaraccounts.com" target="_blank"><img src="https://www.intastellarsolutions.com/assets/icons/fav/favicon-96x96.png" className="logo-icon" />Manage Your Intastellar Account</a>
                    </div>
                </div>
            </div>
            <div className="sign_out_btn_container">
                <button className="sign_out_btn" onClick={() => {Authentication.Logout()}}>
                    <svg focusable="false" height="24" viewBox="0 0 24 24" width="24" className=" NMm5M"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg> Sign Out
                </button>
            </div>
        </div>
    </>
}