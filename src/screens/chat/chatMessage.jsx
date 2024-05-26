import React from 'react';
import {View, Text, TouchableOpacity} from "react-native";
import auth from "@react-native-firebase/auth";;

const ChatMessage = ({theme, message}) => {

    const formattedTime = formatTimestamp(message.item.timestamp);

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    return (
        <>
            <TouchableOpacity style={{flexDirection: message.item.senderId === auth().currentUser.uid ? 'row-reverse' : 'row'}}>
                <View style={{
                    backgroundColor: message.item.senderId === auth().currentUser.uid ? 'lightblue' : 'lightgrey',
                    borderRadius: 10,
                    padding: 10,
                    margin: 5
                }}>
                    <Text style={{fontFamily: 'Roboto-Regular', fontSize: 14, alignSelf: 'flex-end', color: theme.colors.text}}>{message.item.content}</Text>
                    <Text style={{fontFamily: 'Roboto-Regular', fontSize: 12, alignSelf: 'flex-end', color: theme.colors.greyOutline}}>{formattedTime}</Text>
                </View>
            </TouchableOpacity>
        </>
    );
};

export default ChatMessage;