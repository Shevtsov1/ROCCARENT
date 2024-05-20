import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Icon } from "@rneui/base";
import { AppContext } from "../../../App";
import { Avatar } from "@rneui/themed";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const Chat = ({ theme, navigation }) => {

  const { userdata } = useContext(AppContext);

  const [chats, setChats] = useState([]);
  const [otherUsersData, setOtherUsersData] = useState([]);

  useEffect(() => {
    // Fetch chats from the real-time database
    const fetchChats = async () => {
      try {
        const currentUserId = auth().currentUser.uid;
        const chatRef = database().ref('chats');
        const firstQuery = chatRef.orderByChild('userIds/0').equalTo(currentUserId);
        const secondQuery = chatRef.orderByChild('userIds/1').equalTo(currentUserId);

        const snapshots = await Promise.all([firstQuery.once('value'), secondQuery.once('value')]);

        const chatList = [];
        const userIds = new Set(); // Using a Set to avoid duplicate userIds

        for (const snapshot of snapshots) {
          snapshot.forEach((childSnapshot) => {
            const chatData = childSnapshot.val();
            const otherUserId = chatData.userIds[0] === currentUserId ? chatData.userIds[1] : chatData.userIds[0];
            const chatId = childSnapshot.key;

            chatList.push({ chatId, otherUserId });
            userIds.add(otherUserId);
          });
        }

        // Fetch last messages for each chat
        const chatListWithMessages = await Promise.all(chatList.map(async (chat) => {
          const lastMessage = await fetchLastMessage(chat.chatId);
          return { ...chat, lastMessage };
        }));

        setChats(chatListWithMessages);
        await fetchOtherUsersData([...userIds]);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    const fetchLastMessage = async (chatId) => {
      try {
        const messagesRef = database().ref(`chats/${chatId}/messages`);
        const messageSnapshot = await messagesRef
          .orderByChild('timestamp')
          .limitToLast(1)
          .once('value');

        if (messageSnapshot.exists()) {
          const lastMessageKey = Object.keys(messageSnapshot.val())[0];
          const lastMessageData = messageSnapshot.child(lastMessageKey).val();
          const { content, senderId } = lastMessageData;
          return { content, senderId };
        } else {
          return { content: null, senderId: null }; // Handle case where there are no messages
        }
      } catch (error) {
        console.error('Failed to fetch last message:', error);
        throw error;
      }
    };


    const fetchOtherUsersData = async (userIds) => {
      try {
        const usersCollection = firestore().collection('users');
        const usersData = [];

        for (const userId of userIds) {
          const userDoc = await usersCollection.doc(userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            usersData.push(userData);
          }
        }

        setOtherUsersData(usersData);
      } catch (error) {
        console.error('Failed to fetch other users data:', error);
      }
    };


    fetchChats().then();

    return () => {
      // Clean up the event listener when the component unmounts
      const chatRef = database().ref('chats');
      chatRef.off();
    };
  }, []);

  const ChatBtn = ({ chat }) => {
    // Find the corresponding user data based on otherUserId
    const otherUserData = otherUsersData.find(user => user.userId === chat.otherUserId);

    if (!otherUserData) {
      // Other user data not available, render a loading state or placeholder
      return (
        <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="48" color={theme.colors.accent}/>
        </View>
      );
    }

    return (
      <Button
        containerStyle={{ height: 60 }}
        buttonStyle={{
          width: "100%",
          height: "100%",
          paddingHorizontal: 0,
          paddingVertical: 0,
          backgroundColor: "transparent",
        }}
        titleStyle={{ color: theme.colors.grey1 }}
        onPress={() => navigation.navigate('OpenedChat', { ownerId: chat.item.otherUserId })}
      >
        <View style={{ width: "100%", height: "100%", flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 6 }}>
            <Avatar
              containerStyle={{ marginEnd: 6 }}
              size={"medium"}
              rounded
              source={
                otherUserData.photoUrl
                  ? { uri: otherUserData.photoUrl }
                  : require("../../assets/images/save.png")
              }
            />
            <View>
              <Text numberOfLines={1} style={{ fontFamily: "Roboto-Medium", fontSize: 16, color: theme.colors.text }}>
                {otherUserData.nickname}
              </Text>
              <Text numberOfLines={1} style={{ fontFamily: "Roboto-Regular", color: theme.colors.text }}>
                {chat.item.lastMessage.senderId === auth().currentUser.uid && 'Вы: '}{chat.item.lastMessage.content}
              </Text>
            </View>
          </View>
          <View style={{ justifyContent: "center" }}>
            <Icon type={"ionicon"} name={"chevron-forward"} color={theme.colors.text} size={18} />
          </View>
        </View>
      </Button>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{height: 60, backgroundColor: theme.colors.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6}}>
        <Text style={{fontFamily: 'Roboto-Medium', fontSize: 18, color: theme.colors.accentText,}}>Чаты</Text>
        <TouchableOpacity style={{position: 'absolute', right: 6,}} onPress={() => navigation.navigate('Profile')}>
          <Text style={{fontFamily: 'Roboto-Regular', fontSize: 16, color: theme.colors.accentText}}>Назад</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <FlatList
          data={chats}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          renderItem={(chat) => (
            <ChatBtn chat={chat}/>
          )
          } />
      </View>
    </SafeAreaView>
  );
};

export default Chat;
