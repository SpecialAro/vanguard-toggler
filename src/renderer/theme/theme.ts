import { ThemeOptions, createTheme } from "@mui/material/styles";

const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    text: {
      primary: "#f5f5f5",
      secondary: "#f5f5f5",
    },
    primary: {
      main: "#f5f5f5",
    },
    secondary: {
      main: "#00fff6",
    },
    background: {
      paper: "#153B47",
      default: "#153B47",
    },
  },
};

export const theme = createTheme(themeOptions);
