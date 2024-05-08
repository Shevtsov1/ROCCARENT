import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Support = ({ theme }) => (
  <SafeAreaView>
    <View>
      <Text style={{color: theme.colors.text}}>Поддержка</Text>
    </View>
  </SafeAreaView>
);

export default Support;
