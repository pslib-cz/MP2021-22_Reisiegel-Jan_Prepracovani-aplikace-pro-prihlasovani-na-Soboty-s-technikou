import { Plus } from "@rsuite/icons/lib/icons";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Col, Form, IconButton, Panel, Row, SelectPicker, Table } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";

const conditionData = [
    {
        "label": "Vyberte stav akce",
        "value": "",
    },
    {
        "label": "Aktivní",
        "value": "true",
    },
    {
        "label": "Blokovaný",
        "value": "false",
    },
    

];
const typeData = [
    {
        "label": "Vyberte typ akce",
        "value": "",
    },
    {
        "label": "Distanční",
        "value": 0,
    },
    {
        "label": "Prezenční",
        "value": 1,
    },
    

];

const AllActions = () => {
    const [{ accessToken }] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [actions, setActions] = useState([]);
    const [sortCol, setSortCol] = useState();
    const [sortType, setSortType] = useState();

    const [actionNameFilter, setActionNameFilter] = useState();
    const [actionYearFilter, setActionYearFilter] = useState();
    const [actionIsActiveFilter, setActionIsActiveFilter] = useState();
    const [actionAvailabilityFilter, setActionAvailabilityFilter] = useState();

    const getActions = () => {
        setIsLoading(true);
        setError(false);
        axios.get("/api/Actions", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            params: {
                name: actionNameFilter,
                year: actionYearFilter,
                isActive: actionIsActiveFilter,
                typeOfAction: actionAvailabilityFilter,
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

    const FilterHeader = () => {
        return (
            <Row>
                <Col xs={15} sm={7} md={4} lg={7}>
                    <h5 style={{ textAlign: "center" }}>Filter</h5>
                </Col>
                <Col xsHidden sm={24} md={24} lg={24} />
                <Col xs={15} sm={17} md={17} lg={17}>
                    <ButtonGroup>
                        <Button color="blue" appearance="primary" onClick={()=>getActions()} >Filtrovat</Button>
                        <Button color="cyan" appearance="primary" onClick={()=>{
                            setActionNameFilter("");
                            setActionYearFilter("");
                            setActionIsActiveFilter("");
                            setActionAvailabilityFilter("");
                        }} >Reset filtru</Button>
                    </ButtonGroup>
                </Col>
                <Col xs={6} sm={5} md={5} lg={5}>
                <Button appearance="primary" color="green" as={Link} to="/NewAction" >Nová akce</Button>
                </Col>
            </Row>
        )
    }

    useEffect(() => {
        getActions();
    }, [accessToken])

    return (
        <Col xs={24} sm={24} md={24} lg={24}>
            <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Panel header={<FilterHeader />} bordered>
                        <Form fluid>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <Form.Control placeholder="Název akce" value={actionNameFilter} onChange={e => setActionNameFilter(e)} />
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <Form.Control placeholder="Rok akce" value={actionYearFilter} onChange={e => setActionYearFilter(e)} />
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <SelectPicker block data={conditionData} searchable={false} value={actionIsActiveFilter} onChange={e => setActionIsActiveFilter(e)} placeholder="Stav akce"  />
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <SelectPicker block data={typeData} searchable={false} value={actionAvailabilityFilter} onChange={e => setActionAvailabilityFilter(e)} placeholder="Typ akce"  />
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
                            <Table.HeaderCell align="center" >Název akce</Table.HeaderCell>
                            <Table.Cell dataKey="name" />
                        </Table.Column>
                        <Table.Column sortable resizable width={100} >
                            <Table.HeaderCell align="center" >Rok akce</Table.HeaderCell>
                            <Table.Cell dataKey="year" />
                        </Table.Column>
                        <Table.Column resizable width={100} >
                            <Table.HeaderCell align="center" >Stav</Table.HeaderCell>
                            <ConditionCell dataKey="active" />
                        </Table.Column>
                        <Table.Column resizable width={200} >
                            <Table.HeaderCell align="center" >Veřejná</Table.HeaderCell>
                            <AvailabilityCell dataKey="availability" />
                        </Table.Column>
                        <Table.Column resizable width={200} >
                            <Table.HeaderCell align="center" >Typ akce</Table.HeaderCell>
                            <TypeCell dataKey="formOfAction" />
                        </Table.Column>
                        <Table.Column resizable width={200} >
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



export default AllActions;