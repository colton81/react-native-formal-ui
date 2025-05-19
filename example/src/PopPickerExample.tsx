import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Trash2 } from "lucide-react-native"
import React, { useCallback, useEffect, useState } from "react"
import {
  I18nManager,
  Platform,
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  Text,
  type ViewStyle
} from "react-native"
import { DropDown } from "react-native-formal-ui"

type PopPickerType = {
  data: any[]
  label?: string
  displayKey: string
  selectionKey: string
  value: any
  defaultValue?: any
  onValueChange: (value: any) => void
  showTrashIcon?: boolean
  backgroundColor?: string
  disabled?: boolean
  clearOnNull?: boolean
  placeHolder?: string
  children?: any
  caption?: string
  style?: StyleProp<ViewStyle>
  extraValue?: string
}

export const PopPickerExample = ({
  data = [],
  label,
  displayKey,
  selectionKey,
  value,
  defaultValue,
  onValueChange,
  showTrashIcon = false,
  disabled,
  clearOnNull = false,
  caption,
  style,
  extraValue,
  placeHolder
}: PopPickerType) => {
  const [selectedValue, setSelectedValue] = useState<any>(value)

  useEffect(() => {
    setSelectedValue(value)
  }, [value])

  const deleteSelection = useCallback(() => {
    setSelectedValue(null)
    onValueChange(null)
  }, [onValueChange])

  useEffect(() => {
    if (value === null && clearOnNull) {
      deleteSelection()
    }
  }, [clearOnNull, deleteSelection, value])

  const handleSelect = (itemValue: any) => {
    setSelectedValue(itemValue)
    const selectedItem = data.find((item) => item[selectionKey] === itemValue)
    if (selectedItem) {
      onValueChange(selectedItem[selectionKey])
    }
  }

  const borderColor = () => {
    return disabled ? "#E4E9F2" : "#B0BEC5"
  }
  const backgroundColor = () => {
    return disabled ? "#E4E9F2" : "white"
  }
  const fontColor = () => {
    return disabled ? "#747474" : "#000"
  }
  const displayValue = selectedValue ?? defaultValue
  const styles = useStyle()
  // if we have extra info we render this item instead of the default picker
  const extraInfoRender = (item: any) => {
    // nested text in a text so we can change the style of extra value if we want to
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 8,
          paddingLeft: 12
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            fontSize: 16,
            writingDirection: I18nManager.isRTL ? "rtl" : "ltr"
          }}
        >
          {item.value} -{" "}
          <Text numberOfLines={1} style={{ fontSize: 16 }}>
            {item.extraValue}
          </Text>
        </Text>
      </View>
    )
  }
  const itemRender = (item: any) => {
    // nested text in a text so we can change the style of extra value if we want to
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 8,
          paddingLeft: 12
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            fontSize: 16,
            writingDirection: I18nManager.isRTL ? "rtl" : "ltr"
          }}
        >
          {item.label}
        </Text>
      </View>
    )
  }

  return (
    <View style={[style, styles.container, { paddingTop: label ? 0 : 2 }]}>
      <View style={[styles.dropdownWrapper]}>
        {label ? (
          <View
            style={{ width: "25%", justifyContent: "center", paddingRight: 2 }}
          >
            {label ? (
              <Text
                style={{
                  textAlign: "left",
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#8F9BB3"
                }}
              >
                {label}
              </Text>
            ) : null}
          </View>
        ) : null}

        <View
          style={{
            flex: 1,
            backgroundColor: backgroundColor(),
            borderRadius: 5
          }}
        >
          <DropDown
            dropdownPosition="auto"
            selectedTextProps={{ numberOfLines: 2, allowFontScaling: false }}
            showsVerticalScrollIndicator={false}
            style={[
              {
                height: 45,
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 8,
                paddingLeft: 10,
                borderColor: borderColor()
              }
            ]}
            placeholderStyle={{
              color: disabled
                ? "transparent"
                : Platform.OS === "android"
                  ? "#666666"
                  : "#676767",
              fontSize: 15
            }}
            selectedTextStyle={{
              color: fontColor()
            }}
            data={
              data
                ? data.map((item) => ({
                    label: item[displayKey],
                    value: item[selectionKey],
                    extraValue: extraValue ? item?.[extraValue] : null
                  }))
                : []
            }
            activeColor={"rgba(0,50,255,0.2)"}
            labelField="label"
            renderItem={extraValue ? extraInfoRender : itemRender}
            disable={disabled}
            // containerStyle={{ backgroundColor: theme.mainBackgroundColor }}
            itemTextStyle={{ color: fontColor() }}
            itemContainerStyle={{
              borderBottomWidth: 0.5,
              borderBottomColor: "#dcdcdc",
              height: 55,
              backgroundColor: "white"
            }}
            valueField="value"
            placeholder={placeHolder ?? " "}
            value={displayValue}
            renderRightIcon={() =>
              showTrashIcon && value ? (
                <Pressable onPress={deleteSelection}>
                  <Trash2
                    color={"#FF3D00"}
                    size={24}
                    onPress={deleteSelection}
                  />
                </Pressable>
              ) : !disabled ? (
                <View style={{ paddingRight: 0 }}>
                  <MaterialCommunityIcons
                    size={24}
                    color={"#dcdcdc"}
                    name="chevron-down"
                  />
                </View>
              ) : null
            }
            onChange={(item) => handleSelect(item.value)}
          />
        </View>
      </View>
      {caption ? (
        <View style={{ flexDirection: "row", gap: 5 }}>
          {label ? (
            <View style={{ width: "25%" }}>
              <Text />
            </View>
          ) : null}
          <Text style={{ fontSize: 12, color: "#e42b2b" }}>{caption}</Text>
        </View>
      ) : null}

      {/* {showLocDesc &&
      selectedValue !== "" &&
      selectedValue !== 0 &&
      selectedValue !== null &&
      selectedValue !== undefined ? (
        <Text style={[styles.detailText, { color: theme.text }]}>
          {data?.find(item => item[selectionKey] === selectedValue)?.LocDescription}
        </Text>
      ) : null} */}
    </View>
  )
}

const useStyle = () => {
  return StyleSheet.create({
    container: {
      justifyContent: "center",
      gap: 5
    },
    dropdownWrapper: {
      borderRadius: 5,
      justifyContent: "center",
      flexDirection: "row",
      gap: 5
    },
    dropdown: {}
  })
}
