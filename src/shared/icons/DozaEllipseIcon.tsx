import * as React from "react";
import Svg, { Circle } from "react-native-svg";

const DozdEllipseIcon = (props: any) => (
  <Svg
    width={229}
    height={229}
    viewBox="0 0 229 229"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={114.5} cy={114.5} r={114.5} fill="white" />
    <Circle
      cx={114.5}
      cy={114.5}
      r={107.5}
      stroke="#56B5B3"
      strokeOpacity={0.15}
      strokeWidth={14}
    />
  </Svg>
);
export default DozdEllipseIcon;
