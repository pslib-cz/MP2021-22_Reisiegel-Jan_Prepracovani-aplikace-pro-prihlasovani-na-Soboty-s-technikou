import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Form, Panel, Row, Table, Button, ButtonGroup } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";
import Unauthorized from "../general/Unauthorized";

const AllGroups = () => {
    const [{ accessToken, profile }] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [groups, setGroups] = useState([]);

    const [sortCol, setSortCol] = useState();
    const [sortType, setSortType] = useState();

    const [groupName, setGroupName] = useState();
    const [groupAction, setGroupAction] = useState();
    const [groupOpen, setGroupOpen] = useState();


    const [nameFilter, setNameFilter] = useState();
    const [actionNameFilter, setActionNameFilter] = useState();

    const getConditions = () => {
        let conditions = "?";
        if (groupName) {
            conditions = conditions + "name=" + groupName;
            if (groupAction) {
                conditions = conditions + "&action=" + groupAction;
            }
            if (groupOpen) {
                conditions = conditions + "&open=" + groupOpen;
            }
        }
        else if (groupAction) {
            conditions = conditions + "action=" + groupAction;
            if (groupOpen) {
                conditions = conditions + "&open=" + groupOpen;
            }
        }
        else if (groupOpen) {
            conditions = conditions + "open=" + groupOpen;
        }
        else {
            conditions = "";
        }
        return conditions;
    }

    const getGroups = () => {
        setIsLoading(true);
        setError(false);
        axios.get("/api/Groups", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            params: {
                name: nameFilter,
                actionName: actionNameFilter,
            }
        })
            .then(response => {
                console.log(response.data);
                setGroups(response.data);
            })
            .catch(error => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const dataToTable = () => {

        if (sortCol && sortType) {
            return groups.sort((a, b) => {
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
        return groups;
    }

    const handleSortColumn = (sortCol, sortType) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSortCol(sortCol);
            setSortType(sortType);
        }, 500)
    }

    const FilterHeader = () => {
        return (
            <Row>
                <Col xs={15} sm={7} md={4} lg={7}>
                    <h5 style={{ textAlign: "center" }}>Filter</h5>
                </Col>
                <Col xsHidden sm={24} md={24} lg={24} />
                <Col xs={15} sm={17} md={17} lg={17}>
                    <ButtonGroup>
                        <Button color="blue" appearance="primary" onClick={() => { getGroups() }} >Filtrovat</Button>
                        <Button color="cyan" appearance="primary" onClick={() => {
                            setActionNameFilter("");
                            setNameFilter("");
                            getGroups();
                        }} >Reset filtru</Button>
                    </ButtonGroup>
                </Col>
                <Col xs={6} sm={5} md={5} lg={5}>
                    <Button appearance="primary" color="green" as={Link} to="/NewGroup" >Nová skupina</Button>
                </Col>
            </Row>
        )
    }

    useEffect(() => {
        getGroups();
    }, [accessToken])

    if (!profile.lector === "1") {
        return (
            <Unauthorized lector={true} />
        )
    }
    else {
        return (
            <Col xs={24} sm={24} md={24} lg={24}>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Panel header={<FilterHeader />} bordered>
                            <Form fluid>
                                <Col xs={12} sm={12} md={6} lg={6} >
                                    <Form.Control placeholder="Název Skupiny" value={nameFilter} onChange={e => setNameFilter(e)} />
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} >
                                    <Form.Control placeholder="Název akce skupiny" value={actionNameFilter} onChange={e => setActionNameFilter(e)} />
                                </Col>
                                <br />
                            </Form>
                        </Panel>
                    </Col>
                    <Col lg={3}>

                    </Col>
                </Row>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24}>
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
                            <Table.Column sortable resizable width={300} >
                                <Table.HeaderCell align="center" >Název</Table.HeaderCell>
                                <Table.Cell dataKey="name" />
                            </Table.Column>
                            <Table.Column sortable resizable width={300} >
                                <Table.HeaderCell align="center" >Akce</Table.HeaderCell>
                                <Table.Cell dataKey="actionName" />
                            </Table.Column>
                            <Table.Column sortable resizable width={90} >
                                <Table.HeaderCell align="center" >Kapacita</Table.HeaderCell>
                                <Table.Cell dataKey="capacity" />
                            </Table.Column>
                            <Table.Column sortable resizable width={90} >
                                <Table.HeaderCell align="center" >Otevřená</Table.HeaderCell>
                                <ActiveCell dataKey="open" />
                            </Table.Column>
                            <Table.Column resizable width={100} >
                                <Table.HeaderCell align="center" >Akce</Table.HeaderCell>
                                <ActionCell />
                            </Table.Column>
                        </Table>
                    </Col>
                </Row>
            </Col>
        )
    }
}

const ActiveCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Table.Cell {...props}>
            {rowData[dataKey] ? "Ano" : "Ne"}
        </Table.Cell>
    )
}

const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Table.Cell {...props}>
            <Button color="blue" appearance="primary" as={Link} to={`/Group/${rowData["year"]}/${rowData["actionNameId"]}/${rowData["nameId"]}`}>Detail</Button>
        </Table.Cell>
    )
}



export default AllGroups;