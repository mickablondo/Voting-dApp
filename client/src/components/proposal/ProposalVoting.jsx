import { Button } from "reactstrap";
import EnumWorkflowStatus from '../EnumWorkflowStatus';
import useEth from "../../contexts/EthContext/useEth";

const ProposalVoting = ({ currentStatus }) => {

    const { state: { contract, accounts } } = useEth();

    const vote = async () => {
        try {
            contract.methods.setVote().send({from: accounts[0]});
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Button disabled={currentStatus !== parseInt(EnumWorkflowStatus.VotingSessionStarted)} className="rounded-circle" onClick={vote}>Vote</Button>
    )
}

export default ProposalVoting