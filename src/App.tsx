import { useEffect, useState } from "react";
import { ipcRenderer } from "./lib/ipcRenderer";

function App() {
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const getVanguardStatus = async () => {
    ipcRenderer
      .invoke("vanguard:get-status")
      .then((result) => {
        setStatus(result);
      })
      .catch((_error) => {
        setStatus("Error getting Vanguard status");
      });
  };

  useEffect(() => {
    getVanguardStatus();
  }, []);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button
          onClick={async () => {
            ipcRenderer
              .invoke("vanguard:toggle", { status })
              .then((result) => {
                if (!result) {
                  setError("Error toggling Vanguard");
                }
              })
              .finally(async () => {
                await getVanguardStatus();
              });
          }}
        >
          {status === "running" ? "Stop" : "Start"}
        </button>

        <span>{status}</span>
        <span>{error}</span>
      </div>
    </>
  );
}

export default App;
