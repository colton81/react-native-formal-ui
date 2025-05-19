// Mock PixelRatio to prevent StyleSheet errors

import { render, screen } from "@testing-library/react-native"
import { DropDown } from "../index"

// Mock the necessary dependencies
jest.mock("react-native/Libraries/Components/StatusBar/StatusBar", () => ({
  currentHeight: 20
}))

jest.mock("../hooks/useDetectDevice", () => ({
  useDetectDevice: {
    isTablet: false
  }
}))

jest.mock("../hooks/useDeviceOrientation", () => ({
  useDeviceOrientation: jest.fn(() => "PORTRAIT")
}))

// Mock modules to suppress warnings
jest.mock("react-native/Libraries/Utilities/Dimensions", () => ({
  get: () => ({ width: 375, height: 812 })
}))

// Sample test data
const testData = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" }
]

describe("Dropdown Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders correctly with default props", () => {
    render(
      <DropDown
        autoScroll={true}
        dropdownPosition="auto"
        selectedTextProps={{ numberOfLines: 2, allowFontScaling: false }}
        showsVerticalScrollIndicator={false}
        placeholder="Choose an option"
        value={""}
        data={testData}
        labelField="label"
        valueField="value"
        onChange={jest.fn()}
      />
    )

    expect(screen.getByText("Select item")).toBeTruthy()
  })
})
