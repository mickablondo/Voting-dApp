import { useState } from 'react';
import useEth from "../../contexts/EthContext/useEth";
import { Form, Row, Col, Input, Button } from 'reactstrap';

const AddProposal = () => {

  // TODO
  // - si pas la bonne étape, ne pas montrer le bouton
  // - re-vérif du type d'utilisateur ? (isVoter)

  const [proposalInputState, setProposalInputState] = useState("");
  const { state: {  contract, accounts } } = useEth();
  
  const onProposalInputChange = (value) => {
    setProposalInputState(value);
  };

  const onAddProposalSubmit = (e) => {
    e.preventDefault(); 
    try {
      contract.methods.addProposal(proposalInputState).send({from: accounts[0]});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form onSubmit={onAddProposalSubmit} >
      <Row className="row-cols-lg-auto g-1">
        <Col className="me-auto ">
          <Input name="proposalText" placeholder="my proposal is ..." id="addProposal" type="textarea" 
            rows="4"
            value={proposalInputState}
            onChange={e => onProposalInputChange(e.target.value)}
          />
        </Col>
        <Col>
          <Button>Add proposal</Button>
        </Col>
      </Row> 
    </Form>
  )
}

export default AddProposal