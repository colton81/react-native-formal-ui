import Svg, { Path, Circle } from "react-native-svg"

export const CircleX = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-circle-x-icon lucide-circle-x"
    {...props}
  >
    <Circle cx={12} cy={12} r={10} />
    <Path d="m15 9-6 6M9 9l6 6" />
  </Svg>
)
