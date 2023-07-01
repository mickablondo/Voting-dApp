import { useState } from "react";
import { CardBody, Card, CardTitle, CardImg, CardText, Button } from 'reactstrap'
import useEth from "../../contexts/EthContext/useEth";
import './WinningProposal.css'

const WinningProposal = ({ proposalsState }) => {

    const { state: { contract, accounts } } = useEth();
    const [winningProposal, setWinningProposal] = useState(null);
    const [loadingProposal, setLoadingProposal] = useState(false);

    const getWinningProposal = () => {
        setLoadingProposal(true);
        contract.methods.winningProposalID().call({ from: accounts[0] })
            .then((proposalId) => {
                proposalId = parseInt(proposalId)
                console.log("winningProposal = "+ proposalId);
                let found = false;
                for (const proposal of proposalsState) {
                    if (proposal.id === proposalId) {
                    console.log("winningProposal found", proposal)
                    setWinningProposal(proposal);
                    found = true;
                    }
                }
                if (!found) {
                    setWinningProposal({ if: proposalId, description: 'N/A', voteCount: 'N/A' });    
                } 
            })
            .catch((error) => {
                console.log("error", error);
                alert(error?.message);
            })
            .finally(() => setLoadingProposal(false))
    };

  return (
    <Card>
        <CardImg alt="Trophy image" src="/images/voting-state-panel/trophy-icon-96.png" />
        <CardBody>
            <>
              {winningProposal === null ? (
                <Button onClick={getWinningProposal} disabled={loadingProposal}>Winning proposal?</Button>
              ) : (
                <>
                  <CardTitle tag="h5"> Id: {winningProposal.id} </CardTitle>
                  <CardText tag="h5"> Votes: {winningProposal.voteCount} </CardText>
                  <CardText className="mb-2 text-muted" tag="h6">{winningProposal.description}</CardText>
                </>
              )}
            </>
        </CardBody>
      </Card>
  )
}

export default WinningProposal