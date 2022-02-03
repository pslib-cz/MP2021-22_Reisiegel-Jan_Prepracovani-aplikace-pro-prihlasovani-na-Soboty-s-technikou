import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Grid, Panel, Row } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";

const Profile = props => {
    const [{ accessToken, userManager, profile }] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [userData, setUserData] = useState();
    console.log(profile);
    const getUserData = () => {
        setIsLoading(true);
        console.log(accessToken);
        setError(false);
        //if ((accessToken == null)) {
        axios.get("/api/Users/UserInfo", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setError(false);
                setUserData(response.data);
                console.log(userData);
            })
            .catch(error => {
                setError(true);
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            })
        //}

    }
    useEffect(() => {
        getUserData();
        console.log("změna");
    }, [accessToken]);
    if (userData) {
        return (
            <div>
                <Panel shaded bordered header={userData.firstName + "" + userData.lastName}>
                    <Grid>
                        <Row>
                            <Col lg={12} style={{ textAlign: "right", fontSize: "1.5em" }}>
                                Uživatelské jméno:
                            </Col>
                            <Col lg={12} style={{fontSize: "1.5em"}}>
                                {userData.userName}
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} style={{ textAlign: "right", fontSize: "1.5em" }}>
                                Email:
                            </Col>
                            <Col lg={12} style={{fontSize: "1.5em"}}>
                                {userData.email}
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} style={{ textAlign: "right", fontSize: "1.5em" }}>
                                Datum narození:
                            </Col>
                            <Col lg={12} style={{fontSize: "1.5em"}} >
                                {userData.birthDate}
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} style={{ textAlign: "right", fontSize: "1.5em" }}>
                                Pohlaví:
                            </Col>
                            <Col lg={12} style={{fontSize: "1.5em"}} >
                                {userData.gender}
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} style={{ textAlign: "right", fontSize: "1.5em" }}>
                                Škola:
                            </Col>
                            <Col lg={12} style={{fontSize: "1.5em", wordWrap: "break-word" }}>
                                {userData.school}
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} style={{ textAlign: "right", fontSize: "1.5em" }}>
                                Ročník:
                            </Col>
                            <Col lg={12} style={{fontSize: "1.5em"}}>
                                {userData.year}
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} style={{ textAlign: "right", fontSize: "1.5em" }}>
                                Zájemce o studium:
                            </Col>
                            <Col lg={12} style={{fontSize: "1.5em"}}>
                                {
                                    userData.potentionalStudent ?
                                        "Ano" : "Ne"
                                }
                            </Col>
                        </Row>
                        {
                            userData.phoneNumber ?
                                <Row>
                                    <Col lg={12} style={{ textAlign: "right", fontSize: "1.5em" }}>
                                        Telefonní číslo:
                                    </Col>
                                    <Col lg={12} style={{fontSize: "1.5em"}}>
                                        {userData.phoneNumber}
                                    </Col>
                                </Row>
                                : null
                        }
                    </Grid>




                </Panel>
            </div>
        )
    }
    else {
        return (
            <h3>
                Nejsou data
            </h3>
        )
    }
}

export default Profile;