import * as React from "react";
import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const LoaderIcon = (props: any) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Svg width={52} height={52} viewBox="0 0 52 52" fill="none" {...props}>
        <Path
          d="M48.2163 31.9528C46.9725 36.5948 44.3059 40.7305 40.591 43.7792C36.8762 46.8279 32.2997 48.6364 27.5043 48.9508C22.7089 49.2651 17.9355 48.0694 13.8544 45.5317C9.77343 42.9939 6.58983 39.2416 4.75077 34.8017C2.91171 30.3618 2.50957 25.4574 3.60083 20.7772C4.69209 16.0971 7.22193 11.8763 10.835 8.70769C14.4482 5.53907 18.963 3.58179 23.7456 3.11075C28.5282 2.63971 33.3381 3.67857 37.5 6.08141"
          stroke="url(#paint0_linear_2229_13877)"
          strokeWidth={6}
        />
        <Defs>
          <LinearGradient
            id="paint0_linear_2229_13877"
            x1={26}
            y1={0}
            x2={26}
            y2={52}
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#B2B2B2" />
            <Stop offset={1} stopColor="#DADADA" />
          </LinearGradient>
        </Defs>
      </Svg>
    </Animated.View>
  );
};

export default LoaderIcon;
