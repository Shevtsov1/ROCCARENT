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

  const {ownerId} = route.params;

  const [isChatLoading, setIsChatLoading] = useState(true);
  const [isSendBtnDisabled, setSendBtnDisabled] = useState(true);
  const [messages, setMessages] = useState([]);
  const [messageToSend, setMessageToSend] = useState('');
  const [chatMateData, setChatMateData] = useState([]);

  const messageInputRef = useRef(null);

  useEffect(() => {
    const getChatMateData = async () => {
      const snapshot = await firestore().collection('users').doc(ownerId).get();
      if (snapshot.exists && snapshot.data().nickname && snapshot.data().photoUrl) {
        setChatMateData({nickname: snapshot.data().nickname, photoUrl: snapshot.data().photoUrl})
      }
    };
    getChatMateData().then();
    getMessages();
    setIsChatLoading(false);
  }, [ownerId]);

  const getMessages = () => {
    const currentUserId = auth().currentUser.uid;
    const chatRef = database().ref('chats');
    const query = chatRef.orderByChild('userIds/0').equalTo(currentUserId);

    query.once('value').then((snapshot) => {
      // Проверяем, существует ли чат, в котором текущий пользователь является первым участником
      let chatId;
      snapshot.forEach((childSnapshot) => {
        const chatData = childSnapshot.val();
        const otherUserId = chatData.userIds[1];
        if (otherUserId === ownerId) {
          chatId = childSnapshot.key;
          return true; // Выходим из цикла forEach, когда находим нужный чат
        }
      });

      if (chatId) {
        // Чат уже существует, получаем сообщения
        const messageRef = database().ref(`chats/${chatId}/messages`);

        messageRef.once('value').then((snapshot) => {
          const messagesData = snapshot.val();
          if (messagesData) {
            const messagesArray = Object.values(messagesData);
            setMessages(messagesArray);
          }
        }).catch((error) => {
          console.error('Failed to get messages:', error);
        });
      }
    }).catch((error) => {
      console.error('Failed to check chat existence:', error);
    });
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

  const handleSendBtn = () => {
    const currentUserId = auth().currentUser.uid;
    const chatRef = database().ref('chats');
    const query = chatRef.orderByChild('userIds/0').equalTo(currentUserId);

    query.once('value').then((snapshot) => {
      // Проверяем, существует ли чат, в котором текущий пользователь является первым участником
      let chatId;
      snapshot.forEach((childSnapshot) => {
        const chatData = childSnapshot.val();
        const otherUserId = chatData.userIds[1];
        if (otherUserId === ownerId) {
          chatId = childSnapshot.key;
          return true; // Выходим из цикла forEach, когда находим нужный чат
        }
      });

      if (chatId) {
        // Чат уже существует, отправляем сообщение
        sendMessage(chatId);
      } else {
        // Чат не существует, создаем новый чат
        const newChatRef = chatRef.push();
        chatId = newChatRef.key;
        const chatData = {
          userIds: [currentUserId, ownerId],
        };
        newChatRef
          .set(chatData)
          .then(() => {
            sendMessage(chatId);
          })
          .catch((error) => {
            console.error('Failed to create chat:', error);
          });
      }
      if (messageInputRef.current) {
        messageInputRef.current.blur();
      }
    }).catch((error) => {
      console.error('Failed to check chat existence:', error);
    });
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
