import { EthProvider } from "./contexts/EthContext";
import Index from "./components/index.jsx";

function App() {
  return (
    <EthProvider>
      <Index />
    </EthProvider>
  );
}

export default App;