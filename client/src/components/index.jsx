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
import { Toaster } from 'react-hot-toast';
import './index.css'
import { EnumWorkflowStatus } from "./EnumWorkflowStatus";
import WinningProposal from './winningProposal/WinningProposal';

const INIT_SUBSCRIBTION_REF = { voterRegistred: null, proposalRegistred: null, 
  workflowChanged: null, voted: null };

const Index = () => {

  const { state: { artifact, contract, accounts, owner } } = useEth();
  const [isOwnerState, setIsOwnerState] = useState(false);
  const [isVoterState, setIsVoterState] = useState(false); 
  const [votersState, setVotersState] = useState([]);
  const [votersHaveVoted, setVotersHaveVoted] = useState([]);
  const [proposalsState, setProposalsState] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(0);
  
  const subscriptionsRef = useRef(INIT_SUBSCRIBTION_REF);

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
      if (proposalsState.filter(p => p.id === proposalId).length === 0) {
      //if (!proposalsState.includes(proposalId)) {
        console.log("new proposal added: "+ proposalId);
        return [...proposalsState,
          new Proposal(proposalId, proposal.description, parseInt(proposal.voteCount))]
      } else {
        console.log("Already exists! Could not add proposal: "+ proposalId);
      }
      return proposalsState;
    });
  };
  
  // reset states/data related to current account
  useEffect(() => {
    if (accounts === null) {
      console.log ("index - account state reset")
      if (isOwnerState)
        setIsOwnerState(false);
      if (isVoterState)
        setIsVoterState(false);
      // avoiding to many update if possible
      // setVotersState([]);
      // setProposalsState([]);
    } else {
      if (owner && !isOwnerState && owner === accounts[0]) {
        console.log("setIsOwnerState true")
        setIsOwnerState(true);
      }
      if (votersState !== null && !isVoterState && votersState.filter((addr) => addr === accounts[0]).length > 0) {
        console.log("setIsVoterState true")
        setIsVoterState(true);
      }
    }
  }, [accounts, owner, votersState])

  // Gestion des droits du compte connecté et appel aux différents éléments du Smart Contract
  useEffect(() => { 
    if (contract && accounts && accounts.length > 0) {
      if(owner === accounts[0]) {
          setIsOwnerState(true); 
      }

      // recherche des voters dans les évènements
      let options = {filter: {value: [],},fromBlock: 0};
      if (subscriptionsRef.current.voterRegistred === null) {
        console.log("add subscriptions.VoterRegistered")
        const subscription = contract.events.VoterRegistered(options, (error, event) => {
          if (event) {
            addVoter(event.returnValues.voterAddress);
            if(event.returnValues.voterAddress === accounts[0]) { 
              setIsVoterState(true);
            } 
          } else {
            console.log("VoterRegistered error", error);
          }
        });
        subscriptionsRef.current = {...subscriptionsRef.current, voterRegistred: subscription};
      }
      
      // recherche des proposals dans les évènements
      if (subscriptionsRef.current.proposalRegistred === null) {
        console.log("add subscriptions.ProposalRegistered")
        const subscription = contract.events.ProposalRegistered(options, (error, event) => {
          if (event) { 
            try {
              addProposal(parseInt(event.returnValues.proposalId));
            } catch (err) {
              console.log("ProposalRegistered event error", err);
            }
          } else {
            console.log("ProposalRegistered error", error);
          }
        });
        subscriptionsRef.current = {...subscriptionsRef.current, proposalRegistred: subscription};
      }

      // Récupération du statut en cours dans le workflow
      if (subscriptionsRef.current.workflowChanged === null) {
        console.log("add subscriptions.WorkflowStatusChange")
        const subscription = contract.events.WorkflowStatusChange(options, (error, event) => {
          if (event) { 
            try {
              setCurrentStatus(parseInt(event.returnValues.newStatus));
            } catch (err) {
              console.log("WorkflowStatusChange event error", err);
            }
          } else {
            console.log("WorkflowStatusChange error", error);
          }
        });
        subscriptionsRef.current = {...subscriptionsRef.current, workflowChanged: subscription};
      }

      if (subscriptionsRef.current.voted === null) {
        console.log("add subscriptions.Voted")
        const subscription = contract.events.Voted(options, (error, event) => {
          if (event) { 
            try {
              setVotersHaveVoted(votes => {
                if (votes.filter(v => v.voter === event.returnValues.voter).length === 0) {
                  console.log(`Add new vote for proposal ${event.returnValues.proposalId} from ${event.returnValues.voter}`);
                  return [...votes, {
                    voter: event.returnValues.voter, 
                    proposalId: parseInt(event.returnValues.proposalId)
                  }];
                } else {
                  console.log("Already exists! Could not add vote from "+ event.returnValues.voter);
                  return votes;
                }
            });
            } catch (err) {
              console.log("Voted event error", err);
            }
          } else {
            console.log("Voted error", error);
          }
        });
        subscriptionsRef.current = {...subscriptionsRef.current, voted: subscription};
      }
    }//! contract

    return () => {
      const subscriptions = subscriptionsRef.current;
      for (const name in subscriptions) {
        if (subscriptions[name] != null) {
          console.log("clear subscriptions."+ name)
          subscriptions[name].unsubscribe();
          subscriptionsRef.current = INIT_SUBSCRIBTION_REF;
        }
      }
    };

  }, [contract, accounts, owner]);

  const body = <Row>
  <Col className="col-sm-9">
    {isOwnerState && (
      <Row>
        <ChangeStatus currentStatus={currentStatus}/>
        { currentStatus === EnumWorkflowStatus.VotesTallied ?
          <WinningProposal proposalsState={proposalsState}/>
          : <VoterContainer votersState={votersState} isOwnerState={isOwnerState} currentStatus={currentStatus}/>
        }
      </Row>
    )}
    {isVoterState && (
      <>
      <Row>
        <GetVoterContainer /> 
        { currentStatus === EnumWorkflowStatus.VotesTallied ?
          <WinningProposal proposalsState={proposalsState} votersHaveVoted={votersHaveVoted} />
          : <ProposalContainer proposalsState={proposalsState} currentStatus={currentStatus} votersHaveVoted={votersHaveVoted}/>
        }
      </Row>
      </>
    )} 
  </Col>
  <Col className="col-sm-3">
    <Row>
      <VotingStates votersState={votersState} proposalsState={proposalsState} votersHaveVoted={votersHaveVoted} />
    </Row>
  </Col>
</Row>;

  return (
    <Container>
        <Toaster  position="bottom-right" reverseOrder={false} />
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