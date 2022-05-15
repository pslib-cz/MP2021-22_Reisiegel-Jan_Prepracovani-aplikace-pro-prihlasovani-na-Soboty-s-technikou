import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { useAuthContext } from '../../../providers/AuthProvider';
import { Button, Col, Drawer, Dropdown, IconButton, Nav, Navbar, Row } from 'rsuite';
import { Spinner } from 'reactstrap';
import MenuIcon from '@rsuite/icons/Menu';

export const NavMenu = props => {
    const [{ profile, accessToken, isUserLoading, userManager }] = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    console.log(profile);

    const renderIconButton = (props, ref) => {
        return (
            <IconButton {...props} ref={ref} icon={<MenuIcon />} color="blue" appearance='primary' style={{ marginLeft: ".6em", marginTop: ".8em" }} />
        );
    };

    return (
        <Navbar>
            <Row>
                <Col md={1} lg={2}>
                </Col>
                <Col xs={24} sm={24} mdHidden lgHidden>
                    {
                        profile ? profile.admin ? (
                            <Nav>
                                <Nav.Dropdown placement='bottomStart' renderToggle={renderIconButton}>
                                    <Nav.Dropdown.Item as={Link} to={"/Applications"}>Přihlášky</Nav.Dropdown.Item>
                                    <Nav.Dropdown.Menu title="Uživatelé">
                                        <Nav.Dropdown.Item as={Link} to="/Users">Seznam</Nav.Dropdown.Item>
                                        <Nav.Dropdown.Item as={Link} to="/Profile">Detail profilu</Nav.Dropdown.Item>
                                    </Nav.Dropdown.Menu>
                                    <Nav.Dropdown.Menu title="Akce">
                                        <Nav.Dropdown.Item as={Link} to="/AllActions">Seznam</Nav.Dropdown.Item>
                                        <Nav.Dropdown.Item as={Link} to="/NewAction">Nová</Nav.Dropdown.Item>
                                    </Nav.Dropdown.Menu>
                                    <Nav.Dropdown.Menu title="Skupiny">
                                        <Nav.Dropdown.Item as={Link} to="/AllGroups">Seznam</Nav.Dropdown.Item>
                                        <Nav.Dropdown.Item as={Link} to="/NewGroup">Nová</Nav.Dropdown.Item>
                                    </Nav.Dropdown.Menu>
                                </Nav.Dropdown>
                            </Nav>
                        ) : profile.lector ? (
                            <Nav>
                                <Nav.Dropdown placement='bottomStart' renderToggle={renderIconButton}>
                                    <Nav.Dropdown.Menu title="Akce">
                                        <Nav.Dropdown.Item as={Link} to="/AllActions">Seznam</Nav.Dropdown.Item>
                                        <Nav.Dropdown.Item as={Link} to="/NewAction">Nová</Nav.Dropdown.Item>
                                    </Nav.Dropdown.Menu>
                                    <Nav.Dropdown.Menu title="Skupiny">
                                        <Nav.Dropdown.Item as={Link} to="/AllGroups">Seznam</Nav.Dropdown.Item>
                                        <Nav.Dropdown.Item as={Link} to="/NewGroup">Nová</Nav.Dropdown.Item>
                                    </Nav.Dropdown.Menu>
                                </Nav.Dropdown>
                            </Nav>
                        ) : null : null
                    }
                    <Navbar.Brand as={Link} to={"/"} style={{ fontWeight: "bold" }}>
                        Soboty s technikou
                    </Navbar.Brand>
                    <Nav pullRight>
                        {
                            userManager ?
                                accessToken ?
                                    <Nav.Dropdown title={profile.preferred_username}>

                                    </Nav.Dropdown> :
                                    <Nav.Item as={Link} to="/log-in" onClick={() => { userManager.signinRedirect({ redirectUrl: "/" }) }}>Přihlásit se</Nav.Item> :
                                null

                        }

                    </Nav>
                </Col>
                <Col xsHidden smHidden md={22} lg={20}>
                    <Navbar.Brand as={Link} to={"/"} style={{ fontWeight: "bold" }}>
                        Soboty s technikou
                    </Navbar.Brand>
                    {
                        profile ? profile.admin ? (
                            <Nav>
                                <Nav.Dropdown title={"Uživatelé"}>
                                    <Nav.Dropdown.Item as={Link} to="/Users">
                                        Seznam
                                    </Nav.Dropdown.Item>
                                    <Nav.Dropdown.Item as={Link} to="/Profile">
                                        Detail
                                    </Nav.Dropdown.Item>
                                </Nav.Dropdown>
                                <Nav.Dropdown title={"Skupiny"}>
                                    <Nav.Dropdown.Item as={Link} to="/NewGroup">
                                        Nová
                                    </Nav.Dropdown.Item>
                                    <Nav.Dropdown.Item as={Link} to="/AllGroups">
                                        Seznam
                                    </Nav.Dropdown.Item>
                                </Nav.Dropdown>
                                <Nav.Dropdown title={"Akce"}>
                                    <Nav.Dropdown.Item as={Link} to="/NewAction">
                                        Nová
                                    </Nav.Dropdown.Item>
                                    <Nav.Dropdown.Item as={Link} to="/AllActions">
                                        Seznam
                                    </Nav.Dropdown.Item>
                                </Nav.Dropdown>
                                <Nav.Item as={Link} to={"/Applications"}>
                                    Přihlášky
                                </Nav.Item>
                            </Nav>
                        ) : profile.lector ? (
                            <Nav>
                                <Nav.Dropdown title={"Skupiny"}>
                                    <Nav.Dropdown.Item as={Link} to="/NewGroup">
                                        Nová
                                    </Nav.Dropdown.Item>
                                    <Nav.Dropdown.Item as={Link} to="/AllGroups">
                                        Seznam
                                    </Nav.Dropdown.Item>

                                </Nav.Dropdown>
                                <Nav.Dropdown title={"Akce"}>
                                    <Nav.Dropdown.Item as={Link} to="/NewAction">
                                        Nová
                                    </Nav.Dropdown.Item>
                                    <Nav.Dropdown.Item as={Link} to="/AllActions">
                                        Seznam
                                    </Nav.Dropdown.Item>
                                </Nav.Dropdown>
                            </Nav>
                        ) : null : null
                    }
                    <Nav pullRight>
                        {
                            accessToken ?
                                <Nav.Dropdown title={profile.preferred_username}>
                                    <Nav.Dropdown.Item as={Link} to="/Profile">Profil</Nav.Dropdown.Item>
                                    <Nav.Dropdown.Item as={Link} to={"/EditUser"}>Upravit</Nav.Dropdown.Item>
                                </Nav.Dropdown>
                                : isUserLoading ?
                                    <Spinner size={"sm"} />
                                    : null
                        }
                        {
                            userManager ?
                                accessToken ?
                                    <Nav.Item as={Link} to="/log-out" onClick={() => { userManager.signoutRedirect() }}>Odhlásit</Nav.Item> :
                                    <Nav.Item as={Link} to="/log-in" onClick={() => { userManager.signinRedirect({ redirectUrl: "/" }) }}>Přihlásit se</Nav.Item> :
                                null

                        }

                    </Nav>
                </Col>
                <Col md={1} lg={2}>
                </Col>
            </Row>
        </Navbar >
    )
}