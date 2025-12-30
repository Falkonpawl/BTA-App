import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface LightningIconProps {
  fill?: string;
}

const LightningIcon = ({
  fill = "rgba(255, 255, 255, 0.75)",
  ...props
}: LightningIconProps) => (
  <Svg width={21} height={21} viewBox="0 0 21 21" fill="none" {...props}>
    <Path
      d="M10.9959 21H7.62976L9.37976 14H5.76338C5.41389 13.9999 5.06927 13.918 4.75707 13.7609C4.44487 13.6038 4.17374 13.3758 3.96535 13.0953C3.75696 12.8147 3.61709 12.4893 3.55691 12.145C3.49673 11.8007 3.51791 11.4471 3.61876 11.1125L6.97963 0H15.2633L12.6383 7H16.1584C16.5589 7.00025 16.9518 7.10903 17.2955 7.31475C17.6391 7.52048 17.9206 7.81547 18.1099 8.16838C18.2993 8.52128 18.3895 8.9189 18.371 9.31898C18.3524 9.71905 18.2258 10.1066 18.0046 10.4405L10.9959 21Z"
      fill={fill}
    />
  </Svg>
);
export default LightningIcon;
