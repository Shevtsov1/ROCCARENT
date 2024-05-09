import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Input } from "@rneui/themed";
import auth from "@react-native-firebase/auth";
import { Button } from "@rneui/base";
import firestore from "@react-native-firebase/firestore";
import LoadingScreen from "../../../../components/loadingScreen";

const EditName = ({ theme, navigation }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState(auth().currentUser.displayName.split(" ")[0]);
  const [surname, setSurname] = useState(auth().currentUser.displayName.split(" ")[1]);
  const [newNickname, setNewNickname] = useState('');
  const [newName, setNewName] = useState('');
  const [newSurname, setNewSurname] = useState('');
  const [updates, setUpdates] = useState(false);
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);

  const nameRef = useRef(null);
  const surnameRef = useRef(null);

  const getNickname = async () => {
    const loadedNickname = await firestore().collection("users").doc(auth().currentUser.uid).get().then(querySnapshot => {
      if (querySnapshot.exists && querySnapshot.data().nickname) {
        return querySnapshot.data().nickname;
      } else {
        return "";
      }
    });
    setNickname(loadedNickname);
  };

  useEffect(() => {
    getNickname().then();
    const displayNameArray = auth().currentUser.displayName.split(" ");
    setName(displayNameArray[0]);
    if (displayNameArray.length > 1) setSurname(displayNameArray[1]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const validateData = () => {
      // Validation logic for nickname, name, and surname
      const nicknameRegex = /^[a-zA-Zа-яА-Я\d_]{3,15}$/; // Example: Alphanumeric with 3-15 characters
      const nameRegex = /^[a-zA-Zа-яА-Я\s]{2,99}$/; // Example: Alphabetic with at least 2 characters
      const surnameRegex = /^[a-zA-Zа-яА-Я\s]{2,99}$/; // Example: Alphabetic with at least 2 characters

      let isNicknameValid;
      let isNameValid;
      let isSurnameValid;
      if (newNickname) {
        isNicknameValid = nicknameRegex.test(newNickname);
      } else {
        isNicknameValid = true;
      }
      if (newName) {
        isNameValid = nameRegex.test(newName);
      } else {
        isNameValid = true;
      }
      if (newSurname) {
        isSurnameValid = surnameRegex.test(newSurname);
      } else {
        isSurnameValid = true;
      }

      return (newNickname || newName || newSurname) && isNicknameValid && isNameValid && isSurnameValid;
    };

    const areDataValid = validateData();

    setUpdates(areDataValid);
  }, [newNickname, newName, newSurname]);

  const handleChangeNickname = (value) => {
    setNewNickname(value);
  };

  const handleChangeName = (value) => {
    setNewName(value);
  };

  const handleChangeSurname = (value) => {
    setNewSurname(value);
  };

  const handleSubmitBtn = async () => {
    setIsSubmitBtnLoading(true);
    try {
      if (newNickname) {
        await firestore().collection("users").doc(auth().currentUser.uid).set({ nickname: newNickname });
      }
      if (newName && newSurname) {
        await auth().currentUser.updateProfile({
          displayName: newName.trim() + " " + newSurname.trim(),
        });
      } else if (newName) {
        await auth().currentUser.updateProfile({
          displayName: newName.trim() + " " + surname.trim(),
        });
      } else if (newSurname) {
        await auth().currentUser.updateProfile({
          displayName: name.trim() + " " + newSurname.trim(),
        });
      }
    } catch (error) {
      console.log(error);
    }
    setIsSubmitBtnLoading(false);
    navigation.navigate("Profile");
  };



  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    }, editNameContainer: {
      width: "100%",
      height: "auto",
      backgroundColor: theme.colors.background,
      marginBottom: 12,
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
    }, header: {
      height: 36,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.accent,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }, headerBackBtn: {
      justifyContent: "center",
    }, headerBackBtnText: {
      fontFamily: "Roboto-Regular",
      fontSize: 16,
      color: theme.colors.accentText,
      alignSelf: "center",
    }, infoText: {
      width: "100%",
      fontFamily: "Roboto-Regular",
      fontSize: 14,
      color: theme.colors.grey1,
    }, inputComponentContainer: {
      height: 72,
      alignSelf: "center",
      marginBottom: 12,
    }, inputContainer: {
      borderWidth: 1,
      borderColor: theme.colors.accent,
      borderRadius: 5,
    }, inputTextStyle: {
      fontFamily: "Roboto-Regular",
      fontSize: 16,
      color: theme.colors.text,
    }, submitBtnContainer: {
      borderRadius: 5,
      marginHorizontal: wp(2),
    }, submitBtn: {
      width: "100%",
      height: 48,
      backgroundColor: theme.colors.accent,
    },
  });

  if(isLoading) {
    return (
      <LoadingScreen theme={theme} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ paddingBottom: hp(1) }}>
          <View style={styles.editNameContainer}>
            <View style={styles.header}>
              <Text
                style={{
                  fontFamily: "Roboto-Medium",
                  fontSize: 18,
                  color: theme.colors.accentText,
                  alignSelf: "center",
                }}>Изменение
                имени</Text>
              <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.headerBackBtnText}>Назад</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 12, marginVertical: 12, flex: 1 }}>
              <Text style={styles.infoText}>
                В случае отсутсвия никнейма ваше имя и фамилия будут отображаться
                другим пользователям:{"\n"}
              </Text>
              <Text style={styles.infoText}>
                {`${name} ${surname}`}{"\n"}
              </Text>
              <Text style={styles.infoText}>
                Вы можете придумать никнейм или изменить свое имя ниже:
              </Text>
            </View>
            <Input
              label={"Никнейм"}
              labelStyle={styles.inputTextStyle}
              containerStyle={styles.inputComponentContainer}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputTextStyle}
              placeholder={nickname ? nickname : "Придумайте никнейм"}
              value={newNickname}
              onChangeText={handleChangeNickname}
              onSubmitEditing={() => {
                // Переход к следующему инпуту (в данном случае, к инпуту password)
               nameRef.current.focus();
              }}
            />
            <Input
              label={"Имя"}
              labelStyle={styles.inputTextStyle}
              containerStyle={styles.inputComponentContainer}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputTextStyle}
              placeholder={name ? name : "Введите имя"}
              value={newName}
              onChangeText={handleChangeName}
              onSubmitEditing={() => {
                // Переход к следующему инпуту (в данном случае, к инпуту password)
                surnameRef.current.focus();
              }}
              ref={nameRef}
            />
            <Input
              label={"Фамилия"}
              labelStyle={styles.inputTextStyle}
              containerStyle={styles.inputComponentContainer}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputTextStyle}
              placeholder={surname ? surname : "Введите фамилию"}
              value={newSurname}
              onChangeText={handleChangeSurname}
              ref={surnameRef}
            />
            <Button containerStyle={styles.submitBtnContainer} buttonStyle={styles.submitBtn}
                    titleStyle={{ color: theme.colors.grey1 }} loadingStyle={styles.submitBtn} disabled={!updates}
                    loading={isSubmitBtnLoading} onPress={handleSubmitBtn}><Text
              style={{ fontFamily: "Roboto-Medium", fontSize: 18, color: !updates ? theme.colors.greyOutline : theme.colors.accentText }}>Сохранить
              изменения</Text></Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditName;
