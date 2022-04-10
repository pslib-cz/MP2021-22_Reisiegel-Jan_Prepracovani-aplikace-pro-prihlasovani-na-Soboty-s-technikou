import axios from "axios";
import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Radio, RadioGroup, Row, SelectPicker } from "rsuite";
import { useState } from "react";
import { useAuthContext } from "../../providers/AuthProvider";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getAuthorization, useRequireAdmin } from "../Auth/useAuthorization";
import Unauthorized from "../general/Unauthorized";

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

const NewGroup = () => {
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

    const [answer, setAnswer] = useState();
    const [lectors, setLectors] = useState();

    const createGroup = () => {
        setIsLoading(true);
        setError(false);
        axios.post("/api/Groups/", {
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
        }
        )
            .then(response => {
                setAnswer(response.data);
            })
            .catch(error => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

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
                setLectors(response.data);
                console.log(response.data);
            })
            .catch(error => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getActionsSelector();
        getLectorsSelector();
    }, [accessToken]);


    return (
        <div>
            <h2>Vytvořit novou skupinu</h2>
            <Form fluid>
                <Row>
                    <Col lg={22} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel >Název skupiny</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <Input value={groupName} onChange={e => setGroupName(e)} placeholder="Vývoj webové stránky ve Wordpressu"></Input>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col lg={22} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel >Akce</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <SelectPicker block searchable={true} data={actionsSelector} value={action} onChange={e => setAction(e)} />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col lg={22} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel >Odpovědný lektor</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <SelectPicker block data={lectors} value={headLector} onChange={e => setHeadLector(e)}></SelectPicker>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col lg={22} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel >Počet Lektorů</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <InputNumber style={{ width: "100%" }} value={numberOfLectors} onChange={e => setNumberOfLectors(e)}></InputNumber>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col lg={22} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel >Poznámka k Lektorům</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <CKEditor
                                    config={{
                                        language: 'cs',
                                        toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
                                    }}
                                    editor={ClassicEditor}
                                    data={lectorNote}
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
                    <Col lg={22} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel >Kapacita</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <InputNumber style={{ width: "100%" }} value={capacity} onChange={e => setCapacity(e)}></InputNumber>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col lg={22} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel >Minimální ročník</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <SelectPicker block data={yearData} searchable={false} value={minYear} onChange={e => setMinYear(e)}></SelectPicker>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col lg={22} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel >Popis</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <CKEditor
                                    config={{
                                        language: 'cs',
                                        toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
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
                    <Col lg={22} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel >Otevřená</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <Checkbox value={open} onChange={e => setOpen(!open)}></Checkbox>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col lg={22} lgOffset={2}>
                        <Form.Group>
                            <Col lg={6}>
                                <Form.ControlLabel >Poznámka</Form.ControlLabel>
                            </Col>
                            <Col lg={16}>
                                <CKEditor
                                    config={{
                                        language: 'cs',
                                        toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
                                    }}
                                    editor={ClassicEditor}
                                    data={note}
                                    onChange={(event, editor) => {
                                        //const data = editor.getData();
                                        setNote(editor.getData());
                                    }}
                                />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Button color="cyan" appearance="primary" onClick={() => createGroup()} as={Link} to="/AllGroups" >Vytvořit</Button>
            </Form>
        </div>
    )


}

export default NewGroup;