export const App = {
    ApplicationName: "SobotySTechnikou",
}
export const Paths = {
    ApiAuthorizationClientConfigurationUrl: `_configuration/${App.ApplicationName}`,
    LoginCallback: "/oidc-callback",
    LogoutCallback: "/oidc-signout-callback",
    RenewCallback: "/oidc-silent-callback"
}