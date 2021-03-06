import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ButtonGroup, Col, Panel, Row, Table, Divider } from 'rsuite';
import { useAuthContext } from '../../providers/AuthProvider';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';
import Loading from '../general/Loading';
import NotFound from '../general/NotFound';
import ErrorMessage from '../general/ErrorMessage';
import Unauthorized from '../general/Unauthorized';

const GroupDetail = () => {
    const { year, actionId, groupId } = useParams();
    const [{ accessToken, profile }] = useAuthContext();
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();
    const [groupData, setGroupData] = useState();

    const getGroupData = () => {
        setIsLoading(true);
        setError(false);
        axios.get(`/api/Groups/${year}/${actionId}/${groupId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setGroupData(response.data);
                console.log(response.data);
            })
            .catch(error => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const groupIsOpen = () => {
        setIsLoading(true);
        setError(false);
        axios.put("/api/Groups/", {
            id: groupData.id,
            name: groupData.name,
            description: groupData.description,
            capacity: groupData.capacity,
            open: !groupData.open,
            headLectorId: groupData.headLectorId,
            actionId: groupData.actionId,
            numberOfLectors: groupData.numberOfLectors,
            minYear: groupData.minYearToEnter,
            noteForLectors: groupData.noteForLectors,
            note: groupData.note
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
                getGroupData();
            })
    }

    const PanelHeader = () => {
        const deleteGroup = () => {
            axios.delete("/api/Groups/" + groupData.id, {
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
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <h2>Informace o Skupin??</h2>
                    </Col>
                    <Col xs={24} sm={19} smOffset={1} md={10} lg={12} style={{ textAlign: "right" }}>
                        <ButtonGroup>
                            <Button color="blue" appearance="primary" as={Link} to={`/EditGroup/${year}/${actionId}/${groupId} `} >Upravit</Button>
                            <Button appearance="ghost" onClick={() => { groupIsOpen() }} >{groupData.open ? "Zav????t" : "Otev????t"}</Button>
                            <Button appearance="ghost" >Zve??ejnit</Button>
                            <Button appearance="primary" color="red" as={Link} to="/AllGroups" onClick={() => { deleteGroup() }}>Odstranit</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </>


        )
    }

    const GenderCell = ({ rowData, dataKey, ...props }) => {
        return (
            <Table.Cell {...props}>
                {rowData[dataKey] === 1 ? "Mu??" : rowData[dataKey] === 2 ? "??ena" : "Jin??"}
            </Table.Cell>
        )
    }

    const YearCell = ({ rowData, dataKey, ...props }) => {
        return (
            <Table.Cell {...props}>
                {rowData[dataKey] === 0 ? "1. - 7." : rowData[dataKey] === 1 ? "8." : rowData[dataKey] === 2 ? "9." : "S??"}
            </Table.Cell>
        )
    }

    const ActionCell = ({ rowData, dataKey, ...props }) => {
        return (
            <Table.Cell {...props}>
                <Button color="green" appearance="primary" onClick={e => {
                    console.log(typeof (rowData["id"]));
                    axios.get("/api/Applications/Print", {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "text/html"
                        },
                        responseType: "blob"
                    }
                    ).then(response => {
                        console.log(response);
                        let fileContent = new Blob([response.data]);
                        const url = window.URL.createObjectURL(fileContent);
                        const link = document.createElement(`a`);
                        link.href = url;
                        link.setAttribute(`download`, `certificate.html`);
                        document.body.appendChild(link);
                        link.click();
                    }).catch(error => {
                        console.log(error);
                    });
                }}>Osv??d??en??</Button>
            </Table.Cell>
        )
    }

    useEffect(() => {
        getGroupData();
    }, [accessToken])

    if(!profile.lector === "1"){
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
    else if (groupData) {
        return (
            <Col xs={24} sm={24} md={20} mdOffset={2} lg={20} lgOffset={2}>
                <Row>
                    <Col xs={24} lg={24}>
                        <Panel shaded bordered header={<PanelHeader year={year} actionNameId={actionId} groupNameId={groupId} groupData={groupData} />} >
                            <Row>
                                <h5>Skupina</h5>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={12} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    N??zev skupiny
                                </Col>
                                <Col xs={24} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.name}
                                </Col>
                                <Col xs={24}>
                                    <Divider />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={14} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Odpov??dn?? Lektor
                                </Col>
                                <Col xs={10} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.headLectorName}
                                </Col>
                                <Col xs={24}>
                                    <Divider />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={14} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Po??et lektor??
                                </Col>
                                <Col xs={10} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.numberOfLectors}
                                </Col>
                                <Col xs={24}>
                                    <Divider />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={14} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Pozn??mka k lektor??m
                                </Col>
                                <Col xs={10} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {parse(groupData.noteForLectors)}
                                </Col>
                                <Col xs={24}>
                                    <Divider />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={14} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Kapacita
                                </Col>
                                <Col xs={10} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.capacity}
                                </Col>
                                <Col xs={24}>
                                    <Divider />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={14} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Po??et p??ihl????ek
                                </Col>
                                <Col xs={10} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.countOfUsers}
                                </Col>
                                <Col xs={24}>
                                    <Divider />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={14} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Minim??ln?? ro??n??k ????astn??k??
                                </Col>
                                <Col xs={10} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.year === 1 ? "7. a ni?????? t????da Z??" : groupData.year === 2 ? "8. t??ida Z??" : groupData.year === 3 ? "9. t????da Z??" : groupData.year === 4 ? "Vy?????? t????da (S??)" : "Nevybr??no"}
                                </Col>
                                <Col xs={24}>
                                    <Divider />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={14} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Otev??en??
                                </Col>
                                <Col xs={10} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.open ? "Ano" : "Ne"}
                                </Col>
                                <Col xs={24}>
                                    <Divider />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={14} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Popis
                                </Col>
                                <Col xs={10} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {parse(groupData.description)}
                                </Col>
                                <Col xs={24}>
                                    <Divider />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={14} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Pozn??mka
                                </Col>
                                <Col xs={10} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {parse(groupData.note)}
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <h5>Akce</h5>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={14} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    N??zev akce
                                </Col>
                                <Col xs={10} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.action.name}
                                </Col>
                                <Col xs={24}>
                                    <Divider />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={14} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    ??koln?? rok
                                </Col>
                                <Col xs={10} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.action.year}
                                </Col>
                                <Col xs={24}>
                                    <Divider />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={14} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Za????tek
                                </Col>
                                <Col xs={10} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.action.start}
                                </Col>
                                <Col xs={24}>
                                    <Divider />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={14} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Konec
                                </Col>
                                <Col xs={10} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.action.end}
                                </Col>
                                <Col xs={24}>
                                    <Divider />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={14} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Aktivn??
                                </Col>
                                <Col xs={10} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.action.active ? "Ano" : "Ne"}
                                </Col>
                                <Col xs={24}>
                                    <Divider />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col xs={14} sm={11} md={11} lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Popis
                                </Col>
                                <Col xs={10} sm={11} md={11} lg={17} style={{ fontSize: "1.25em" }}>
                                    {parse(groupData.action.description)}
                                </Col>
                            </Row>
                            <br />

                        </Panel>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} lg={24}>
                        <Panel shaded bordered header={<h5>U??ivatel??</h5>}>
                            <Table
                                data={groupData.users}
                                loading={isLoading}
                                autoHeight={true}
                                bordered
                                cellBordered
                                wordWrap>
                                <Table.Column sortable resizable width={210} >
                                    <Table.HeaderCell align="center" >Datum a ??as</Table.HeaderCell>
                                    <Table.Cell dataKey="userSetInGroup" />
                                </Table.Column>
                                <Table.Column sortable resizable width={150} >
                                    <Table.HeaderCell align="center" >Jm??no</Table.HeaderCell>
                                    <Table.Cell dataKey="firstName" />
                                </Table.Column>
                                <Table.Column sortable resizable width={150} >
                                    <Table.HeaderCell align="center" >P????jmen??</Table.HeaderCell>
                                    <Table.Cell dataKey="lastName" />
                                </Table.Column>
                                <Table.Column resizable width={200} >
                                    <Table.HeaderCell align="center" >Email</Table.HeaderCell>
                                    <Table.Cell dataKey="email" />
                                </Table.Column>
                                <Table.Column resizable width={70} >
                                    <Table.HeaderCell align="center" >Pohlav??</Table.HeaderCell>
                                    <GenderCell dataKey="gender" />
                                </Table.Column>
                                <Table.Column resizable width={90} >
                                    <Table.HeaderCell align="center" >Narozen??</Table.HeaderCell>
                                    <Table.Cell dataKey="birthDate" />
                                </Table.Column>
                                <Table.Column resizable width={80} >
                                    <Table.HeaderCell align="center" >T????da</Table.HeaderCell>
                                    <YearCell dataKey="year" />
                                </Table.Column><Table.Column resizable width={110} >
                                    <Table.HeaderCell align="center" >Akce</Table.HeaderCell>
                                    <ActionCell />
                                </Table.Column>
                            </Table>
                        </Panel>
                    </Col>
                </Row>
            </Col>
        )
    }
    else {
        return (<NotFound />)
    }
}



export default GroupDetail;