import { Card, CardBody } from 'reactstrap';
import EnumWorkflowStatus from './EnumWorkflowStatus';
import useEth from '../contexts/EthContext/useEth';

const ChangeStatus = ({ currentStatus }) => {

  const { state: {  contract, accounts } } = useEth();

  const handleStepClick = (step) => {
    if (step === currentStatus + 1) {
      switch (step) {
        case EnumWorkflowStatus.ProposalsRegistrationStarted:
          contract.methods.startProposalsRegistering().send({from: accounts[0]});
          break;

        case EnumWorkflowStatus.ProposalsRegistrationEnded:
          contract.methods.endProposalsRegistering().send({from: accounts[0]});
          break;

        case EnumWorkflowStatus.VotingSessionStarted:
          contract.methods.startVotingSession().send({from: accounts[0]});
          break;

         case EnumWorkflowStatus.VotingSessionEnded:
          contract.methods.endVotingSession().send({from: accounts[0]});
          break;

        case EnumWorkflowStatus.VotesTallied:
          contract.methods.tallyVotes().send({from: accounts[0]});
          break;
        default:
      }
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Card style={{ flex: 1, marginRight: '1rem',
          cursor: currentStatus == EnumWorkflowStatus.RegisteringVoters ? 'default' : 'pointer',
          backgroundColor: currentStatus == EnumWorkflowStatus.RegisteringVoters ? 'blue' : 'white',
          color: currentStatus == EnumWorkflowStatus.RegisteringVoters ? 'white' : 'black' }}>
        <CardBody>
          <p>Registering voters</p>
        </CardBody>
      </Card>

      <Card onClick={() => handleStepClick(EnumWorkflowStatus.ProposalsRegistrationStarted)} style={{ flex: 1, marginRight: '1rem',
          cursor: currentStatus == EnumWorkflowStatus.RegisteringVoters ? 'default' : 'pointer',
          backgroundColor: currentStatus == EnumWorkflowStatus.ProposalsRegistrationStarted ? 'blue' : 'white',
          color: currentStatus == EnumWorkflowStatus.ProposalsRegistrationStarted ? 'white' : 'black' }}>
        <CardBody>
          <p>Proposals registration started</p>
        </CardBody>
      </Card>

      <Card onClick={() => handleStepClick(EnumWorkflowStatus.ProposalsRegistrationEnded)} style={{ flex: 1, marginRight: '1rem',
          cursor: currentStatus == EnumWorkflowStatus.ProposalsRegistrationStarted ? 'pointer' : 'default',
          backgroundColor: currentStatus == EnumWorkflowStatus.ProposalsRegistrationEnded ? 'blue' : 'white',
          color: currentStatus == EnumWorkflowStatus.ProposalsRegistrationEnded ? 'white' : 'black' }}>
        <CardBody>
          <p>Proposals registration ended</p>
        </CardBody>
      </Card>

      <Card onClick={() => handleStepClick(EnumWorkflowStatus.VotingSessionStarted)} style={{ flex: 1, marginRight: '1rem',
          cursor: currentStatus == EnumWorkflowStatus.ProposalsRegistrationEnded ? 'pointer' : 'default',
          backgroundColor: currentStatus == EnumWorkflowStatus.VotingSessionStarted ? 'blue' : 'white',
          color: currentStatus == EnumWorkflowStatus.VotingSessionStarted ? 'white' : 'black' }}>
        <CardBody>
          <p>Voting session started</p>
        </CardBody>
      </Card>

      <Card onClick={() => handleStepClick(EnumWorkflowStatus.VotingSessionEnded)} style={{ flex: 1, marginRight: '1rem',
          cursor: currentStatus == EnumWorkflowStatus.VotingSessionStarted ? 'pointer' : 'default',
          backgroundColor: currentStatus == EnumWorkflowStatus.VotingSessionEnded ? 'blue' : 'white',
          color: currentStatus == EnumWorkflowStatus.VotingSessionEnded ? 'white' : 'black' }}>
        <CardBody>
          <p>Voting session ended</p>
        </CardBody>
      </Card>

      <Card onClick={() => handleStepClick(EnumWorkflowStatus.VotesTallied)} style={{ flex: 1,
          cursor: currentStatus == EnumWorkflowStatus.VotingSessionEnded ? 'pointer' : 'default',
          backgroundColor: currentStatus == EnumWorkflowStatus.VotesTallied ? 'blue' : 'white',
          color: currentStatus == EnumWorkflowStatus.VotesTallied ? 'white' : 'black' }}>
        <CardBody>
          <p>Votes tallied</p>
        </CardBody>
      </Card>
    </div>
  );
}

export default ChangeStatus