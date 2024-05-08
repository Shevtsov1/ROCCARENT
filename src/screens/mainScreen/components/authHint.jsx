import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@rneui/base";

const AuthHint = ({theme}) => {

  const styles = StyleSheet.create({
    container: {

    }, hintContainer: {

    }, hint: {

    }
  })

  return (
    <View style={styles.container}>
        <View style={styles.hintContainer}>
          <View style={styles.hint}>

          </View>
        </View>
    </View>
  );
};

export default AuthHint;
