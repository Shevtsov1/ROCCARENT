import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { Button } from "@rneui/base";
import { heightPercentageToDP } from "react-native-responsive-screen";

const Profile = ({theme, toggleMode, navigation}) => {

  const handleAuthBtnPress = () => {
    navigation.navigate('Auth');
  }

  const styles = StyleSheet.create({

    /* BODY BEGIN */

    body: {
      flex:1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.secondary,
    },

    /* BODY END */
  });

  return (
    <View style={{flex: 1}}>
      <View style={styles.body}>
        <Text>P R O F I L E</Text>
        <Button onPress={handleAuthBtnPress} title={'Go to Auth'}/>
        <Button onPress={toggleMode} title={'Change color mode'}/>
      </View>
    </View>
  );
};

export default Profile;
