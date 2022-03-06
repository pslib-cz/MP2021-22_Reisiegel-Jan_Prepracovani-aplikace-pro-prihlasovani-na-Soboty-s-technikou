import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Row, Panel, Button } from "rsuite";
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

    const GroupCard = ({ group }) => {
        return (
            <Col lg={8} >
                <Panel bordered shaded style={{ height: "100%", textAlign: "left", minHeight: "100%", padding: "0 0", margin: "0 0", position: "relative" }} >
                    <div>
                        <h5>{group.name}</h5>
                        {
                            parse(group.description)
                        }
                        {
                            group.note ? <p onClick={console.info("Funkce")} style={{ color: "#5bc0de" }}>Podívejte se na poznámku k této skupině.</p>
                                : null
                        }
                    </div>

                    <div style={{ paddingTop: "auto", paddingBottom: "0"}}>
                        <Button color="blue" appearance="primary">Detail</Button>
                    </div>
                </Panel>
            </Col>
        )
    }

    useEffect(() => {
        loadAction();
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