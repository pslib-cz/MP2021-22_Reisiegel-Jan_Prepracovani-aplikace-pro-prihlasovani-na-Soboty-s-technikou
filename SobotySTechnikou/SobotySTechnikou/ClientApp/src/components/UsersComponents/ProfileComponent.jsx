import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Grid, Panel, Row, Table } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";

const Profile = props => {
    const { mail } = useParams();
    const [{ accessToken, userManager, profile }] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [userData, setUserData] = useState();
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    //console.log(profile);
    const getUserData = () => {
        setIsLoading(true);
        //console.log(accessToken);
        setError(false);
        //if ((accessToken == null)) {
        if(mail){
            axios.get("/api/Users/UserInfo?mail=" + mail, {
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
                    //console.log(error);
                })
                .finally(() => {
                    setIsLoading(false);
                })
        }
        else{
            axios.get("/api/Users/UserInfo", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    setError(false);
                    setUserData(response.data);
                    console.log(response.data);
                })
                .catch(error => {
                    setError(true);
                    //console.log(error);
                })
                .finally(() => {
                    setIsLoading(false);
                })
        }
        //}

    }

    useEffect(() => {
        getUserData();
        //console.log(mail);
    }, [accessToken]);
    if (userData) {
        return (
            <div>
                <Row>
                    <Col lg={15} lgOffset={4}>
                        <Panel shaded bordered header={userData.firstName + " " + userData.lastName}>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.5em" }}>
                                    Uživatelské jméno:
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.5em" }}>
                                    {userData.userName}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.5em" }}>
                                    Email:
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.5em" }}>
                                    {userData.email}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.5em" }}>
                                    Datum narození:
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.5em" }} >
                                    {userData.birthDate}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.5em" }}>
                                    Pohlaví:
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.5em" }} >
                                    {userData.gender}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.5em" }}>
                                    Škola:
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.5em", wordWrap: "break-word" }}>
                                    {userData.school}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.5em" }}>
                                    Ročník:
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.5em" }}>
                                    {userData.year}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.5em" }}>
                                    Zájemce o studium:
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.5em" }}>
                                    {
                                        userData.potentionalStudent ?
                                            "Ano" : "Ne"
                                    }
                                </Col>
                            </Row>
                        </Panel>
                    </Col>
                    <Col lg={15} lgOffset={4}>
                        <Panel shaded bordered header={"Skupiny"}>
                            <Table
                            data = {userData.groups}
                            autoHeight={true}
                            loading={isLoading}
                            >
                                <Table.Column width={130} align="center">
                                    <Table.HeaderCell>Název</Table.HeaderCell>
                                    <Table.Cell dataKey="name" />
                                </Table.Column>
                                <Table.Column width={130} align="center">
                                    <Table.HeaderCell>Akce</Table.HeaderCell>
                                    <Table.Cell dataKey="actionName" />
                                </Table.Column>
                                <Table.Column width={130} align="center">
                                    <Table.HeaderCell>Rok</Table.HeaderCell>
                                    <Table.Cell dataKey="name" />
                                </Table.Column>
                                <Table.Column width={130} align="center">
                                    <Table.HeaderCell>Akce</Table.HeaderCell>
                                    <Table.Cell dataKey="year" />
                                </Table.Column>
                            </Table>
                        </Panel>
                    </Col>
                </Row>
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