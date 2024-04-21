import React from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const LoadingScreen = ({ theme }) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    }}>
      <View style={{
        alignItems: "center",
        marginBottom: 20,
      }}>
        <Image
          source={require("../assets/images/logo/logo_text_caps.png")}
          style={{ width: wp("70%") }}
          resizeMode={"contain"}
        />
      </View>
      <ActivityIndicator
        size={75}
        color={theme.colors.accent}
      />
    </View>
  );
};

export default LoadingScreen;
