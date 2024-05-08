import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const CreateAd = ({theme}) => {


  const styles = StyleSheet.create({

    /* BODY BEGIN */

    body: {
      flex:1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },

    /* BODY END */
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.body}>
        <Text>C R E A T E    A D</Text>
      </View>
    </SafeAreaView>
  );
};

export default CreateAd;
