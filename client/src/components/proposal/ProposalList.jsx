import { useEffect, useState } from "react";
import { ListGroup, ListGroupItem } from 'reactstrap';
import useEth from "../../contexts/EthContext/useEth";

const ListProposal = () => {

  const [proposalsState, setProposalsState] = useState([]);
  const { state: {  contract, accounts } } = useEth();

  function Proposal(id, description, voteCount) {
    this.id = id;
    this.description = description;
    this.voteCount = voteCount;
  }
    
  useEffect(() => { 
    if (contract) {
      // recherche des proposals dans les évènements
      let options = {filter: {value: [],},fromBlock: 0};
      contract.events.ProposalRegistered(options)
          .on('data', async event => {
            try {
              const proposal = await contract.methods.getOneProposal(event.returnValues.proposalId).call({ from: accounts[0]});

              setProposalsState(proposalsState => [...proposalsState,
                new Proposal(event.returnValues.proposalId, proposal.description, proposal.voteCount)]
              );
            } catch (err) {
              console.error(err);
            }
          })
          .on('changed', changed => console.log(changed))
          .on('error', err => console.log(err))
          .on('connected', str => console.log(str));
    } 
  }, [contract]);

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