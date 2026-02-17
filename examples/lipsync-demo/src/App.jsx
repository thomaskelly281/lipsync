import { Loader } from "@react-three/drei";
import { Lipsync } from "wawa-lipsync";
import { UI } from "./components/UI";

export const lipsyncManager = new Lipsync({
  fftSize: 4096,   // Higher frequency resolution for better viseme discrimination
  historySize: 15, // More history frames for smoother averaged features
});

function App() {
  return (
    <>
      <Loader />
      <UI />
    </>
  );
}

export default App;
