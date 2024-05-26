import React, {useRef, useState} from 'react';
import {TextInput, TouchableOpacity, View} from "react-native";
import FastImage from "react-native-fast-image";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";

const SendMessageField = ({theme, otherUserId}) => {

    const [isSendBtnDisabled, setSendBtnDisabled] = useState(true);
    const [messageToSend, setMessageToSend] = useState('');

    const messageInputRef = useRef(null);

    const verifyMessageToSend = (value) => {
        return value.trim().length !== 0
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
                    userIds: [currentUserId, otherUserId],
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
            receiverId: otherUserId,
            content: messageToSend.trim(),
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
            }} value={messageToSend} ref={messageInputRef}
                       onChangeText={value => handleMessageToSend(value)}/>
            <TouchableOpacity disabled={isSendBtnDisabled} onPress={handleSendBtn}>
                <View style={{width: 24, height: 24}}>
                    <FastImage
                        style={{width: '100%', height: '100%'}}
                        source={isSendBtnDisabled ? require("../../assets/images/sender-outline.png") : require("../../assets/images/sender.png")}
                        tintColor={theme.colors.accent}
                        resizeMode={FastImage.resizeMode.contain}/>
                </View>
            </TouchableOpacity>
        </View>
    )

};

export default SendMessageField;