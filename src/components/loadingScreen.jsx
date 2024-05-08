import React from "react";
import { ActivityIndicator, Animated, Easing, Image, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { Overlay } from "@rneui/themed";

const LoadingScreen = ({ theme, text, textColor }) => {

  const animation = new Animated.Value(0);

  React.useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.timing(animation, {
          toValue: 1,
          duration: 2500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    };

    startAnimation();

    return () => {
      animation.stopAnimation();
    };
  }, []);

  const opacity = animation.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [1, 0.6, 1],
  });

  return (
    <Overlay style={{
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    }}>
      <View style={{
        width: wp(100),
        height: hp(100),
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Animated.View
          style={{
            opacity,
            top: hp(30),
          }}
        >
          <Image
            source={require("../assets/images/logo/logo.png")}
            style={{ width: wp("60%"), height: wp(60) }}
            resizeMode="contain"
          />
          <ActivityIndicator color={theme.colors.accent} size={60} />
        </Animated.View>
        <View>
          <Text style={{ fontFamily: "Roboto-Medium", color: textColor ? textColor : theme.colors.text }}>{text}</Text>
        </View>
      </View>
    </Overlay>
  );
};

export default LoadingScreen;
