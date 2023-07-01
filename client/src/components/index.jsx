import { useEffect, useRef, useState } from "react";
import Head from "./head";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from 'reactstrap';
import useEth from "../contexts/EthContext/useEth";
import VotingStates from "./votingState/VotingStatePanel";
import NoticeNoArtifact from "./notices/NoticeNoArtifact";
import NoticeWrongNetwork from "./notices/NoticeWrongNetwork";
import ChangeStatus from "./changeStatus/ChangeStatus";
import VoterContainer from "./voter/VoterContainer";
import ProposalContainer from "./proposal/ProposalContainer";
import GetVoterContainer from "./voter/GetVoterContainer";

import './index.css'

const Index = () => {

  const { state: { artifact, contract, accounts, owner } } = useEth();
  const [isOwnerState, setIsOwnerState] = useState(false);
  const [isVoterState, setIsVoterState] = useState(false); 
  const [votersState, setVotersState] = useState([]);
  const [votersHaveVoted, setVotersHaveVoted] = useState([]);
  const [proposalsState, setProposalsState] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(0);
   
  const subscriptionsRef = useRef({ voterRegistred: null, proposalRegistred: null, workflowChanged: null });

  // Définition d'une proposal
  class Proposal {
    constructor(id, description, voteCount) {
      this.id = id;
      this.description = description;
      this.voteCount = voteCount;
    }
  }
 
  const addVoter = (voterAddress) => {
    setVotersState(votersState => {
      if (!votersState.includes(voterAddress)) {
        console.log("new voter added: "+ voterAddress);
        return [...votersState, voterAddress];
      } else {
        console.log("Already exists! Could not add voter: "+ voterAddress);
      }
      return votersState;
    });
  };

  const addProposal = async (proposalId) => {
    console.log("adding a proposalState: "+ proposalId);
    const proposal = await contract.methods.getOneProposal(proposalId).call({ from: accounts[0]});

    setProposalsState(proposalsState => {
      if (!proposalsState.includes(proposalId)) {
        console.log("new proposal added: "+ proposalId);
        return [...proposalsState,
          new Proposal(proposalId, proposal.description, parseInt(proposal.voteCount))]
      } else {
        console.log("Already exists! Could not add proposal: "+ proposalId);
      }
      return proposalsState;
    });
  };
  
  // reset states/data related to account
  useEffect(() => {
    if (accounts) {
      setIsOwnerState(false);
      setIsVoterState(false);
      setVotersState([]);
      setProposalsState([]);
    }
  }, [accounts])
  
  // Gestion des droits du compte connecté et appel aux différents éléments du Smart Contract
  useEffect(() => { 
    if (contract && accounts && accounts.length > 0) {
      if(owner === accounts[0]) {
          setIsOwnerState(true); 
      }

      // recherche des voters dans les évènements
      let options = {filter: {value: [],},fromBlock: 0};
      if (subscriptionsRef.current.voterRegistred == null) {
        const subscription = contract.events.VoterRegistered(options)
            .on('data', event => {
              addVoter(event.returnValues.voterAddress);
              if(event.returnValues.voterAddress === accounts[0]) { 
                setIsVoterState(true);
              }  
            })
            .on('changed', changed => console.log(changed))
            .on('error', err => console.log(err))
            .on('connected', str => console.log(str));
        subscriptionsRef.current = {...subscriptionsRef.current, voterRegistred: subscription};
      }
      
      // recherche des proposals dans les évènements
      if (subscriptionsRef.current.proposalRegistred == null) {
        const subscription = contract.events.ProposalRegistered(options)
            .on('data', event => {
              try {
                addProposal(parseInt(event.returnValues.proposalId));
              } catch (err) {
                console.error(err);
              }
            })
            .on('changed', changed => console.log(changed))
            .on('error', err => console.log(err))
            .on('connected', str => console.log(str));
        subscriptionsRef.current = {...subscriptionsRef.current, proposalRegistred: subscription};
      }

      // Récupération du statut en cours dans le workflow
      if (subscriptionsRef.current.workflowChanged == null) {
        console.log("listening on WorkflowStatusChange")
        const subscription = contract.events.WorkflowStatusChange(options)
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
        subscriptionsRef.current = {...subscriptionsRef.current, workflowChanged: subscription};
      }

      contract.events.Voted(options)
          .on('data', event => {
            try {
              setVotersHaveVoted(voters => [...voters, event.returnValues.voter]);
            } catch (err) {
              console.error(err);
            }
          })
          .on('changed', changed => console.log(changed))
          .on('error', err => console.log(err))
          .on('connected', str => console.log(str));
    }//! contract

    return () => {
      const subscriptions = subscriptionsRef.current;
      for (const name in subscriptions) {
        if (subscriptions[name] != null) {
          subscriptions[name].unsubscribe();
        }
      }
    };

  }, [contract, accounts, owner]);

  const body = <Row>
  <Col className="col-sm-9">
    {isOwnerState && (
      <Row>
        <ChangeStatus currentStatus={currentStatus}/>
        <VoterContainer votersState={votersState} isOwnerState={isOwnerState} currentStatus={currentStatus}/>
      </Row>
    )}
    {isVoterState && (
      <>
      <Row>
        <GetVoterContainer /> 
        <ProposalContainer proposalsState={proposalsState} currentStatus={currentStatus} votersHaveVoted={votersHaveVoted}/>
      </Row>
      </>
    )} 
  </Col>
  <Col className="col-sm-3">
    <Row>
      <VotingStates votersState={votersState} proposalsState={proposalsState} currentStatus={currentStatus}/>
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