import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Col, Form, Panel, Row, Table } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";
import Unauthorized from "../general/Unauthorized";

const AllApplications = () => {
    const [{ accessToken, profile }] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [applications, setApplications] = useState();

    const [sortCol, setSortCol] = useState();
    const [sortType, setSortType] = useState();

    const [actionFilter, setActionFilter] = useState("");
    const [groupFilter, setGroupFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [userNameFilter, setUserNameFilter] = useState("");


    const getApplications = () => {
        setIsLoading(true);
        setError(false);
        axios.get(`/api/Applications`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            params: {
                lastName: userNameFilter,
                actionName: actionFilter,
                actionYear: yearFilter,
                groupName: groupFilter
            }
        })
            .then(response => {
                setApplications(response.data);
                console.log(response.data);
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

    const ActionCell = ({ rowData, dataKey, ...props }) => {
        const generateCertificate = () => {
            axios.get("/api/Applications/Print", {
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
            }).catch((error) => {
                console.log(error);
            })
        }
        return (
            <Table.Cell {...props}>
                <ButtonGroup size="xs">
                    {
                        !rowData["cancelDate"] ? (
                            <Button color="blue" appearance="primary"
                                onClick={e => {
                                    generateCertificate()
                                }} >Generovat certifikát</Button>
                        ) : null
                    }
                    {/*<Button color="blue" appearance="primary" as={Link} to={`/Group/${rowData["year"]}/${rowData["actionNameId"]}/${rowData["nameId"]}`}>Detail</Button>*/}
                </ButtonGroup>
            </Table.Cell>
        )
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
                        <Button color="blue" appearance="primary" onClick={() => getApplications()} >Filtrovat</Button>
                        <Button color="cyan" appearance="primary" onClick={() => {
                            setActionFilter("");
                            setYearFilter("");
                            setUserNameFilter("");
                            setGroupFilter("")
                            getApplications();
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
        getApplications();
    }, [accessToken])

    if (profile.admin == undefined || !profile.admin === "1") {
        return (
            <Unauthorized admin={true} />
        )
    }
    else {
        return (
            <div>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Panel header={<FilterHeader />} bordered>
                                <Form fluid>
                                    <Col xs={12} sm={12} md={6} lg={6}>
                                        <Form.Control placeholder="Název akce" value={actionFilter} onChange={e => setActionFilter(e)} />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} >
                                        <Form.Control placeholder="Název skupiny" value={groupFilter} onChange={e => setGroupFilter(e)} />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6}>
                                        <Form.Control placeholder="Rok akce" value={yearFilter} onChange={e => setYearFilter(e)} />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} >
                                        <Form.Control placeholder="Jméno uživatele" value={userNameFilter} onChange={e => setUserNameFilter(e)} />
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
                                <Table.Column resizable width={250} >
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
                                <Table.Column resizable width={150} >
                                    <Table.HeaderCell align="center" >Akce</Table.HeaderCell>
                                    <ActionCell />
                                </Table.Column>
                            </Table>
                        </Col>
                    </Row>
                </Col>
            </div>
        )
    }
}



export default AllApplications;