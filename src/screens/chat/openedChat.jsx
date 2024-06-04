import React, {useContext, useEffect, useState} from "react";
import {ActivityIndicator, FlatList, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import FastImage from "react-native-fast-image";
import database from "@react-native-firebase/database";
import ChatMessage from "./chatMessage";
import SendMessageField from "./sendMessageField";
import {Icon, Overlay} from "@rneui/base";
import Reanimated, {LightSpeedInRight, LightSpeedOutRight} from "react-native-reanimated";
import auth from "@react-native-firebase/auth";
import {AppContext} from "../../../App";
import firestore from "@react-native-firebase/firestore";

const OpenedChat = ({theme, navigation, route}) => {
    const {userdata} = useContext(AppContext);
    const chatRef = database().ref('chats');
    const {chatId, otherUserId, otherUserData, fetchChats, requestRent, listingId} = route.params;
    const [isChatLoading, setIsChatLoading] = useState(true);
    const [isInitialMessagesLoaded, setIsInitialMessagesLoaded] = useState(false);
    const [isDeleteChatModalVisible, setDeleteChatModalVisible] = useState(false);
    const [isBlockUserModalVisible, setBlockUserModalVisible] = useState(false);
    const [chatMateData, setChatMateData] = useState({})
    const [messages, setMessages] = useState([]);
    const [finalChatId, setFinalChatId] = useState(null);

    const [isEllipsisMenuOpened, setEllipsisMenuOpened] = useState(false);

    useEffect(() => {
        if (!otherUserData) {
            getChatMateData().then();
        }
        if (!chatId) {
            getChatId().then((chatId) => {
                setFinalChatId(chatId);
            });
        }
        getMessages().then();
    }, []);

    useEffect(() => {
        if (requestRent) {
            console.log(chatId)
            sendRequestRent(chatId).then();
        }
    }, [])

    const sendRequestMessage = (chatId) => {
        // Отправка сообщения в чат
        const messageRef = database().ref(`chats/${chatId}/messages`);
        const newMessageRef = messageRef.push();
        const messageData = {
            senderId: auth().currentUser.uid,
            receiverId: otherUserId,
            content: `${listingId}`.trim(),
            timestamp: Date.now(),
            rentRequestApproved: 'no'
        };
        newMessageRef.set(messageData)
            .then(() => {
            })
            .catch((error) => {
                console.error('Failed to send message:', error);
            });
    };

    const sendRequestRent = async (chatId) => {
        const currentUserId = auth().currentUser.uid;
        const chatRef = database().ref('chats');
        const firstQuery = chatRef.orderByChild('userIds/0').equalTo(currentUserId);
        const secondQuery = chatRef.orderByChild('userIds/1').equalTo(currentUserId);

        const [firstSnapshot, secondSnapshot] = await Promise.all([firstQuery.once('value'), secondQuery.once('value')]);

        let newChatId;
        const snapshot = firstSnapshot.exists() ? firstSnapshot : secondSnapshot;

        snapshot.forEach((childSnapshot) => {
            const chatData = childSnapshot.val();
            const userIds = chatData.userIds;
            if (userIds.includes(currentUserId)) {
                newChatId = childSnapshot.key;
                return true;
            }
        });

        if (newChatId) {
            sendRequestMessage(newChatId);
        } else {
            const newChatRef = chatRef.push();
            newChatId = newChatRef.key;
            const chatData = {
                userIds: [currentUserId, otherUserId],
            };

            await newChatRef.set(chatData);
            sendRequestMessage(newChatId);
        }
        if (messages.length === 0) {
            await getMessages();
        }
        if (!finalChatId) {
            getChatId().then((chatId) => {
                setFinalChatId(chatId);
            });
        }
    }

    useEffect(() => {
        navigation.setOptions({
            fetchChats: async () => {
                fetchChats();
            },
        });
    }, [navigation]);

    useEffect(() => {
        let messageRef;
        if (chatId) {
            messageRef = database().ref(`chats/${chatId}/messages`);
        } else {
            messageRef = database().ref(`chats/${finalChatId}/messages`);
        }

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

    const getChatMateData = async () => {
        const snapshot = await firestore().collection('users').doc(otherUserId).get();
        if (snapshot.exists && snapshot.data().nickname && snapshot.data().photoUrl) {
            setChatMateData({nickname: snapshot.data().nickname, photoUrl: snapshot.data().photoUrl})
        }
    };

    const getChatId = async () => {
        const currentUserId = auth().currentUser.uid;
        const chatRef = database().ref('chats');
        const firstQuery = chatRef.orderByChild('userIds/0').equalTo(currentUserId);
        const secondQuery = chatRef.orderByChild('userIds/1').equalTo(currentUserId);

        const [firstSnapshot, secondSnapshot] = await Promise.all([firstQuery.once('value'), secondQuery.once('value')]);

        const snapshot = firstSnapshot.exists() ? firstSnapshot : secondSnapshot;

        return new Promise((resolve) => {
            snapshot.forEach((childSnapshot) => {
                const chatData = childSnapshot.val();
                const userIds = chatData.userIds;
                if (userIds.includes(otherUserId)) {
                    resolve(childSnapshot.key);
                }
            });
        });
    };

    const getMessages = async () => {
        try {
            setIsChatLoading(true);

            let messageRef, messageSnapshot, existingMessages;

            if (chatId) {
                messageRef = database().ref(`chats/${chatId}/messages`);
            } else {
                const newChatId = await getChatId();
                messageRef = database().ref(`chats/${newChatId}/messages`);
            }

            messageSnapshot = await messageRef.once('value');
            existingMessages = Object.values(messageSnapshot.val() || {});
            existingMessages.sort((a, b) => a.timestamp - b.timestamp).reverse();
            setMessages(existingMessages);
            setIsInitialMessagesLoaded(true);

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
            content: `Телефон ${userdata.nickname}\n${auth().currentUser.phoneNumber}`,
            timestamp: Date.now()
        };
        newMessageRef.set(messageData)
            .then(() => {
            })
            .catch((error) => {
                console.error('Failed to send message:', error);
            });
    };

    const handleDeleteChat = async () => {
        if (chatId) {
            const chatRef = database().ref(`chats/${chatId}`);
            await chatRef.remove();
            if (fetchChats) {
                await fetchChats();
            }
            navigation.navigate('Chat');
        } else {
            const chatRef = database().ref(`chats/${finalChatId}`);
            await chatRef.remove();
            if (fetchChats) {
                await fetchChats();
            }
            navigation.navigate('Chat');
        }
    };

    const handleDeleteBtnPress = () => {
        setDeleteChatModalVisible(true);
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <Overlay isVisible={isDeleteChatModalVisible} onBackdropPress={() => setDeleteChatModalVisible(false)}
                     overlayStyle={{backgroundColor: theme.colors.background, elevation: 0}}>
                <View style={{backgroundColor: theme.colors.background}}>
                    <Text style={{fontFamily: 'Roboto-Medium', color: theme.colors.text}}>Вы точно хотите безвозвратно удалить чат?</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 6,}}>
                        <TouchableOpacity onPress={() => setDeleteChatModalVisible(false)}>
                            <Text style={{fontFamily: 'Roboto-Regular', color: theme.colors.text}}>Отмена</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDeleteChat}>
                            <Text style={{fontFamily: 'Roboto-Regular', color: theme.colors.error}}>Удалить</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
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
                        <TouchableOpacity style={{flexDirection: 'row',}}
                                          disabled={!auth().currentUser.phoneNumber} onPress={sendPhoneNumber}>
                            <Icon type={'ionicon'} name={'person-add'} size={20}
                                  color={auth().currentUser.phoneNumber ? theme.colors.text : theme.colors.grey1}
                                  style={{marginEnd: 6}}/>
                            <Text style={{
                                fontFamily: 'Roboto-Regular',
                                color: auth().currentUser.phoneNumber ? theme.colors.text : theme.colors.grey1
                            }}>Отправить свой
                                телефон</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: 'row', marginTop: 6,}}
                                          disabled={!auth().currentUser.phoneNumber}>
                            <Icon type={'ionicon'} name={'ban'} size={20}
                                  color={auth().currentUser.phoneNumber ? theme.colors.text : theme.colors.grey1}
                                  style={{marginEnd: 6}}/>
                            <Text style={{
                                fontFamily: 'Roboto-Regular',
                                color: auth().currentUser.phoneNumber ? theme.colors.text : theme.colors.grey1
                            }}>Заблокировать пользователя</Text>
                        </TouchableOpacity>
                        {/*<TouchableOpacity style={{flexDirection: 'row', marginTop: 6,}}*/}
                        {/*                  disabled={!auth().currentUser.phoneNumber}>*/}
                        {/*    <Icon type={'ionicon'} name={'checkmark-circle'} size={20}*/}
                        {/*          color={auth().currentUser.phoneNumber ? theme.colors.text : theme.colors.grey1}*/}
                        {/*          style={{marginEnd: 6}}/>*/}
                        {/*    <Text style={{*/}
                        {/*        fontFamily: 'Roboto-Regular',*/}
                        {/*        color: auth().currentUser.phoneNumber ? theme.colors.text : theme.colors.grey1*/}
                        {/*    }}>Разблокировать пользователя</Text>*/}
                        {/*</TouchableOpacity>*/}
                        {messages.length !== 0 && <TouchableOpacity style={{flexDirection: 'row', marginTop: 6}}
                                                                    disabled={messages.length === 0}
                                                                    onPress={handleDeleteBtnPress}>
                            <Icon type={'ionicon'} name={'trash'} size={20} color={theme.colors.error}
                                  style={{marginEnd: 6}}/>
                            <Text style={{fontFamily: 'Roboto-Regular', color: theme.colors.error}}>Удалить чат</Text>
                        </TouchableOpacity>}
                    </Reanimated.View>}
                <View style={{
                    height: 60,
                    backgroundColor: theme.colors.accent,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 6,
                }}>
                    <TouchableOpacity onPress={async () => {
                        if (fetchChats) {
                            await fetchChats();
                        }
                        navigation.navigate('Chat');
                    }}>
                        <Icon type={'ionicon'} name={'arrow-back'} size={24} color={theme.colors.accentText}/>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 48, height: 48, marginEnd: 6, justifyContent: 'center'}}>
                            <FastImage
                                style={{width: "100%", height: "100%", borderRadius: 100}}
                                source={otherUserData
                                    ? {uri: otherUserData.photoUrl}
                                    : chatMateData
                                        ? {uri: chatMateData.photoUrl}
                                        : require('../../assets/images/user.png')}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </View>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: theme.colors.accentText
                        }}>{otherUserData
                            ? otherUserData.nickname
                            : chatMateData
                                ? chatMateData.nickname
                                : 'Нет имени'}</Text>
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
                        renderItem={(item) => <ChatMessage  theme={theme} message={item}
                                                           chatId={chatId ? chatId : finalChatId}/>}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                    />
                ) : (<View style={{flex: 1}}>
                    {chatId || finalChatId ? <ActivityIndicator size={'large'} color={theme.colors.accent}/>
                        :
                        <Text style={{
                            fontFamily: 'Roboto-Regular',
                            fontSize: 14,
                            color: theme.colors.grey1,
                            alignSelf: 'center'
                        }}>
                            Нет сообщений
                        </Text>}

                </View>)}
                <SendMessageField theme={theme} otherUserId={otherUserId} setFinalChatId={setFinalChatId}
                                  finalChatId={finalChatId} getChatId={getChatId} messagesLength={messages.length}
                                  getMessages={getMessages}/>
            </View>
        </SafeAreaView>
    );
};

export default OpenedChat;


