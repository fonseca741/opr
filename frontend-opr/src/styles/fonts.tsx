import { Global } from "@emotion/react";

export const Fonts = () => (
  <Global
    styles={`
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 400;
              src: local(''), url('/fonts/inter-v3-latin-regular.woff2') format('woff2');
              font-display: swap;
            }
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 500;
              src: local(''), url('/fonts/inter-v3-latin-500.woff2') format('woff2');
              font-display: swap;
            }
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 600;
              src: local(''), url('/fonts/inter-v3-latin-600.woff2') format('woff2');
              font-display: swap;
            }
          `}
  />
);
