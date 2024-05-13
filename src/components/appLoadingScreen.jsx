import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { heightPercentageToDP, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Button } from "@rneui/base";
import auth from "@react-native-firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";

const AppLoadingScreen =({ theme, text, textColor, resendEmailVerify }) => {

  const [resendBtnLoading, setResendBtnLoading] = useState(false);


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
      .catch(() => text = "Ошибка при отправке подтвержденя на Email");

    console.log("Письмо с подтверждением отправлено");
    console.log("Регистрация завершена");

    // Ожидание подтверждения почты
    await waitForEmailVerification()
      .catch(() => text = "Ошибка при подтверждении почты");

    setResendBtnLoading(false);
    text='';
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: "center",
        }}>
          <View
            entering={FadeIn}
            style={{
              top: heightPercentageToDP(35),
            }}
          >
            <Image
              source={require("../assets/images/logo/logo.png")}
              style={{ width: wp("60%"), height: wp(60) }}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={{ fontFamily: "Roboto-Medium", color: textColor ? textColor : theme.colors.text }}>{text}</Text>
            {resendEmailVerify && <Button onPress={handleResendVerification}
                                          buttonStyle={{ borderRadius: 15, backgroundColor: theme.colors.accent }}
                                          title={"Отправить повторно"}
                                          titleStyle={{ fontFamily: "Roboto-Bold", color: theme.colors.accentText }}
                                          loading={resendBtnLoading} />}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default AppLoadingScreen;
