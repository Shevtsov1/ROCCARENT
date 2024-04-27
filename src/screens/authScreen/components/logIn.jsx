import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet, Animated,
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Icon, Input } from "@rneui/themed";
import auth from "@react-native-firebase/auth";

const LogIn = ({ theme, onGoogleButtonPress, setInitializing, Advice, isAdviceShown }) => {
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [authBtnDisabled, setAuthBtnDisabled] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;
  const passwordRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const backColor = theme.colors.secondary;
  const textColor = theme.colors.text;

  const [hasValidPassword, setHasValidPassword] = useState(false);
  const [hasValidEmail, setHasValidEmail] = useState(false);

  useEffect(() => {
    const minimumLength = password.length >= 6;
    const validCharacters = /^(?=.*\d?)\w+$/.test(password);
    const validEmail = /^[a-zA-Z][a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email);

    setHasValidPassword(minimumLength && validCharacters);
    setHasValidEmail(validEmail);

    if (email && password && minimumLength && validCharacters && validEmail) {
      setAuthBtnDisabled(false);
    } else {
      setAuthBtnDisabled(true);
    }
  }, [email, password]);

  useEffect(() => {
    if (!isAdviceShown) {
      Animated.timing(translateY, {
        toValue: -100, // Величина смещения вверх, которую вы можете настроить
        duration: 300, // Длительность анимации (в миллисекундах)
        useNativeDriver: true,
      }).start();
    }
  }, [isAdviceShown]);

  const handleEmailClear = () => {
    setEmail("");
  };

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleLogInBtn = async () => {
    setInitializing(true);
    await auth().signInWithEmailAndPassword(email, password).then(() => {
      setInitializing(false);
      console.log("User signed in!");
    }).catch((error) => {
      console.log(error);
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backColor,
    },
    contentContainer: {
      marginVertical: hp(2),
      marginBottom: 24,
      marginHorizontal: wp(4),
    },
    imageContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    image: {
      width: 144,
      height: 144,
      alignSelf: "center",
    },
    buttonContainer: {
      alignSelf: "flex-end",
      marginBottom: "5%",
      flexDirection: "column",
    },
    inputContainer: {
      height: 60,
      paddingHorizontal: 0,
    },
    input: {
      paddingHorizontal: wp(3),
      borderColor: theme.colors.grey1,
    },
    emailInput: {
      color: textColor,
    },
    errorStyle: {
      marginStart: wp(3),
    },
    googleAuthBtn: {
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
    },
    googleAuthBtnImageContainer: {
      height: 36,
      width: 42,
      backgroundColor: theme.mode === "dark" ? theme.colors.text : theme.colors.accentText,
      justifyContent: "center",
      alignItems: "center",
      borderTopStartRadius: 15,
      borderBottomStartRadius: 15,
    },
    googleAuthBtnText: {
      marginEnd: 18,
      fontFamily: "Roboto-Medium",
      fontSize: 16,
      color: theme.mode === "dark" ? theme.colors.text : theme.colors.accentText,
    },
    buttonSubmit: {
      alignSelf: "center",
      height: 54,
      width: wp(92),
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontFamily: "Roboto-Bold",
      fontSize: 18,
      color: authBtnDisabled ? theme.colors.text : theme.colors.accentText,
    },
  });

  return (
        <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <Advice authTypeWord={"Войдите"} />
          <Animated.View style={{ transform: [{ translateY }] }}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../../../assets/images/usingPhone/auth.png")}
                style={styles.image}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.googleAuthBtn} onPress={onGoogleButtonPress}>
                  <View style={styles.googleAuthBtnImageContainer}>
                    <Image source={require("../../../assets/images/google-icon.png")} style={{ width: 24, height: 24 }} />
                  </View>
                  <Text style={styles.googleAuthBtnText}>Войти с Google</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Input
              containerStyle={[styles.inputContainer, { marginBottom: password ? (hasValidEmail ? 0 : hp(1.5)) : 0 }]}
              inputContainerStyle={styles.input}
              inputMode={"email"}
              inputStyle={styles.emailInput}
              errorMessage={email ? (hasValidEmail ? '' :  'Введит корректный Email') : '' }
              leftIcon={<Icon type={"ionicon"} name="mail-outline" color={textColor} />}
              rightIcon={
                email && (
                  <TouchableOpacity onPress={handleEmailClear}>
                    <Icon type={"ionicon"} name={"close"} color={textColor} />
                  </TouchableOpacity>
                )
              }
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
              containerStyle={[styles.inputContainer, { marginBottom: password ? (hasValidPassword ? 0 : hp(2)) : 0 }]}
              inputContainerStyle={styles.input}
              inputStyle={styles.emailInput}
              errorStyle={styles.errorStyle}
              errorMessage={password ? (hasValidPassword ? "" : "Пароль может содержать латинские буквы, цифры и \"_\"") : ""}
              leftIcon={<Icon type={"ionicon"} name="key-outline" color={textColor} />}
              rightIcon={
                password && (
                  <TouchableOpacity onPress={() => setIsPasswordSecure(!isPasswordSecure)}>
                    <Icon
                      color={textColor}
                      type={"ionicon"}
                      name={isPasswordSecure ? "eye-outline" : "eye-off-outline"}
                    />
                  </TouchableOpacity>
                )
              }
              labelStyle={{ color: textColor }}
              placeholder="Пароль"
              secureTextEntry={isPasswordSecure}
              value={password}
              onChangeText={handlePasswordChange}
              ref={passwordRef}
            />
            <TouchableOpacity
              style={[
                styles.buttonSubmit,
                {
                  backgroundColor: authBtnDisabled ? theme.colors.disabled : theme.colors.accent,
                },
              ]}
              disabled={authBtnDisabled}
              onPress={handleLogInBtn}
            >
              <Text style={styles.buttonText}>Войти</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
  );
};

export default LogIn;
