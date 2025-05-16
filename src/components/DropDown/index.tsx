/* eslint-disable @typescript-eslint/no-shadow */
import _differenceWith from "lodash/differenceWith"
import _findIndex from "lodash/findIndex"
import _get from "lodash/get"
import _isEqual from "lodash/isEqual"

import { debounce } from "lodash"
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type JSX
} from "react"
import {
  Dimensions,
  FlatList,
  I18nManager,
  Keyboard,
  type KeyboardEvent,
  Modal,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type ViewStyle
} from "react-native"
import type { DropdownProps, IDropdownRef } from "./model"
import { useDeviceOrientation } from "../../hooks/useDeviceOrientation"
import { useDetectDevice } from "../../hooks/useDetectDevice"
import { TextInput } from "../TextInput"
import { DropDownContainer } from "./DropDownContainer"
import { DropdownItem } from "./DropDownItem"

const { isTablet } = useDetectDevice

const statusBarHeight: number = StatusBar.currentHeight || 0

/**
 * A customizable dropdown component for React Native applications.
 *
 * @template T - The type of data items in the dropdown, must be a record with string keys
 * @component
 *
 * @example
 * ```jsx
 * <Dropdown
 *   data={[{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }]}
 *   labelField="label"
 *   valueField="value"
 *   placeholder="Select an option"
 *   onChange={(item) => console.log(item)}
 * />
 * ```
 *
 * @property `data`: Record<string, any>[] - Array of objects to be used as dropdown items
 * @property `labelField`: string - Object field to display as label
 * @property `valueField`: string - Object field to use as value
 * @property `value`: any - Currently selected value
 * @property `onChange`: (item: T) => void - Callback when item is selected
 * @property `placeholder`: string - Text to display when no item is selected (default: "Select item")
 * @property `search`: boolean - Enable search functionality (default: false)
 * @property `searchField`: string - Field to use for searching (defaults to labelField if not provided)
 * @property `searchPlaceholder`: string - Placeholder for search input
 * @property `searchQuery`: (text: string, labelValue: string) => boolean - Custom search function
 * @property `renderItem`: React.ReactElement - Custom render function for dropdown items
 * @property `renderLeftIcon`: React.ReactElement - Custom render function for left icon
 * @property `renderRightIcon`: React.ReactElement - Custom render function for right icon
 * @property `renderInputSearch`: React.ReactElement - Custom render function for search input
 * @property `disable`: boolean - Disable dropdown (default: false)
 * @property `maxHeight`: number - Maximum height of dropdown (default: 340)
 * @property `minHeight`: number - Minimum height of dropdown (default: 0)
 * @property `style`: ViewStyle - Style for the dropdown container
 * @property `containerStyle`: ViewStyle - Style for the dropdown list container
 * @property `placeholderStyle`: TextStyle - Style for placeholder text
 * @property `selectedTextStyle`: TextStyle - Style for selected item text
 * @property `itemContainerStyle`: ViewStyle - Style for item containers
 * @property `itemTextStyle`: TextStyle - Style for item text
 * @property `inputSearchStyle`: TextStyle - Style for search input
 * @property `iconStyle`: ImageStyle - Style for dropdown icons
 * @property `activeColor`: string - Color for the active/selected item (default: "#0088ff")
 * @property `iconColor`: string - Color for icons (default: "gray")
 * @property `backgroundColor`: string - Background color for modal overlay
 * @property `inverted`: boolean - Invert the dropdown list display (default: true)
 * @property `keyboardAvoiding`: boolean - Adjust position to avoid keyboard (default: true)
 * @property `autoScroll`: boolean - Auto scroll to selected item (default: true)
 * @property `showsVerticalScrollIndicator`: boolean - Show scroll indicator (default: true)
 * @property `dropdownPosition`: 'auto' | 'top' | 'bottom' - Position of dropdown (default: "auto")
 * @property `flatListProps`: FlatListProps<any> - Props for the FlatList component
 * @property `confirmSelectItem`: boolean - Require confirmation before selecting an item
 * @property `onConfirmSelectItem`: (item: T) => void - Callback for confirming item selection
 * @property `onFocus`:  () => void - Callback when dropdown is focused (opened)
 * @property `onBlur`:  () => void - Callback when dropdown is blurred (closed)
 * @property `onChangeText`: (text: string) => void - Callback when search text changes
 * @property `testID`: string - Test ID for testing
 * @property `itemTestIDField`: string - Field to use for item test IDs
 * @property `accessibilityLabel`: string - Accessibility label
 * @property `itemAccessibilityLabelField`: string - Field to use for item accessibility labels
 * @property `mode`: 'default' | 'modal' | 'auto' - Display mode (default: "default")
 * @property `closeModalWhenSelectedItem`: boolean - Close dropdown after item selection (default: true)
 * @property `excludeItems`: T[] - Items to exclude from the dropdown list (default: [])
 * @property `excludeSearchItems`: T[] - Items to exclude from search results (default: [])
 * @property `selectedTextProps`: TextProps - Props for selected item text (default: {})
 * @property `itemTextProps`: TextProps - Props for item text (default: {})
 */
