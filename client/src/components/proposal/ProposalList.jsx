import { ListGroup, ListGroupItem } from 'reactstrap';

const ListProposal = ({ proposalsState }) => {

  return (
    <ListGroup id='proposal-list'>
    { proposalsState.map(proposal => (
      <ListGroupItem key={proposal.id}>
        {proposal.description}
      </ListGroupItem>
    ))}
    </ListGroup> 
  )
}

export default ListProposal