import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Col, Form, Pagination, Panel, Row, Table } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";

const Users = props => {
    const [{ accessToken }] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [users, setUsers] = useState([]);

    const [sortCol, setSortCol] = useState();
    const [sortType, setSortType] = useState();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState();

    const [lastNameFiter, setLastNAmeFilter] = useState("");
    const [schoolFilter, setSchoolFilter] = useState("");

    const getUsers = () => {
        setIsLoading(true);
        setError(false);
        console.log(accessToken);
        axios.get("/api/Users/AllUsers", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setUsers(response.data);
                setError(false);
                console.log(response);
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
            return users.sort((a, b) => {
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
        return users;
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
                <Col xs={15} sm={17} md={17} lg={17} >
                    <ButtonGroup>
                        <Button color="blue" appearance="primary" onClick={()=>getUsers()} >Filtrovat</Button>
                        <Button color="cyan" appearance="primary" onClick={() => {
                            setLastNAmeFilter("");
                            setLastNAmeFilter("");
                            setLastNAmeFilter("");
                            setLastNAmeFilter("")
                            setLastNAmeFilter();
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
        getUsers();
    }, [accessToken, sortCol, sortType])



    return (
        <Col xs={24} sm={24} md={24} lg={24}>
            <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Panel header={<FilterHeader />} bordered>
                        <Form fluid>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <Form.Control placeholder="Název akce" value={lastNameFiter} onChange={e => setLastNAmeFilter(e)} />
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} >
                                <Form.Control placeholder="Název skupiny" value={lastNameFiter} onChange={e => setLastNAmeFilter(e)} />
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <Form.Control placeholder="Rok akce" value={lastNameFiter} onChange={e => setLastNAmeFilter(e)} />
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} >
                                <Form.Control placeholder="Jméno uživatele" value={lastNameFiter} onChange={e => setLastNAmeFilter(e)} />
                            </Col>
                            <br />
                        </Form>
                    </Panel>
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
                        <Table.Column sortable resizable fixed width={100} >
                            <Table.HeaderCell align="center" >Jméno</Table.HeaderCell>
                            <Table.Cell dataKey="firstName" />
                        </Table.Column>
                        <Table.Column sortable resizable fixed width={100} >
                            <Table.HeaderCell align="center">Příjmení</Table.HeaderCell>
                            <Table.Cell dataKey="lastName" />
                        </Table.Column>
                        <Table.Column resizable width={60} >
                            <Table.HeaderCell align="center">Pohlaví</Table.HeaderCell>
                            <GenderCell dataKey={"gender"} />
                        </Table.Column>
                        <Table.Column sortable resizable width={200}  >
                            <Table.HeaderCell align="center">Email</Table.HeaderCell>
                            <Table.Cell dataKey="email" />
                        </Table.Column>
                        <Table.Column resizable width={110} >
                            <Table.HeaderCell align="center">Potvrzený email</Table.HeaderCell>
                            <YesNoCell dataKey={"emailConfirmed"} />
                        </Table.Column>
                        <Table.Column resizable width={140} >
                            <Table.HeaderCell align="center">Potencionální student</Table.HeaderCell>
                            <YesNoCell dataKey={"potentionalStudent"} />
                        </Table.Column>
                        <Table.Column sortable resizable width={200} >
                            <Table.HeaderCell align="center">Škola</Table.HeaderCell>
                            <Table.Cell dataKey="school" />
                        </Table.Column>
                        <Table.Column resizable width={90} >
                            <Table.HeaderCell align="center">Stav</Table.HeaderCell>
                            <ConditionCell dataKey={"condition"} />
                        </Table.Column>
                        <Table.Column sortable resizable width={80} autoHeight >
                            <Table.HeaderCell align="center">Ročník</Table.HeaderCell>
                            <YearCell dataKey={"year"} />
                        </Table.Column>
                        <Table.Column sortable resizable width={150} autoHeight >
                            <Table.HeaderCell align="center">Akce</Table.HeaderCell>
                            <ActionCell />
                        </Table.Column>
                    </Table>
                </Col>
            </Row>
        </Col>

    )
}

const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Table.Cell {...props}>
            <ButtonGroup>
                <Button color="blue" appearance="primary" as={Link} to={"/UserDetail/" + rowData["email"]}>Detail</Button>
                <Button color="blue" appearance="primary" as={Link} to={"/EditUser/" + rowData["email"]}>Upravit</Button>
            </ButtonGroup>
        </Table.Cell>
    )
}

const YesNoCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Table.Cell {...props}>
            {rowData[dataKey] ? "Ano" : "Ne"}
        </Table.Cell>
    )
}
const GenderCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Table.Cell {...props}>
            {rowData[dataKey] === 1 ? "Muž" : rowData[dataKey] === 2 ? "Žena" : "Jiné"}
        </Table.Cell>
    )
}
const ConditionCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Table.Cell {...props}>
            {rowData[dataKey] === 0 ? "Aktivní" : "Blokovaný"}
        </Table.Cell>
    )
}
const YearCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Table.Cell {...props}>
            {rowData[dataKey] === 0 ? "1. - 7." : rowData[dataKey] === 1 ? "8." : rowData[dataKey] === 2 ? "9." : "SŠ"}
        </Table.Cell>
    )
}

export default Users;