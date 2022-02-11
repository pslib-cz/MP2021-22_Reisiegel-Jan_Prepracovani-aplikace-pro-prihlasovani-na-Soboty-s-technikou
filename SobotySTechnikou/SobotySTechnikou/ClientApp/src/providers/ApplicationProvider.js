import React from "react";
import { CustomProvider } from "rsuite";

const LOCAL_STORAGE_ID = "Soboty_s_technikou_SPSSE-Liberec";

export const LIGHT_THEME = "LIGHT_THEME";
export const DARK_THEME = "DARK_THEME";
export const HIGH_CONTRAST_THEME = "HIGHCONTRAST_THEME";

const itemsReducer = (state, action) => {
    switch (action.type) {
        case DARK_THEME: {
            return {... state, theme: "dark", autoTheme: false}
        }
        case LIGHT_THEME: {
            return {... state, theme: "light", autoTheme: false}
        }
        case HIGH_CONTRAST_THEME: {
            return {... state, theme: "high-contrast", autoTheme: false}
        }
        default: {
            return {...state}
        }
    }
}

let storedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ID));

export const OrderSystemContext = createContext();

export const OrderSystemProvider = ({ initialState, children, ...rest }) => {
    const [store, dispatch] = useReducer(itemsReducer, storedData || initialState);
    useEffect(()=>{
        localStorage.setItem(LOCAL_STORAGE_ID, JSON.stringify(store));
    }, [store]);
    return(
        <OrderSystemContext.Provider value={{store, dispatch}}>
            <CustomProvider theme={store.theme}>
                {children}
            </CustomProvider>
        </OrderSystemContext.Provider>
    )
}

export const useSystemContext = () => useContext(OrderSystemContext);