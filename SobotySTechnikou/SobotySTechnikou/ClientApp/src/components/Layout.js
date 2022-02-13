import React, { Component } from 'react';
import { Col, Container, Content, Footer, Header, Row, Sidebar } from 'rsuite';
import { NavMenu } from './general/Menu/NavMenu';
import SideMenu from './general/Menu/SideMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
        <Container>
          <Header><NavMenu /></Header>
          <Content>
            <Container>
              <Content>
                <Row>
                  <Col lg={2}>
                  </Col>
                  <Col lg={16}>
                    {this.props.children}
                  </Col>
                  <Col lg={4}>
                    <SideMenu />
                  </Col>
                  <Col lg={2}>
                  </Col>
                </Row>
              </Content>
            </Container>
          </Content>
          <Footer></Footer>
        </Container>
    );
  }
}
