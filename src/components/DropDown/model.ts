import type React from "react"
import type {
  FlatListProps,
  ImageStyle,
  StyleProp,
  TextProps,
  TextStyle,
  ViewStyle
} from "react-native"

export type IDropdownRef = {
  open: () => void
  close: () => void
}

/**
 * Props interface for the Dropdown component
 * @template T The type of data items in the dropdown
 */
export interface DropdownProps<T> {
  /**
   * Reference object for the Dropdown component to access its methods externally
   */
  ref?:
    | React.RefObject<IDropdownRef>
    | React.MutableRefObject<IDropdownRef>
    | null
    | undefined

  /**
   * Test ID for the dropdown component in automated testing
   */
  testID?: string

  /**
   * Field to use as the testID for individual dropdown items
   */
  itemTestIDField?: string

  /**
   * Style for the main container of the dropdown
   */
  style?: StyleProp<ViewStyle>

  /**
   * Style for the dropdown options container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * Style for the placeholder text when no item is selected
   */
  placeholderStyle?: StyleProp<TextStyle>

  /**
   * Style for the selected item's text
   */
  selectedTextStyle?: StyleProp<TextStyle>

  /**
   * Additional props for the selected text component
   */
  selectedTextProps?: TextProps

  /**
   * Additional props for individual dropdown items text components
   */
  itemTextProps?: TextProps

  /**
   * Style for the container of individual dropdown items
   */
  itemContainerStyle?: StyleProp<ViewStyle>

  /**
   * Style for the text of individual dropdown items
   */
  itemTextStyle?: StyleProp<TextStyle>

  /**
   * Style for the search input field
   */
  inputSearchStyle?: StyleProp<TextStyle>

  /**
   * Style for the dropdown icons (arrow, search icon)
   */
  iconStyle?: StyleProp<ImageStyle>

  /**
   * Maximum height of the dropdown list in pixels
   * @default 340
   */
  maxHeight?: number

  /**
   * Minimum height of the dropdown list in pixels
   * @default 0
   */
  minHeight?: number

  /**
   * Color for the dropdown icons
   * @default 'gray'
   */
  iconColor?: string

  /**
   * Background color for the active/selected item
   * @default '#F6F7F8'
   */
  activeColor?: string

  /**
   * Array of data items to be displayed in the dropdown
   */
  data: T[]

  /**
   * Currently selected value (can be object, string, or null)
   */
  value?: T | string | null

  /**
   * Text to display when no item is selected
   * @default 'Select item'
   */
  placeholder?: string

  /**
   * Property name in data items to use as display text
   */
  labelField: keyof T

  /**
   * Property name in data items to use as the value
   */
  valueField: keyof T

  /**
   * Property name in data items to search on (defaults to labelField)
   */
  searchField?: keyof T

  /**
   * Whether to enable search functionality
   * @default false
   */
  search?: boolean

  /**
   * Placeholder text for the search input
   */
  searchPlaceholder?: string

  /**
   * Text color for the search placeholder
   * @default 'gray'
   */
  searchPlaceholderTextColor?: string

  /**
   * Whether the dropdown is disabled/non-interactive
   * @default false
   */
  disable?: boolean

  /**
   * Whether to automatically scroll to the selected item when dropdown opens
   * @default true
   */
  autoScroll?: boolean

  /**
   * Whether to show scroll indicator in the dropdown list
   * @default true
   */
  showsVerticalScrollIndicator?: boolean

  /**
   * Position of the dropdown relative to the selector
   * - 'auto': Calculate the best position based on space
   * - 'top': Always position above the selector
   * - 'bottom': Always position below the selector
   * @default 'auto'
   */
  dropdownPosition?: "auto" | "top" | "bottom"

  /**
   * Additional props to pass to the FlatList component
   */
  flatListProps?: Omit<FlatListProps<any>, "renderItem" | "data">

  /**
   * Whether to adjust dropdown position when keyboard is visible
   * @default true
   */
  keyboardAvoiding?: boolean

  /**
   * Background color for the modal/overlay
   */
  backgroundColor?: string

  /**
   * Whether to require confirmation when selecting an item
   * @default false
   */
  confirmSelectItem?: boolean

  /**
   * Accessibility label for the dropdown component
   */
  accessibilityLabel?: string

  /**
   * Field to use as the accessibility label for individual items
   */
  itemAccessibilityLabelField?: string

  /**
   * Whether to invert the list when positioned above the selector
   * @default true
   */
  inverted?: boolean

  /**
   * Display mode for the dropdown
   * - 'default': Regular dropdown behavior
   * - 'modal': Full modal presentation
   * - 'auto': Adaptive based on device/orientation
   * @default 'default'
   */
  mode?: "default" | "modal" | "auto"

  /**
   * Whether to close the dropdown modal when an item is selected
   * @default true
   */
  closeModalWhenSelectedItem?: boolean

  /**
   * Array of items to exclude from the dropdown list
   * @default []
   */
  excludeItems?: T[]

  /**
   * Array of items to exclude from search results
   * @default []
   */
  excludeSearchItems?: T[]

  /**
   * Callback function triggered when an item is selected
   * @param item The selected item
   */
  onChange: (item: T) => void

  /**
   * Function to render an icon on the left side of the dropdown selector
   * @param visible Whether the dropdown is currently visible
   * @returns React element or null
   */
  renderLeftIcon?: (visible?: boolean) => React.ReactElement | null

  /**
   * Function to render an icon on the right side of the dropdown selector
   * @param visible Whether the dropdown is currently visible
   * @returns React element or null
   */
  renderRightIcon?: (visible?: boolean) => React.ReactElement | null

  /**
   * Function to customize rendering of dropdown items
   * @param item The data item to render
   * @param selected Whether the item is currently selected
   * @returns React element or null
   */
  renderItem?: (item: T, selected?: boolean) => React.ReactElement | null

  /**
   * Function to customize rendering of the search input
   * @param onSearch Callback to trigger search functionality
   * @returns React element or null
   */
  renderInputSearch?: (
    onSearch: (text: string) => void
  ) => React.ReactElement | null

  /**
   * Callback function triggered when dropdown receives focus
   */
  onFocus?: () => void

  /**
   * Callback function triggered when dropdown loses focus
   */
  onBlur?: () => void

  /**
   * Custom search function to filter dropdown items
   * @param keyword The search text
   * @param labelValue The value from the item's label field
   * @returns Boolean indicating if the item matches the search
   */
  searchQuery?: (keyword: string, labelValue: string) => boolean

  /**
   * Callback function triggered when search text changes
   * @param search The current search text
   */
  onChangeText?: (search: string) => void

  /**
   * Callback function triggered when an item is confirmed
   * (Used when confirmSelectItem is true)
   * @param item The selected item
   */
  onConfirmSelectItem?: (item: T) => void
}
