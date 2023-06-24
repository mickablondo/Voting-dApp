import { useEffect } from "react";
import Head from "./head";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from 'reactstrap';
import useEth from "../contexts/EthContext/useEth";
import VotingStates from "./voting_states";
import NoticeNoArtifact from "./notices/NoticeNoArtifact";
import NoticeWrongNetwork from "./notices/NoticeWrongNetwork";

const Index = () => {

  const { state: { artifact, contract, accounts, owner } } = useEth();

  // Gestion des droits du compte connecté
  useEffect(() => {
      (async function () {
          if (contract) {
              if(owner === accounts[0]) {
                  console.log('i am the owner !')
              }
          }
      })();
  }, [contract]);

  const body = <Row>
  <Col>
    CECI EST A GAUCHE
  </Col>
  <Col>
    <VotingStates />
  </Col>
</Row>;

  return (
    <Container>
        <Row>
          <Head />
        </Row>
        {
          !artifact ? <NoticeNoArtifact /> :
            !contract ? <NoticeWrongNetwork /> :
              body
        }
      </Container>
  )
}

export default Index