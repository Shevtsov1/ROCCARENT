import React, { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "@rneui/themed";
import { AppContext } from "../../../App";
import firestore from "@react-native-firebase/firestore";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";

const OpenedChat = ({ theme, navigation, route }) => {

  const { userdata } = useContext(AppContext);

  const { ownerId } = route.params;

  const [isChatLoading, setIsChatLoading] = useState(true);
  const [isSendBtnDisabled, setSendBtnDisabled] = useState(true);
  const [messages, setMessages] = useState([]);
  const [messageToSend, setMessageToSend] = useState('');
  const [chatMateData, setChatMateData] = useState([]);

  const messageInputRef = useRef(null);

  useEffect(() => {
    console.log('reload openedChat')
    const getChatMateData = async () => {
      const snapshot = await firestore().collection('users').doc(ownerId).get();
      if (snapshot.exists && snapshot.data().nickname && snapshot.data().photoUrl) {
        setChatMateData({nickname: snapshot.data().nickname, photoUrl: snapshot.data().photoUrl})
      }
    };
    getChatMateData().then();
    getMessages().then();
  }, []);

  const getMessages = async () => {
    try {
      const currentUserId = auth().currentUser.uid;
      const chatRef = database().ref('chats');
      const firstQuery = chatRef.orderByChild('userIds/0').equalTo(currentUserId);
      const secondQuery = chatRef.orderByChild('userIds/1').equalTo(currentUserId);

      const [firstSnapshot, secondSnapshot] = await Promise.all([firstQuery.once('value'), secondQuery.once('value')]);

      let chatId;
      const snapshot = firstSnapshot.exists() ? firstSnapshot : secondSnapshot;

      snapshot.forEach((childSnapshot) => {
        const chatData = childSnapshot.val();
        const userIds = chatData.userIds;
        if (userIds.includes(currentUserId)) {
          chatId = childSnapshot.key;
          return true;
        }
      });

      if (chatId) {
        const messageRef = database().ref(`chats/${chatId}/messages`);
        const messageSnapshot = await messageRef.once('value');
        const messagesData = messageSnapshot.val();

        if (messagesData) {
          const messagesArray = Object.values(messagesData);

          // Сортировка сообщений по времени (timestamp) от старых к новым
          messagesArray.sort((a, b) => a.timestamp - b.timestamp);
          messagesArray.reverse();

          setMessages(messagesArray);
        }
      }

      setIsChatLoading(false);
    } catch (error) {
      console.error('Failed to check chat existence:', error);
    }
  };

  const verifyMessageToSend = (value) => {
    return value.length !== 0
  };

  const handleMessageToSend = (value) => {
    setMessageToSend(value);

    if (verifyMessageToSend(value)) {
      setSendBtnDisabled(false);
    } else {
      setSendBtnDisabled(true);
    }
  };

  const handleSendBtn = async () => {
    try {
      const currentUserId = auth().currentUser.uid;
      const chatRef = database().ref('chats');
      const firstQuery = chatRef.orderByChild('userIds/0').equalTo(currentUserId);
      const secondQuery = chatRef.orderByChild('userIds/1').equalTo(currentUserId);

      const [firstSnapshot, secondSnapshot] = await Promise.all([firstQuery.once('value'), secondQuery.once('value')]);

      let chatId;
      const snapshot = firstSnapshot.exists() ? firstSnapshot : secondSnapshot;

      snapshot.forEach((childSnapshot) => {
        const chatData = childSnapshot.val();
        const userIds = chatData.userIds;
        if (userIds.includes(currentUserId)) {
          chatId = childSnapshot.key;
          return true;
        }
      });

      if (chatId) {
        sendMessage(chatId);
      } else {
        const newChatRef = chatRef.push();
        chatId = newChatRef.key;
        const chatData = {
          userIds: [currentUserId, ownerId],
        };

        await newChatRef.set(chatData);
        sendMessage(chatId);
      }

      if (messageInputRef.current) {
        messageInputRef.current.blur();
      }
    } catch (error) {
      console.error('Failed to handle send button click:', error);
    }
  };

  const sendMessage = (chatId) => {
    // Отправка сообщения в чат
    setMessageToSend('');
    const messageRef = database().ref(`chats/${chatId}/messages`);
    const newMessageRef = messageRef.push();
    const messageData = {
      senderId: auth().currentUser.uid,
      receiverId: ownerId,
      content: messageToSend,
      timestamp: Date.now()
    };
    newMessageRef.set(messageData)
      .then(() => {
      })
      .catch((error) => {
        console.error('Failed to send message:', error);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{
          height: 60,
          backgroundColor: theme.colors.accent,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 6,
        }}>
          <Avatar containerStyle={{ marginEnd: 6 }} size={"medium"} rounded
                  source={chatMateData && chatMateData.photoUrl  ? { uri: chatMateData.photoUrl } : require("../../assets/images/save.png")} />
          <Text style={{ fontFamily: "Roboto-Medium", fontSize: 18, color: theme.colors.accentText }}>{chatMateData && chatMateData.nickname}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
            <Text style={{ fontFamily: "Roboto-Regular", fontSize: 16, color: theme.colors.accentText }}>Назад</Text>
          </TouchableOpacity>
        </View>
        <ScrollView  contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
          {isChatLoading ? (<ActivityIndicator size={24} color={theme.colors.accent}/>) : (
            messages.length !== 0 ?   <View>
                    {messages.slice().reverse().map((message, index) => (
                      <View key={index} style={{ flexDirection: message.senderId === ownerId ? 'row' : 'row-reverse' }}>
                        <View style={{ backgroundColor: message.senderId === ownerId ? 'lightblue' : 'lightgray', borderRadius: 10, padding: 10, margin: 5 }}>
                          <Text>{message.content}</Text>
                        </View>
                      </View>
                    ))}
              </View>
              :
              <Text style={{
                fontFamily: "Roboto-Regular",
                fontSize: 14,
                color: theme.colors.text,
                alignSelf: "center",
                justifyContent: "center",
                marginTop: 12,
              }}>Нет сообщений</Text>
          )}
        </ScrollView>
        <View style={{
          marginBottom: 12,
          marginHorizontal: 6,
          paddingHorizontal: 12,
          borderRadius: 15,
          borderWidth: 2,
          borderColor: theme.colors.accent,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
          <TextInput maxLength={2500} multiline style={{
            height: 36,
            width: "90%",
            borderRadius: 15,
            paddingVertical: 0,
            backgroundColor: theme.colors.background,
          }} value={messageToSend}  ref={messageInputRef}
                     onChangeText={value => handleMessageToSend(value)} />
          <TouchableOpacity disabled={isSendBtnDisabled} onPress={handleSendBtn}>
            <Image
              source={isSendBtnDisabled ? require("../../assets/images/sender-outline.png") : require("../../assets/images/sender.png")}
              style={{ width: 24, height: 24, tintColor: theme.colors.accent }} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OpenedChat;
