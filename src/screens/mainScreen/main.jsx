import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Main = () => {


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
        <Text>M A I N</Text>
      </View>
    </View>
  );
};

export default Main;
