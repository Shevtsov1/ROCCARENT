import React, {useState} from 'react';
import {TouchableOpacity, Image, Text, StyleSheet, View} from 'react-native';

import Terms from "./Terms";
import {widthPercentageToDP} from "react-native-responsive-screen";

const TermsCheckbox = ({theme, isDarkMode, isActive, onCheckboxToggle}) => {
  const [isChecked, setIsChecked] = useState(isActive);
  const [showTerms, setShowTerms] = useState(false);

  const handleCheckboxPress = () => {
    const updatedChecked = !isChecked;
    setIsChecked(updatedChecked);
    onCheckboxToggle(updatedChecked);
  };

  const handleShowTerms = () => {
    setShowTerms(true);
  };

  const handleTermsPress = () => {
    isChecked ? handleCheckboxPress() : handleShowTerms();
  }

  const handleCloseTerms = () => {
    setShowTerms(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={handleCheckboxPress} style={styles.container}>
        <Image style={{
          height: 24,
          width: 24,
          tintColor: isChecked ? (theme.colors.accent) : (theme.colors.text)
        }} resizeMethod={"resize"}
               source={isChecked ? require('../../../assets/images/checkbox.png') : require('../../../assets/images/checkbox-unchecked.png')}/>
        <View style={{flex: 1, marginHorizontal: widthPercentageToDP(4)}}>
          <Text
            style={[styles.label, {color: theme.colors.text}]}>
            Я соглашаюсь с условиями
            <TouchableOpacity onPress={handleTermsPress}>
              <Text style={[styles.label, {color: theme.colors.accent}]}>
                пользовательского соглашения
              </Text>
            </TouchableOpacity>
          </Text>
        </View>
      </TouchableOpacity>
      <Terms theme={theme} isDarkMode={isDarkMode} isVisible={showTerms} isChecked={isChecked} handleConfirm={handleCheckboxPress}
             onClose={handleCloseTerms}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  label: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
  },
});

export default TermsCheckbox;
