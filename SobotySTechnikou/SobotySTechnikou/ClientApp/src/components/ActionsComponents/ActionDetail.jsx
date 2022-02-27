import axios from "axios";
import React, { useEffect } from "react";
import ReactDOM from 'react-dom';
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, ButtonGroup, Col, Panel, Row, Table } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";
import parse from 'html-react-parser';
import { Link } from "react-router-dom";

const ActionDetail = () => {
    const { nameId, year } = useParams();
    const [{ accessToken }] = useAuthContext();
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();
    const [actionData, setActionData] = useState();

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

    useEffect(() => {
        getData();
    }, [accessToken])

    if (isLoading) {
        return (<div>načítám</div>);
    }
    else if (error) {
        return (<div>Error</div>);
    }
    else if (actionData) {
        return (
            <div>
                <Row>
                    <Col lg={20} lgOffset={2}>
                        <Panel shaded bordered header={<PanelHeader year={year} nameId={nameId} actionId={actionData.id} />} >
                            <Row>
                                <h5>Obecné</h5>
                            </Row>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Název akce
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.name}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Školní rok
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.year}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Začátek
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.start}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Konec
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.end}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Aktivní
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.active === true ? "Ano" : "Ne"}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Veřejná
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.availability === true ? "Ano" : "Ne"}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Popis
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
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
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Založení
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.createTime}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Poslední aktualizace
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {actionData.updateTime}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Vytvořil
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
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
                                            cellBordere
                                        >
                                            <Table.Column resizable fixed width={400} >
                                                <Table.HeaderCell align="center" >Název akce</Table.HeaderCell>
                                                <Table.Cell dataKey="name" />
                                            </Table.Column>
                                            <Table.Column resizable fixed width={100} >
                                                <Table.HeaderCell align="center" >Kapacita</Table.HeaderCell>
                                                <Table.Cell dataKey="name" />
                                            </Table.Column>
                                            <Table.Column resizable fixed width={100} >
                                                <Table.HeaderCell align="center" >Přihlášení</Table.HeaderCell>
                                                <Table.Cell dataKey="name" />
                                            </Table.Column>
                                            <Table.Column resizable fixed width={100} >
                                                <Table.HeaderCell align="center" >Počet lektorů</Table.HeaderCell>
                                                <Table.Cell dataKey="name" />
                                            </Table.Column>
                                            <Table.Column resizable fixed width={100} >
                                                <Table.HeaderCell align="center" >Otevřené</Table.HeaderCell>
                                                <AvailabilityCell dataKey="name" />
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
        return (<div></div>)
    }
}

const PanelHeader = ({nameId, year, actionId}) => {
    const [{accessToken}] = useAuthContext();
    const deleteAction = () => {
        axios.delete("/api/Actions/" + actionId, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                console.log(Response);
            })
    }
    return (
        <>
            <Row>
                <Col lg={12}>
                    <h2>Informace o akci</h2>
                </Col>
                <Col lg={12} style={{ textAlign: "right" }}>
                    <ButtonGroup>
                        <Button color="blue" appearance="primary" as={Link} to={`/EditAction/${year}/${nameId}`} >Upravit</Button>
                        <Button appearance="ghost" >Aktivovat</Button>
                        <Button appearance="ghost" >Zveřejnit na titulní stránku</Button>
                        <Button appearance="primary" onClick={() => {deleteAction()}} as={Link} to="/AllActions" color="red">Smazat</Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </>


    )
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