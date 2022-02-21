import axios from "axios";
import React from "react";
import { useState } from "react";
import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, SelectPicker } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";

const actionType = [
    {
        "label": "Online",
        "value": 0,
    },
    {
        "label": "Prezenčně",
        "value": 1,
    }
]

const NewAction = () => {
    const [{accessToken}] = useAuthContext();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [year, setYear] = useState(Number);
    const [type, setType] = useState();
    const [active, setActive] = useState(false);
    const [availability, setAvailability] = useState(false);
    const [neco, setNeco] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState();

    const createAction = async() => {
        setIsLoading(true);
        setError(false);
        await axios.post("/api/Actions",
            {
                name: name,
                description: description,
                year: year,
                start: startDate,
                end: endDate,
                active: active,
                formOfAction: type,
                availability: availability
            }
        ,
        {
            headers: {
                //"Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
        .then(response=>{
            setNeco(response);
        })
        .catch(error=>{
            setError(true);
        })
        .finally(()=>{
            setIsLoading(false);
        })
    }

    return (
        <div>
            <h1>Nová akce</h1>
            <Form fluid>
                <Row>
                    <Col lg={20} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel >Název Akce</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <Input value={name} onChange={e => setName(e)} />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col lg={20} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel >školní rok</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <InputNumber style={{ width: "100%" }} value={year} onChange={e => setYear(e)} />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col lg={20} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel >Začátek</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <Input type="datetime-local" value={startDate} onChange={e=>setStartDate(e)} />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col lg={20} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel >Konec</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <Input type="datetime-local" />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col lg={20} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel>Forma Akce</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <SelectPicker block searchable="false" data={actionType} value={type} onChange={e => setType(e)} />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col lg={20} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel>Popis Akce</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <Input as="textarea" rows={5} value={description} onChange={e => setDescription(e)} />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col lg={20} lgOffset={2}>
                        <Form.Group>
                            <Col lg={16} lgOffset={6}>
                                <Checkbox value={active} onChange={e => setActive(!active)}>Aktivní</Checkbox>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col lg={20} lgOffset={2}>
                        <Form.Group>
                            <Col lg={16} lgOffset={6}>
                                <Checkbox value={availability} onChange={e => setAvailability(!availability)}>Na titulní stránce</Checkbox>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Button color="cyan" appearance="primary" onClick={()=>{createAction()}}>Uložit</Button>
            </Form>
        </div>
    )
}

export default NewAction;