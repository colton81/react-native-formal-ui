import _get from "lodash/get"
import {
  TouchableOpacity,
  View,
  Text,
  I18nManager,
  type ViewProps
} from "react-native"
import { ChevronDown } from "../../icons/ChevronDown"
import React, { forwardRef } from "react"
type DropDownContainerProps = {
  visible?: boolean
  testID?: string
  renderLeftIcon?: (visible?: boolean) => React.ReactElement | null
  renderRightIcon?: (visible?: boolean) => React.ReactElement | null
  showOrClose: () => void
  currentValue: any
  placeholder: string
  labelField: string | number | symbol
  valueField: string | number | symbol
  accessibilityLabel?: string
  selectedTextStyle: any
  selectedTextProps: any
  placeholderStyle: any
  iconColor: string
  iconStyle: any
} & ViewProps

export const DropDownContainer = forwardRef<any, DropDownContainerProps>(
  (props, ref) => {
    const isSelected =
      props.currentValue && _get(props.currentValue, props.valueField)
    return (
      <TouchableOpacity
        ref={ref}
        testID={props.testID}
        accessible={!!props.accessibilityLabel}
        accessibilityLabel={props.accessibilityLabel}
        onPress={props.showOrClose}
      >
        <View
          {...props}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 45,
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 8,
            paddingLeft: 10,
            borderColor: "#676767",
            ...(props.style && typeof props.style === "object"
              ? props.style
              : {})
          }}
        >
          {props.renderLeftIcon?.(props.visible)}
          <Text
            style={[
              {
                flex: 1,
                fontSize: 16,
                writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
                color: "#000"
              },
              isSelected !== null
                ? props.selectedTextStyle
                : props.placeholderStyle
            ]}
            {...props.selectedTextProps}
          >
            {isSelected !== null
              ? _get(props.currentValue, props.labelField)
              : props.placeholder}
          </Text>
          {props.renderRightIcon ? (
            props.renderRightIcon(props.visible)
          ) : (
            <ChevronDown color={props.iconColor} width={20} height={20} />
          )}
        </View>
      </TouchableOpacity>
    )
  }
)
