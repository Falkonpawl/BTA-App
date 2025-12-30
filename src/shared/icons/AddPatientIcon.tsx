import React from "react";
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend, ClipPath, Rect, G } from "react-native-svg";

interface AddPatientIconProps {
  size?: number;
}

const AddPatientIcon: React.FC<AddPatientIconProps> = ({
  size = 84,
}) => (
  <Svg width={size} height={size} viewBox="0 0 84 84" fill="none">
    <Defs>
      <Filter id="filter0_d_333_2746" x="0" y="0" width="84" height="84" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
        <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <FeOffset dy="2"/>
        <FeGaussianBlur stdDeviation="8"/>
        <FeComposite in2="hardAlpha" operator="out"/>
        <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_333_2746"/>
        <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_333_2746" result="shape"/>
      </Filter>
      <SvgLinearGradient id="paint0_linear_333_2746" x1="50.4193" y1="35" x2="50.4193" y2="43" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#56B5B3"/>
        <Stop offset="1" stopColor="#1F7876"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint1_linear_333_2746" x1="39.129" y1="27" x2="39.129" y2="39" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#56B5B3"/>
        <Stop offset="1" stopColor="#1F7876"/>
      </SvgLinearGradient>
      <SvgLinearGradient id="paint2_linear_333_2746" x1="38.6935" y1="41" x2="38.6935" y2="51" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#56B5B3"/>
        <Stop offset="1" stopColor="#1F7876"/>
      </SvgLinearGradient>
      <ClipPath id="clip0_333_2746">
        <Rect width="24" height="24" fill="white" transform="translate(31 27)"/>
      </ClipPath>
    </Defs>
    <G filter="url(#filter0_d_333_2746)">
      <Circle cx="25" cy="25" r="25" transform="matrix(-1 0 0 1 67 15)" fill="white"/>
      <Circle cx="25" cy="25" r="25.5" transform="matrix(-1 0 0 1 67 15)" stroke="white"/>
    </G>
    <G clipPath="url(#clip0_333_2746)">
      <Path d="M54 38H52V36C52 35.4477 51.5523 35 51 35C50.4477 35 50 35.4477 50 36V38H48C47.4477 38 47 38.4477 47 39C47 39.5523 47.4477 40 48 40H50V42C50 42.5523 50.4477 43 51 43C51.5523 43 52 42.5523 52 42V40H54C54.5523 40 55 39.5523 55 39C55 38.4477 54.5523 38 54 38Z" fill="url(#paint0_linear_333_2746)"/>
      <Path d="M40 39C43.3137 39 46 36.3137 46 33C46 29.6863 43.3137 27 40 27C36.6863 27 34 29.6863 34 33C34 36.3137 36.6863 39 40 39Z" fill="url(#paint1_linear_333_2746)"/>
      <Path d="M40 41C35.0317 41.0055 31.0055 45.0317 31 50C31 50.5523 31.4477 51 32 51H48C48.5522 51 49 50.5523 49 50C48.9945 45.0317 44.9683 41.0055 40 41Z" fill="url(#paint2_linear_333_2746)"/>
    </G>
  </Svg>
);

export default AddPatientIcon;

