import { ListGroup, ListGroupItem, Form, Col, Row, Button } from 'reactstrap';
import EnumWorkflowStatus from '../EnumWorkflowStatus';
import useEth from "../../contexts/EthContext/useEth";

const ListProposal = ({ proposalsState, currentStatus }) => {

  const { state: { contract, accounts } } = useEth();

  const onVoteSubmit = (e) => {
    console.log(e)
    console.log(e.preventDefault)
    e.preventDefault(); 
    try {
      // TODO setVote de ?
      contract.methods.setVote().send({from: accounts[0]});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form onSubmit={onVoteSubmit}>
      <Row className="row-cols-lg-auto g-1">
        <Col className="me-auto ">
          <ListGroup className='proposal-list'>
          { proposalsState.map(proposal => (
            <ListGroupItem key={proposal.id} onClick={(e) => e.preventDefault}>
              {proposal.description}
            </ListGroupItem>
          ))}
          </ListGroup>
        </Col>
        <Col>
          <Button disabled={currentStatus !== parseInt(EnumWorkflowStatus.VotingSessionStarted)} className="rounded-circle">Vote</Button>
        </Col>
      </Row>
    </Form>
  )
}

export default ListProposal