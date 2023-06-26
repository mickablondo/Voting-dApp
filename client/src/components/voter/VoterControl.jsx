import { useState } from 'react';
import useEth from "../../contexts/EthContext/useEth";

import { Form, Row, Col, Label, Input, Button } from 'reactstrap';

const VoterControl = ({   }) => {
  
  const [voterInputState, setVoterInputState] = useState("");
  const { state: {  contract, owner } } = useEth();
  
  const onVoterInputChange = (value) => {
    setVoterInputState(value);
  };

  const onAddVoterSubmit = (e) => {
    e.preventDefault(); 

    //TODO validate address format
    //TODO process with web3 addVoter
    //TODO manage rpc error case
    try {
      // Récupération du owner
      contract.methods.addVoter(voterInputState).send({from: owner});

    } catch (err) {
      console.error(err);
    }
  };

  return ( 
    <Form onSubmit={onAddVoterSubmit} >
      <Row className="row-cols-lg-auto g-1">
        <Col className="me-auto ">
          <Label for="voterAddress" className="visually-hidden">Email</Label>
          <Input name="voterAddress" placeholder="0x..." id="addVoterAddress" type="text" 
            value={voterInputState}
            onChange={e => onVoterInputChange(e.target.value)}
          />
        </Col>
        <Col>
          <Button>Add voter</Button>
        </Col>
      </Row> 
    </Form>
  )
}

export default VoterControl