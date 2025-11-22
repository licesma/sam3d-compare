import "./App.css";
import VideoCompare from "./components/VideoCompare";

function App() {
  return (
    <div>
      <h1>Sam 3d Objects</h1>
      <VideoCompare label="correct" />
      <h2>Correct Objects</h2>
      <h2>Wrong Position</h2>
      <h2>Wrong Objects</h2>
    </div>
  );
}

export default App;
