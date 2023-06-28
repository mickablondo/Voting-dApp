import { useEffect, useState } from "react";
import Head from "./head";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from 'reactstrap';
import useEth from "../contexts/EthContext/useEth";
import VotingStates from "./voting_states";
import NoticeNoArtifact from "./notices/NoticeNoArtifact";
import NoticeWrongNetwork from "./notices/NoticeWrongNetwork";
import ChangeStatus from "./ChangeStatus";
import VoterControl from "./voter/VoterControl";
import VoterList from "./voter/VoterList";
import AddProposal from "./proposal/ProposalControl";
import ListProposal from "./proposal/ProposalList";

const Index = () => {

  const { state: { artifact, contract, accounts, owner } } = useEth();
  const [isOwnerState, setIsOwnerState] = useState(false);
  const [isVoterState, setIsVoterState] = useState(false); 
  const [votersState, setVotersState] = useState([]);
 
  const addVoter = (voterAddress) => {
    console.log("adding a votersState: "+ voterAddress); 
    setVotersState(votersState => [...votersState, voterAddress]);
  };

  // Gestion des droits du compte connecté
  useEffect(() => { 
    if (contract) {
      if(owner === accounts[0]) {
          console.log('i am the owner !')
          setIsOwnerState(true); 
      }

      // recherche des voters dans les évènements
      let options = {filter: {value: [],},fromBlock: 0};
      contract.events.VoterRegistered(options)
          .on('data', event => {
            addVoter(event.returnValues.voterAddress);
            if(event.returnValues.voterAddress === accounts[0]) { 
              console.log('i am a voter !')
              setIsVoterState(true);
            }  
          })
          .on('changed', changed => console.log(changed))
          .on('error', err => console.log(err))
          .on('connected', str => console.log(str));
    } 
  }, [contract]);

  const body = <Row>
  <Col>
    {isOwnerState && (
      <Row>
        <ChangeStatus />
        <VoterList votersState={votersState} />
        { isOwnerState && (
          <VoterControl />
        )}
      </Row>
    )}
    {isVoterState && (
      <Row> 
        <ListProposal />
        <AddProposal />
      </Row>
    )} 
  </Col>
  <Col>
    <VotingStates />
  </Col>
</Row>;

  return (
    <Container>
        <Row>
          <Head isOwner={isOwnerState} isVoter={isVoterState}/>
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