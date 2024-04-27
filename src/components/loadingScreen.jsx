import React, { useState } from "react";
import { Animated, Easing, Image, Text, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Button } from "@rneui/base";
import auth from "@react-native-firebase/auth";

const LoadingScreen = ({ theme, text, resendEmailVerify }) => {

  const [resendBtnLoading, setResendBtnLoading] = useState(false);

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

  const waitForEmailVerification = async () => {
    return new Promise((resolve) => {
      const intervalId = setInterval(async () => {
        const user = auth().currentUser;
        await user.reload();
        if (user.emailVerified) {
          clearInterval(intervalId);
          resolve();
        }
      }, 1000); // Проверяем каждую секунду
    });
  };

  const handleResendVerification = async () => {
    setResendBtnLoading(true);
    await auth().currentUser.sendEmailVerification()
      .then(text = "Письмо с подтверждением отправлено на Email\nОжидание подтверждения")
      .catch((error) => text = "Ошибка при отправке подтвержденя на Email");

    console.log("Письмо с подтверждением отправлено");
    console.log("Регистрация завершена");

    // Ожидание подтверждения почты
    await waitForEmailVerification()
      .catch((error) => text = "Ошибка при подтверждении почты");

    setResendBtnLoading(false);
    setTimeout(() => {
      text = "Почта подтверждена";
    }, 3000);
  };

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
            source={require("../assets/images/logo/logo.png")}
            style={{ width: wp("60%") }}
            resizeMode="contain"
          />
        </Animated.View>
        <Text style={{ fontFamily: "Roboto-Medium" }}>{text}</Text>
        {resendEmailVerify && <Button onPress={handleResendVerification}
                                      buttonStyle={{ borderRadius: 15, backgroundColor: theme.colors.accent }}
                                      title={"Отправить повторно"}
                                      titleStyle={{ fontFamily: "Roboto-Bold", color: theme.colors.accentText }}
                                      loading={resendBtnLoading} />}
      </View>
    </View>
  );
};

export default LoadingScreen;
