import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, ButtonGroup, Col, Container, Grid, Panel, Row, Table } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";

const yearData = [ "Nevybráno", "7. a nižší třída", "8. třída ZŠ", "9. třída ZŠ", "Vyšší třída (SŠ)"];

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
    const ClickCell = ({ rowData, dataKey, ...props }) => {
        const generateCertificate = () => {
            axios.get("/api/Applications/Print",{
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "text/html"
                },
                params: {
                    userId: profile.sub,
                    actionId: rowData.actionId,
                }
            }).then((response) => {
                let fileContent = new Blob([response.data]);
                const url = window.URL.createObjectURL(fileContent);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'cektifikat.html')
                document.body.appendChild(link);
                link.click();
            }).catch((error)=>{
                console.log(error);
            })
        }
        return (
            <Table.Cell {...props}>
                <ButtonGroup size="xs">
                    
                    {
                        rowData.canEnroll ? <Button color="blue" appearance="primary" >Odhlásit</Button> : null
                    } 
                    {
                        rowData.canGenerateCertificate ? <Button  color="blue" appearance="primary"
                        onClick={e => {
                            generateCertificate()
                        }} >Generovat certifikát</Button> : null
                    }
                    
                </ButtonGroup>
            </Table.Cell>
        )
    }

    

    useEffect(() => {
        getUserData();
        //console.log(mail);
    }, [accessToken]);
    if (userData) {
        return (
            <Col xs={24} sm={24} md={24} lg={24}>
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
                                    {yearData[userData.year]}
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
                                <Table.Column align="center">
                                    <Table.HeaderCell>Název</Table.HeaderCell>
                                    <Table.Cell dataKey="name" />
                                </Table.Column>
                                <Table.Column  align="center">
                                    <Table.HeaderCell>Akce</Table.HeaderCell>
                                    <Table.Cell dataKey="actionName" />
                                </Table.Column>
                                <Table.Column  align="center">
                                    <Table.HeaderCell>Rok</Table.HeaderCell>
                                    <Table.Cell dataKey="year" />
                                </Table.Column>
                                <Table.Column width={500} align="center">
                                    <Table.HeaderCell>Akce</Table.HeaderCell>
                                    <ClickCell />
                                </Table.Column>
                            </Table>
                        </Panel>
                    </Col>
                </Row>
            </Col>
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