import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Form, Panel, Row, Table } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";

const AllGroups = () => {
    const [{ accessToken }] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [groups, setGroups] = useState([]);

    const [groupName, setGroupName] = useState();
    const [groupAction, setGroupAction] = useState();
    const [groupOpen, setGroupOpne] = useState();

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
                //"Content-Type": "application/json",
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
        .finally(()=>{
            setIsLoading(false);
        })
    }

    useEffect(() => {
        getGroups();
    }, [accessToken])

    return (
        <div>
            <Col lg={24}>
            <Row>
                <Col lg={21}>
                    <Panel  bordered>
                        <Form fluid>
                            
                        </Form>
                    </Panel>
                </Col>
                <Col lg={3}>

                </Col>
            </Row>
            <Row>
                <Col lg={24}>
                    
                </Col>
            </Row>
        </Col>
        </div>
    )
}

export default AllGroups;