import { useEffect, useState } from "react";
import { ipcRenderer } from "./lib/ipcRenderer";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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

  const toggleVanguard = async () => {
    setError("");
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
  };

  useEffect(() => {
    getVanguardStatus();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          width: "100%",
          height: "100%",
          gap: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {status === "running" && (
            <>
              <img src="vanguard.png" width={64} />
              <Typography>Vanguard is currently active</Typography>
            </>
          )}
          {status === "stopped" && (
            <>
              <img src="vanguard-yellow.png" width={64} />
              <Typography>Vanguard is currently disabled</Typography>
            </>
          )}
        </Box>

        <Button onClick={toggleVanguard}>
          {status === "running" ? "Stop" : "Start"}
        </Button>
        <Typography variant="button" color="error">
          {error}
        </Typography>
        <Typography variant="body2">
          {window.app?.version ? `Version: ${window.app?.version}` : ""}
        </Typography>
      </Box>
    </>
  );
}

export default App;
