import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

function Footer() {
    return (
        <footer className="py-3 pt-5">
            <Container>
                <Row>
                    <hr />
                    <Col>
                        <div>Caleb Addison, 2024</div>
                        <a href="https://github.com/caleb-addison/simple-wunderground-project">
                            Project Source Code
                        </a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
