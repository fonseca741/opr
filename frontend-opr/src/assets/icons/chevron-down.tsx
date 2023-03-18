import { SVGProps } from "react";

export const ChevronDown = (props: SVGProps<SVGSVGElement> | any) => (
  <svg
    fill="none"
    width="1em"
    height="1em"
    strokeWidth="2"
    viewBox="0 0 20 20"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
