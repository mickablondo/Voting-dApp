import { useState } from "react";
import { CardBody, Card, CardTitle, CardImg, CardText, Button } from 'reactstrap'
import useEth from "../../contexts/EthContext/useEth";
import './WinningProposal.css'

const WinningProposal = ({ proposalsState, votersHaveVoted }) => {

    const { state: { contract, accounts } } = useEth();
    const [winningProposal, setWinningProposal] = useState(null);
    const [loadingProposal, setLoadingProposal] = useState(false);

    const getWinningProposal = () => {
        setLoadingProposal(true);
        contract.methods.winningProposalID().call({ from: accounts[0] })
            .then(async (proposalId) => {
                proposalId = parseInt(proposalId)
                console.log("winningProposal = "+ proposalId);
                let found = false;
                for (const proposal of proposalsState) {
                    if (proposal === proposalId) {
                      console.log("winningProposal found", proposal)
                      if(votersHaveVoted) {
                        const proposalFromContract = await contract.methods.getOneProposal(proposalId).call({ from: accounts[0]});
                        setWinningProposal({ id: proposalId, description: proposalFromContract.description, voteCount: proposalFromContract.voteCount });
                      } else {
                        setWinningProposal({ id: proposalId, description: 'N/A', voteCount: 'N/A' });
                      }
                      found = true;
                    }
                }
                if (!found) {
                    setWinningProposal({ id: 'N/A', description: 'N/A', voteCount: 'N/A' });    
                } 
            })
            .catch((error) => {
                console.log("error", error);
                alert(error?.message);
            })
            .finally(() => setLoadingProposal(false))
    };

  return (
    <Card id="winning-proposal">
        <CardImg alt="Trophy image" src="/images/voting-state-panel/trophy-icon-96.png" />
        <CardBody>
            <>
              {winningProposal === null ? (
                <Button onClick={getWinningProposal} disabled={loadingProposal}>Winning proposal?</Button>
              ) : (
                <>
                  <CardTitle tag="h5"> Id: {winningProposal.id} </CardTitle>
                  { votersHaveVoted ?
                    <>
                    <CardText tag="h5"> Votes: {votersHaveVoted.filter(vote => vote.proposalId === winningProposal.id).length} </CardText>
                    <CardText className="mb-2 text-muted" tag="h6">{winningProposal.description}</CardText>
                    </>
                    : <></>
                  }
                </>
              )}
            </>
        </CardBody>
    </Card>
  )
}

export default WinningProposal