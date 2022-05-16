import axios from "axios";
import React, { useEffect } from "react";
import ReactDOM from 'react-dom';
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, ButtonGroup, Col, Panel, Row, Table } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";
import parse from 'html-react-parser';
import { Link } from "react-router-dom";
import Loading from "../general/Loading";
import NotFound from "../general/NotFound";
import ErrorMessage from "../general/ErrorMessage";
import Unauthorized from "../general/Unauthorized";

const ActionDetail = () => {
    const { nameId, year } = useParams();
    const [{ accessToken, profile }] = useAuthContext();
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();
    const [actionData, setActionData] = useState();

    console.log(profile)

    const getData = () => {
        setIsLoading(true);
        setError(false);
        axios.get("/api/Actions/" + year + "/" + nameId, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setActionData(response.data);
                console.log(response.data);
            })
            .catch(error => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const PanelHeader = ({ nameId, year, actionData }) => {
        const [{ accessToken }] = useAuthContext();
        const deleteAction = () => {
            axios.delete("/api/Actions/" + actionData.id, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    console.log(Response);
                })
        }
        const changeActionActive = () => {
            setIsLoading(true);
            setError(false);
            axios.put(`api/Actions`, {
                id: actionData.id,
                name: actionData.name,
                description: actionData.description,
                year: actionData.year,
                start: actionData.start,
                end: actionData.end,
                formOfAction: actionData.type,
                active: !actionData.active,
                availability: actionData.availability
            }, {
                headers: {
                    //"Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    setError(true);
                })
                .finally(() => {
                    setIsLoading(false);
                    getData();
                })
        }

        const changeAvailabilityAction = () => {
            setIsLoading(true);
            setError(false);
            axios.put(`api/Actions`, {
                id: actionData.id,
                name: actionData.name,
                description: actionData.description,
                year: actionData.year,
                start: actionData.start,
                end: actionData.end,
                formOfAction: actionData.type,
                active: actionData.active,
                availability: !actionData.availability
            }, {
                headers: {
                    //"Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    setError(true);
                })
                .finally(() => {
                    setIsLoading(false);
                    getData();
                })
        }
        return (
            <>
                <Row>
                    <Col xs={24} sm={24} md={9} lg={11}>
                        <h2>Informace o akci</h2>
                    </Col>
                    <Col xs={24} smHidden mdHidden lgHidden>
                        <Row>
                            <Col xs={12}>
                                <Button block color="blue" appearance="primary" as={Link} to={`/EditAction/${year}/${nameId}`} >Upravit</Button>
                            </Col>
                            <Col xs={12}>
                                <Button block appearance="ghost" onClick={() => { changeActionActive() }} >{actionData.active ? "Deaktivovat" : "Aktivovat"}</Button>
                            </Col>
                        </Row>
                        <Row style={{marginTop: '.25em'}}>
                            <Col xs={12}>
                                <Button block appearance="ghost" onClick={() => { changeAvailabilityAction() }} >{actionData.availability ? "Skrýt z Titulní stránky" : "Zveřejnit na titulní stránku"}</Button>
                            </Col>
                            <Col xs={12}>
                                <Button block appearance="primary" onClick={() => { deleteAction() }} as={Link} to="/AllActions" color="red">Smazat</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col xsHidden sm={23} md={12} lg={12} style={{ textAlign: "right" }}>
                        <ButtonGroup>
                            <Button color="blue" appearance="primary" as={Link} to={`/EditAction/${year}/${nameId}`} >Upravit</Button>
                            <Button appearance="ghost" onClick={() => { changeActionActive() }} >{actionData.active ? "Deaktivovat" : "Aktivovat"}</Button>
                            <Button appearance="ghost" onClick={() => { changeAvailabilityAction() }} >{actionData.availability ? "Skrýt z Titulní stránky" : "Zveřejnit na titulní stránku"}</Button>
                            <Button appearance="primary" onClick={() => { deleteAction() }} as={Link} to="/AllActions" color="red">Smazat</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </>


        )
    }

    const ActionCell = ({ rowData, dataKey, ...props }) => {
        return (
            <Table.Cell {...props} align="center">
                <Button as={Link} to={`/Group/${year}/${nameId}/${rowData["nameId"]}`} color="blue" appearance="primary" size="sm" >Detail</Button>
            </Table.Cell>
        )
    }

    useEffect(() => {
        getData();
    }, [accessToken])

    if(profile.lector === "1"){
        return (
            <Unauthorized lector={true} />
        )
    }
    else if (isLoading) {
        return (<Loading />);
    }
    else if (error) {
        return (<ErrorMessage />);
    }
    else if (actionData) {
        return (
            <div>
                <Row>
                    <Col xs={24} lg={20} lgOffset={2}>
                        <Panel shaded bordered header={<PanelHeader year={year} nameId={nameId} actionData={actionData} />} >
                            <Row>
                                <h5>Obecné</h5>
                            </Row>
                            <Row>
                                <Col xs={10} sm={7} md={7} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Název akce
                                </Col>
                                <Col xs={14} sm={17} md={17} lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.name}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={10} sm={7} md={7} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Školní rok
                                </Col>
                                <Col xs={14} sm={17} md={17} lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.year}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={10} sm={7} md={7} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Začátek
                                </Col>
                                <Col xs={14} sm={17} md={17} lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.start}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={10} sm={7} md={7} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Konec
                                </Col>
                                <Col xs={14} sm={17} md={17} lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.end}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={10} sm={7} md={7} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Aktivní
                                </Col>
                                <Col xs={14} sm={17} md={17} lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.active === true ? "Ano" : "Ne"}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={10} sm={7} md={7} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Veřejná
                                </Col>
                                <Col xs={14} sm={17} md={17} lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.availability === true ? "Ano" : "Ne"}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={10} sm={7} md={7} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Popis
                                </Col>
                                <Col xs={14} sm={17} md={17} lg={17} style={{ fontSize: "1.25em" }}>
                                    {
                                        parse(actionData.description)
                                    }
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <h5>Založení</h5>
                            </Row>
                            <Row>
                                <Col xs={10} sm={7} md={7} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Založení
                                </Col>
                                <Col xs={14} sm={17} md={17} lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.createTime}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={10} sm={7} md={7} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Poslední aktualizace
                                </Col>
                                <Col xs={14} sm={17} md={17} lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.updateTime}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={10} sm={7} md={7} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Vytvořil
                                </Col>
                                <Col xs={14} sm={17} md={17} lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.creatorName}
                                </Col>
                            </Row>
                            <hr />

                            {
                                actionData.groups ?
                                    <>
                                        <h5>Skupiny</h5>
                                        <Table
                                            data={actionData.groups}
                                            bordered
                                            cellBordered  
                                        >
                                            <Table.Column resizable  width={400} >
                                                <Table.HeaderCell align="center" >Název akce</Table.HeaderCell>
                                                <Table.Cell dataKey="name" />
                                            </Table.Column>
                                            <Table.Column resizable  width={100} >
                                                <Table.HeaderCell align="center" >Kapacita</Table.HeaderCell>
                                                <Table.Cell dataKey="capacity" />
                                            </Table.Column>
                                            <Table.Column resizable  width={100} >
                                                <Table.HeaderCell align="center" >Přihlášení</Table.HeaderCell>
                                                <Table.Cell dataKey="countOfUsers" />
                                            </Table.Column>
                                            <Table.Column resizable  width={100} >
                                                <Table.HeaderCell align="center" >Počet lektorů</Table.HeaderCell>
                                                <Table.Cell dataKey="numberOfLectors" />
                                            </Table.Column>
                                            <Table.Column resizable  width={100} >
                                                <Table.HeaderCell align="center" >Otevřené</Table.HeaderCell>
                                                <AvailabilityCell dataKey="open" />
                                            </Table.Column>
                                            <Table.Column resizable  width={100} >
                                                <Table.HeaderCell align="center" >Akce</Table.HeaderCell>
                                                <ActionCell />
                                            </Table.Column>
                                        </Table>
                                    </>

                                    :
                                    null
                            }

                        </Panel>
                    </Col>
                </Row>
            </div >
        )
    }
    else {
        return (<NotFound />)
    }
}



const AvailabilityCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Table.Cell {...props}>
            {rowData[dataKey] ? "Ano" : "Ne"}
        </Table.Cell>
    )
}

const ClickCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Table.Cell {...props}>
            {rowData.dataKey}
        </Table.Cell>
    )
}


export default ActionDetail;