import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button, Checkbox, Col, DatePicker, Form, Input, Radio, RadioGroup, Row, SelectPicker } from "rsuite";
import { createNonNullExpression } from "typescript";
import { useAuthContext } from "../../providers/AuthProvider";

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
const conditionData = [
    {
        "label": "Aktivní",
        "value": 0,
    },
    {
        "label": "Zablokovaný",
        "value": 1,
    }
]
const userRoles = [
    {
        "label": "Uživatel",
        "value": "",
    },
    {
        "label": "Lektor",
        "value": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2",
    },
    {
        "label": "Administrátor",
        "value": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
    },
]

const EditUser = () => {
    const { mail } = useParams();
    const [{ accessToken, profile }] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [userData, setUserData] = useState();

    const [name, setName] = useState();
    const [surname, setSurname] = useState();
    const [birthDate, setBirthDate] = useState();
    const [gender, setGender] = useState();
    const [school, setSchool] = useState();
    const [potStudent, setPotStudent] = useState();
    const [year, setYear] = useState();
    const [email, setEmail] = useState();
    const [role, setRole] = useState();
    const [condition, setCondition] = useState();
    const [informed, setInformed] = useState();
    const [emailConfirmed, setEmailConfirmed] = useState();


    const getUserData = () => {
        setIsLoading(true);
        setError(false);
        if (mail) {
            axios.get("/api/Users/User/" + mail, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    setUserData(response.data);

                })
                .catch(error => {
                    setError(true);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
        else {
            axios.get("/api/Users/User/" + profile.name, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    setUserData(response.data);
                })
                .catch(error => {
                    setError(true);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }

    const saveUserData = () => {
        setIsLoading(true);
        setError(false);
        axios.put("/api/Users/" + userData.id, {
            firstName: name,
            lastName: surname,
            birthDate: birthDate,
            gender: gender,
            school: school,
            year: year,
            potentialStudent: potStudent,
            condition: condition,
            beInformed: informed,
            emailConfirmed: emailConfirmed,
            email: email
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
        getUserData();
    }, [accessToken || profile]);
    if (userData) {
        return (
            <div>
                <h2>{userData.firstName + " " + userData.lastName}</h2>
                <Form fluid>
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel >Jméno</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                    <Input value={name} onChange={e => setName(e)} defaultValue={userData.firstName}></Input>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel >Příjmení</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                    <Input value={surname} onChange={e => setSurname(e)} defaultValue={userData.lastName}></Input>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel >Datum narození</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                    <DatePicker block type="datetime" value={birthDate} onChange={e => setBirthDate(e)} defaultValue={Date.parse(userData.birthDate)}></DatePicker>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10} lgOffset={10}>
                                    <RadioGroup
                                        inline
                                        value={gender}
                                        defaultValue={userData.gender}
                                        onChange={value => setGender(value)}>
                                        <Radio value={0}>Muž</Radio>
                                        <Radio value={1}>Žena</Radio>
                                    </RadioGroup>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel>Škola</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                    <Input value={school} onChange={e => setSchool(e)} defaultValue={userData.school}></Input>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel>Ročník</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                    <SelectPicker block searchable={false} data={yearData} defaultValue={userData.year} value={year} onChange={e => setYear(e)} />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10} lgOffset={10}>
                                    <Checkbox checked={potStudent} onChange={e => setPotStudent(!potStudent)} defaultChecked={userData.potentionalStudent} >Chce být studentem SPŠSE</Checkbox>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel>E-mailová adresa</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                    <Input value={email} onChange={e => setEmail(e)} defaultValue={userData.email}></Input>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel>Role</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                    <SelectPicker block searchable={false} data={userRoles} defaultValue={userData.roleString} value={role} onChange={e => setRole(e)} />
                                </Col>
                                <Col>

                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10}>
                                    <Form.ControlLabel>Stav</Form.ControlLabel>
                                </Col>
                                <Col lg={10}>
                                    <SelectPicker block searchable={false} data={conditionData} defaultValue={userData.condition} value={condition} onChange={e => setCondition(e)} />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10} lgOffset={10}>
                                    <Checkbox checked={informed} onChange={e => setInformed(!informed)} defaultChecked={userData.potentionalStudent} >Chce být informován</Checkbox>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col lg={10} lgOffset={10}>
                                    <Checkbox checked={emailConfirmed} onChange={e => setEmailConfirmed(!emailConfirmed)} defaultChecked={userData.emailConfirmed} disabled>Potvrzený email</Checkbox>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button color="cyan" appearance="primary" onClick={() => saveUserData()} as={Link} to="/Users" >Uložit</Button>
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
export default EditUser;