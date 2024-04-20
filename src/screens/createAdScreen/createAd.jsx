import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const CreateAd = () => {


  const styles = StyleSheet.create({

    /* BODY BEGIN */

    body: {
      flex:1,
      justifyContent: "center",
      alignItems: "center",
    },

    /* BODY END */
  });

  return (
    <View style={{flex: 1}}>
      <View style={styles.body}>
        <Text>C R E A T E    A D</Text>
      </View>
    </View>
  );
};

export default CreateAd;
