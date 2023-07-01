import { ListGroup, ListGroupItem, Button, Container } from 'reactstrap';
import { EnumWorkflowStatus } from '../EnumWorkflowStatus';
import useEth from "../../contexts/EthContext/useEth";
import { useState } from 'react';

const ListProposal = ({ proposalsState, currentStatus, votersHaveVoted }) => {

  const { state: { contract, accounts } } = useEth();
  const [selectedProposal, setSelectedProposal] = useState(null);

  const handleProposalClick = (proposalId) => {
    setSelectedProposal(proposalId);
  };

  // Vote enregistré dans la blockchain via le Smart Contract
  const handleActionButtonClick = () => {
    if (selectedProposal) {
      try {
        contract.methods.setVote(selectedProposal).send({from: accounts[0]});
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Container>
      <ListGroup className='proposal-list'>
      { proposalsState.map(proposal => (
        <ListGroupItem
          key={proposal.id}
          active={selectedProposal === proposal.id}
          onClick={() => handleProposalClick(proposal.id)}
        >
          {proposal.description}
        </ListGroupItem>
      ))}
      </ListGroup>
      { votersHaveVoted.length === 0 || votersHaveVoted.find((voter) => voter === accounts[0]) === null ?
      <Button
        color="primary"
        onClick={handleActionButtonClick}
        className="rounded-circle"
        disabled={currentStatus !== parseInt(EnumWorkflowStatus.VotingSessionStarted)}
      >
          Vote
      </Button>
      : <span className="badge bg-success">You have already voted !</span>
      }
    </Container>
  )
}

export default ListProposal