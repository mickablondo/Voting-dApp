import { useEffect, useState } from "react";
import Head from "./head";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from 'reactstrap';
import useEth from "../contexts/EthContext/useEth";
import VotingStates from "./votingState/VotingStatePanel";
import NoticeNoArtifact from "./notices/NoticeNoArtifact";
import NoticeWrongNetwork from "./notices/NoticeWrongNetwork";
import ChangeStatus from "./ChangeStatus";
import VoterContainer from "./voter/VoterContainer";
import AddProposal from "./proposal/ProposalControl";
import ListProposal from "./proposal/ProposalList";
import ProposalVoting from "./proposal/ProposalVoting";

const Index = () => {

  const { state: { artifact, contract, accounts, owner } } = useEth();
  const [isOwnerState, setIsOwnerState] = useState(false);
  const [isVoterState, setIsVoterState] = useState(false); 
  const [votersState, setVotersState] = useState([]);
  const [proposalsState, setProposalsState] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(0);
  
  let voterRegisteredSubscription, proposalRegisteredSubscription;

  // Définition d'une proposal
  class Proposal {
    constructor(id, description, voteCount) {
      this.id = id;
      this.description = description;
      this.voteCount = voteCount;
    }
  }

  const resetAccountStates = () => {
    setIsOwnerState(false);
    setIsVoterState(false);
    setVotersState([]);
    setProposalsState([]);
  };
 
  const addVoter = (voterAddress) => {
    if (!votersState.includes(voterAddress)) {
      console.log("adding a votersState: "+ voterAddress);
      setVotersState(voters => [...voters, voterAddress]);
    }
  };

  const addProposal = async (proposalId) => {
    console.log("adding a proposalState: "+ proposalId);
    const proposal = await contract.methods.getOneProposal(proposalId).call({ from: accounts[0]});

    setProposalsState(proposalsState => [...proposalsState,
      new Proposal(proposalId, proposal.description, proposal.voteCount)]
    );
  };
  
  // reset states/data related to account
  useEffect(() => {
    if (accounts) {
      resetAccountStates();
    }
  }, [accounts])
  
  // Gestion des droits du compte connecté et appel aux différents éléments du Smart Contract
  useEffect(() => { 
    if (contract) {
      if(owner === accounts[0]) {
          setIsOwnerState(true); 
      }

      // recherche des voters dans les évènements
      let options = {filter: {value: [],},fromBlock: 0};
      if (voterRegisteredSubscription == null) {
        voterRegisteredSubscription = contract.events.VoterRegistered(options)
            .on('data', event => {
              addVoter(event.returnValues.voterAddress);
              if(event.returnValues.voterAddress === accounts[0]) { 
                setIsVoterState(true);
              }  
            })
            .on('changed', changed => console.log(changed))
            .on('error', err => console.log(err))
            .on('connected', str => console.log(str));
      }
      
      // recherche des proposals dans les évènements
      // if (voterRegisteredSubscription == null) {
        proposalRegisteredSubscription = contract.events.ProposalRegistered(options)
            .on('data', event => {
              try {
                addProposal(event.returnValues.proposalId);
              } catch (err) {
                console.error(err);
              }
            })
            .on('changed', changed => console.log(changed))
            .on('error', err => console.log(err))
            .on('connected', str => console.log(str));
      //}

      // Récupération du statut en cours dans le workflow
      contract.events.WorkflowStatusChange(options)
          .on('data', event => {
            try {
              setCurrentStatus(parseInt(event.returnValues.newStatus));
            } catch (err) {
              console.error(err);
            }
          })
          .on('changed', changed => console.log(changed))
          .on('error', err => console.log(err))
          .on('connected', str => console.log(str));
    } 

    return () => {
      if (voterRegisteredSubscription != null) {
        voterRegisteredSubscription.unsubscribe();
        voterRegisteredSubscription = null;
      }
      if (proposalRegisteredSubscription != null) {
        proposalRegisteredSubscription.unsubscribe();
        proposalRegisteredSubscription = null;
      }
    };

  }, [contract]);

  const body = <Row>
  <Col>
    {isOwnerState && (
      <Row>
        <ChangeStatus currentStatus={currentStatus}/>
        <VoterContainer votersState={votersState} isOwnerState={isOwnerState} currentStatus={currentStatus}/>
      </Row>
    )}
    {isVoterState && (
      <>
      <Row> 
        <ListProposal proposalsState={proposalsState}/>
        <AddProposal currentStatus={currentStatus}/>
      </Row>
      <Row>
        <ProposalVoting currentStatus={currentStatus}/>
      </Row>
      </>
    )} 
  </Col>
  <Col>
    <Row>
      <VotingStates votersState={votersState} proposalsState={proposalsState}/>
    </Row>
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