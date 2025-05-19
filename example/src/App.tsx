import { View, StyleSheet, ScrollView, Button, Modal } from "react-native"
import { useState } from "react"
import { DummyData } from "./DummyData"
import { PopPickerExample } from "./PopPickerExample"

export default function App() {
  const [selected, setSelected] = useState<string>("")
  const [showModal, setShowModal] = useState(false)
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentInset={{ top: 100 }}
    >
      <Button
        title="Show Modal"
        onPress={() => {
          setShowModal(!showModal)
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(!showModal)
        }}
      >
        <View
          style={{
            flex: 1
          }}
        >
          <View
            style={{
              flex: 1
            }}
          >
            <View
              style={{
                flexShrink: 1,
                borderWidth: 0.5,
                borderColor: "#EEEEEE",
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                elevation: 2
              }}
            >
              <Button
                title="Close Modal"
                onPress={() => {
                  setShowModal(!showModal)
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ width: "100%", padding: 16, gap: 16 }}>
        <PopPickerExample
          data={DummyData}
          label="Select a fruit"
          displayKey={"label"}
          selectionKey={"value"}
          value={selected}
          onValueChange={function (value: any): void {
            setSelected(value)
          }}
        />
        <PopPickerExample
          data={DummyData}
          label="Select a fruit"
          displayKey={"label"}
          selectionKey={"value"}
          value={selected}
          onValueChange={function (value: any): void {
            setSelected(value)
          }}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})
