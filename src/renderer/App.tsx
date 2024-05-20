import GeneralApp from "./components/GeneralApp";
import { observer } from "mobx-react-lite";
import { stores } from "../lib/stores";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import MinimizeIcon from "@mui/icons-material/Minimize";

function App() {
  const { app } = stores;

  if (app.loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <Topbar />
      <GeneralApp />
    </Box>
  );
}

const ObservedApp = observer(App);

export default ObservedApp;

const Topbar = () => {
  const barHeight = 42;
  const appVersion = window.app?.version || "";
  return (
    <AppBar
      position="static"
      sx={{ height: barHeight, backgroundColor: "grey" }}
    >
      <Toolbar style={{ padding: 0, minHeight: barHeight, height: barHeight }}>
        <Box
          className="window-draggable"
          sx={{
            flexGrow: 1,
            height: "100%",
            paddingLeft: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              padding: 0.7,
              marginRight: 1.5,
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              borderRadius: 10,
            }}
          >
            <img src="vanguard-toggler.png" width={15} />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              alignItems: "baseline",
              gap: 1.2,
              flexGrow: 1,
            }}
          >
            <Typography sx={{ fontSize: "0.8rem" }}>Vanguard Toggler</Typography>
            {appVersion && (
              <Typography sx={{ fontSize: "0.6rem" }}>v{appVersion}</Typography>
            )}
          </Box>
        </Box>

        <IconButton
          color="inherit"
          onClick={() => {
            window.ipcRenderer.send("app:minimize");
          }}
          sx={{ borderRadius: 0 }}
        >
          <MinimizeIcon />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={() => {
            window.ipcRenderer.send("app:close");
          }}
          sx={{ borderRadius: 0, "&:hover": { backgroundColor: "red" } }}
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
