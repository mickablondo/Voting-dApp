import React, { useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import EnumWorkflowStatus from './EnumWorkflowStatus';
import useEth from '../contexts/EthContext/useEth';

const ChangeStatus = ({ currentStatus }) => {

  const [activeStep, setActiveStep] = useState(parseInt(currentStatus));
  const { state: {  contract, accounts } } = useEth();

  const handleStepClick = (step) => {
    if (parseInt(step) === activeStep + 1) {
      setActiveStep(parseInt(step));

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
          cursor: activeStep === EnumWorkflowStatus.RegisteringVoters ? 'default' : 'pointer',
          backgroundColor: activeStep === EnumWorkflowStatus.RegisteringVoters ? 'blue' : 'white',
          color: activeStep === EnumWorkflowStatus.RegisteringVoters ? 'white' : 'black' }}>
        <CardBody>
          <p>Registering voters</p>
        </CardBody>
      </Card>

      <Card onClick={() => handleStepClick(EnumWorkflowStatus.ProposalsRegistrationStarted)} style={{ flex: 1, marginRight: '1rem',
          cursor: activeStep === EnumWorkflowStatus.RegisteringVoters ? 'default' : 'pointer',
          backgroundColor: activeStep === EnumWorkflowStatus.ProposalsRegistrationStarted ? 'blue' : 'white',
          color: activeStep === EnumWorkflowStatus.ProposalsRegistrationStarted ? 'white' : 'black' }}>
        <CardBody>
          <p>Proposals registration started</p>
        </CardBody>
      </Card>

      <Card onClick={() => handleStepClick(EnumWorkflowStatus.ProposalsRegistrationEnded)} style={{ flex: 1, marginRight: '1rem',
          cursor: activeStep === EnumWorkflowStatus.ProposalsRegistrationStarted ? 'pointer' : 'default',
          backgroundColor: activeStep === EnumWorkflowStatus.ProposalsRegistrationEnded ? 'blue' : 'white',
          color: activeStep === EnumWorkflowStatus.ProposalsRegistrationEnded ? 'white' : 'black' }}>
        <CardBody>
          <p>Proposals registration ended</p>
        </CardBody>
      </Card>

      <Card onClick={() => handleStepClick(EnumWorkflowStatus.VotingSessionStarted)} style={{ flex: 1, marginRight: '1rem',
          cursor: activeStep === EnumWorkflowStatus.ProposalsRegistrationEnded ? 'pointer' : 'default',
          backgroundColor: activeStep === EnumWorkflowStatus.VotingSessionStarted ? 'blue' : 'white',
          color: activeStep === EnumWorkflowStatus.VotingSessionStarted ? 'white' : 'black' }}>
        <CardBody>
          <p>Voting session started</p>
        </CardBody>
      </Card>

      <Card onClick={() => handleStepClick(EnumWorkflowStatus.VotingSessionEnded)} style={{ flex: 1, marginRight: '1rem',
          cursor: activeStep === EnumWorkflowStatus.VotingSessionStarted ? 'pointer' : 'default',
          backgroundColor: activeStep === EnumWorkflowStatus.VotingSessionEnded ? 'blue' : 'white',
          color: activeStep === EnumWorkflowStatus.VotingSessionEnded ? 'white' : 'black' }}>
        <CardBody>
          <p>Voting session ended</p>
        </CardBody>
      </Card>

      <Card onClick={() => handleStepClick(EnumWorkflowStatus.VotesTallied)} style={{ flex: 1,
          cursor: activeStep === EnumWorkflowStatus.VotingSessionEnded ? 'pointer' : 'default',
          backgroundColor: activeStep === EnumWorkflowStatus.VotesTallied ? 'blue' : 'white',
          color: activeStep === EnumWorkflowStatus.VotesTallied ? 'white' : 'black' }}>
        <CardBody>
          <p>Votes tallied</p>
        </CardBody>
      </Card>
    </div>
  );
}

export default ChangeStatus