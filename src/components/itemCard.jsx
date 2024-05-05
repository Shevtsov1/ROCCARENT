import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Button, Icon, Rating } from "@rneui/base";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const ItemCard = ({ theme, item }) => {

  const cardWidth = wp(49.5);
  const cardMinWidth = 192;

  function getRatingWord(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'оценок';
    }

    if (lastDigit === 1) {
      return 'оценка';
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'оценки';
    }

    return 'оценок';
  }

  const styles = StyleSheet.create({
    mainCardContainer: { minWidth: cardMinWidth, width: cardWidth, height: 312, borderRadius: 15 },
    mainCard: {
      width: "100%",
      height: "100%",
      flexDirection: "column",
      backgroundColor: theme.colors.secondary,
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderRadius: 15,
      justifyContent: "flex-start",
      alignItems: "center",

    }, mainCardContentContainer: {
      width: "100%",
      height: "100%",
    }, mainCardImageContainer: {
      width: "100%",
      height: "65%",
      borderRadius: 15,
    },
    mainCardImage: { maxWidth: "100%", maxHeight: "100%" },
    mainCardTextContainer: {
      width: "100%",
      height: "35%",
      borderRadius: 15,
      paddingVertical: 6,
      paddingHorizontal: 12,
    }, mainCardTextPrice: {
      fontFamily: "Roboto-Bold",
      fontSize: 18,
      color: theme.colors.text,
    }, mainCardTextTitle: {
      fontFamily: "Roboto-Regular",
      fontSize: 14,
      color: theme.colors.text,
    }, mainCardTextMark: {
      fontFamily: "Roboto-Regular",
      fontSize: 14,
      color: theme.colors.text,
    }, mainCardTextRating: {
      fontFamily: "Roboto-Regular",
      fontSize: 14,
      color: theme.colors.text,
    },
  });

  return (
    <Button containerStyle={styles.mainCardContainer} buttonStyle={styles.mainCard}
            titleStyle={{ color: theme.colors.grey1, height: 0 }}>
      <View style={styles.mainCardContentContainer}>
        <View style={styles.mainCardImageContainer}>
          <Image source={require("../assets/images/telephone.png")} resizeMode={"contain"}
                 style={styles.mainCardImage} />
        </View>
        <View style={styles.mainCardTextContainer}>
          <Text numberOfLines={1} style={styles.mainCardTextPrice}>{item.price} <Text style={{ fontSize: 14 }}>BYN/сут</Text></Text>
          <Text numberOfLines={1} style={styles.mainCardTextTitle}>{item.title}</Text>
          <Text numberOfLines={1} style={styles.mainCardTextTitle}>{item.title}</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ justifyContent: "center" }}>
              <Icon type={"ionicon"} name={"star"} color={theme.colors.accent} size={14} />
            </View>
            <Text numberOfLines={1} style={styles.mainCardTextMark}>
              {'\ '}{item.mark.toFixed(1).replace('.', ',')}{'\ '}
            </Text>
            <View style={{ justifyContent: "center" }}>
              <Icon type={"ionicon"} name={"ellipse"} color={theme.colors.grey1} size={8} />
            </View>
            <Text numberOfLines={1} style={styles.mainCardTextRating}>{'\ '}{item.ratings} {getRatingWord(item.ratings)}</Text>
          </View>
        </View>
      </View>
    </Button>
  );
};

export default ItemCard;
