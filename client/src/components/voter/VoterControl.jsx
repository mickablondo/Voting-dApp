import { useState } from 'react';
import useEth from "../../contexts/EthContext/useEth";
import { EnumWorkflowStatus } from '../EnumWorkflowStatus';
import { Form, Row, Col, Label, Input, Button } from 'reactstrap';
import toast from 'react-hot-toast';
import { toasterDefaultOptions, toasterOptionsWithSuccess } from '../toasterConfig'

const VoterControl = ({votersState, currentStatus}) => {
  
  const [voterInputState, setVoterInputState] = useState("");
  const [isVoteRunningState, setIsVoteRunningState] = useState(false);
  const { state: {  contract, owner } } = useEth();  

  const onVoterInputChange = (value) => {
    setVoterInputState(value);
  };

  const isEthAddressFormat = (ethAddress) => { 
    return (/^0x[0-9a-fA-F]{40}$/.test(ethAddress));
  };

  const onAddVoterSubmit = (e) => {
    // prevent default submit form action
    e.preventDefault(); 

    if (!isEthAddressFormat(voterInputState)) { 
      toast.error(`Not an ethereum address:"${voterInputState}"!`, toasterDefaultOptions);
      return;
    }
    if (votersState.includes(voterInputState)) {
      toast.error(`Voter ${voterInputState} already registred!`, toasterDefaultOptions);
      return;
    }

    setIsVoteRunningState(true);
    try { 
      const addVoterPromise = contract.methods.addVoter(voterInputState).send({from: owner})
      .then(() => setVoterInputState(""))
      .catch((error) => console.log(error))
      .finally(() => setIsVoteRunningState(false)) 

      toast.promise(addVoterPromise, {
        loading: 'Loading',
        success: () => `Voter added ${voterInputState}!`,
        error: (err) => `This just happened: ${err?.toString()}`,
      },
      toasterOptionsWithSuccess);

    } catch (error) {
      alert(`Could not addVoter:"${error}"`);
      console.log(error);
      setIsVoteRunningState(false);
    }

  };
 
  return ( 
    <Form onSubmit={onAddVoterSubmit} >
      <Row >
        <Col className="col-sm-9">
          <Label for="voterAddress" className="visually-hidden">Email</Label>
          <Input name="voterAddress" placeholder="0x..." className="voter-address-input" type="text" 
            value={voterInputState}
            onChange={e => onVoterInputChange(e.target.value)}
            disabled={isVoteRunningState || currentStatus !== EnumWorkflowStatus.RegisteringVoters}
          />
        </Col>
        <Col className='col-sm-3'>
          <Button disabled={isVoteRunningState || currentStatus !== EnumWorkflowStatus.RegisteringVoters}
          style={{width: '100%'}}
          >
            Add voter
          </Button>
        </Col>
      </Row> 
    </Form>
  )
}

export default VoterControl