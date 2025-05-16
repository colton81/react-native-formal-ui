/* eslint-disable @typescript-eslint/no-shadow */
import { useEffect, useState } from "react"
import {
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  I18nManager
} from "react-native"
import type { CTextInput } from "./model"
import { CircleX } from "lucide-react-native"

export const TextInput: CTextInput = (props) => {
  const {
    fontFamily,
    style,
    value,
    placeholderTextColor = "#000",
    placeholder = "",
    showIcon,
    inputStyle,
    iconStyle,
    onChangeText = (_value: string) => {},
    renderLeftIcon,
    renderRightIcon
  } = props

  const [text, setText] = useState<string>("")

  useEffect(() => {
    if (value) {
      setText(value)
    }
  }, [value])

  const onChange = (text: string) => {
    setText(text)
    onChangeText(text)
  }

  const _renderRightIcon = () => {
    if (showIcon) {
      if (renderRightIcon) {
        return renderRightIcon()
      }
      if (text.length > 0) {
        return (
          <TouchableOpacity onPress={() => onChange("")}>
            <CircleX
              style={StyleSheet.flatten([
                {
                  width: 20,
                  height: 20
                },
                iconStyle
              ])}
            />
          </TouchableOpacity>
        )
      }
      return null
    }
    return null
  }

  const font = () => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily
      }
    } else {
      return {}
    }
  }

  return (
    <TouchableWithoutFeedback>
      <View style={[style]}>
        <View
          style={{
            flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
            alignItems: "center",
            flex: 1
          }}
        >
          {renderLeftIcon?.()}
          <RNTextInput
            {...props}
            style={StyleSheet.flatten([
              {
                fontSize: 16,
                flex: 1,
                textAlign: I18nManager.isRTL ? "right" : "left"
              },
              inputStyle,
              font()
            ])}
            value={text}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            onChangeText={onChange}
          />
          {_renderRightIcon()}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
