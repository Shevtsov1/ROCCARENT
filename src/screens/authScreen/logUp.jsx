import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Icon, Input } from "@rneui/themed";
import TermsCheckbox from "./TermsCheckbox";
import auth from "@react-native-firebase/auth";
import { Button } from "@rneui/base";
import { ShadowedView, shadowStyle } from "react-native-fast-shadow";
import { SafeAreaView } from "react-native-safe-area-context";
import FastImage from "react-native-fast-image";
import firestore from "@react-native-firebase/firestore";

const LogUp = ({ theme, setInitializing, setLoadingScreenText, onGoogleButtonPress, navigation }) => {

    const [isPasswordSecure, setIsPasswordSecure] = useState(true);
    const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] = useState(true);
    const [authBtnDisabled, setAuthBtnDisabled] = useState(true);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const surnameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const passwordConfirmationRef = useRef(null);

    const backColor = theme.colors.background;
    const textColor = theme.colors.text;
    const accentColor = theme.colors.accent;

    const [hasValidPasswordLength, setHasValidPasswordLength] = useState(false);
    const [hasValidPassword, setHasValidPassword] = useState(false);
    const [hasValidEmail, setHasValidEmail] = useState(false);
    const [hasValidName, setHasValidName] = useState(false);
    const [hasValidSurname, setHasValidSurname] = useState(false);
    const [passwordsMatch, setPaswordsMatch] = useState(false);

    useEffect(() => {
      const validName = /^[a-zA-Zа-яА-Я-]+$/.test(name);
      const validSurname = /^[a-zA-Zа-яА-Я-]+$/.test(surname);
      const minimumLength = password.length >= 6;
      const validCharacters = /^(?=.*\d?)\w+$/.test(password);
      const validEmail = /^[a-zA-Z][a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email);
      setPaswordsMatch(password === passwordConfirmation);

      setHasValidPasswordLength(minimumLength);
      setHasValidPassword(validCharacters);
      setHasValidEmail(validEmail);
      setHasValidName(validName);
      setHasValidSurname(validSurname);

      if (name && surname && email && password && passwordConfirmation && termsAccepted && minimumLength && validCharacters && validName && validSurname && validEmail && passwordsMatch) {
        setAuthBtnDisabled(false);
      } else {
        setAuthBtnDisabled(true);
      }
    }, [name, surname, email, password, passwordConfirmation, termsAccepted]);

    const handleNameClear = () => {
      setName("");
    };

    const handleNameChange = (value) => {
      setName(value);
    };

    const handleSurnameClear = () => {
      setSurname("");
    };

    const handleSurnameChange = (value) => {
      setSurname(value);
    };

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

    const handleLogUpBtn = async () => {
      setInitializing(true);
      try {
        const newDisplayName = name.trim() + " " + surname.trim();
        const emailAuthCredential = auth.EmailAuthProvider.credential(email, password);
        await auth().currentUser.linkWithCredential(emailAuthCredential);

        // Установка displayName
        const currentUser = auth().currentUser;
        await currentUser.updateProfile({
          displayName: newDisplayName,
        });

        await firestore().collection("users").doc(currentUser.uid).update({ nickname: newDisplayName} );

        // Регистрация завершена, отправляем письмо с подтверждением
        await auth().currentUser.sendEmailVerification({handleCodeInApp: true}).catch(() => setLoadingScreenText("Ошибка при отправке подтверждения на Email"));
        setLoadingScreenText("Письмо с подтверждением отправлено на Email\nОжидание подтверждения");
      } catch (error) {
        if (error.code === "auth/unknown") {
          console.log("Пользователь с таким Email уже зарегистрирован");
        }
        // Обработка других ошибок при регистрации
      }
      setInitializing(false);
    };

    const styles = StyleSheet.create({
      container: {
        flex: 1, backgroundColor: backColor, justifyContent: "center",
      },   contentContainer: {
        paddingHorizontal: 12,
      },
      imageContainer: {
        paddingTop: hp(5),
      }, image: {
        width: 144, height: 144, alignSelf: "center",
      }, inputViewContainer: {
        height: 84,
        borderRadius: 15,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        paddingHorizontal: 12,
      },
      inputContainer: {
        height: 72, paddingHorizontal: 0,
      },
      inputLabelStyle: { fontFamily: "Roboto-Medium", fontWeight: "light", color: theme.colors.grey1, marginBottom: 10 },
      input: {
        height: 24, borderBottomWidth: 0,
      },
      emailInput: {
        paddingVertical: 0, fontFamily: "Roboto-Medium", color: textColor,
      },
      errorStyle: {
        marginTop: 0, fontFamily: "Roboto-Regular", marginHorizontal: 0, paddingHorizontal: 0,
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
      }, googleButton: {
        alignSelf: "flex-end", marginBottom: "5%",
      }, googleButtonContainer: {
        alignSelf: "flex-end", marginBottom: "5%", flexDirection: "column",
      }, logupBtnContainer: {
        maxWidth: "100%",
        flexDirection: "row",
      }, backButton: {
        position: "absolute",
        top: hp(2),
        right: wp(4),
      }, underButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
      }, underButton: {
        height: 48,
      }, underButtonText: {
        fontFamily: "Roboto-Medium",
        color: theme.colors.grey1,
        fontSize: 15,
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
        width: wp(90) - 54,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
      },
      buttonText: {
        fontFamily: "Roboto-Bold", fontSize: 18, color: theme.colors.accentText,
      },
      googleAuthBtnContainer: {
        borderRadius: 15,
      },
      googleAuthBtn: {
        height: 54,
        width: 54,
        backgroundColor: theme.colors.background,
        flexDirection: "row",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
      },
      googleAuthBtnImageContainer: {
        height: 54,
        width: 54,
        backgroundColor: theme.mode === "dark" ? theme.colors.accentText : theme.colors.accentText,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
      },
      loginBtnContainer: {
        maxWidth: "100%", flexDirection: "row",
      },
    });

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.backButton}>
              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16, color: theme.colors.grey1}}>Назад</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <FastImage
                source={require("../../assets/images/logo/logo.png")}
                style={styles.image}
                resizeMode={"contain"}
              />
            </View>
            <View style={styles.contentContainer}>
              <View style={{ marginBottom: 12 }}>
                <ShadowedView style={[shadowStyle({
                  color: theme.colors.grey3, opacity: 0.8, radius: 12, offset: [0, 0],
                }), { borderRadius: 15 }]}>
                  <View style={styles.inputViewContainer}>
                    <Input
                      label={"Имя"}
                      containerStyle={[styles.inputContainer]}
                      inputContainerStyle={styles.input}
                      inputMode={"text"}
                      inputStyle={styles.emailInput}
                      errorStyle={styles.errorStyle}
                      errorMessage={name ? (hasValidName ? "" : "Введите корректное имя") : ""}
                      leftIcon={<Icon type={"ionicon"} name="person-outline" color={textColor} />}
                      rightIcon={name && (<TouchableOpacity onPress={handleNameClear}>
                        <Icon type={"ionicon"} name={"close"} color={textColor} />
                      </TouchableOpacity>)}
                      labelStyle={styles.inputLabelStyle}
                      placeholder="Введите имя"
                      value={name}
                      onChangeText={handleNameChange}
                      onSubmitEditing={() => {
                        // Переход к следующему инпуту (в данном случае, к инпуту password)
                        surnameRef.current.focus();
                      }}
                    />
                  </View>
                </ShadowedView>
              </View>
              <View style={{ marginBottom: 12 }}>
                <ShadowedView style={[shadowStyle({
                  color: theme.colors.grey3, opacity: 0.8, radius: 12, offset: [0, 0],
                }), { borderRadius: 15 }]}>
                  <View style={styles.inputViewContainer}>
                    <Input
                      label={"Фамилия"}
                      containerStyle={[styles.inputContainer]}
                      inputContainerStyle={styles.input}
                      inputMode={"text"}
                      inputStyle={styles.emailInput}
                      errorStyle={styles.errorStyle}
                      errorMessage={surname ? (hasValidSurname ? "" : "Введите корректную фамилию") : ""}
                      leftIcon={<Icon type={"ionicon"} name="person-outline" color={textColor} />}
                      rightIcon={surname && (<TouchableOpacity onPress={handleSurnameClear}>
                        <Icon type={"ionicon"} name={"close"} color={textColor} />
                      </TouchableOpacity>)}
                      labelStyle={styles.inputLabelStyle}
                      placeholder="Введите фамилию"
                      value={surname}
                      onChangeText={handleSurnameChange}
                      onSubmitEditing={() => {
                        // Переход к следующему инпуту (в данном случае, к инпуту password)
                        emailRef.current.focus();
                      }}
                      ref={surnameRef}
                    />
                  </View>
                </ShadowedView>
              </View>
              <View style={{ marginBottom: 12 }}>
                <ShadowedView style={[shadowStyle({
                  color: theme.colors.grey3, opacity: 0.8, radius: 12, offset: [0, 0],
                }), { borderRadius: 15 }]}>
                  <View style={styles.inputViewContainer}>
                    <Input
                      label={"Email"}
                      containerStyle={[styles.inputContainer]}
                      inputContainerStyle={styles.input}
                      inputMode={"email"}
                      inputStyle={styles.emailInput}
                      errorStyle={styles.errorStyle}
                      errorMessage={email ? (hasValidEmail ? "" : "Введите корректный Email") : ""}
                      leftIcon={<Icon type={"ionicon"} name="mail-outline" color={textColor} />}
                      rightIcon={email && (<TouchableOpacity onPress={handleEmailClear}>
                        <Icon type={"ionicon"} name={"close"} color={textColor} />
                      </TouchableOpacity>)}
                      labelStyle={styles.inputLabelStyle}
                      placeholder="example@gmail.com"
                      value={email}
                      onChangeText={handleEmailChange}
                      onSubmitEditing={() => {
                        // Переход к следующему инпуту (в данном случае, к инпуту password)
                        passwordRef.current.focus();
                      }}
                      ref={emailRef}
                    />
                  </View>
                </ShadowedView>
              </View>
              <View style={{ marginBottom: 12 }}>
                <ShadowedView style={[shadowStyle({
                  color: theme.colors.grey3, opacity: 0.8, radius: 12, offset: [0, 0],
                }), { borderRadius: 15 }]}>
                  <View style={styles.inputViewContainer}>
                    <Input
                      label={"Пароль"}
                      containerStyle={[styles.inputContainer]}
                      inputContainerStyle={styles.input}
                      inputStyle={styles.emailInput}
                      errorStyle={styles.errorStyle}
                      errorMessage={password ? (hasValidPasswordLength ? (hasValidPassword ? "" : "Латинские буквы, цифры и \"_\"") : "Минимум 6 символов") : ""}
                      leftIcon={<Icon type={"ionicon"} name="key-outline" color={textColor} />}
                      rightIcon={password && (<TouchableOpacity onPress={() => setIsPasswordSecure(!isPasswordSecure)}>
                        <Icon
                          color={textColor}
                          type={"ionicon"}
                          name={isPasswordSecure ? "eye-outline" : "eye-off-outline"}
                        />
                      </TouchableOpacity>)}
                      labelStyle={styles.inputLabelStyle}
                      placeholder="Придумайте пароль"
                      secureTextEntry={isPasswordSecure}
                      value={password}
                      onChangeText={handlePasswordChange}
                      onSubmitEditing={() => {
                        // Переход к следующему инпуту (в данном случае, к инпуту password)
                        passwordConfirmationRef.current.focus();
                      }}
                      ref={passwordRef}
                    />
                  </View>
                </ShadowedView>
              </View>
              <ShadowedView style={[shadowStyle({
                color: theme.colors.grey3, opacity: 0.8, radius: 12, offset: [0, 0],
              }), { borderRadius: 15 }]}>
                <View style={styles.inputViewContainer}>
                  <Input
                    label={"Подтвердите пароль"}
                    containerStyle={[styles.inputContainer]}
                    inputContainerStyle={styles.input}
                    inputStyle={styles.emailInput}
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
                    labelStyle={styles.inputLabelStyle}
                    placeholder="Повторите пароль"
                    secureTextEntry={isConfirmPasswordSecure}
                    value={passwordConfirmation}
                    onChangeText={handlePasswordConfirmationChange}
                    ref={passwordConfirmationRef}
                  />
                </View>
              </ShadowedView>
              <View>
                <TermsCheckbox
                  theme={theme}
                  isActive={termsAccepted}
                  onCheckboxToggle={handleTermsToggle}
                />
              </View>
              <View style={styles.logupBtnContainer}>
                <View style={{ marginEnd: wp(2) }}>
                  <ShadowedView style={[!authBtnDisabled && shadowStyle({
                    color: theme.colors.grey3, opacity: 0.8, radius: 12, offset: [0, 0],
                  }), { borderRadius: 15 }]}>
                    <TouchableOpacity
                      style={[styles.buttonSubmit, {
                        backgroundColor: authBtnDisabled ? theme.colors.disabled : theme.colors.accent,
                      }]}
                      disabled={authBtnDisabled}
                      onPress={handleLogUpBtn}
                    >
                      <Text style={styles.buttonText}>Зарегистрироваться</Text>
                    </TouchableOpacity>
                  </ShadowedView>
                </View>
                <ShadowedView style={[shadowStyle({
                  color: theme.colors.grey3, opacity: 0.8, radius: 12, offset: [0, 0],
                }), { borderRadius: 15 }]}>
                  <Button containerStyle={styles.googleAuthBtnContainer} buttonStyle={styles.googleAuthBtn}
                          onPress={onGoogleButtonPress}
                          title={<FastImage source={require("../../assets/images/google-icon.png")}
                                        style={{ width: 30, height: 30 }} />} />
                </ShadowedView>
              </View>
              <View style={styles.underButtonsContainer}>
                <TouchableOpacity style={styles.underButton} onPress={() => navigation.navigate("LogIn")}>
                  <Text style={styles.underButtonText}>Вход</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.underButton} onPress={() => navigation.navigate('SupportStackNavigator')}>
                  <Text style={styles.underButtonText}>Нужна помощь?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
;

export default LogUp;
