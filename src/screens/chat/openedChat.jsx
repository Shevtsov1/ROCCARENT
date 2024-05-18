import React, { useContext, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "@rneui/themed";
import { AppContext } from "../../../App";

const OpenedChat = ({ theme }) => {

  const {userdata} = useContext(AppContext);

  const [isSendBtnDisabled, setSendBtnDisabled] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{flex: 1, backgroundColor: theme.colors.background}}>
        <View style={{height: 60, backgroundColor: theme.colors.accent, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 6}}>
          <Avatar containerStyle={{ marginEnd: 6 }} size={'medium'} rounded
                  source={userdata && userdata.photoUrl ? { uri: userdata.photoUrl } : require("../../assets/images/save.png")} />
          <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16, color: theme.colors.accentText}}>Name</Text>
          <TouchableOpacity>
            <Text style={{fontFamily: 'Roboto-Regular', fontSize: 14, color: theme.colors.accentText}}>Назад</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <Text>Chat</Text>
        </ScrollView>
        <View style={{marginBottom: 12, marginHorizontal: 6, paddingHorizontal: 12, borderRadius: 15, borderWidth: 2, borderColor: theme.colors.accent, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
          <TextInput maxLength={2500} multiline style={{height: 36, width: '90%',  borderRadius: 15, paddingVertical: 0,  backgroundColor: theme.colors.background}}/>
          <TouchableOpacity disabled={isSendBtnDisabled}>
            <Image source={isSendBtnDisabled ? require('../../assets/images/sender-outline.png') : require('../../assets/images/sender.png')} style={{width: 24, height: 24, tintColor: theme.colors.accent}}/>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OpenedChat;
