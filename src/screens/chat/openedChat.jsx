import React, {useEffect, useState} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import FastImage from "react-native-fast-image";
import database from "@react-native-firebase/database";
import ChatMessage from "./chatMessage";
import SendMessageField from "./sendMessageField";
import {Icon} from "@rneui/base";
import Reanimated, {LightSpeedInRight, LightSpeedOutRight} from "react-native-reanimated";
import auth from "@react-native-firebase/auth";

const OpenedChat = ({theme, navigation, route}) => {
    const {chatId, otherUserId, otherUserData} = route.params;
    const [isChatLoading, setIsChatLoading] = useState(true);
    const [isInitialMessagesLoaded, setIsInitialMessagesLoaded] = useState(false);
    const [messages, setMessages] = useState([]);

    const [isEllipsisMenuOpened, setEllipsisMenuOpened] = useState(false);

    useEffect(() => {
        getMessages().then();
    }, []);

    useEffect(() => {
        const messageRef = database().ref(`chats/${chatId}/messages`);

        const handleChildAdded = (snapshot) => {
            const newMessage = snapshot.val();
            setMessages((prevMessages) => {
                // Проверяем, есть ли такое сообщение в предыдущем списке
                if (!prevMessages.some((msg) =>
                    msg.content === newMessage.content &&
                    msg.receiverId === newMessage.receiverId &&
                    msg.senderId === newMessage.senderId &&
                    msg.timestamp === newMessage.timestamp
                )) {
                    console.log(1)
                    const updatedMessages = [...prevMessages, newMessage];
                    updatedMessages.sort((a, b) => a.timestamp - b.timestamp);
                    updatedMessages.reverse();
                    return updatedMessages;
                }
                return prevMessages;
            });
        };

        const handleChildRemoved = (snapshot) => {
            const removedMessage = snapshot.val();
            setMessages((prevMessages) => {
                // Проверяем, есть ли такое сообщение в предыдущем списке
                if (prevMessages.some((msg) =>
                    msg.content === removedMessage.content &&
                    msg.receiverId === removedMessage.receiverId &&
                    msg.senderId === removedMessage.senderId &&
                    msg.timestamp === removedMessage.timestamp
                )) {
                    // Фильтруем список, оставляя только сообщения, которые не совпадают с удаляемым
                    return prevMessages.filter((msg) =>
                        msg.content !== removedMessage.content ||
                        msg.receiverId !== removedMessage.receiverId ||
                        msg.senderId !== removedMessage.senderId ||
                        msg.timestamp !== removedMessage.timestamp
                    );
                }
                return prevMessages;
            });
        };

        // Подписка на добавление и удаление сообщений
        messageRef.on('child_added', handleChildAdded);
        messageRef.on('child_removed', handleChildRemoved);

        // Очистка подписок при размонтировании компонента
        return () => {
            messageRef.off('child_added', handleChildAdded);
            messageRef.off('child_removed', handleChildRemoved);
        };
    }, []);

    const getMessages = async () => {
        try {
            setIsChatLoading(true);

            if (chatId) {
                const messageRef = database().ref(`chats/${chatId}/messages`);

                // Load all existing messages
                const messageSnapshot = await messageRef.once('value');
                const existingMessages = Object.values(messageSnapshot.val() || {});
                setMessages(existingMessages.sort((a, b) => a.timestamp - b.timestamp).reverse());
                setIsInitialMessagesLoaded(true);
            }

            setIsChatLoading(false);
        } catch (error) {
            console.error('Failed to check chat existence:', error);
            setIsChatLoading(false);
        }
    };

    const sendPhoneNumber = () => {
        // Отправка сообщения в чат
        const messageRef = database().ref(`chats/${chatId}/messages`);
        const newMessageRef = messageRef.push();
        const messageData = {
            senderId: auth().currentUser.uid,
            receiverId: otherUserId,
            content: auth().currentUser.phoneNumber,
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
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1, backgroundColor: theme.colors.background}}>
                {isEllipsisMenuOpened &&
                    <Reanimated.View entering={LightSpeedInRight} exiting={LightSpeedOutRight} style={{
                        position: 'absolute',
                        zIndex: 1,
                        right: 0,
                        top: 42,
                        padding: 12,
                        elevation: 5,
                        borderRadius: 5,
                        backgroundColor: theme.colors.background
                    }}>
                        <TouchableOpacity style={{flexDirection: 'row', marginBottom: 6,}}
                                          disabled={!auth().currentUser.phoneNumber} onPress={sendPhoneNumber}>
                            <Icon type={'ionicon'} name={'person-add'} size={20}
                                  color={auth().currentUser.phoneNumber ? theme.colors.text : theme.colors.grey1}/>
                            <Text style={{
                                fontFamily: 'Roboto-Regular',
                                color: auth().currentUser.phoneNumber ? theme.colors.text : theme.colors.grey1
                            }}>Отправить свой
                                телефон</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: 'row'}}>
                            <Icon type={'ionicon'} name={'trash'} size={20} color={theme.colors.error}/>
                            <Text style={{fontFamily: 'Roboto-Regular', color: theme.colors.error}}>Удалить чат</Text>
                        </TouchableOpacity>
                    </Reanimated.View>}
                <View style={{
                    height: 60,
                    backgroundColor: theme.colors.accent,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 6,
                }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                        <Icon type={'ionicon'} name={'arrow-back'} size={24} color={theme.colors.accentText}/>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 48, height: 48, marginEnd: 6}}>
                            <FastImage
                                style={{width: "100%", height: "100%", borderRadius: 100}}
                                source={otherUserData && otherUserData.photoUrl ? {uri: otherUserData.photoUrl} : require("../../assets/images/save.png")}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </View>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: theme.colors.accentText
                        }}>{otherUserData && otherUserData.nickname}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setEllipsisMenuOpened(!isEllipsisMenuOpened)}>
                        <Icon type={'ionicon'} name={'ellipsis-vertical'} size={24} color={theme.colors.accentText}/>
                    </TouchableOpacity>
                </View>
                {isInitialMessagesLoaded ? (
                    <FlatList
                        inverted
                        contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
                        data={messages}
                        renderItem={(item) => <ChatMessage theme={theme} message={item}/>}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                    />
                ) : (<View style={{flex: 1}}/>)}
                <SendMessageField theme={theme} otherUserId={otherUserId}/>
            </View>
        </SafeAreaView>
    );
};

export default OpenedChat;


