import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Col, Form, Panel, Row, Table } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";

const AllApplications = () => {
    const [{ accessToken }] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [applications, setApplications] = useState();

    const [sortCol, setSortCol] = useState();
    const [sortType, setSortType] = useState();

    const getApplications = () => {
        setIsLoading(true);
        setError(false);
        axios.get(`/api/Applications`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setApplications(response.data);
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
            return applications.sort((a, b) => {
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
        return applications;
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
        getApplications();
    }, [accessToken])

    return (<div>
        <Col lg={24}>
            <Row>
                <Col lg={21}>
                    <Panel header={<FilterHeader />} bordered>
                        <Form fluid>
                            <Col lg={6}>
                                <Form.Control placeholder="Název akce" />
                            </Col>
                            <Col lg={6}>
                                <Form.Control placeholder="Rok akce" />
                            </Col>
                            <Col lg={6}>
                                <Form.Control placeholder="Stav akce" />
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
                        <Table.Column resizable width={100} >
                            <Table.HeaderCell align="center" >Jméno</Table.HeaderCell>
                            <Table.Cell dataKey="firstName" />
                        </Table.Column>
                        <Table.Column resizable width={100} >
                            <Table.HeaderCell align="center" >Příjmení</Table.HeaderCell>
                            <Table.Cell dataKey="lastName" />
                        </Table.Column>
                        <Table.Column resizable width={60} >
                            <Table.HeaderCell align="center" >Rok</Table.HeaderCell>
                            <Table.Cell dataKey="year" />
                        </Table.Column>
                        <Table.Column resizable fied width={300} >
                            <Table.HeaderCell align="center" >Akce</Table.HeaderCell>
                            <Table.Cell dataKey="actionName" />
                        </Table.Column>
                        <Table.Column resizable width={300} >
                            <Table.HeaderCell align="center" >Skupina</Table.HeaderCell>
                            <Table.Cell dataKey="groupName" />
                        </Table.Column>
                        <Table.Column sortable resizable width={145} >
                            <Table.HeaderCell align="center" >Vytvořeno</Table.HeaderCell>
                            <Table.Cell dataKey="createDate" />
                        </Table.Column>
                        <Table.Column resizable width={120} >
                            <Table.HeaderCell align="center" >Vytvořil</Table.HeaderCell>
                            <Table.Cell dataKey="createdBy" />
                        </Table.Column>
                        <Table.Column sortable resizable width={145} >
                            <Table.HeaderCell align="center" >Zrušeno</Table.HeaderCell>
                            <Table.Cell dataKey="cancelDate" />
                        </Table.Column>
                        <Table.Column resizable width={120} >
                            <Table.HeaderCell align="center" >Zrušil</Table.HeaderCell>
                            <Table.Cell dataKey="cancelledBy" />
                        </Table.Column>
                        <Table.Column resizable width={80} >
                            <Table.HeaderCell align="center" >Akce</Table.HeaderCell>
                            <ActionCell />
                        </Table.Column>
                    </Table>
                </Col>
            </Row>
        </Col>
    </div>)
}

const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Table.Cell {...props}>
            <Button color="blue" appearance="primary" as={Link} to={`/Group/${rowData["year"]}/${rowData["actionNameId"]}/${rowData["nameId"]}`}>Detail</Button>
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
                    <Button appearance="primary" color="green" as={Link} to="/NewGroup" >Nová skupina</Button>
                </ButtonGroup>
            </Col>
        </Row>
    )
}

export default AllApplications;