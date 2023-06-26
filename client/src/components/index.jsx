import { useEffect, useState } from "react";
import Head from "./head";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from 'reactstrap';
import useEth from "../contexts/EthContext/useEth";
import VotingStates from "./voting_states";
import NoticeNoArtifact from "./notices/NoticeNoArtifact";
import NoticeWrongNetwork from "./notices/NoticeWrongNetwork";
import ChangeStatus from "./change_status";
import AddVoter from "./voter/add_voter";
import ListVoters from "./voter/list_voters";
import AddProposal from "./proposal/ProposalControl";
import ListProposal from "./proposal/ProposalList";

const Index = () => {

  const { state: { artifact, contract, accounts, owner } } = useEth();
  const [ownerPart, setOwnerPart] = useState();
  const [voterPart, setVoterPart] = useState();

  // Gestion des droits du compte connecté
  useEffect(() => {
      (async function () {
          if (contract) {
              if(owner === accounts[0]) {
                  console.log('i am the owner !')
                  setOwnerPart(<Row>
                                <ChangeStatus />
                                <ListVoters />
                                <AddVoter />
                              </Row>);
              }

              // recherche des voters dans les évènements
              let options = {filter: {value: [],},fromBlock: 0};
              contract.events.VoterRegistered(options)
                  .on('data', event => {
                    if(event.returnValues.voterAddress === accounts[0]) {
                      console.log('i am a voter !')
                      setVoterPart(<Row>
                                    <ListProposal />
                                    <AddProposal />
                                  </Row>);
                    }
                  })
                  .on('changed', changed => console.log(changed))
                  .on('error', err => console.log(err))
                  .on('connected', str => console.log(str));
          }
      })();
  }, [contract]);

  const body = <Row>
  <Col>
    {ownerPart}
    {voterPart}
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