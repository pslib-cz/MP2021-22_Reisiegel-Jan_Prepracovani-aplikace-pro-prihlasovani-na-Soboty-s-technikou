import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button, Checkbox, Col, DatePicker, Form, Input, Radio, RadioGroup, Row, SelectPicker } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";
import ErrorMessage from "../general/ErrorMessage";
import Loading from "../general/Loading";
import NotFound from "../general/NotFound";
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
        "value": "user",
    },
    {
        "label": "Lektor",
        "value": "lector",
    },
    {
        "label": "Administrátor",
        "value": "admin",
    },
]

const EditUser = () => {
    const { mail } = useParams();
    const [{ accessToken, profile }] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    //const [errorMessage, setErrorMessage] = useState("");
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
    const [date, setDate] = useState(Date.now);


    const getUserData = () => {
        setIsLoading(true);
        setError(false);
        if (mail) {
            axios.get("/api/Users/User" + mail, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    setUserData(response.data);
                    setName(response.data.firstName);
                    setSurname(response.data.lastName);
                    setBirthDate(response.data.birthDate);
                    setGender(response.data.gender);
                    setSchool(response.data.school);
                    setPotStudent(response.data.potentionalStudent);
                    setYear(response.data.year);
                    setRole(response.data.roleString);
                    setCondition(response.data.condition);
                    setInformed(response.data.beInformed);
                    setEmail(response.data.email);
                    setEmailConfirmed(response.data.emailConfirmed);

                })
                .catch(error => {
                    setError(true);
                    //setErrorMessage(error)
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
        else {
            axios.get("/api/Users/User/" + profile.email, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    setUserData(response.data);
                    setName(response.data.firstName);
                    setSurname(response.data.lastName);
                    setBirthDate(response.data.birthDate);
                    setGender(response.data.gender);
                    setSchool(response.data.school);
                    setPotStudent(response.data.potentionalStudent);
                    setYear(response.data.year);
                    setRole(response.data.roleString);
                    setCondition(response.data.condition);
                    setInformed(response.data.beInformed);
                    setEmail(response.data.email);
                    setEmailConfirmed(response.data.emailConfirmed);
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
        console.log(birthDate);
        setIsLoading(true);
        setError(false);
        axios.put("/api/Users/" + userData.id, {
            firstName: name,
            lastName: surname,
            birthDate: birthDate,
            gender: gender,
            school: school ? school : "",
            year: year,
            potentialStudent: potStudent,
            condition: condition,
            beInformed: informed,
            emailConfirmed: emailConfirmed,
            email: email,
            id: userData.id,
            roleString: role

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

    const addRole = () => {
        setIsLoading(true);
        setError(false);
        console.log("userId: " + userData.id + " | funkce: " + role);
        axios.post("/api/Users/" + userData.id + "/ChangeAuthorization/" + role, {
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
                setIsLoading(false)
            })
    }

    useEffect(() => {
        getUserData();
    }, [accessToken || profile]);
    if(mail){
        if(profile.admin == undefined || !profile.admin === "1"){
            return (
                <Unauthorized admin={true} />
            )
        }
    }
    else if(!accessToken){
        
        return (
            <Unauthorized />
        )
    }
    else if (userData) {
        return (
            <div>
                <h2>{userData.firstName + " " + userData.lastName}</h2>
                <Form fluid>
                    <Row>
                        <Col xs={24} sm={24} md={20} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={10} lg={10}>
                                    <Form.ControlLabel >Jméno</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={16} md={10} lg={10}>
                                    <Input value={name} onChange={e => setName(e)} ></Input>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={20} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={10} lg={10}>
                                    <Form.ControlLabel >Příjmení</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={16} md={10} lg={10}>
                                    <Input value={surname} onChange={e => setSurname(e)} ></Input>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={20} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={10} lg={10}>
                                    <Form.ControlLabel >Datum narození</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={16} md={10} lg={10}>
                                    <Input block value={birthDate} onChange={e => setBirthDate(e)} ></Input>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={20} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={16} smOffset={8} md={10} mdOffset={10} lg={10} lgOffset={10}>
                                    <RadioGroup
                                        inline
                                        value={gender}
                                        defaultValue={userData.gender}
                                        onChange={value => setGender(value)}>
                                        <Col xs={12}>
                                            <Radio value={1}>Muž</Radio>
                                        </Col>
                                        <Col xs={12}>
                                            <Radio value={2}>Žena</Radio>
                                        </Col>
                                    </RadioGroup>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={20} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={10} lg={10}>
                                    <Form.ControlLabel>Škola</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={16} md={10} lg={10}>
                                    <Input value={school} onChange={e => setSchool(e)} ></Input>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={20} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={10} lg={10}>
                                    <Form.ControlLabel>Ročník</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={16} md={10} lg={10}>
                                    <SelectPicker block searchable={false} data={yearData} value={year} onChange={e => setYear(e)} />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={20} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={16} smOffset={8} md={10} mdOffset={10} lg={10} lgOffset={10}>
                                    <Checkbox checked={potStudent} onChange={e => setPotStudent(!potStudent)} >Chce být studentem SPŠSE</Checkbox>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={20} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={10} lg={10}>
                                    <Form.ControlLabel>E-mailová adresa</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={16} md={10} lg={10}>
                                    <Input value={email} onChange={e => setEmail(e)} ></Input>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={20} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={16} smOffset={8} md={10} mdOffset={10} lg={10} lgOffset={10}>
                                    <Checkbox checked={informed} onChange={e => setInformed(!informed)}  >Chce být informován</Checkbox>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={20} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={10} lg={10}>
                                    <Form.ControlLabel>Role</Form.ControlLabel>
                                </Col>
                                <Col xs={16} sm={10} md={7} lg={5}>
                                    <SelectPicker block searchable={false} data={userRoles} value={role} onChange={e => setRole(e)} disabled={profile.admin ? false : true} />
                                </Col>
                                <Col xs={8} sm={6} md={3} lg={5}>
                                    <Button block color="cyan" appearance="primary" onClick={() => addRole()} as={Link} to="/Users" disabled={profile.admin ? false : true}>Změnit roli</Button>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={20} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={8} md={10} lg={10}>
                                    <Form.ControlLabel>Stav</Form.ControlLabel>
                                </Col>
                                <Col xs={24} sm={16} md={10} lg={10}>
                                    <SelectPicker block searchable={false} data={conditionData} value={condition} onChange={e => setCondition(e)} disabled={profile.admin ? false : true} />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={24} sm={24} md={20} mdOffset={2} lg={20} lgOffset={2}>
                            <Form.Group>
                                <Col xs={24} sm={16} smOffset={8} md={10} mdOffset={10} lg={10} lgOffset={10}>
                                    <Checkbox checked={emailConfirmed} onChange={e => setEmailConfirmed(!emailConfirmed)} disabled>Potvrzený email</Checkbox>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Col xs={24} sm={8} smOffset={8} md={8} mdOffset={8} lg={8} lgOffset={8}>
                        <Button block color="cyan" appearance="primary" onClick={() => saveUserData()} as={Link} to="/Users" >Uložit</Button>
                    </Col>
                </Form>
            </div>
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
export default EditUser;
