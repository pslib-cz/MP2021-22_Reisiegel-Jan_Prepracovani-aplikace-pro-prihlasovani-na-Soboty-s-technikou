import { Message } from "rsuite";

const NotFound = props => {
    return (
        <div className="text-center">
            <Message type="error" showIcon header={<h2>404</h2>}>
                <h3>Stránka nebyla nalezena</h3>
                <p style={{fontSize: "1.25rem"}}>Požadovaná stránka neexistuje. Stránka mohla být smazána, nebo jste zadali špatnou URL adresu.</p>
            </Message>
        </div>
    );
}

export default NotFound;