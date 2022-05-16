import React from "react";
import { Message } from "rsuite";

const ErrorMessage = ({errorMessage}) => {
    return (
        <div className="text-center">
            <Message type="error" showIcon header={<h2>Error</h2>}>
                <h3>Byla nalezena chyba</h3>
                <p style={{fontSize: "1.25rem"}}>Kontaktujte správce aplikace</p>
            </Message>
        </div>
    );
}

export default ErrorMessage;