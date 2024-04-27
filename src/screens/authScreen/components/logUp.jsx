import React, { useEffect, useRef, useState } from "react";
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
  const passwordRef = useRef(null);
  const passwordConfirmationRef = useRef(null);

  const backColor = theme.colors.secondary;
  const textColor = theme.colors.text;
  const accentColor = theme.colors.accent;

  const [hasValidPassword, setHasValidPassword] = useState(false);
  const [hasValidEmail, setHasValidEmail] = useState(false);
  const [passwordsMatch, setPaswordsMatch] = useState(false);

  useEffect(() => {
    const minimumLength = password.length >= 6;
    const validCharacters = /^(?=.*\d?)\w+$/.test(password);
    const validEmail = /^[a-zA-Z][a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email);
    setPaswordsMatch(password === passwordConfirmation);

    setHasValidPassword(minimumLength && validCharacters);
    setHasValidEmail(validEmail);

    if (email && password && passwordConfirmation && termsAccepted && minimumLength && validCharacters && validEmail && passwordsMatch) {
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
      width: (wp(90) - 54),
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: authBtnDisabled ? theme.colors.disabled : accentColor,
      overflow: "hidden",
      marginEnd: wp(2),
    }, buttonText: {
      fontFamily: "Roboto-Bold", fontSize: 18, color: authBtnDisabled ? theme.colors.text : theme.colors.accentText,
    }, imageContainer: {
      flexDirection: "row", justifyContent: "center",
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
      height: 54,
      width: 54,
      flexDirection: "row",
      backgroundColor: theme.colors.googleBlue,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.colors.primary,
      elevation: 8,
    }, googleAuthBtnImageContainer: {
      height: 54,
      width: 54,
      backgroundColor: theme.mode === "dark" ? theme.colors.accentText : theme.colors.accentText,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
    }, logupBtnContainer: {
      maxWidth: "100%",
      flexDirection: "row",
    },
  });

  return (<ScrollView style={styles.container}>
    <View style={{ marginVertical: hp(2), marginHorizontal: wp(4) }}>
      {isAdviceShown && <Advice authTypeWord={"Зарегистрируйтесь"} />}
      <View>
        <Input
          containerStyle={[styles.inputContainer, { marginBottom: email ? (hasValidEmail ? 0 : hp(1.5)) : 0 }]}
          inputContainerStyle={styles.input}
          inputMode={"email"}
          inputStyle={{ fontFamily: "Roboto-Regular", color: textColor }}
          errorMessage={email ? (hasValidEmail ? "" : "Введит корректный Email") : ""}
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
          onSubmitEditing={() => {
            // Переход к следующему инпуту (в данном случае, к инпуту password)
            passwordRef.current.focus();
          }}
        />
        <Input
          containerStyle={[styles.inputContainer, { marginBottom: password ? (hasValidPassword ? 0 : hp(1.5)) : 0 }]}
          inputContainerStyle={styles.input}
          inputStyle={{ fontFamily: "Roboto-Regular", color: textColor }}
          errorStyle={styles.errorStyle}
          errorMessage={password ? (hasValidPassword ? "" : "Пароль может содержать латинские буквы, цифры и \"_\"") : ""}
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
          ref={passwordRef}
          onSubmitEditing={() => {
            // Переход к следующему инпуту (в данном случае, к инпуту passwordConfirmation)
            passwordConfirmationRef.current.focus();
          }}
        />
        <Input
          containerStyle={[styles.inputContainer, { marginBottom: passwordConfirmation ? (passwordsMatch ? 0 : hp(1.5)) : 0 }]}
          inputContainerStyle={styles.input}
          inputStyle={{ fontFamily: "Roboto-Regular", color: textColor }}
          errorStyle={styles.errorStyle}
          errorMessage={passwordConfirmation ? (passwordsMatch ? "" : "Пароли не совпадают") : ""}
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
          ref={passwordConfirmationRef}
        />
        <View>
          <TermsCheckbox
            theme={theme}
            isActive={termsAccepted}
            onCheckboxToggle={handleTermsToggle}
          />
        </View>
        <View style={styles.logupBtnContainer}>
          <TouchableOpacity disabled={authBtnDisabled} style={styles.buttonContainer} onPress={handleLogUpBtn}>
            <Text style={styles.buttonText}>Зарегистрироваться</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.googleAuthBtn} onPress={onGoogleButtonPress}>
            <View style={styles.googleAuthBtnImageContainer}>
              <Image source={require("../../../assets/images/google-icon.png")} style={{ width: 30, height: 30 }} />
            </View>
          </TouchableOpacity>
        </View>
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
