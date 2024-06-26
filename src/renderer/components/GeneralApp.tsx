import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { ipcRenderer } from "../../lib/ipcRenderer";
import { stores } from "../../lib/stores";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material";

function GeneralApp() {
  const { app } = stores;
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  // const theme = useTheme();

  const getVanguardStatus = async () => {
    ipcRenderer
      .invoke("vanguard:get-status")
      .then((result) => {
        setStatus(result);
      })
      .catch((_error) => {
        setStatus("Error getting Vanguard status");
      })
      .finally(() => {
        app.setLoading(false);
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

    return () => {
      ipcRenderer.removeAllListeners("vanguard:get-status");
    };
  }, []);

  if (app.loading) {
    return (
      <Wrapper>
        <CircularProgress />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
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
            <Typography>
              Vanguard is currently active
            </Typography>
          </>
        )}
        {status === "stopped" && (
          <>
            <img src="vanguard-yellow.png" width={64} />
            <Typography>
              Vanguard is currently disabled
            </Typography>
          </>
        )}
      </Box>

      <Button onClick={toggleVanguard}>
        {status === "running" ? "Stop" : "Start"}
      </Button>
      {error && (
        <Typography variant="button" color="error">
          {error}
        </Typography>
      )}
    </Wrapper>
  );
}

export default GeneralApp;

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  return (
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
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      }}
    >
      {children}
    </Box>
  );
};
