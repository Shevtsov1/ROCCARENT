import React from "react";
import { Animated, Easing, Image, Text, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const LoadingScreen = ({ theme, text }) => {

  const animation = new Animated.Value(0);

  React.useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.timing(animation, {
          toValue: 1,
          duration: 2500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
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
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    }}>
      <View style={{
        alignItems: "center",
      }}>
        <Animated.View
          style={{
            opacity,
          }}
        >
          <Image
            source={require('../assets/images/logo/logo.png')}
            style={{ width: wp('60%') }}
            resizeMode="contain"
          />
        </Animated.View>
        <Text style={{fontFamily: 'Roboto-Medium'}}>{text}</Text>
      </View>
    </View>
  );
};

export default LoadingScreen;
