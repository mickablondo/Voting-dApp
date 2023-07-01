import { Card, CardBody } from 'reactstrap';
import { EnumWorkflowStatus, EnumWorkflowStatusValues} from '../EnumWorkflowStatus';
import useEth from '../../contexts/EthContext/useEth';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { toasterOptionsWithSuccess } from '../toasterConfig'
import './ChangeStatus.css'
 

const initCardBodyStepClassNames = (currentStatusValue) => { 
  const state = {}
  const nextStateValue = currentStatusValue+1;
  for (const name in EnumWorkflowStatus) {
    state[name] = "stepIndicator";
    if (EnumWorkflowStatus[name] === currentStatusValue) {
      state[name] += " active";
    } else if (EnumWorkflowStatus[name] < currentStatusValue) {
      state[name] += " finish";
    } else if (EnumWorkflowStatus[name] === nextStateValue) {
      state[name] += " next";
    }
  }
  return state;
};

const ChangeStatus = ({ currentStatus }) => {

  const { state: { contract, accounts } } = useEth();
  const [cardBodyStepClassNames, setCardBodyStepClassNames] = useState(initCardBodyStepClassNames(currentStatus))

  useEffect(() => {
    if (currentStatus) {
      setCardBodyStepClassNames(initCardBodyStepClassNames(currentStatus));
    }
  }, [currentStatus]) 

  const handleStepClick = (step) => {
    if (step === currentStatus + 1) {
      let promise = null; 
      switch (step) {
        case EnumWorkflowStatus.ProposalsRegistrationStarted:
          promise = contract.methods.startProposalsRegistering().send({ from: accounts[0] });
          break;
        case EnumWorkflowStatus.ProposalsRegistrationEnded:
          promise = contract.methods.endProposalsRegistering().send({ from: accounts[0] });
          break;
        case EnumWorkflowStatus.VotingSessionStarted:
          promise = contract.methods.startVotingSession().send({ from: accounts[0] });
          break;
        case EnumWorkflowStatus.VotingSessionEnded:
          promise = contract.methods.endVotingSession().send({ from: accounts[0] });
          break;
        case EnumWorkflowStatus.VotesTallied:
          promise= contract.methods.tallyVotes().send({ from: accounts[0] });
          break;
        default:
      }
      if (promise != null) {
        toast.promise(promise, {
          loading: 'Loading',
          success: () => `Workflow status changed to ${EnumWorkflowStatusValues[step]}!`,
          error: (err) => `This just happened: ${err?.toString()}`,
        },
        toasterOptionsWithSuccess);
      }
    }
  }; 
 
  return (
    <div id="change-status-container" style={{ display: 'flex' }}>

      <Card className={cardBodyStepClassNames.RegisteringVoters} > 
        <CardBody>
          Registering voters
        </CardBody>
      </Card>

      <Card onClick={() => handleStepClick(EnumWorkflowStatus.ProposalsRegistrationStarted)} 
      className={cardBodyStepClassNames.ProposalsRegistrationStarted}
      > 
        <CardBody>
          Proposals registration started
        </CardBody> 
      </Card>

      <Card onClick={() => handleStepClick(EnumWorkflowStatus.ProposalsRegistrationEnded)} 
      className={cardBodyStepClassNames.ProposalsRegistrationEnded}
      >
        <CardBody>
          Proposals registration ended
        </CardBody>
      </Card>

      <Card onClick={() => handleStepClick(EnumWorkflowStatus.VotingSessionStarted)} 
      className={cardBodyStepClassNames.VotingSessionStarted}
      >
        <CardBody>
          Voting session started
        </CardBody>
      </Card>

      <Card onClick={() => handleStepClick(EnumWorkflowStatus.VotingSessionEnded)} 
      className={cardBodyStepClassNames.VotingSessionEnded}
      >
        <CardBody >
          Voting session ended
        </CardBody>
      </Card>

      <Card onClick={() => handleStepClick(EnumWorkflowStatus.VotesTallied)} 
      className={cardBodyStepClassNames.VotesTallied}
      >
        <CardBody>
          Votes tallied
        </CardBody>
      </Card>
    </div>
  );
}

export default ChangeStatus