import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@rneui/base";
import { ShadowedView, shadowStyle } from "react-native-fast-shadow";

const AuthHint = ({ theme }) => {

  const styles = StyleSheet.create({
    hint: {
      height: 144,
      width: "100%",
      backgroundColor: theme.colors.background,
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
      marginBottom: 12,
    },
  });

  return (
    <ShadowedView style={[styles.hint, shadowStyle({
      color: theme.colors.grey3,
      opacity: 0.8,
      radius: 24,
      offset: [0, 0],
    })]}>
      <Text>Hello</Text>
    </ShadowedView>
  );
};

export default AuthHint;