export const Dropdown = forwardRef(
  <T extends Record<string, any>>(
    props: DropdownProps<T>,
    ref: React.Ref<IDropdownRef>
  ) => {
    const orientation = useDeviceOrientation()
    const {
      testID,
      itemTestIDField,
      onChange,
      style = {},
      containerStyle,
      placeholderStyle,
      selectedTextStyle,
      itemContainerStyle,
      itemTextStyle,
      inputSearchStyle,
      iconStyle,
      selectedTextProps = {},
      data = [],
      labelField,
      valueField,
      searchField,
      value,
      activeColor = "#0088ff",
      iconColor = "gray",
      searchPlaceholder,
      searchPlaceholderTextColor = "gray",
      placeholder = "Select item",
      search = false,
      maxHeight = 340,
      minHeight = 0,
      disable = false,
      keyboardAvoiding = true,
      inverted = true,
      renderLeftIcon,
      renderRightIcon,
      renderItem,
      renderInputSearch,
      onFocus,
      onBlur,
      autoScroll = true,
      showsVerticalScrollIndicator = true,
      dropdownPosition = "auto",
      flatListProps,
      searchQuery,
      backgroundColor,
      onChangeText,
      confirmSelectItem,
      onConfirmSelectItem,
      accessibilityLabel,
      itemAccessibilityLabelField,
      mode = "default",
      closeModalWhenSelectedItem = true,
      excludeItems = [],
      excludeSearchItems = [],
      itemTextProps = {}
    } = props
    const refDropDown = useRef<View>(null)
    const refList = useRef<FlatList>(null)
    const [visible, setVisible] = useState<boolean>(false)
    const [currentValue, setCurrentValue] = useState<any>(null)
    const [listData, setListData] = useState<any[]>(data)
    const [position, setPosition] = useState<any>()
    const [keyboardHeight, setKeyboardHeight] = useState<number>(0)
    const [searchText, setSearchText] = useState("")
    const [scrollToIndex, setScrollToIndex] = useState<number>(0)
    const { width: W, height: H } = Dimensions.get("window")
    const [opacity, setOpacity] = useState(0)
    const styleContainerVertical: ViewStyle = useMemo(() => {
      return {
        backgroundColor: "rgba(0,0,0,0.1)",
        alignItems: "center"
      }
    }, [])
    const styleHorizontal: ViewStyle = useMemo(() => {
      return {
        width: orientation === "LANDSCAPE" ? W / 2 : "100%",
        alignSelf: "center"
      }
    }, [W, orientation])

    useImperativeHandle(ref, () => {
      return { open: eventOpen, close: eventClose }
    })

    useEffect(() => {
      return eventClose
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const excludeData = useCallback(
      (data: any[]) => {
        if (excludeItems.length > 0) {
          const getData = _differenceWith(
            data,
            excludeItems,
            (obj1, obj2) => _get(obj1, valueField) === _get(obj2, valueField)
          )
          return getData || []
        } else {
          return data || []
        }
      },
      [excludeItems, valueField]
    )

    useEffect(() => {
      if (data && searchText.length === 0) {
        const filterData = excludeData(data)
        setListData([...filterData])
      }

      if (searchText) {
        onSearch(searchText)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, searchText])

    const eventOpen = () => {
      if (!disable) {
        _measure()
        setVisible(true)
        if (onFocus) {
          onFocus()
        }

        if (searchText.length > 0) {
          onSearch(searchText)
        }
      }
    }

    const eventClose = useCallback(() => {
      if (!disable) {
        setVisible(false)
        if (onBlur) {
          onBlur()
        }
      }
    }, [disable, onBlur])

    const _measure = useCallback(() => {
      if (refDropDown?.current) {
        refDropDown.current.measureInWindow((pageX, pageY, width, height) => {
          let isFull = isTablet
            ? false
            : mode === "modal" || orientation === "LANDSCAPE"

          if (mode === "auto") {
            isFull = false
          }

          const top = isFull ? 20 : height + pageY + 2
          const bottom = H - top + height
          const left = I18nManager.isRTL ? W - width - pageX : pageX

          setPosition({
            isFull,
            width: Math.floor(width),
            top: Math.floor(top + statusBarHeight),
            bottom: Math.floor(bottom - statusBarHeight),
            left: Math.floor(left),
            height: Math.floor(height)
          })
        })
      }
    }, [H, W, orientation, mode])

    const onKeyboardDidShow = useCallback(
      (e: KeyboardEvent) => {
        _measure()
        setKeyboardHeight(e.endCoordinates.height)
      },
      [_measure]
    )

    const onKeyboardDidHide = useCallback(() => {
      setKeyboardHeight(0)
      _measure()
    }, [_measure])

    useEffect(() => {
      const susbcriptionKeyboardDidShow = Keyboard.addListener(
        "keyboardDidShow",
        onKeyboardDidShow
      )
      const susbcriptionKeyboardDidHide = Keyboard.addListener(
        "keyboardDidHide",
        onKeyboardDidHide
      )

      return () => {
        if (typeof susbcriptionKeyboardDidShow?.remove === "function") {
          susbcriptionKeyboardDidShow.remove()
        }

        if (typeof susbcriptionKeyboardDidHide?.remove === "function") {
          susbcriptionKeyboardDidHide.remove()
        }
      }
    }, [onKeyboardDidHide, onKeyboardDidShow])

    const getValue = useCallback(() => {
      const defaultValue =
        typeof value === "object" ? _get(value, valueField) : value

      const getItem = data.filter((e) =>
        _isEqual(defaultValue, _get(e, valueField))
      )

      if (getItem.length > 0) {
        setCurrentValue(getItem[0])
      } else {
        setCurrentValue(null)
      }
    }, [data, value, valueField])

    useEffect(() => {
      getValue()
    }, [value, data, getValue])

    const scrollIndex = debounce(
      useCallback(() => {
        if (
          autoScroll &&
          data?.length > 0 &&
          listData?.length === data?.length
        ) {
          if (refList?.current) {
            const defaultValue =
              typeof value === "object" ? _get(value, valueField) : value

            const index = _findIndex(listData, (e) =>
              _isEqual(defaultValue, _get(e, valueField))
            )
            if (
              listData?.length > 0 &&
              index > -1 &&
              index <= listData?.length - 1
            ) {
              try {
                //  scrollToSelectedItem()
                setOpacity(1)
              } catch (error) {
                console.warn(`scrollToIndex error: ${error}`)
              }
            }
          }
        }
      }, [autoScroll, data.length, listData, value, valueField]),
      200
    )

    const showOrClose = useCallback(() => {
      if (!disable) {
        const visibleStatus = !visible

        if (keyboardHeight > 0 && !visibleStatus) {
          return Keyboard.dismiss()
        }

        if (!visibleStatus) {
          if (onChangeText) {
            onChangeText("")
          }
          setSearchText("")
          onSearch("")
        }

        _measure()
        if (value) {
          const defaultValue =
            typeof value === "object" ? _get(value, valueField) : value
          const index = _findIndex(data, (e) =>
            _isEqual(defaultValue, _get(e, valueField))
          )

          if (index > -1) {
            // Store the scroll index to use it once the dropdown is opened
            setScrollToIndex(index)
          }
        }
        setVisible(visibleStatus)

        if (data) {
          const filterData = excludeData(data)
          setListData(filterData)
        }

        if (visibleStatus) {
          onFocus?.()
        } else {
          onBlur?.()
        }

        if (searchText.length > 0) {
          onSearch(searchText)
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      disable,
      keyboardHeight,
      visible,
      _measure,
      data,
      searchText,
      onFocus,
      onBlur
    ])

    const onSearch = useCallback(
      (text: string) => {
        if (text.length > 0) {
          const defaultFilterFunction = (e: any) => {
            const item = _get(e, searchField || labelField)
              ?.toLowerCase()
              .replace(/\s/g, "")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
            const key = text
              .toLowerCase()
              .replace(/\s/g, "")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")

            return item.indexOf(key) >= 0
          }

          const propSearchFunction = (e: any) => {
            const labelText = _get(e, searchField || labelField)

            return searchQuery?.(text, labelText)
          }

          const dataSearch = data.filter(
            searchQuery ? propSearchFunction : defaultFilterFunction
          )

          if (excludeSearchItems.length > 0 || excludeItems.length > 0) {
            const excludeSearchData = _differenceWith(
              dataSearch,
              excludeSearchItems,
              (obj1, obj2) => _get(obj1, valueField) === _get(obj2, valueField)
            )

            const filterData = excludeData(excludeSearchData)
            setListData(filterData)
          } else {
            setListData(dataSearch)
          }
        } else {
          const filterData = excludeData(data)
          setListData(filterData)
        }
      },
      [
        data,
        searchQuery,
        excludeSearchItems,
        excludeItems,
        searchField,
        labelField,
        valueField,
        excludeData
      ]
    )

    const onSelect = useCallback(
      (item: any) => {
        if (confirmSelectItem && onConfirmSelectItem) {
          return onConfirmSelectItem(item)
        }

        setCurrentValue(item)
        onChange(item)

        if (closeModalWhenSelectedItem) {
          if (onChangeText) {
            onChangeText("")
          }
          setSearchText("")
          onSearch("")
          eventClose()
        }
      },
      [
        confirmSelectItem,
        eventClose,
        onChange,
        onChangeText,
        onConfirmSelectItem,
        onSearch,
        closeModalWhenSelectedItem
      ]
    )

    const renderSearch = useCallback(() => {
      if (search) {
        if (renderInputSearch) {
          return renderInputSearch((text) => {
            if (onChangeText) {
              setSearchText(text)
              onChangeText(text)
            }
            onSearch(text)
          })
        } else {
          return (
            <TextInput
              testID={testID + " input"}
              accessibilityLabel={accessibilityLabel + " input"}
              style={[
                {
                  borderWidth: 0.5,
                  borderColor: "#DDDDDD",
                  paddingHorizontal: 8,
                  marginBottom: 8,
                  margin: 6,
                  height: 45
                },
                inputSearchStyle
              ]}
              inputStyle={[inputSearchStyle]}
              value={searchText}
              autoCorrect={false}
              placeholder={searchPlaceholder}
              onChangeText={(e) => {
                if (onChangeText) {
                  setSearchText(e)
                  onChangeText(e)
                }
                onSearch(e)
              }}
              placeholderTextColor={searchPlaceholderTextColor}
              showIcon
              iconStyle={[{ tintColor: iconColor }, iconStyle]}
            />
          )
        }
      }
      return null
    }, [
      accessibilityLabel,

      iconColor,
      iconStyle,
      inputSearchStyle,
      onChangeText,
      onSearch,
      renderInputSearch,
      search,
      searchPlaceholder,
      searchPlaceholderTextColor,
      testID,
      searchText
    ])

    const _renderList = useCallback(
      (isTopPosition: boolean) => {
        const isInverted = !inverted ? false : isTopPosition

        const _renderListHelper = () => {
          return (
            <FlatList
              testID={testID + " flatlist"}
              accessibilityLabel={accessibilityLabel + " flatlist"}
              {...flatListProps}
              keyboardShouldPersistTaps="handled"
              ref={refList}
              onContentSizeChange={scrollIndex}
              initialScrollIndex={
                scrollToIndex > -1 ? scrollToIndex : undefined
              }
              onScrollToIndexFailed={scrollIndex}
              initialNumToRender={Math.max(5, scrollToIndex + 2)}
              getItemLayout={(_, index) => ({
                length: 60, // Make sure this matches the actual item height
                offset: 60 * index,
                index
              })}
              data={listData}
              inverted={isTopPosition ? inverted : false}
              renderItem={({ item, index }: { item: any; index: number }) => {
                return (
                  <>
                    {renderItem ? (
                      <DropdownItem
                        itemContainerStyle={itemContainerStyle}
                        itemTextStyle={itemTextStyle}
                        activeColor={activeColor}
                        currentValue={currentValue}
                        onSelect={onSelect}
                        itemTestIDField={itemTestIDField}
                        accessibilityLabel={accessibilityLabel}
                        itemAccessibilityLabelField={
                          itemAccessibilityLabelField
                        }
                        itemTextProps={itemTextProps}
                        item={item}
                        index={index}
                        valueField={valueField}
                        labelField={labelField}
                      />
                    ) : (
                      renderItem
                    )}
                  </>
                )
              }}
              keyExtractor={(_item, index) => index.toString()}
              showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            />
          )
        }

        return (
          <TouchableWithoutFeedback>
            <View
              style={{
                flexShrink: 1
              }}
            >
              {isInverted && _renderListHelper()}
              {renderSearch()}
              {!isInverted && _renderListHelper()}
            </View>
          </TouchableWithoutFeedback>
        )
      },
      [
        inverted,
        renderSearch,
        testID,
        accessibilityLabel,
        flatListProps,
        scrollIndex,
        scrollToIndex,
        listData,
        showsVerticalScrollIndicator,
        renderItem,
        itemContainerStyle,
        itemTextStyle,
        activeColor,
        currentValue,
        onSelect,
        itemTestIDField,
        itemAccessibilityLabelField,
        valueField,
        labelField,
        itemTextProps
      ]
    )

    const _renderModal = useCallback(() => {
      if (visible && position) {
        const { isFull, width, height, top, bottom, left } = position

        const onAutoPosition = () => {
          if (keyboardHeight > 0) {
            return bottom < keyboardHeight + height
          }

          return bottom < H * 0.35
        }

        if (width && top && bottom) {
          const styleVertical: ViewStyle = {
            left: left,
            maxHeight: maxHeight,
            minHeight: Math.min(
              // Ensure we have space for at least 3 items or set minimum height
              Math.max(minHeight, Math.min(listData.length, 3) * 50),
              maxHeight
            )
          }
          const isTopPosition =
            dropdownPosition === "auto"
              ? onAutoPosition()
              : dropdownPosition === "top"

          let keyboardStyle: ViewStyle = {}

          let extendHeight = !isTopPosition ? top : bottom
          if (
            keyboardAvoiding &&
            keyboardHeight > 0 &&
            isTopPosition &&
            dropdownPosition === "auto"
          ) {
            extendHeight = keyboardHeight
          }

          return (
            <Modal
              transparent
              statusBarTranslucent
              visible={visible}
              supportedOrientations={["landscape", "portrait"]}
              onRequestClose={showOrClose}
            >
              <TouchableWithoutFeedback onPress={showOrClose}>
                <View
                  style={StyleSheet.flatten([
                    { opacity: opacity, flex: 1 },
                    isFull && styleContainerVertical,
                    backgroundColor && { backgroundColor: backgroundColor },
                    keyboardStyle
                  ])}
                >
                  <View
                    style={StyleSheet.flatten([
                      { flex: 1 },
                      !isTopPosition
                        ? { paddingTop: extendHeight }
                        : {
                            justifyContent: "flex-end",
                            paddingBottom: extendHeight
                          },
                      isFull && {
                        alignItems: "center",
                        justifyContent: "center"
                      }
                    ])}
                  >
                    <View
                      style={StyleSheet.flatten([
                        isFull ? styleHorizontal : styleVertical,
                        {
                          width,
                          flexShrink: 1,
                          marginTop: 8,
                          borderRadius: 10,
                          overflow: "hidden",
                          borderColor: "#676767",
                          backgroundColor: "#fff",
                          borderWidth: 1,
                          // iOS shadow properties
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2
                          },
                          shadowOpacity: 0.9,
                          shadowRadius: 3,
                          // Required for Android shadow
                          elevation: 4
                        },
                        containerStyle
                      ])}
                    >
                      {_renderList(isTopPosition)}
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )
        }
        return null
      }
      return null
    }, [
      visible,
      position,
      keyboardHeight,
      H,
      maxHeight,
      minHeight,
      listData.length,
      dropdownPosition,
      keyboardAvoiding,
      showOrClose,
      opacity,
      styleContainerVertical,
      backgroundColor,
      styleHorizontal,
      containerStyle,
      _renderList
    ])

    return (
      <View
        style={StyleSheet.flatten([{ justifyContent: "center" }, style])}
        ref={refDropDown}
        onLayout={_measure}
      >
        <DropDownContainer
          visible={visible}
          testID={testID}
          renderLeftIcon={renderLeftIcon}
          renderRightIcon={renderRightIcon}
          showOrClose={showOrClose}
          currentValue={currentValue}
          placeholder={placeholder}
          valueField={valueField}
          labelField={labelField}
          accessibilityLabel={accessibilityLabel}
          selectedTextStyle={selectedTextStyle}
          selectedTextProps={selectedTextProps}
          placeholderStyle={placeholderStyle}
          iconColor={iconColor}
          iconStyle={iconStyle}
        />
        {_renderModal()}
      </View>
    )
  }
) as <T extends Record<string, any>>(
  props: DropdownProps<T> & { ref?: React.Ref<IDropdownRef> }
) => JSX.Element
