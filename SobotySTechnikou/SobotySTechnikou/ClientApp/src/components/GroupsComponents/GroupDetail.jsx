import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ButtonGroup, Col, Panel, Row } from 'rsuite';
import { useAuthContext } from '../../providers/AuthProvider';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';

const GroupDetail = () => {
    const { year, actionId, groupId } = useParams();
    const [{ accessToken }] = useAuthContext();
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
                    <Col lg={12}>
                        <h2>Informace o Skupině</h2>
                    </Col>
                    <Col lg={12} style={{ textAlign: "right" }}>
                        <ButtonGroup>
                            <Button color="blue" appearance="primary" as={Link} to={`/EditGroup/${year}/${actionId}/${groupId} `} >Upravit</Button>
                            <Button appearance="ghost" onClick={()=>{groupIsOpen()}} >{groupData.open ? "Zavřít" : "Otevřít"}</Button>
                            <Button appearance="ghost" >Zveřejnit</Button>
                            <Button appearance="primary" color="red" as={Link} to="/AllGroups" onClick={()=>{deleteGroup()}}>Odstranit</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </>
    
    
        )
    }

    useEffect(() => {
        getGroupData();
    }, [accessToken])

    if (isLoading) {
        return (<div>načítám</div>);
    }
    else if (error) {
        return (<div>Error</div>);
    }
    else if (groupData) {
        return (
            <div>
                <Row>
                    <Col lg={20} lgOffset={2}>
                        <Panel shaded bordered header={<PanelHeader year={year} actionNameId={actionId} groupNameId={groupId} groupData={groupData} />} >
                            <Row>
                                <h5>Skupina</h5>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Název skupiny
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.name}
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Odpovědný Lektor
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.headLectorName}
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Počet lektorů
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.numberOfLectors}
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Poznámka k lektorům
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {parse(groupData.noteForLectors)}
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Kapacita
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.capacity}
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Počet přihlášek
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.countOfUsers}
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Minimální ročník účastníků
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.year === 1 ? "7. a nižší třída ZŠ" : groupData.year === 2 ? "8. třida ZŠ" : groupData.year === 3 ? "9. třída ZŠ" : groupData.year === 4 ? "Vyšší třída (SŠ)" : "Nevybráno"}
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Otevřená
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.open ? "Ano" : "Ne" }
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Popis
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {parse(groupData.description)}
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Poznámka
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {parse(groupData.note)}
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <h5>Akce</h5>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Název akce
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.action.name}
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Školní rok
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.action.year}
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Začátek
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.action.start}
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Konec
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.action.end}
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Aktivní
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.action.active ? "Ano" : "Ne" }
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={7} style={{ textAlign: "right", fontSize: "1.25em", paddingRight: "1.5em" }}>
                                    Popis
                                </Col>
                                <Col lg={17} style={{ fontSize: "1.25em" }}>
                                    {groupData.action.description}
                                </Col>
                            </Row>
                            <br />
                            
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



export default GroupDetail;