import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, SelectPicker } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Link } from "react-router-dom";

const yearData = [
    {
        "label": "Nevybráno",
        "value": 0,
    },
    {
        "label": "7. a nižší třída",
        "value": 1,
    },
    {
        "label": "8. třída ZŠ",
        "value": 2,
    },
    {
        "label": "9. třída ZŠ",
        "value": 3,
    },
    {
        "label": "Vyšší třída (SŠ)",
        "value": 4,
    }
];

const EditGroup = () => {
    const { year, actionId, groupId } = useParams();
    const [{ accessToken }] = useAuthContext();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [groupData, setGroupData] = useState();

    const [groupName, setGroupName] = useState();
    const [desc, setDesc] = useState();
    const [capacity, setCapacity] = useState();
    const [open, setOpen] = useState();
    const [numberOfLectors, setNumberOfLectors] = useState();
    const [headLector, setHeadLector] = useState();
    const [action, setAction] = useState();
    const [minYear, setMinYear] = useState();
    const [lectorNote, setLectorNote] = useState();
    const [note, setNote] = useState();

    const [actionsSelector, setActionsSelector] = useState();
    const [lectorsSelector, setLectorsSelector] = useState();

    const getActionsSelector = () => {
        setIsLoading(true);
        setError(false);
        axios.get("/api/Actions/Selector", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setActionsSelector(response.data);
            })
            .catch(error => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const getLectorsSelector = () => {
        setIsLoading(true);
        setError(false);
        axios.get("/api/Users/LectorSelector", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setLectorsSelector(response.data);
                console.log(response.data);
            })
            .catch(error => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

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
                setGroupName(response.data.name);
                setDesc(response.data.description);
                setCapacity(response.data.capacity);
                setOpen(response.data.open);
                setNumberOfLectors(response.data.numberOfLectors);
                setHeadLector(response.data.headLectorId);
                setAction(response.data.actionId);
                setMinYear(response.data.minYearToEnter);
                setLectorNote(response.data.noteForLectors);
                setNote(response.data.note);
            })
            .catch(error => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const saveGroupData = () => {
        setIsLoading(true);
        setError(false);
        axios.put("/api/Groups/", {
            id: groupData.id,
            name: groupName,
            description: desc,
            capacity: capacity,
            open: open,
            headLectorId: headLector,
            actionId: action,
            numberOfLectors: numberOfLectors,
            minYear: minYear,
            noteForLectors: lectorNote,
            note: note
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
            })
    }

    useEffect(() => {
        getGroupData();
        getLectorsSelector();
        getActionsSelector();
    }, [accessToken]);

    if (groupData) {
        return (
            <Col xs={24} sm={24} md={24} lg={24}>
                <h2>{groupName}</h2>
                <Form fluid>
                    <Row>
                        <Col xs={24} sm={24} md={22} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={8} lg={10}>
                                    <Form.ControlLabel >Název</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={10}>
                                    <Input value={groupName} onChange={e => setGroupName(e)} ></Input>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={22} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={8} lg={10}>
                                    <Form.ControlLabel >Akce</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={10}>
                                    <SelectPicker block searchable={false} data={actionsSelector} value={action} onChange={e => setAction(e)} />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={22} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={8} lg={10}>
                                    <Form.ControlLabel >Lektor</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={10}>
                                    <SelectPicker block searchable={false} data={lectorsSelector} value={headLector} onChange={e => setHeadLector(e)} />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={22} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={8} lg={10}>
                                    <Form.ControlLabel >Počet lektorů</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={10}>
                                    <InputNumber block value={numberOfLectors} onChange={e => numberOfLectors(e)} ></InputNumber>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={22} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={8} lg={10}>
                                    <Form.ControlLabel>Poznámka k lektorům</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={10}>
                                    <CKEditor
                                        config={{
                                            language: 'cs',
                                            toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
                                        }}

                                        editor={ClassicEditor}
                                        data={lectorNote}
                                        onReady={editor => {
                                            console.log(lectorNote);
                                            lectorNote ? editor.setData(lectorNote) : editor.setData("");
                                        }}
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
                        <Col xs={24} sm={24} md={22} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={8} lg={10}>
                                    <Form.ControlLabel>Kapacita</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={10}>
                                    <InputNumber block value={capacity} onChange={e => setCapacity(e)} ></InputNumber>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={22} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={8} lg={10}>
                                    <Form.ControlLabel>Minimální ročník</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={10}>
                                    <SelectPicker block searchable={false} data={yearData} value={minYear} onChange={e => setMinYear(e)} />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={22} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={8} lg={10}>
                                    <Form.ControlLabel>Popis</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={10}>
                                    <CKEditor
                                        config={{
                                            language: 'cs',
                                            toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
                                        }}
                                        onReady={editor => {
                                            desc ? editor.setData(desc) : editor.setData("");
                                        }}
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
                        <Col xs={24} sm={24} md={22} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Form.Group>
                                    <Col xs={24} sm={8} md={8} mdOffset={8} lg={10} lgOffset={10}>
                                        <Checkbox checked={open} onChange={e => setOpen(!open)}  >Otevřená pro zápis</Checkbox>
                                    </Col>
                                </Form.Group>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={22} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={8} lg={10}>
                                    <Form.ControlLabel>Poznámka</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={10}>
                                    <CKEditor
                                        config={{
                                            language: 'cs',
                                            toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
                                        }}
                                        editor={ClassicEditor}
                                        data={note}
                                        onReady={editor => {
                                            note ? editor.setData(note) : editor.setData("");
                                        }}
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
                    <Col xs={24} sm={8} smOffset={8} md={8} mdOffset={8} lg={8} lgOffset={8}>
                        <Button block color="cyan" appearance="primary" onClick={() => saveGroupData()} as={Link} to="/AllGroups" >Uložit</Button>
                    </Col>
                </Form>
            </Col>
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

export default EditGroup;