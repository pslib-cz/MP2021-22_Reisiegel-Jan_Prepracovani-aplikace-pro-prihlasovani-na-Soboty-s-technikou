import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Row, Panel, Button, ButtonGroup, Progress, Message, Whisper, Modal } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";
import parse from 'html-react-parser';
import { Link } from "react-router-dom";
import { translateDOMPositionXY } from "rsuite/esm/DOMHelper";
import Loading from "../general/Loading";
import NotFound from "../general/NotFound";
import ErrorMessage from "../general/ErrorMessage";

const ActionOnHome = () => {
    const [{ accessToken, userManager, profile }] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [action, setAction] = useState();
    const [reload, setReload] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState();

    const loadAction = () => {
        setIsLoading(true);
        setError(false);
        axios.get("/api/Actions/MainAction", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setAction(response.data);
                console.log(response.data);
            })
            .catch(error => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const percentageProgress = (maxCapacity, actualCapacity) => {
        let per = (actualCapacity / maxCapacity) * 100;
        return per;
    }
    const enroll = (group) => {
        axios.post(`/api/Applications/Enroll`, {
            userId: profile.sub,
            groupId: group.id
        }, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                console.log(response.data);
            })
            .finally(() => {
                setReload(!reload);
            })
    }
    const unenroll = (group) => {
        console.log(profile);
        axios.put(`/api/Applications/Unenroll`, {
            userId: profile.sub,
            groupId: group.id
        }, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                console.log(response);
            })
            .finally(() => {
                setReload(!reload);
            })
    }

    const GroupCard = ({ group, itemIndex }) => {
        console.log(group);
        return (
            <>

                <Col xs={24} sm={12} lg={6} md={8} Style={{ position: "relative" }} >
                    <Panel bordered shaded style={{ height: "100%", textAlign: "left" }}
                        header={<h5>{group.name}</h5>}>

                        <Row>
                            <Col >
                                {
                                    parse(group.description)
                                }
                                {
                                    group.note ? <p onClick={console.info("Funkce")} style={{ color: "#5bc0de" }}>Podívejte se na poznámku k této skupině.</p>
                                        : null
                                }
                            </Col>
                        </Row>
                        <br />

                    </Panel>
                    <Col lg={24} xs={24} sm={24} md={24} style={{ position: "relative", bottom: "6em" }} >

                        <Row style={{ marginBottom: "0.5em" }}>

                            <ButtonGroup style={{ width: "87%" }}>
                                {
                                    accessToken ? (
                                        action.userIsInAction ? (
                                            group.isUserAdded ?
                                                <Button style={{ width: "50%", border: "0.1em solid #2196f3" }} color="blue" appearance="subtle" onClick={() => { unenroll(group) }} disabled={false} >Odzapsat se</Button>
                                                : <Button style={{ width: "50%", border: "0.1em solid #2196f3" }} color="blue" appearance="subtle" onClick={() => { enroll(group) }} disabled={true} >Zapsat se</Button>
                                        )
                                            : <Button style={{ width: "50%", border: "0.1em solid #2196f3" }} color="blue" appearance="subtle" onClick={() => { enroll(group) }} disabled={false} >Zapsat se</Button>
                                    )
                                        : <Button
                                            style={{ width: "50%", border: "0.1em solid #2196f3" }}
                                            color="blue" appearance="subtle" onClick={() => { userManager.signinRedirect({ redirectUrl: "/" }) }}
                                        >Zapsat se</Button>
                                }
                                <Button style={{ width: "50%", border: "0.1em solid #2196f3", borderLeft: "none" }} onClick={() => { setModalOpen(true); setModalData(group) }} color="blue" appearance="subtle">Detail</Button>

                            </ButtonGroup>

                            <br />
                        </Row>
                        <Row >
                            <Col lg={3} style={{ position: "relative", top: "0.16em", left: "0.75em" }}>
                                <p style={{ textAlign: "center" }}>{`${group.countOfUsers}/${group.capacity}`}</p>
                            </Col>
                            <Col lg={21}>
                                <Progress.Line showInfo={false} percent={percentageProgress(group.capacity, group.countOfUsers)} strokeColor={group.countOfUsers === group.capacity ? "#f44336" : "#4caf50"} status={group.countOfUsers === group.capacity ? "fail" : "active"} />
                            </Col>
                        </Row>
                    </Col>
                    <br />
                </Col>
            </>
        )
    }

    useEffect(() => {
        loadAction();
    }, [accessToken, reload])

    if (isLoading) {
        return (
            <Loading />
        )
    } else if (action) {
        return (
            <>
                {
                    action ? (
                        <>
                            <Row>
                                <Col style={{ textAlign: "left" }}>
                                    <h3>{action.name}</h3>
                                    <br />
                                    <p>{action.start}</p>
                                    <br />
                                    {parse(action.description)}
                                </Col>
                            </Row>
                            <br />
                            <Row style={{ display: "flex", flexWrap: "wrap" }} >
                                {
                                    action.groups.map((item, index) => (<GroupCard group={item} itemIndex={index} />))
                                }
                            </Row>
                            <br />
                        </>
                    ) : (
                        <Message type="info" showIcon header={<h2>Neexistuje žádná akce</h2>}>
                            <p>Bohužel ještě nebyla vytvořena či zpřístupněna akce.</p>
                            {
                                accessToken ? null : (
                                    <>
                                        <p>Přihlaste se, abyste nepřišli o další akce</p>
                                        <Button color='blue' appearance='ghost' as={Link} to="/log-in" onClick={() => { userManager.signinRedirect({ redirectUrl: "/" }) }}>Přihlásit se</Button>
                                    </>
                                )
                            }
                        </Message>
                    )
                }
                {
                    modalData ? (
                        <Modal open={modalOpen} onClose={() => { setModalOpen(false) }} >
                            <Modal.Header>
                                <h2>{modalData.name}</h2>
                            </Modal.Header>
                            <Modal.Body>
                                <Col lg={5}>
                                    <Modal.Title>Hlavní lektor:</Modal.Title>
                                </Col>
                                <Col lg={19}>
                                    {modalData.headLectorName}
                                </Col>
                            </Modal.Body>
                            <Modal.Title>Popis skupiny</Modal.Title>
                            <Modal.Body>
                                {parse(modalData.description)}
                            </Modal.Body>
                            <hr />
                            <Modal.Body>
                                <Message showIcon type="info" header={<Modal.Title>Poznámka</Modal.Title>} >
                                    {parse(modalData.note)}
                                </Message>
                            </Modal.Body>
                            <hr />
                            <Modal.Body>
                                <Col lg={3} style={{ position: "relative", top: "0.16em", left: "0.75em" }}>
                                    <p style={{ textAlign: "center" }}>{`${modalData.countOfUsers}/${modalData.capacity}`}</p>
                                </Col>
                                <Col lg={21}>
                                    <Progress.Line showInfo={false} percent={percentageProgress(modalData.capacity, modalData.countOfUsers)} strokeColor={modalData.countOfUsers === modalData.capacity ? "#f44336" : "#4caf50"} status={modalData.countOfUsers === modalData.capacity ? "fail" : "active"} />
                                </Col>
                            </Modal.Body>
                            <Modal.Footer>
                                {
                                    accessToken ? (
                                        action.userIsInAction ? (
                                            modalData.isUserAdded ?
                                                <Button style={{ width: "50%", border: "0.1em solid #2196f3" }} color="blue" appearance="subtle" onClick={() => { unenroll(modalData) }} disabled={false} >Odzapsat se</Button>
                                                : <Button style={{ width: "50%", border: "0.1em solid #2196f3" }} color="blue" appearance="subtle" onClick={() => { enroll(modalData) }} disabled={true} >Zapsat se</Button>
                                        )
                                            : <Button style={{ width: "50%", border: "0.1em solid #2196f3" }} color="blue" appearance="subtle" onClick={() => { enroll(modalData) }} disabled={false} >Zapsat se</Button>
                                    )
                                        : <Button
                                            style={{ width: "50%", border: "0.1em solid #2196f3" }}
                                            color="blue" appearance="subtle" onClick={() => { userManager.signinRedirect({ redirectUrl: "/" }) }}
                                        >Zapsat se</Button>
                                }
                            </Modal.Footer>
                        </Modal>
                    ) : null
                }
            </>
        )
    }
    else if(error){
        return(<ErrorMessage />)
    }
    else return(<NotFound />)

}
//userManager.signinRedirect({ redirectUrl: "/" })



export default ActionOnHome;