import React, { createContext, useReducer, useContext, useEffect } from "react";
import { UserManager, WebStorageStateStore, Log } from "oidc-client";
import { App, Paths } from "../configuration/main";
import axios from "axios";

export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";
export const CLEAR_ACCESS_TOKEN = "CLEAR_ACCESS_TOKEN";
export const SET_ID_TOKEN = "SET_ID_TOKEN";
export const CLEAR_ID_TOKEN = "CLEAR_ID_TOKEN";
export const USER_EXPIRED = "USER_EXPIRED";
export const USER_FOUND = "USER_FOUND";
export const USER_EXPIRING = "USER_EXPIRING";
export const LOADING_USER = "LOADING_USER";
export const SILENT_RENEW_ERROR = "SILENT_RENEW_ERROR";
export const SESSION_TERMINATED = "SESSION_TERMINATED";
export const LOAD_USER_ERROR = "LOAD_USER_ERROR";
export const USER_SIGNED_OUT = "USER_SIGNED_OUT";
export const SET_USER_MANAGER = "SET_USER_MANAGER";

Log.logger = console;
Log.level = /*Log.ERROR;*/Log.DEBUG;

const initialState = {
    userManager: null,
    accessToken: null,
    idToken: null,
    userId: null,
    profile: null,
    isUserLoading: false
}

const parseJwt = token => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
};

const reducer = (state, action) => {
    switch (action.type) {
        case SET_USER_MANAGER:
            return { ...state, userManager: action.payload }
        case LOADING_USER:
            return { ...state, isUserLoading: true }
        case SET_ACCESS_TOKEN:
            return { ...state, accessToken: action.payload }
        case CLEAR_ACCESS_TOKEN:
            return { ...state, accessToken: null }
        case SET_ID_TOKEN:
            return { ...state, idToken: action.payload }
        case CLEAR_ID_TOKEN:
            return { ...state, idToken: null }
        case USER_FOUND:
            return { ...state, idToken: action.idToken, accessToken: action.accessToken, userId: action.userId, profile: action.profile, isUserLoading: false }
        case USER_EXPIRED:
        case LOAD_USER_ERROR:
        case SILENT_RENEW_ERROR:
        case USER_SIGNED_OUT:
        case SESSION_TERMINATED:
            return { ...state, idToken: null, accessToken: null, userId: null, profile: null, isUserLoading: false }
        default: {
            return state;
        }
    }
}

export const AuthContext = createContext(initialState);
export const AuthConsumer = AuthContext.Consumer;
export const AuthProvider = props => {
    const store = useReducer(
        reducer,
        initialState
    );
    const [, dispatch] = store;
    useEffect(() => {
        axios.get(Paths.ApiAuthorizationClientConfigurationUrl)
            .then(response => {
                let settings = response.data;
                settings.automaticSilentRenew = true;
                settings.includeIdTokenInSilentRenew = true;
                settings.userStore = new WebStorageStateStore({
                    prefix: App.ApplicationName
                });
                let userManager = new UserManager(settings);
                console.log(settings);
                userManager.events.addUserLoaded(user => {
                    const tokenData = parseJwt(user.access_token);
                    dispatch({
                        type: USER_FOUND,
                        accessToken: user.access_token,
                        idToken: user.id_token,
                        userId: tokenData.sub,
                        profile: user.profile
                    });
                    console.info("Uživatel byl přihlášen");
                });
                userManager.events.addUserUnloaded(() => {
                    dispatch({ type: USER_EXPIRED });
                    console.info("Informace o přihlášení jsou neplatné.");
                });
                userManager.events.addAccessTokenExpiring(() => {
                    dispatch({ type: USER_EXPIRING });
                    console.info("Platnost přihlášení brzy vyprší.");
                });
                userManager.events.addAccessTokenExpired(() => {
                    dispatch({ type: USER_EXPIRED });
                    console.info("Platnost přihlášení vypršela.");
                });
                userManager.events.addSilentRenewError(() => {
                    dispatch({ type: SILENT_RENEW_ERROR });
                    console.info("Nepodařilo se obnovit přihlášení.");
                });
                userManager.events.addUserSignedOut(() => {
                    dispatch({ type: USER_EXPIRED });
                    console.info("Uživatel byl odhlášen.");
                });
                userManager.getUser()
                    .then((user) => {
                        if (user && !user.expired) {
                            let tokenData = parseJwt(user.access_token);
                            dispatch({
                                type: USER_FOUND,
                                accessToken: user.access_token,
                                idToken: user.id_token,
                                userId: tokenData.sub,
                                profile: user.profile
                            });
                        } else if (!user || (user && user.expired)) {
                            dispatch({
                                type: USER_EXPIRED
                            });
                        }
                    })
                    .catch(() => {
                        dispatch({
                            type: LOAD_USER_ERROR
                        });
                    });
                dispatch({type: SET_USER_MANAGER, payload: userManager});
            })
            .catch(error => {
                console.error("Získání konfigurace se nepodařilo");
            })
    }, [dispatch]);
    return (
        <AuthContext.Provider value={store}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);