import { ClassicEditor } from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button, Checkbox, Col, Form, Input, InputNumber, Row } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";
import ErrorMessage from "../general/ErrorMessage";
import Loading from "../general/Loading";
import NotFound from "../general/NotFound";
import Unauthorized from "../general/Unauthorized";

const EditAction = () => {
    const { year, actionId } = useParams();
    const [{ accessToken, profile }] = useAuthContext();
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();

    const [actionData, setActionData] = useState();
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [startDate, setStartDate] = useState(Date);
    const [endDate, setEndDate] = useState(Date);
    const [schoolYear, setSchoolYear] = useState();
    const [type, setType] = useState();
    const [active, setActive] = useState();
    const [availability, setAvailability] = useState();

    const [datum, setDatum] = useState(Date);

    const getActionData = () => {
        setIsLoading(true);
        setError(false);
        axios.get(`/api/Actions/${year}/${actionId}?forEdit=true`, {
            headers: {
                //"Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setActionData(response.data);
                console.log(response.data);
                setName(response.data.name);
                setDescription(response.data.description);
                setStartDate(response.data.start);
                setEndDate(response.data.end);
                setDatum(response.data.end);
                setSchoolYear(response.data.year);
                setType(response.data.type);
                setActive(response.data.active);
                setAvailability(response.data.availability);
            })
            .catch(error => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const saveActionData = () => {
        setIsLoading(true);
        setError(false);
        axios.put(`api/Actions`, {
            id: actionData.id,
            name: name,
            description: description,
            year: year,
            start: startDate,
            end: endDate,
            formOfAction: type,
            active: active,
            availability: availability
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
        getActionData();
    }, [accessToken]);

    if(profile.lector === "1"){
        return (
            <Unauthorized lector={true} />
        )
    }
    else if (actionData) {
        return (
            <Col xs={24} sm={24} md={24} lg={24}>
                <h2>{actionData.name}</h2>
                <Form fluid>
                    <Row>
                        <Col xs={24} sm={24} md={22} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={8} lg={10}>
                                    <Form.ControlLabel >Název</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={10}>
                                    <Input value={name} onChange={e => setName(e)} ></Input>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={22} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={8} lg={10}>
                                    <Form.ControlLabel >Školní rok</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={10}>
                                    <InputNumber block value={schoolYear} onChange={e => setSchoolYear(e)} ></InputNumber>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={22} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={8} lg={10}>
                                    <Form.ControlLabel >Začátek</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={10}>
                                    <Input type="datetime-local" value={startDate} onChange={e => { console.log(e) }} />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={22} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={8} lg={10}>
                                    <Form.ControlLabel >Konec</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={10}>
                                    <Input type="datetime-local" value={endDate} onChange={e => { console.log(e) }} />
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

                                        editor={ClassicEditor}
                                        data={description}
                                        /*onReady={editor => {
                                            description ? editor.setData(description) : editor.setData("");
                                        }}*/
                                        onChange={(event, editor) => {
                                            //const data = editor.getData();
                                            setDescription(editor.getData());
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
                                <Col xs={24} sm={8} smOffset={8} md={8} mdOffset={8} lg={10} lgOffset={10}>
                                    <Checkbox checked={active} onChange={e => setActive(!active)}  >Aktivní akce</Checkbox>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={22} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} smOffset={8} md={8} mdOffset={8} lg={10} lgOffset={10}>
                                    <Checkbox checked={availability} onChange={e => setAvailability(!availability)}  >Zveřejněná na titulní stránce</Checkbox>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Col xs={24} sm={8} smOffset={8} md={8} mdOffset={8} lg={4} lgOffset={10}>
                        <Button block color="cyan" appearance="primary" onClick={() => saveActionData()} as={Link} to="/AllActions" >Uložit</Button>
                    </Col>
                </Form>
            </Col>
        )
    }
    else if (error) {
        return (
            <ErrorMessage />
        )
    }
    else if (isLoading) {
        return (
            <Loading />
        )
    }
    else {
        return (
            <NotFound />
        )
    }
}

export default EditAction;