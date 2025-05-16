import { Text, View, StyleSheet } from "react-native"
import { Dropdown } from "react-native-formal-ui"
import { useState } from "react"
import { DummyData, type DummyDataType } from "./DummyData"

export default function App() {
  const [selected, setSelected] = useState<string>("zucchini")
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
            fontSize: 16
          }}
        >
          {item.value}
        </Text>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={{ width: "100%", padding: 16 }}>
        <Dropdown
          autoScroll={true}
          dropdownPosition="auto"
          selectedTextProps={{ numberOfLines: 2, allowFontScaling: false }}
          showsVerticalScrollIndicator={false}
          data={DummyData}
          placeholder="Choose an option"
          labelField="label"
          valueField="value"
          onChange={function (item: DummyDataType): void {
            setSelected(item.value)
          }}
          value={selected}
          renderItem={itemRender}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})
