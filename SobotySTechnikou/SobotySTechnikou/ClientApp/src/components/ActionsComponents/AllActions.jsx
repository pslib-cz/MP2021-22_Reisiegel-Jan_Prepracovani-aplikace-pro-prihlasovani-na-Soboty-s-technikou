import { Plus } from "@rsuite/icons/lib/icons";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Col, Form, IconButton, Panel, Row, Table } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";

const AllActions = () => {
    const [{ accessToken }] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [actions, setActions] = useState([]);
    const [sortCol, setSortCol] = useState();
    const [sortType, setSortType] = useState();

    const [actionName, setActionName] = useState();
    const [actionYear, setActionYear] = useState();
    const [actionIsActive, setActionIsActive] = useState();
    const [actionAvailability, setActionAvailability] = useState();

    const getConditions = () => {
        let conditions = "?";
        if (actionName) {
            conditions = conditions + "name=" + actionName;
            if (actionYear) {
                conditions = conditions + "&year=" + actionYear;
            }
            if (actionIsActive) {
                conditions = conditions + "&isActive=" + actionIsActive;
            }
            if (actionAvailability) {
                conditions = conditions + "&availability=" + actionYear;
            }
        }
        else if (actionYear) {
            conditions = conditions + "year=" + actionYear;
            if (actionIsActive) {
                conditions = conditions + "&isActive=" + actionIsActive;
            }
            if (actionAvailability) {
                conditions = conditions + "&availability=" + actionYear;
            }
        }
        else if (actionIsActive) {
            conditions = conditions + "isActive=" + actionIsActive;
            if (actionAvailability) {
                conditions = conditions + "&availability=" + actionYear;
            }
        }
        else if (actionAvailability) {
            conditions = conditions + "availability=" + actionYear;
        }
        else {
            conditions = "";
        }
        return conditions;
    }

    const getActions = () => {
        setIsLoading(true);
        setError(false);
        axios.get("/api/Actions" + getConditions(), {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setActions(response.data);
                console.log(response.data);
                setError(false);
            })
            .catch(error => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const dataToTable = () => {

        if (sortCol && sortType) {
            return actions.sort((a, b) => {
                let x = a[sortCol];
                let y = b[sortCol];
                if (typeof x === 'string') {
                    x = x.charCodeAt();
                }
                if (typeof y === 'string') {
                    y = y.charCodeAt();
                }
                if (sortType === 'asc') {
                    return x - y;
                }
                else {
                    return y - x;
                }
            });
        }
        return actions;
    }

    const handleSortColumn = (sortCol, sortType) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSortCol(sortCol);
            setSortType(sortType);
        }, 500)
    }

    useEffect(() => {
        getActions();
    }, [accessToken])

    return (
        <Col lg={24}>
            <Row>
                <Col lg={21}>
                    <Panel header={<FilterHeader />} bordered>
                        <Form fluid>
                            <Col lg={6}>
                                <Form.Control placeholder="Název akce" value={actionName} onChange={e => setActionName(e)} />
                            </Col>
                            <Col lg={6}>
                                <Form.Control placeholder="Rok akce" value={actionYear} onChange={e => setActionYear(e)} />
                            </Col>
                            <Col lg={6}>
                                <Form.Control placeholder="Stav akce" value={actionIsActive} onChange={e => setActionIsActive(e)} />
                            </Col>
                            <Col lg={6}>
                                <Form.Control placeholder="Věřejná" value={actionAvailability} onChange={e => setActionAvailability(e)} />
                            </Col>
                            <br />
                        </Form>
                    </Panel>
                </Col>
                <Col lg={3}>

                </Col>
            </Row>
            <Row>
                <Col lg={24}>
                    <Table
                        data={dataToTable()}
                        onSortColumn={handleSortColumn}
                        sortType={sortType}
                        sortColumn={sortCol}
                        loading={isLoading}
                        autoHeight={true}
                        bordered
                        cellBordered
                        wordWrap >
                        <Table.Column sortable resizable fixed width={300} >
                            <Table.HeaderCell align="center" >Název akce</Table.HeaderCell>
                            <Table.Cell dataKey="name" />
                        </Table.Column>
                        <Table.Column sortable resizable fixed width={100} >
                            <Table.HeaderCell align="center" >Rok akce</Table.HeaderCell>
                            <Table.Cell dataKey="year" />
                        </Table.Column>
                        <Table.Column resizable fixed width={100} >
                            <Table.HeaderCell align="center" >Stav</Table.HeaderCell>
                            <ConditionCell dataKey="active" />
                        </Table.Column>
                        <Table.Column resizable fixed width={200} >
                            <Table.HeaderCell align="center" >Veřejná</Table.HeaderCell>
                            <AvailabilityCell dataKey="availability" />
                        </Table.Column>
                        <Table.Column resizable fixed width={200} >
                            <Table.HeaderCell align="center" >Typ akce</Table.HeaderCell>
                            <TypeCell dataKey="formOfAction" />
                        </Table.Column><Table.Column resizable fixed width={200} >
                            <Table.HeaderCell align="center" >Akce</Table.HeaderCell>
                            <ActionCell />
                        </Table.Column>
                    </Table>
                </Col>
            </Row>
        </Col>
    )
}

const TypeCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Table.Cell {...props}>
            {rowData[dataKey] === 0 ? "Distanční" : "Prezenční"}
        </Table.Cell>
    )
}

const ConditionCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Table.Cell {...props}>
            {rowData[dataKey] ? "Aktivní" : "Neaktivní"}
        </Table.Cell>
    )
}

const AvailabilityCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Table.Cell {...props}>
            {rowData[dataKey] ? "Ano" : "Ne"}
        </Table.Cell>
    )
}

const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Table.Cell {...props}>
            <Button color="blue" appearance="primary" as={Link} to={"/Action/" + rowData["year"] + "/"+ rowData["nameId"]}>Detail</Button>
        </Table.Cell>
    )
}

const FilterHeader = () => {
    return (
        <Row>
            <Col lg={5}>
                <h5>Filter</h5>
            </Col>
            <Col lg={6} lgOffset={13}>
                <ButtonGroup>
                    <Button color="blue" appearance="primary" >Filtrovat</Button>
                    <Button color="cyan" appearance="primary" >Reset filtru</Button>
                    <Button appearance="primary" color="green" as={Link} to="/NewAction" >Nová akce</Button>
                </ButtonGroup>
            </Col>
        </Row>
    )
}

export default AllActions;