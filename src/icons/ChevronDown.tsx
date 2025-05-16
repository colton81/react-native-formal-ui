import Svg, { Path } from "react-native-svg"

export const ChevronDown = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-chevron-down-icon lucide-chevron-down"
    {...props}
  >
    <Path d="m6 9 6 6 6-6" />
  </Svg>
)
