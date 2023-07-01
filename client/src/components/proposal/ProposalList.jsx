import { ListGroup, ListGroupItem, Button, Container } from 'reactstrap';
import { EnumWorkflowStatus } from '../EnumWorkflowStatus';
import useEth from "../../contexts/EthContext/useEth";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { toasterOptionsWithSuccess } from '../toasterConfig'

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
        const promise = contract.methods.setVote(selectedProposal).send({from: accounts[0]});

        toast.promise(promise, {
          loading: 'Loading',
          success: () => "Vote counted!",
          error: (err) => `This just happened: ${err?.toString()}`,
        },
        toasterOptionsWithSuccess);

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

      { accounts && accounts.length > 0 && (
      <>
        { votersHaveVoted.length === 0 || votersHaveVoted.find((vote) => vote.voter === accounts[0]) === undefined ?
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
      </>
      )}
    </Container>
  )
}

export default ListProposal