import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../providers/AuthProvider";

const EditAction = () => {
    const {year, actionId} = useParams();
    const [{accessToken}] = useAuthContext();
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();

    const [actionData, setActionData] = useState();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [year, setYear] = useState(Number);
    const [type, setType] = useState();
    const [active, setActive] = useState(false);
    const [availability, setAvailability] = useState(false);

    const getActionData = () => {
        setIsLoading(true);
        setError(false);
        axios.get(`/api/Actions/${year}/${actionId}`, {
            headers: {
                //"Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
        .then(response=>{
            setActionData(response.data);
            console.log(response.data);
            setName(response.data.name);
            setDescription(response.data.description);
            setStartDate(response.data.start);
            setEndDate(response.data.end);
            setYear(response.data.year);
            setType(response.data.type);
            setActive(response.data.active);
            setAvailability(response.data.availability);
        })
        .catch(error => {
            setError(true);
        })
        .finally(()=>{
            setIsLoading(false);
        });
    }

    useEffect(()=>{
        getActionData();
    }, [accessToken]);

    if (actionData) {
        return (
            <div>
                <h2>{groupName}</h2>
                <Form fluid>
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel >Název</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                    <Input value={groupName} onChange={e => setGroupName(e)} ></Input>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel >Akce</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                    <SelectPicker block searchable={false} data={actionsSelector} value={action} onChange={e => setAction(e)} />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel >Lektor</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                    <SelectPicker block searchable={false} data={lectorsSelector} value={headLector} onChange={e => setHeadLector(e)} />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel >Počet lektorů</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                    <InputNumber block value={numberOfLectors} onChange={e => numberOfLectors(e)} ></InputNumber>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel>Poznámka k lektorům</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                <CKEditor
                                    config={{
                                        language: 'cs'
                                    }}
                                    
                                    editor={ClassicEditor}
                                    data={lectorNote}
                                    onReady={ editor => {
                                        console.log(lectorNote);
                                        lectorNote ? editor.setData(lectorNote) : editor.setData("");
                                    } }
                                    onChange={(event, editor) => {
                                        //const data = editor.getData();
                                        setLectorNote(editor.getData());
                                    }}
                                />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel>Kapacita</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                <InputNumber block value={capacity} onChange={e => setCapacity(e)} ></InputNumber>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel>Minimální ročník</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                    <SelectPicker block searchable={false} data={yearData} value={minYear} onChange={e => setMinYear(e)} />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel>Popis</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                <CKEditor
                                    config={{
                                        language: 'cs'
                                    }}
                                    onReady={ editor => {
                                        desc ? editor.setData(desc) : editor.setData("");
                                    } }
                                    editor={ClassicEditor}
                                    data={desc}
                                    onChange={(event, editor) => {
                                        //const data = editor.getData();
                                        setDesc(editor.getData());
                                    }}
                                />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Form.Group>
                                    <Col lg={10} lgOffset={10}>
                                        <Checkbox checked={open} onChange={e => setOpen(!open)}  >Otevřená pro zápis</Checkbox>
                                    </Col>
                                </Form.Group>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel>Poznámka</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                <CKEditor
                                    config={{
                                        language: 'cs'
                                    }}
                                    editor={ClassicEditor}
                                    data={note}
                                    onReady={ editor => {
                                        note ? editor.setData(note) : editor.setData("");
                                    } }
                                    onChange={(event, editor) => {
                                        //const data = editor.getData();
                                        setNote(editor.getData());
                                    }}
                                />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    
                    <Button color="cyan" appearance="primary" onClick={() => saveGroupData()} as={Link} to="/AllGroups" >Uložit</Button>
                    <Button color="cyan" appearance="primary" onClick={() => console.log(typeof (date))} >Datum</Button>
                </Form>
            </div>
        )
    }
    else if (error) {
        return (
            <div></div>
        )
    }
    else if (isLoading) {
        return (
            <div></div>
        )
    }
    else {
        return (
            <div></div>
        )
    }
}

export default EditAction;