import GeneralApp from "./components/GeneralApp";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import MinimizeIcon from "@mui/icons-material/Minimize";
import { ThemeProvider, useTheme } from "@mui/material";
import { darkTheme, lightTheme } from "./theme/theme";
import { stores } from "../lib/stores";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

function App() {
  const { app } = stores;
  return (
    <ThemeProvider theme={app.isDarkTheme ? darkTheme : lightTheme}>
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
    </ThemeProvider>
  );
}

const ObservedApp = observer(App);

export default ObservedApp;

const Topbar = () => {
  const barHeight = 42;
  const appVersion = window.app?.version || "";
  const theme = useTheme();
  const { app } = stores;
  return (
    <AppBar position="static" sx={{ height: barHeight }}>
      <Toolbar
        style={{
          padding: 0,
          minHeight: barHeight,
          height: barHeight,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
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
              backgroundColor: theme.palette.getContrastText(
                theme.palette.background.default
              ),
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
            <Typography sx={{ fontSize: "0.8rem" }}>
              Vanguard Toggler
            </Typography>
            {appVersion && (
              <Typography sx={{ fontSize: "0.6rem" }}>v{appVersion}</Typography>
            )}
          </Box>
        </Box>
        <IconButton
          onClick={() => {
            app.setTheme(stores.app.isDarkTheme ? "light" : "dark");
          }}
          size="small"
          sx={{ marginRight: 1, opacity: 0.2, "&:hover": { opacity: 1 } }}
        >
          {app.isDarkTheme ? (
            <LightModeIcon sx={{ fontSize: "1rem" }} />
          ) : (
            <DarkModeIcon sx={{ fontSize: "1rem" }} />
          )}
        </IconButton>

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
          sx={{ borderRadius: 0, "&:hover": { backgroundColor: "red", color: 'white' } }}
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
