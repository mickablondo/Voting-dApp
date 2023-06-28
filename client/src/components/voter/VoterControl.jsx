import { useState } from 'react';
import useEth from "../../contexts/EthContext/useEth";

import { Form, Row, Col, Label, Input, Button } from 'reactstrap';

const VoterControl = ({votersState}) => {
  
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
      alert(`Not an ethereum address:"${voterInputState}"`);
      return;
    }
    if (votersState.includes(voterInputState)) {
      alert(`Already registred voter: "${voterInputState}"`);
      return;
    }

    setIsVoteRunningState(true);
    try {
      contract.methods.addVoter(voterInputState).send({from: owner})
      .catch((error) => {
        console.log(error);
        alert(error?.message); 
      })
      .finally(() => setIsVoteRunningState(false)) 
    } catch (error) {
      alert(`Could not addVoter:"${error}"`);
      console.log(error);
      setIsVoteRunningState(false);
    }

  };

  return ( 
    <Form onSubmit={onAddVoterSubmit} >
      <Row className="row-cols-lg-auto">
        <Col className="me-auto ">
          <Label for="voterAddress" className="visually-hidden">Email</Label>
          <Input name="voterAddress" placeholder="0x..." className="voter-address-input" type="text" 
            value={voterInputState}
            onChange={e => onVoterInputChange(e.target.value)}
            disabled={isVoteRunningState}
          />
        </Col>
        <Col>
          <Button disabled={isVoteRunningState}>Add voter</Button>
        </Col>
      </Row> 
    </Form>
  )
}

export default VoterControl