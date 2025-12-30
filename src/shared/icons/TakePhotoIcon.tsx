import * as React from "react";
import Svg, { Circle } from "react-native-svg";

const TakePhotoIcon = (props: any) => (
  <Svg
    width={52}
    height={52}
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={26} cy={26} r={26} fill="white" fillOpacity={0.56} />
    <Circle cx={26} cy={26} r={21} fill="white" />
  </Svg>
);
export default TakePhotoIcon;
