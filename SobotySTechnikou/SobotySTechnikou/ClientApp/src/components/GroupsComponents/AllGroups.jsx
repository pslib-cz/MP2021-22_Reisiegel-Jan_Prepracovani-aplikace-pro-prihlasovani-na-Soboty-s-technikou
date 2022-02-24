import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Form, Panel, Row, Table, Button, ButtonGroup } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";

const AllGroups = () => {
    const [{ accessToken }] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [groups, setGroups] = useState([]);

    const [sortCol, setSortCol] = useState();
    const [sortType, setSortType] = useState();

    const [groupName, setGroupName] = useState();
    const [groupAction, setGroupAction] = useState();
    const [groupOpen, setGroupOpen] = useState();

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

    useEffect(() => {
        getGroups();
    }, [accessToken])

    return (
        <div>
            <Col lg={24}>
                <Row>
                    <Col lg={21}>
                        <Panel header={<FilterHeader />} bordered>
                            <Form fluid>
                            <Col lg={6}>
                                <Form.Control placeholder="Název akce" value={groupName} onChange={e => setGroupName(e)} />
                            </Col>
                            <Col lg={6}>
                                <Form.Control placeholder="Rok akce" value={groupAction} onChange={e => setGroupAction(e)} />
                            </Col>
                            <Col lg={6}>
                                <Form.Control placeholder="Stav akce" value={groupOpen} onChange={e => setGroupOpen(e)} />
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
                            <Table.Column sortable resizable fixed width={400} >
                                <Table.HeaderCell align="center" >Název</Table.HeaderCell>
                                <Table.Cell dataKey="name" />
                            </Table.Column>
                            <Table.Column sortable resizable fixed width={600} >
                                <Table.HeaderCell align="center" >Akce</Table.HeaderCell>
                                <Table.Cell dataKey="actionName" />
                            </Table.Column>
                            <Table.Column sortable resizable fixed width={90} >
                                <Table.HeaderCell align="center" >Kapacita</Table.HeaderCell>
                                <Table.Cell dataKey="capacity" />
                            </Table.Column>
                            <Table.Column sortable resizable fixed width={90} >
                                <Table.HeaderCell align="center" >Otevřená</Table.HeaderCell>
                                <Table.Cell dataKey="open" />
                            </Table.Column>
                        </Table>
                    </Col>
                </Row>
            </Col>
        </div>
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
                    <Button appearance="primary" color="green" as={Link} to="/NewGroup" >Nová akce</Button>
                </ButtonGroup>
            </Col>
        </Row>
    )
}

export default AllGroups;