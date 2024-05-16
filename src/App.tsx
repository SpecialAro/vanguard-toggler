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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          flexWrap: "wrap",
          width: "100%",
          height: "100%",
        }}
      >
        {status === "running" && <img src="vanguard.png" width={64} />}
        {status === "stopped" && <img src="vanguard-yellow.png" width={64} />}
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
        <span>{error}</span>
        <h3>{window.app?.version}</h3>
      </div>
    </>
  );
}

export default App;
