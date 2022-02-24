import React, { Component } from 'react';
import { Col, Container, Content, Footer, Header, Row, Sidebar } from 'rsuite';
import { NavMenu } from './general/Menu/NavMenu';
import SideMenu from './general/Menu/SideMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    if (true) {
      return (
        <Container>
          <Header><NavMenu /></Header>
          <Content>
            <Container>
              <Content>
                <Row>
                  <Col lg={2}>
                  </Col>
                  <Col lg={20} >
                    {this.props.children}
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
    else {
      return (
        <Container>
          <Header><NavMenu /></Header>
          <Content>
            <Container>
              <Content>
                <Row>
                  <Col lg={2}>
                  </Col>
                  <Col lg={16} xs={20} >
                    {this.props.children}
                  </Col>
                  <Col lg={4} xsHidden mdHidden>
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
}
