import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text, Animated } from "react-native";
import {FadeIn} from "react-native-reanimated";
import Icon, { Icons } from "../assets/images/bottomTab/TabBarIcons";
import Main from "../screens/mainScreen/main";
import Catalog from "../screens/catalogScreen/catalog";
import Favorites from "../screens/favoritesScreen/favorites";
import CreateAd from "../screens/createAdScreen/createAd";
import { ProfileStackNavigator } from "./stackNavigator";
import { widthPercentageToDP } from "react-native-responsive-screen";

// Массив с конфигурациями вкладок
const TabArr = [
  {
    route: "Main",
    label: "Главная",
    type: Icons.Main,
    activeIcon: Icons.Main.activeIcon,
    inActiveIcon: Icons.Main.inActiveIcon,
    component: Main,
  },
  {
    route: "Catalog",
    label: "Каталог",
    type: Icons.Catalog,
    activeIcon: Icons.Catalog.activeIcon,
    inActiveIcon: Icons.Catalog.inActiveIcon,
    component: Catalog,
  },
  {
    route: "CreateAd",
    type: Icons.CreateAd,
    activeIcon: Icons.CreateAd.activeIcon,
    inActiveIcon: Icons.CreateAd.inActiveIcon,
    component: CreateAd,
    separate: true,
  },
  {
    route: "Favorites",
    label: "Избранное",
    type: Icons.Favorites,
    activeIcon: Icons.Favorites.activeIcon,
    inActiveIcon: Icons.Favorites.inActiveIcon,
    component: Favorites,
  },
  {
    route: "ProfileStack",
    label: "Профиль",
    type: Icons.Profile,
    activeIcon: Icons.Profile.activeIcon,
    inActiveIcon: Icons.Profile.inActiveIcon,
    component: ProfileStackNavigator,
  },
];

const Tab = createBottomTabNavigator();

// Компонент кнопки вкладки
const TabButton = (props) => {
  const { item, onPress, accessibilityState, theme } = props;
  const focused = accessibilityState.selected;
  const activeTabBarIconColor = theme.colors.accent;
  const inActiveTabBarIconColor = theme.colors.grey2;
  const label = focused ? item.label : "";
  const rotation = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    if (!focused) {
      onPress();
    }
  };

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    const animations = [
      Animated.timing(rotation, {
        toValue: focused ? 1 : 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start();
  }, [focused, rotation]);

  if (item.route === "CreateAd") {
    // Отдельные стили для кнопки "CreateAd"
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={1}
        style={[styles.container, {
          flex: 1, alignItems: "center", backgroundColor: theme.colors.background,
        }]}
      >
        <View style={{ justifyContent: "center", alignItems: "center", bottom: 2, width: "100%", height: 64 }}>
          <View
            style={
              {
                width: 48,
                height: 36,
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.accent,
              }
            }
          >
            <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
              <Icon
                type={item.type}
                name={focused ? item.activeIcon : item.inActiveIcon}
                color={theme.colors.accentText}
                size={22}
              />
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else {
    // Стили для остальных кнопок
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={1}
                        style={[styles.container, {
                          top: 0,
                          alignItems: "center",
                          backgroundColor: theme.colors.background,
                        }]}>

        <View style={styles.iconContainer}>
          <View>
            <Icon
              type={item.type}
              name={focused ? item.activeIcon : item.inActiveIcon}
              color={focused ? activeTabBarIconColor : inActiveTabBarIconColor}
            />
          </View>
          {focused && (
            <Animated.View entering={FadeIn.duration(200)}>
              <Text style={{ fontFamily: "Roboto-Bold", fontSize: 12, color: theme.colors.accent }}>{label}</Text>
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
};

// Компонент нижней навигации по вкладкам
const BottomTabNavigator = React.memo(({ theme, toggleMode, isDarkMode, routeName, setInitializing, setLoadingScreenText }) => {
  const routeNamesToCheck = ["LogIn", "LogUp"];
  const routeWithoutTabBar = routeNamesToCheck.includes(routeName);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={() => ({
          headerShown: false,
        })}
      >
        {TabArr.map((item, index) => {
          return (
            <Tab.Screen key={index} name={item.route}
                        options={({ route }) => ({
                          tabBarStyle: routeWithoutTabBar ? { display: "none" } : { borderTopWidth: 0, height: 48 },
                          tabBarShowLabel: false,
                          tabBarButton: (props) => (
                            <TabButton {...props} item={item} theme={theme} isDarkMode={isDarkMode} />
                          ),
                        })}
            >
              {(props) => <item.component {...props} theme={theme} toggleMode={toggleMode}
                                          setInitializing={setInitializing}
                                          setLoadingScreenText={setLoadingScreenText} />}
            </Tab.Screen>
          );
        })}
      </Tab.Navigator>
    </SafeAreaView>
  );
})

const ref = createNavigationContainerRef();
// Компонент навигации приложения
const AppNavigator = ({ setInitializing, theme, toggleMode, setLoadingScreenText }) => {
  const [routeName, setRouteName] = useState();
  return (
    <NavigationContainer
      ref={ref}
      onReady={() => {
        setRouteName(ref.getCurrentRoute().name);
      }}
      onStateChange={async () => {
        const previousRouteName = routeName;
        const currentRouteName = ref.getCurrentRoute().name;
        setRouteName(currentRouteName);
      }}>
      <BottomTabNavigator routeName={routeName} setInitializing={setInitializing} theme={theme} toggleMode={toggleMode}
                          setLoadingScreenText={setLoadingScreenText} />
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 60,
    height: 60,
    width: widthPercentageToDP(20),
  },
  iconContainer: {
    alignItems: "center",
  },
});
