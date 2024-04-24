import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Button, Icon, Input } from "@rneui/themed";
import auth from "@react-native-firebase/auth";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";

const LogIn = ({ theme, setInitializing, onGoogleButtonPress, Advice, isAdviceShown }) => {
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [authBtnDisabled, setAuthBtnDisabled] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const backColor = theme.colors.secondary;
  const textColor = theme.colors.text;

  let hasMinimumLength;
  let hasUppercaseLetter;
  let hasLowercaseLetter;
  let hasDigit;
  const [hasAllRequirements, setHasAllRequirements] = useState(false);

  useEffect(() => {
    const hasValidPassword = password;
    hasMinimumLength = password.length >= 8;
    hasUppercaseLetter = /[A-Z]/.test(password);
    hasLowercaseLetter = /[a-z]/.test(password);
    hasDigit = /\d/.test(password);

    if (password && hasMinimumLength && hasDigit && hasUppercaseLetter && hasLowercaseLetter) {
      setHasAllRequirements(true);
    } else {
      setHasAllRequirements(false);
    }

    if (
      email &&
      password &&
      hasValidPassword &&
      hasMinimumLength &&
      hasUppercaseLetter &&
      hasLowercaseLetter &&
      hasDigit
    ) {
      setAuthBtnDisabled(false);
    } else {
      setAuthBtnDisabled(true);
    }
  }, [email, password]);

  const handleEmailClear = () => {
    setEmail("");
  };

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleLogInBtn = () => {
    setInitializing(true);
    auth().signInWithEmailAndPassword(email, password).then(() => {
      console.log("User signed in!");
    }).catch((error) => {
      console.log(error);
    });
    setInitializing(false);
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
      justifyContent: 'space-between',
    },
    image: {
      width: 144,
      height: 144,
      alignSelf: "center",
    },
    buttonContainer: {
      alignSelf: "flex-end",
      marginBottom: "5%",
      flexDirection: 'column',
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
      flexDirection: 'row',
      backgroundColor: theme.colors.googleBlue,
      borderRadius: 15,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    googleAuthBtnImageContainer: {
      height: 36,
      width: 42,
      backgroundColor: theme.mode === 'dark' ? theme.colors.text : theme.colors.accentText,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopStartRadius: 15,
      borderBottomStartRadius: 15,
    },
    googleAuthBtnText: {
      marginEnd: 8,
      fontFamily: 'Montserrat-Medium',
      fontSize: 16,
      color: theme.mode === 'dark' ? theme.colors.text : theme.colors.accentText,
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
      fontFamily: "Montserrat-Bold",
      fontSize: 18,
      color: authBtnDisabled ? theme.colors.accentText : theme.colors.text,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {isAdviceShown && <Advice authTypeWord={'Войдите'} />}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/images/usingPhone/auth.png")}
            style={styles.image}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.googleAuthBtn} onPress={onGoogleButtonPress}>
              <View style={styles.googleAuthBtnImageContainer}>
                <Image source={require('../../../assets/images/google-icon.png')} style={{width: 24, height: 24}}/>
              </View>
              <Text style={styles.googleAuthBtnText}>Войти с Google</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Input
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.input}
          inputMode={"email"}
          inputStyle={styles.emailInput}
          errorMessage=""
          leftIcon={<Icon type={"ionicon"} name="mail-outline" color={textColor} />}
          rightIcon={
            email && (
              <TouchableOpacity onPress={handleEmailClear}>
                <Icon type={"ionicon"} name={"close"} color={textColor}/>
              </TouchableOpacity>
            )
          }
          labelStyle={{ color: textColor }}
          placeholder="Email"
          value={email}
          onChangeText={handleEmailChange}
        />
        <Input
          containerStyle={[styles.inputContainer, { marginBottom: password ? (hasAllRequirements ? 0 : hp(2)) : 0 }]}
          inputContainerStyle={styles.input}
          inputStyle={styles.emailInput}
          errorStyle={styles.errorStyle}
          errorMessage={password ? (hasAllRequirements ? "" : "Пароль не соответствует требованиям") : ""}
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
      </View>
    </ScrollView>
  );
};

export default LogIn;
