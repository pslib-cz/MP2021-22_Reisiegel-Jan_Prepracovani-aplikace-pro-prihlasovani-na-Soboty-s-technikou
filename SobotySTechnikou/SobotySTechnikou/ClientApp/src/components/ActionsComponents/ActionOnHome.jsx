import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Row, Panel, Button, ButtonGroup, Progress } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";
import parse from 'html-react-parser';

const ActionOnHome = () => {
    const [{ accessToken }] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [action, setAction] = useState();

    const loadAction = () => {
        setIsLoading(true);
        setError(false);
        axios.get("/api/Actions/MainAction")
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

    const GroupCard = ({ group }) => {
        return (
            <Col lg={6} Style={{ position: "relative" }} >
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
                <Col lg={24} style={{ position: "relative", bottom: "6em" }} >
                    
                    <Row style={{ marginBottom: "0.5em" }}>

                        <ButtonGroup style={{ width: "87%" }}>
                            <Button style={{ width: "50%", border: "0.1em solid #2196f3" }} color="blue" appearance="subtle">Zapsat se</Button>
                            <Button style={{ width: "50%", border: "0.1em solid #2196f3", borderLeft: "none" }} color="blue" appearance="subtle">Detail</Button>
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
            </Col>
        )
    }

    useEffect(() => {
        loadAction();
        percentageProgress(12, 6);
    }, [])

    return (
        <>
            {
                action ? (
                    <>
                        <Row>
                            <Col style={{ textAlign: "left" }}>
                                <h3>{action.name}</h3>
                                {parse(action.description)}
                            </Col>
                        </Row>
                        <br />
                        <Row style={{ display: "flex", flexWrap: "wrap" }} >
                            {
                                action.groups.map((item, index) => (<GroupCard group={item} />))
                            }
                        </Row>
                    </>
                ) : (<p>nic nedorazilo</p>)
            }
        </>
    )


}



export default ActionOnHome;