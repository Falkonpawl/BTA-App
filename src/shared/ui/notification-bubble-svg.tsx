import * as React from "react";
import Svg, { ClipPath, Defs, ForeignObject, G, Path } from "react-native-svg";

interface NotificationBubbleSvgProps {
  width?: number;
  height?: number;
}

export const NotificationBubbleSvg: React.FC<NotificationBubbleSvgProps> = ({
  props,
}: any) => (
  <Svg
    width={339}
    height={150}
    viewBox="0 0 339 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <ForeignObject x={0} y={0} width={344} height={149.383}></ForeignObject>
    <G filter="url(#filter0_d_2229_12873)" data-figma-bg-blur-radius={4}>
      <Path
        d="M310 14H34C24.0589 14 16 22.0589 16 32V96C16 105.941 24.0589 114 34 114H186.227C189.881 114 193.244 115.993 194.999 119.199L197.627 124L200.612 130C201.759 131.843 204.442 131.843 205.589 130L208.574 124L211.202 119.199C212.957 115.993 216.32 114 219.974 114H310C319.941 114 328 105.941 328 96V32C328 22.0589 319.941 14 310 14Z"
        fill="#B6E3E2"
        fillOpacity={0.75}
        shapeRendering="crispEdges"
      />
    </G>
    <Defs>
      <ClipPath id="bgblur_0_2229_12873_clip_path" transform="translate(0 0)">
        <Path d="M310 14H34C24.0589 14 16 22.0589 16 32V96C16 105.941 24.0589 114 34 114H186.227C189.881 114 193.244 115.993 194.999 119.199L197.627 124L200.612 130C201.759 131.843 204.442 131.843 205.589 130L208.574 124L211.202 119.199C212.957 115.993 216.32 114 219.974 114H310C319.941 114 328 105.941 328 96V32C328 22.0589 319.941 14 310 14Z" />
      </ClipPath>
    </Defs>
  </Svg>
);
