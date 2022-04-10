import { Button, Message } from "rsuite";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../providers/AuthProvider";
 
const Unauthorized = ({admin, lector, redirectToUrl}) => {
    const [{userManager}] = useAuthContext();
    if(admin){
        return (
            <div className="text-center">
                <Message showIcon type="warning" header={<h3>Přístup odepřen</h3>}>
                    <p>Pro vstup na tuto stránku nemáte potřebné oprávnění. Do této oblasti může vstoupit pouze správce.</p>
                </Message>
            </div>
        );
    }
    else if(lector) {
        return (
            <div className="text-center">
                <Message showIcon type="warning" header={<h3>Přístup odepřen</h3>}>
                    <p>Pro vstup na tuto stránku nemáte potřebné oprávnění. Abyste mohli na tuto stránku vstoupit musíte být učitel/lektor</p>
                </Message>
            </div>
        );
    }
    else {
        return (
            <div className="text-center">
                <Message showIcon type="warning" header={<h3>Neznám tě! Kdo jsi?</h3>}>
                    <p>Aplikaci se nepodařilo vás rozeznat.</p>
                    <p>Nezapoměli jste se přihlásit?</p>
                    <Button color='yellow' appearance="primary" as={Link} to={redirectToUrl} onClick={() => { userManager.signinRedirect({ redirectUrl: "/" }) }}>Přihlásit se</Button>
                </Message>
            </div>
        );
    }
}

export default Unauthorized;