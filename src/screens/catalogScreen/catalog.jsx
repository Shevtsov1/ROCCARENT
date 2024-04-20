import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Catalog = () => {


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
        <Text>C A T A L O G</Text>
      </View>
    </View>
  );
};

export default Catalog;
