import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import firestore from "@react-native-firebase/firestore";
import FastImage from "react-native-fast-image";
import {ShadowedView, shadowStyle} from "react-native-fast-shadow";
import {BottomSheet, Button} from "@rneui/base";

const ChatMessage = ({theme, message, chatId}) => {

    const [isMessageModalVisible, setMessageModalVisible] = useState(false);
    const [formattedTime, setFormattedTime] = useState('');
    const [listingData, setListingData] = useState(null);

    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    useEffect(() => {
        setFormattedTime(formatTimestamp(message.item.timestamp))
    })

    useEffect(() => {
        if (message.item.rentRequestApproved) {
            getListingForRentRequest().then();
        }
    })

    const formatTimestamp = (timestamp) => {
        if (!timestamp) {
            return '';
        }

        const date = new Date(timestamp);
        const dayNum = date.getDate();
        const monthIndex = date.getMonth();
        const monthName = monthIndex >= 0 && monthIndex < monthNames.length ? monthNames[monthIndex] : 'Неизвестный месяц';
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${dayNum} ${monthName} ${hours}:${minutes}`;
    };

    const handleLongPress = () => {
        setMessageModalVisible(!isMessageModalVisible);

    };

    const handleDeleteMessage = async () => {
        try {
            const messageRef = database().ref(`chats/${chatId}/messages`);
            const messageSnapshot = await messageRef.once('value');
            const messages = messageSnapshot.val();

            // Find the message to delete
            const messageKeys = Object.keys(messages);
            const messageToDeleteKey = messageKeys.find((key) => {
                return messages[key].content === message.item.content;
            });

            if (messageToDeleteKey) {
                await messageRef.child(messageToDeleteKey).remove();
                console.log('Message deleted successfully');
                setMessageModalVisible(false); // Hide the message modal after successful deletion
            } else {
                console.error('Message not found in the database');
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const getListingForRentRequest = async () => {
        const listingsData = await firestore().collection("listings").where('listingId', '==', message.item.content).get();
        if (listingsData) {
            listingsData.forEach(doc => {
                    setListingData(doc.data());
            });
        }
    }

    const RequestBottomSheet = () => {
        return (
            <BottomSheet>

            </BottomSheet>
            )
    }

    if (message.item.rentRequestApproved) {
        if (message.item.senderId === auth().currentUser.uid) {
            return (
                <View>
                    <TouchableOpacity
                        style={{
                            flexDirection: message.item.senderId === auth().currentUser.uid ? 'row-reverse' : 'row',
                        }}
                        onLongPress={() => message.item.senderId === auth().currentUser.uid && handleLongPress()}
                    >
                        <View
                            style={{
                                backgroundColor: message.item.senderId === auth().currentUser.uid ? 'lightblue' : 'lightgrey',
                                borderRadius: 5,
                                padding: 6,
                                margin: 5,
                            }}
                        >
                            {listingData && (
                                <>
                                    <View style={{width: 192, height: 192 * 1.3, alignSelf: 'center'}}>
                                        <FastImage
                                            source={{uri: listingData.mainImageUrl}}
                                            style={{width: '100%', height: '100%'}}
                                            resizeMode={FastImage.resizeMode.contain}/>
                                    </View>
                                    <View style={{marginVertical: 6}}>
                                        <Text style={{fontFamily: 'Roboto-Bold', color: theme.colors.chatText}}>
                                            {listingData.price} BYN/сут
                                        </Text>
                                        <Text style={{fontFamily: 'Roboto-Regular', color: theme.colors.chatText}}>
                                            {listingData.title}
                                        </Text>
                                        <Text style={{fontFamily: 'Roboto-Regular', color: theme.colors.chatText}}>
                                            {listingData.city}
                                        </Text>
                                    </View>
                                    <ShadowedView style={[{marginBottom: 6}, shadowStyle({
                                        color: theme.colors.grey3, opacity: 0.8, radius: 3, offset: [0, 0],
                                    })]}>
                                        <Button disabledStyle={message.item.rentRequestApproved !== 'no' && {backgroundColor: theme.colors.accent}} disabledTitleStyle={message.item.rentRequestApproved !== 'no' && {color: theme.colors.accentText}}
                                                title={message.item.rentRequestApproved === 'no' ? 'Аренда запрошена' : 'Аренда активна' }
                                                disabled={true}/>
                                    </ShadowedView>
                                </>
                            )}
                            <Text style={{
                                fontFamily: 'Roboto-Regular',
                                fontSize: 12,
                                alignSelf: 'flex-end',
                                color: theme.colors.greyOutline
                            }}>
                                {formattedTime}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{
                        display: isMessageModalVisible ? 'flex' : 'none',
                        flexDirection: message.item.senderId === auth().currentUser.uid ? 'row-reverse' : 'row',
                    }}>
                        <TouchableOpacity style={{
                            backgroundColor: theme.colors.background,
                            elevation: 5,
                            padding: 3,
                            borderRadius: 5,
                            marginEnd: message.item.senderId === auth().currentUser.uid && 6,
                            marginStart: message.item.senderId !== auth().currentUser.uid && 6
                        }} onPress={handleDeleteMessage}>
                            <Text>Удалить</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            return (
                <View>
                    <TouchableOpacity
                        style={{
                            flexDirection: message.item.senderId === auth().currentUser.uid ? 'row-reverse' : 'row',
                        }}
                        onLongPress={() => message.item.senderId === auth().currentUser.uid && handleLongPress()}
                    >
                        <View
                            style={{
                                backgroundColor: message.item.senderId === auth().currentUser.uid ? 'lightblue' : 'lightgrey',
                                borderRadius: 5,
                                padding: 6,
                                margin: 5,
                            }}
                        >
                            {listingData && (
                                <>
                                    <View style={{width: 192, height: 192 * 1.3, alignSelf: 'center'}}>
                                        <FastImage
                                            source={{uri: listingData.mainImageUrl}}
                                            style={{width: '100%', height: '100%'}}
                                            resizeMode={FastImage.resizeMode.contain}/>
                                    </View>
                                    <View style={{marginVertical: 6}}>
                                        <Text style={{fontFamily: 'Roboto-Bold', color: theme.colors.chatText}}>
                                            {listingData.price} BYN/сут
                                        </Text>
                                        <Text style={{fontFamily: 'Roboto-Regular', color: theme.colors.chatText}}>
                                            {listingData.title}
                                        </Text>
                                        <Text style={{fontFamily: 'Roboto-Regular', color: theme.colors.chatText}}>
                                            {listingData.city}
                                        </Text>
                                    </View>
                                    <ShadowedView style={[{marginBottom: 6}, shadowStyle({
                                        color: theme.colors.grey3, opacity: 0.8, radius: 3, offset: [0, 0],
                                    })]}>
                                        <Button
                                                buttonStyle={{backgroundColor: theme.colors.accent}}
                                                titleStyle={{color: theme.colors.accentText}}
                                                title={message.item.rentRequestApproved === 'no' ? 'Запрос аренды' : 'Аренда активна' }
                                                disabled={message.item.rentRequestApproved !== 'no'}/>
                                    </ShadowedView>
                                </>
                            )}
                            <Text style={{
                                fontFamily: 'Roboto-Regular',
                                fontSize: 12,
                                alignSelf: 'flex-end',
                                color: theme.colors.greyOutline
                            }}>
                                {formattedTime}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{
                        display: isMessageModalVisible ? 'flex' : 'none',
                        flexDirection: message.item.senderId === auth().currentUser.uid ? 'row-reverse' : 'row',
                    }}>
                        <TouchableOpacity style={{
                            backgroundColor: theme.colors.background,
                            elevation: 5,
                            padding: 3,
                            borderRadius: 5,
                            marginEnd: message.item.senderId === auth().currentUser.uid && 6,
                            marginStart: message.item.senderId !== auth().currentUser.uid && 6
                        }} onPress={handleDeleteMessage}>
                            <Text>Удалить</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }

    return (
        <View>
            <TouchableOpacity
                style={{
                    flexDirection: message.item.senderId === auth().currentUser.uid ? 'row-reverse' : 'row',
                }}
                onLongPress={() => message.item.senderId === auth().currentUser.uid && handleLongPress()}
            >
                <View
                    style={{
                        backgroundColor: message.item.senderId === auth().currentUser.uid ? 'lightblue' : 'lightgrey',
                        borderRadius: 5,
                        padding: 6,
                        margin: 5,
                    }}
                >
                    <Text style={{
                        fontFamily: 'Roboto-Regular',
                        fontSize: 14,
                        alignSelf: 'flex-end',
                        color: theme.colors.chatText
                    }}>
                        {message.item.content}
                    </Text>
                    <Text style={{
                        fontFamily: 'Roboto-Regular',
                        fontSize: 12,
                        alignSelf: 'flex-end',
                        color: theme.colors.greyOutline
                    }}>
                        {formattedTime}
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={{
                display: isMessageModalVisible ? 'flex' : 'none',
                flexDirection: message.item.senderId === auth().currentUser.uid ? 'row-reverse' : 'row',
            }}>
                <TouchableOpacity style={{
                    backgroundColor: theme.colors.background,
                    elevation: 5,
                    padding: 3,
                    borderRadius: 5,
                    marginEnd: message.item.senderId === auth().currentUser.uid && 6,
                    marginStart: message.item.senderId !== auth().currentUser.uid && 6
                }} onPress={handleDeleteMessage}>
                    <Text>Удалить</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChatMessage;