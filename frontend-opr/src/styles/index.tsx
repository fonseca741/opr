import { extendTheme } from "@chakra-ui/react";
import "react-toastify/dist/ReactToastify.css";

const globalStyles = {
  body: {
    padding: 0,
    margin: 0,
    background: "whitesmoke",
  },
};

const customTheme = {
  components: {
    Button: {
      variants: {
        primary: {
          backgroundColor: "primary.100",
          color: "#000",
          _hover: { backgroundColor: "primary.200" },
          boxShadow: "1px 1px 5px #888888",
        },
        secondary: {
          backgroundColor: "primary.50",
          color: "#000",
          _hover: { backgroundColor: "primary.75" },
          boxShadow: "1px 1px 5px #888888",
        },
      },
    },
  },
  colors: {
    gradientBackground:
      "linear-gradient(90.86deg, #0C64D3 4.45%, #2A89FF 101.58%)",
    primary: {
      "50": "#fff2b8",
      "75": "#ffe469",
      "100": "#FFD000",
      "200": "#ECC100",
    },
    secondary: {
      "50": "#FFF3E6",
      "100": "#FFEAD1",
      "200": "#FFD6A8",
      "300": "#FFC380",
      "400": "#FFB057",
      "500": "#FF9D2E",
      "600": "#FA8500",
      "700": "#C76A00",
      "800": "#944F00",
      "900": "#613400",
    },
    success: {
      "50": "#E2F4CB",
      "100": "#D5EFB3",
      "200": "#BBE585",
      "300": "#B5DB85",
      "400": "#87CE2C",
      "500": "#6BB70B",
      "600": "#508908",
      "700": "#476E17",
      "800": "#375412",
      "900": "#273B0D",
    },
    danger: {
      "50": "#FDEDED",
      "100": "#FBDBDB",
      "200": "#F7B6B6",
      "300": "#EF8B8B",
      "400": "#EB4343",
      "500": "#DE1818",
      "600": "#B91414",
      "700": "#941010",
      "800": "#700C0C",
      "900": "#4B0808",
    },
    neutral: {
      "0": "#FFFFFF",
      "50": "#F4F4F7",
      "100": "#DCDDE3",
      "200": "#C6C8D1",
      "300": "#B0B3C0",
      "400": "#A0A4B3",
      "500": "#7C8096",
      "600": "#646981",
      "700": "#4D5163",
      "800": "#363843",
      "900": "#202125",
    },
  },
  styles: { global: globalStyles },
};

export const theme = extendTheme(customTheme);

export type Theme = typeof customTheme & typeof theme;
