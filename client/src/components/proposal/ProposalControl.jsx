import { useState } from 'react';
import useEth from "../../contexts/EthContext/useEth";
import { Form, Row, Col, Input, Button } from 'reactstrap';
import { EnumWorkflowStatus } from '../EnumWorkflowStatus';
import toast from 'react-hot-toast';
import { toasterOptionsWithSuccess } from '../toasterConfig'

const AddProposal = ({ currentStatus }) => {

  const [proposalInputState, setProposalInputState] = useState("");
  const { state: {  contract, accounts } } = useEth();

  const onProposalInputChange = (value) => {
    setProposalInputState(value);
  };

  const onAddProposalSubmit = (e) => {
    e.preventDefault(); 
    try {
      const promise = contract.methods.addProposal(proposalInputState).send({from: accounts[0]})
      .then(() => setProposalInputState(""));
      
      toast.promise(promise, {
        loading: 'Loading',
        success: () => "Proposal successfully added!",
        error: (err) => `This just happened: ${err?.toString()}`,
      },
      toasterOptionsWithSuccess);
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form onSubmit={onAddProposalSubmit} >
      <Row className="row-cols-lg-auto g-1">
        <Col className="me-auto ">
          <Input name="proposalText" placeholder= {
            parseInt(currentStatus) === parseInt(EnumWorkflowStatus.ProposalsRegistrationStarted) ? "my proposal is ..." : "Not the right time to add a proposal !"
          } id="addProposal" type="textarea" 
            rows="4"
            value={proposalInputState}
            onChange={e => onProposalInputChange(e.target.value)}
            disabled={parseInt(currentStatus) !== parseInt(EnumWorkflowStatus.ProposalsRegistrationStarted)}
          />
        </Col>
        <Col>
          <Button disabled={parseInt(currentStatus) !== parseInt(EnumWorkflowStatus.ProposalsRegistrationStarted)}>Add proposal</Button>
        </Col>
      </Row> 
    </Form>
  )
}

export default AddProposal