import React from "react"
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  type TextProps
} from "react-native"
import _get from "lodash/get"
import _isEqual from "lodash/isEqual"

interface DropdownItemProps {
  item: any
  index: number
  currentValue: any
  valueField: string | number | symbol
  labelField: string | number | symbol
  activeColor: string
  itemContainerStyle?: any
  itemTextStyle?: any
  renderItem?: (item: any, selected: boolean) => React.ReactElement
  onSelect: (item: any) => void
  itemTestIDField?: string
  accessibilityLabel?: string
  itemAccessibilityLabelField?: string
  itemTextProps?: TextProps
}

export const DropdownItem = ({
  item,
  index,
  currentValue,
  valueField,
  labelField,
  activeColor,
  itemContainerStyle,
  itemTextStyle,
  renderItem,
  onSelect,
  itemTestIDField,
  accessibilityLabel,
  itemAccessibilityLabelField,
  itemTextProps
}: DropdownItemProps) => {
  const isSelected = currentValue && _get(currentValue, valueField)
  const selected = _isEqual(_get(item, valueField), isSelected)

  return (
    <TouchableHighlight
      key={index.toString()}
      testID={_get(item, itemTestIDField || labelField)}
      accessible={!!accessibilityLabel}
      accessibilityLabel={_get(item, itemAccessibilityLabelField || labelField)}
      underlayColor={activeColor}
      onPress={() => onSelect(item)}
    >
      <View
        style={StyleSheet.flatten([
          {
            borderBottomWidth: 0.5,
            borderBottomColor: "#676767",
            height: 60,
            backgroundColor: selected ? activeColor : "#fff"
          },
          itemContainerStyle
        ])}
      >
        {renderItem ? (
          renderItem(item, selected)
        ) : (
          <View
            style={{
              padding: 17,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Text
              style={StyleSheet.flatten([
                {
                  flex: 1,
                  fontSize: 15,
                  color: "#000"
                },
                itemTextStyle
              ])}
              {...itemTextProps}
            >
              {_get(item, labelField)}
            </Text>
          </View>
        )}
      </View>
    </TouchableHighlight>
  )
}
