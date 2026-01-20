import { Button } from "./components/button";
import { PlusIcon } from "./icons/PlusIcon";
import { ShareIcon } from "./icons/shareIcon";

function App() {
  return (
    <div >
      <Button variant="secondary" text="share brain" startIcon={<ShareIcon />}></Button>
      <Button variant="primary" text="Add content" startIcon={<PlusIcon />}></Button> 
    </div>
  );
}

export default App;