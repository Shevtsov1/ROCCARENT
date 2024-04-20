import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { Button } from "@rneui/base";

const Auth = () => {


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
        <Text>A U T H</Text>
        <Button title={'Change color mode'}/>
      </View>
    </View>
  );
};

export default Auth;
