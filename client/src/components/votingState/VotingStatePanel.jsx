import React, { useEffect, useState } from 'react'
import { CardBody, CardColumns, Card, CardTitle, CardImg, CardText, Button } from 'reactstrap'
import EnumWorkflowStatus from '../EnumWorkflowStatus';
import useEth from "../../contexts/EthContext/useEth";
import './VotingStatePanel.css';

const VotingStates = ({ votersState, proposalsState, currentStatus }) => {

  const { state: { contract, accounts } } = useEth();
  const [winningProposal, setWinningProposal] = useState(null);
  const [loadingProposal, setLoadingProposal] = useState(false);
  const [participationState, setParticipationState] = useState({
    rate: 0,  registredCount: 0, participantCount: 0
  });

  useEffect(() => {
    if (votersState && votersState.length > 0) {
      const newState = { 
        rate: 0, participantCount: 0,
        // total registred as voters 
        registredCount: votersState.length, 
      };
      // participant? <- registred with a vote
      if (proposalsState && proposalsState.length > 0) {
        let totalVotes = 0;
        for (const p of proposalsState) {
          totalVotes += p.voteCount;
        } 
        newState.participantCount = totalVotes; 
      } 
      if (newState.registredCount != participationState.registredCount
        || newState.participantCount != participationState.participantCount) {
          newState.rate = Math.trunc(newState.participantCount*100 / newState.registredCount);
          setParticipationState(newState);
      }
    }
     
  }, [votersState, proposalsState])
  

  const getWinningProposal = () => {
    setLoadingProposal(true);
    contract.methods.winningProposalID().call({ from: accounts[0] })
      .then((proposalId) => {
        proposalId = parseInt(proposalId)
        console.log("winningProposal = "+ proposalId);
        let found = false;
        // console.log("proposalStates", proposalsState)
        for (const proposal of proposalsState) {
          if (proposal.id === proposalId) {
            console.log("winningProposal found", proposal)
            setWinningProposal(proposal);
            found = true;
          }
        }
        if (!found) {
          setWinningProposal({ if: proposalId, description: 'N/A', voteCount: 'N/A' });    
        } 
      })
      .catch((error) => {
        console.log("error", error);
        alert(error?.message);
      })
      .finally(() => setLoadingProposal(false))
  };

  return (
    <CardColumns id="voting-state-panel">

      <Card>
        <CardImg alt="Voters participation image" src="/images/voting-state-panel/voting-icon-64.png" />
        <CardBody>
          <CardTitle tag="h5"> {participationState.rate} % </CardTitle>
          <CardTitle tag="h6"> Global participation </CardTitle>
          <CardText className="text-muted" tag="h6"> 
          {participationState.registredCount} registred <br/>
          {participationState.participantCount} has voted
          </CardText>
        </CardBody>
      </Card>

      <Card>
        <CardImg alt="Registred voters image" src="/images/voting-state-panel/groupe-icon-96.png" />
        <CardBody>
          <CardTitle tag="h5"> {votersState.length} </CardTitle>
          <CardText className="mb-2 text-muted" tag="h6"> Voters </CardText>
        </CardBody>
      </Card>

      <Card>
        <CardImg alt="Proposals image" src="/images/voting-state-panel/questions-icon-60.png" />
        <CardBody>
          <CardTitle tag="h5"> {proposalsState.length} </CardTitle>
          <CardText className="mb-2 text-muted" tag="h6"> Proposals </CardText>
        </CardBody>
      </Card>

      <Card>
        <CardImg alt="Trophy image" src="/images/voting-state-panel/trophy-icon-96.png" />
        <CardBody>
          {currentStatus === EnumWorkflowStatus.VotesTallied ? (
            <>
              {winningProposal === null ? (
                <Button onClick={getWinningProposal} disabled={loadingProposal}>Winning proposal?</Button>
              ) : (
                <>
                  <CardTitle tag="h5"> Id: {winningProposal.id} </CardTitle>
                  <CardText tag="h5"> Votes: {winningProposal.voteCount} </CardText>
                  <CardText className="mb-2 text-muted" tag="h6">{winningProposal.description}</CardText>
                </>
              )}
            </>
          ) : (
            <CardText className="text-muted" > Votes not tallied yet </CardText>
          )}

        </CardBody>
      </Card>

    </CardColumns>
  )
}

export default VotingStates