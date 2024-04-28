import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const DropdownButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const data = [
    { id: 1, label: 'Option 1' },
    { id: 2, label: 'Option 2' },
    { id: 3, label: 'Option 3' },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectItem = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.button}>
        <Text style={styles.buttonText}>{selectedItem ? selectedItem.label : 'Select an option'}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdown}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectItem(item)} style={styles.dropdownItem}>
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  dropdownItem: {
    padding: 10,
  },
});

export default DropdownButton;
