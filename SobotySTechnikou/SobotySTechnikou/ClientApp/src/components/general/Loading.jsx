import React from "react";
import { Col, Loader } from "rsuite";
import { GuardSpinner } from 'react-spinners-kit';

const Loading = () => {
    return(
        <div style={{marginLeft: "40vw", marginTop: "40vh"}}>
            <GuardSpinner size={50} frontColor="#2796f3"/>
            <br />
            <p>Načítání ...</p>
        </div>
    )
}

export default Loading;