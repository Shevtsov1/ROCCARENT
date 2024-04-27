import React, { useEffect, useState } from "react";
import {
  View, Text, TouchableOpacity, Image, ScrollView, StyleSheet,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Icon, Input } from "@rneui/themed";
import TermsCheckbox from "./TermsCheckbox";
import auth from "@react-native-firebase/auth";
import { Overlay } from "@rneui/base";

const LogUp = ({ theme, setInitializing, onGoogleButtonPress, Advice, isAdviceShown, setLoadingScreenText }) => {
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] = useState(true);
  const [authBtnDisabled, setAuthBtnDisabled] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const backColor = theme.colors.secondary;
  const textColor = theme.colors.text;
  const accentColor = theme.colors.accent;

  let hasMinimumLength;
  let hasValidCharacters;
  let isValidEmail;
  const [hasAllRequirements, setHasAllRequirements] = useState(false);

  useEffect(() => {
    const hasValidPassword = password && passwordConfirmation && password === passwordConfirmation;
    hasMinimumLength = password.length >= 6;
    hasValidCharacters = /^[a-zA-Z0-9]+$/.test(password);
    isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

    if (password && hasMinimumLength && hasValidCharacters && isValidEmail) {
      setHasAllRequirements(true);
    } else {
      setHasAllRequirements(false);
    }

    if (email && password && passwordConfirmation && termsAccepted && hasValidPassword && hasMinimumLength && hasValidCharacters && isValidEmail) {
      setAuthBtnDisabled(false);
    } else {
      setAuthBtnDisabled(true);
    }
  }, [email, password, passwordConfirmation, termsAccepted]);

  const handleEmailClear = () => {
    setEmail("");
  };

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handlePasswordConfirmationChange = (value) => {
    setPasswordConfirmation(value);
  };

  const handleTermsToggle = (isChecked) => {
    setTermsAccepted(isChecked);
  };

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  const handleLogUpBtn = async () => {
    setInitializing(true);
    try {
      const emailAuthCredential = auth.EmailAuthProvider.credential(email, password);
      await auth().currentUser.linkWithCredential(emailAuthCredential);
      // Регистрация завершена, отправляем письмо с подтверждением
      await auth().currentUser.sendEmailVerification()
        .then(setLoadingScreenText("Письмо с подтверждением отправлено на Email\nОжидание подтверждения"))
        .catch((error) => setLoadingScreenText("Ошибка при отправке подтвержденя на Email"));

      console.log("Письмо с подтверждением отправлено");

      // Ожидание подтверждения почты
      await waitForEmailVerification()
        .catch((error) => setLoadingScreenText("Ошибка при подтверждении почты"));

      setTimeout(() => {
        setLoadingScreenText("Почта подтверждена");
      }, 3000);
      console.log("Почта подтверждена");
      setLoadingScreenText(null);
    } catch (error) {
      if (error.code === "auth/unknown") {
        console.log("Пользователь с таким Email уже зарегистрирован");
      }
      // Обработка других ошибок при регистрации
    }
    setInitializing(false);
  };

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

  const styles = StyleSheet.create({
    container: {
      flex: 1, backgroundColor: backColor,
    }, loadingContainer: {
      flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: backColor,
    }, logoImage: {
      width: 192, height: 192, marginBottom: hp(1), borderRadius: 30,
    }, buttonContainer: {
      alignSelf: "center",
      height: 54,
      width: "100%",
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: authBtnDisabled ? theme.colors.disabled : accentColor,
      overflow: "hidden",
    }, buttonText: {
      fontFamily: "Roboto-Bold", fontSize: 18, color: authBtnDisabled ? theme.colors.text : theme.colors.accentText,
    }, imageContainer: {
      flexDirection: "row", justifyContent: "space-between",
    }, image: {
      width: 144, height: 144, alignSelf: "center",
    }, googleButton: {
      alignSelf: "flex-end", marginBottom: "5%",
    }, inputContainer: {
      height: 60, paddingHorizontal: 0,
    }, input: {
      paddingHorizontal: wp(3), borderColor: theme.colors.grey1,
    }, inputIcon: {
      marginEnd: 12,
    }, inputRightIconContainer: {
      marginEnd: 0,
    }, errorStyle: {
      marginStart: wp(3),
    }, googleButtonContainer: {
      alignSelf: "flex-end", marginBottom: "5%", flexDirection: "column",
    }, googleAuthBtn: {
      right: 0,
      height: 36,
      width: 200,
      flexDirection: "row",
      backgroundColor: theme.colors.googleBlue,
      borderRadius: 15,
      justifyContent: "space-between",
      alignItems: "center",
      shadowColor: theme.colors.grey1,
      elevation: 8,
    }, googleAuthBtnImageContainer: {
      height: 36,
      width: 42,
      backgroundColor: theme.mode === "dark" ? theme.colors.text : theme.colors.accentText,
      justifyContent: "center",
      alignItems: "center",
      borderTopStartRadius: 15,
      borderBottomStartRadius: 15,
    }, googleAuthBtnText: {
      marginEnd: 18,
      fontFamily: "Roboto-Medium",
      fontSize: 16,
      color: theme.mode === "dark" ? theme.colors.text : theme.colors.accentText,
    },
  });

  return (<ScrollView style={styles.container}>
    <View style={{ marginVertical: hp(2), marginHorizontal: wp(4) }}>
      {isAdviceShown && <Advice authTypeWord={"Зарегистрируйтесь"} />}
      <View>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/images/usingPhone/auth.png")}
            style={styles.image}
          />
          <View style={styles.googleButtonContainer}>
            <TouchableOpacity style={styles.googleAuthBtn} onPress={onGoogleButtonPress}>
              <View style={styles.googleAuthBtnImageContainer}>
                <Image source={require("../../../assets/images/google-icon.png")} style={{ width: 24, height: 24 }} />
              </View>
              <Text style={styles.googleAuthBtnText}>Войти с Google</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Input
            containerStyle={[styles.inputContainer, { marginBottom: email ? (hasAllRequirements ? 0 : hp(1.5)) : 0 }]}
            inputContainerStyle={styles.input}
            inputMode={"email"}
            inputStyle={{ fontFamily: "Roboto-Regular", color: textColor }}
            errorMessage={email ? (isValidEmail ? "" : "Введит корректный Email") : ""}
            leftIcon={<Icon type={"ionicon"} name="mail-outline" color={textColor} />}
            rightIcon={<View style={{ flexDirection: "row" }}>
              {email && (<TouchableOpacity style={{ justifyContent: "center", marginEnd: 12 }}
                                           onPress={handleEmailClear}>
                <Icon type={"ionicon"} name={"close"} color={textColor} />
              </TouchableOpacity>)}
            </View>}
            rightIconContainerStyle={styles.inputRightIconContainer}
            labelStyle={{ color: textColor }}
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
          />
        </View>
        <Input
          containerStyle={[styles.inputContainer, { marginBottom: password ? (hasAllRequirements ? 0 : hp(1.5)) : 0 }]}
          inputContainerStyle={styles.input}
          inputStyle={{ fontFamily: "Roboto-Regular", color: textColor }}
          errorStyle={styles.errorStyle}
          errorMessage={password ? (hasAllRequirements ? "" : "Пароль не соответствует требованиям") : ""}
          leftIcon={<Icon type={"ionicon"} name="key-outline" color={textColor} />}
          rightIcon={password && (<TouchableOpacity onPress={() => setIsPasswordSecure(!isPasswordSecure)}>
            <Icon
              color={textColor}
              type={"ionicon"}
              name={isPasswordSecure ? "eye-outline" : "eye-off-outline"}
            />
          </TouchableOpacity>)}
          labelStyle={{ color: textColor }}
          placeholder="Пароль"
          secureTextEntry={isPasswordSecure}
          value={password}
          onChangeText={handlePasswordChange}
        />
        <Input
          containerStyle={[styles.inputContainer, { marginBottom: passwordConfirmation ? (hasAllRequirements ? 0 : hp(1.5)) : 0 }]}
          inputContainerStyle={styles.input}
          inputStyle={{ fontFamily: "Roboto-Regular", color: textColor }}
          errorStyle={styles.errorStyle}
          errorMessage={passwordConfirmation ? (hasAllRequirements ? "" : "Пароли не совпадают") : ""}
          leftIcon={<Icon type={"ionicon"} name="key-outline" color={textColor} />}
          rightIcon={passwordConfirmation && (
            <TouchableOpacity onPress={() => setIsConfirmPasswordSecure(!isConfirmPasswordSecure)}>
              <Icon
                color={textColor}
                type={"ionicon"}
                name={isConfirmPasswordSecure ? "eye-outline" : "eye-off-outline"}
              />
            </TouchableOpacity>)}
          labelStyle={{ color: textColor }}
          placeholder="Подтвердите пароль"
          secureTextEntry={isConfirmPasswordSecure}
          value={passwordConfirmation}
          onChangeText={handlePasswordConfirmationChange}
        />
        <View>
          <TermsCheckbox
            theme={theme}
            isActive={termsAccepted}
            onCheckboxToggle={handleTermsToggle}
          />
        </View>
        <TouchableOpacity disabled={authBtnDisabled} style={styles.buttonContainer} onPress={handleLogUpBtn}>
          <Text style={styles.buttonText}>Зарегистрироваться</Text>
        </TouchableOpacity>
        <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay}>
          <Text>Hello!</Text>
          <Text>
            Welcome to React Native Elements
          </Text>
        </Overlay>
      </View>
    </View>
  </ScrollView>);
};

export default LogUp;
