import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Icon } from "@rneui/themed";
import DraggableFlatList, {ScaleDecorator} from "react-native-draggable-flatlist";
import { RenderItemParams } from "react-native-draggable-flatlist";

const CreateAd = ({ theme }) => {

  // const items = [
  //   { title: "Item 1", description: "Description 1", price: 1, ratings: 1, mark: 1, owner: 'Mark'},
  //   { title: "Пила циркулярная Makitta", description: "Description 2", price: 2, ratings: 2, mark: 1.5, owner: 'Maks' },
  //   { title: "Item 3", description: "Description 3", price: 3, ratings: 3, mark: 2, owner: 'John' },
  //   { title: "Item 4", description: "Description 4", price: 4, ratings: 4, mark: 2.5, owner: 'Yuri' },
  //   { title: "Item 5", description: "Description 5", price: 5, ratings: 5, mark: 3, owner: 'Ivan' },
  //   { title: "Item 6", description: "Description 6", price: 6, ratings: 6, mark: 3.5, owner: 'Ilya' },
  //   { title: "Item 7", description: "Description 7", price: 7, ratings: 7, mark: 4, owner: 'Den' },
  //   { title: "Item 8", description: "Description 8", price: 15, ratings: 15, mark: 4.5, owner: 'Nikolay'},
  // ];

  const NUM_ITEMS = 10;
  function getColor(i: number) {
    const multiplier = 255 / (NUM_ITEMS - 1);
    const colorVal = i * multiplier;
    return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
  }

  type Item = {
    key: string;
    label: string;
    height: number;
    width: number;
    backgroundColor: string;
  };

  const initialData: Item[] = [...Array(NUM_ITEMS)].map((d, index) => {
    const backgroundColor = getColor(index);
    return {
      key: `item-${index}`,
      label: String(index) + "",
      height: 100,
      width: 60 + Math.random() * 40,
      backgroundColor,
    };
  });

  const [data, setData] = useState(initialData);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    return (
      <ScaleDecorator activeScale={0.9}>
        <View style={{width: 72, height: 72, justifyContent: 'center', alignItems: 'center', marginEnd: 6,}}>
          <TouchableOpacity
            onLongPress={drag}
            disabled={isActive}
            style={[{width: 72, height: 72, borderRadius: 5,},
              { backgroundColor: isActive ? `${theme.colors.grey1}3A` : item.backgroundColor },
            ]}
          >
            <Text style={styles.text}>{item.label}</Text>
          </TouchableOpacity>
        </View>
      </ScaleDecorator>
    );
  };


  const styles = StyleSheet.create({

    /* BODY BEGIN */

    body: {
      flex: 1,
      backgroundColor: theme.colors.background,
    }, header: {
      flex: 1,
      height: 60,
      backgroundColor: theme.colors.accent,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 12,
      marginBottom: 12,
    }, headerMainText: {
      fontFamily: "Roboto-Medium",
      fontSize: 18,
      color: theme.colors.accentText,
    }, headerCancelText: {
      fontFamily: "Roboto-Regular",
      fontSize: 16,
      color: theme.colors.accentText,
      alignSelf: "center",
    }, imagesContainer: {
      flex: 1,
      height: 144,
      backgroundColor: theme.colors.background,
      marginBottom: 12,
      paddingHorizontal: 12,
      borderWidth: 1,
    }, imagesHeaderContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    }, imagesHeaderMainText: {
      fontFamily: "Roboto-Regular",
      fontSize: 16,
      color: theme.colors.text,
      alignSelf: "center",
    }, imagesHeaderInfoText: {
      fontFamily: "Roboto-Regular",
      fontSize: 14,
      color: theme.colors.grey1,
      alignSelf: "center",
    }, imagesPickerContainer: {
      flex: 2,
      flexDirection: 'row',
      borderWidth: 1,
    }, imagesFooterContainer: {
      flex: 1,
      borderWidth: 1,
    },

    /* BODY END */
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.body}>
        <View style={styles.header}>
          <Text numberOfLines={1} style={styles.headerMainText}>Новое объявление</Text>
          <TouchableOpacity>
            <Text numberOfLines={1} style={styles.headerCancelText}>Очистить</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imagesContainer}>
          <View style={styles.imagesHeaderContainer}>
            <Text style={styles.imagesHeaderMainText}>Добавьте фотографии</Text>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <Icon style={{marginEnd: 6}} type={"ionicon"} name={"image"} size={20} color={theme.colors.grey1} />
              <Text style={styles.imagesHeaderInfoText}>0 из 20</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', paddingVertical: 12}}>
            <Button containerStyle={{marginEnd: 6}} buttonStyle={{width: 72, height: 72, borderRadius: 5,}}>
            </Button>
            <DraggableFlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              animationConfig={{clamp: 1}}
              data={data}
              onDragEnd={({ data }) => setData(data)}
              keyExtractor={(item) => item.key}
              renderItem={renderItem}
              containerStyle={{flex: 1}}
            />
          </View>
          <View style={styles.imagesFooterContainer}>
            <Text style={styles.imagesHeaderInfoText}></Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAd;
