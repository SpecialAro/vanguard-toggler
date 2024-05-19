import GeneralApp from "./components/GeneralApp";
import { observer } from "mobx-react-lite";
import { stores } from "../lib/stores";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

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
    <>
      <GeneralApp />
    </>
  );
}

const ObservedApp = observer(App);

export default ObservedApp;
