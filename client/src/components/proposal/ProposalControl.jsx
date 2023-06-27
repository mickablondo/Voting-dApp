import { useEffect, useState } from 'react';
import useEth from "../../contexts/EthContext/useEth";
import { Form, Row, Col, Input, Button } from 'reactstrap';
import EnumWorkflowStatus from '../EnumWorkflowStatus';

const AddProposal = () => {

  const [proposalInputState, setProposalInputState] = useState("");
  const [isProposalRunningState, setIsProposalRunningState] = useState(true);
  const { state: {  contract, accounts } } = useEth();
  
  const onProposalInputChange = (value) => {
    setProposalInputState(value);
  };

  const onAddProposalSubmit = (e) => {
    e.preventDefault(); 
    try {
      contract.methods.addProposal(proposalInputState).send({from: accounts[0]});
      setProposalInputState("");
    } catch (err) {
      console.error(err);
    }
  };

  // Vérification du bon état du workflow
  useEffect(() => {
    (async function () {
        if (contract) {
          const currentStatus = await contract.methods.workflowStatus().call();
          if(currentStatus == EnumWorkflowStatus.ProposalsRegistrationStarted) {
            setIsProposalRunningState(false);
          }
        }
    })();
  }, [contract]);

  return (
    <Form onSubmit={onAddProposalSubmit} >
      <Row className="row-cols-lg-auto g-1">
        <Col className="me-auto ">
          <Input name="proposalText" placeholder= {
            !isProposalRunningState ? "my proposal is ..." : "Not the right time to add a proposal !"
          } id="addProposal" type="textarea" 
            rows="4"
            value={proposalInputState}
            onChange={e => onProposalInputChange(e.target.value)}
            disabled={isProposalRunningState}
          />
        </Col>
        <Col>
          <Button disabled={isProposalRunningState}>Add proposal</Button>
        </Col>
      </Row> 
    </Form>
  )
}

export default AddProposal