import React from 'react';
import { Image, StyleProp, ViewStyle } from 'react-native';
import MainTabBarOutlined from '../bottomTab/home.png';
import MainTabBarFilled from '../bottomTab/homeFilled.png';
import CatalogTabBarOutlined from '../bottomTab/catalog.png';
import CatalogTabBarFilled from '../bottomTab/catalogFilled.png';
import FavoritesTabBarOutlined from '../bottomTab/favorite.png';
import FavoritesTabBarFilled from '../bottomTab/favoriteFilled.png';
import ProfileTabBarOutlined from '../bottomTab/profile.png';
import ProfileTabBarFilled from '../bottomTab/profileFilled.png';
import CreateAd from '../bottomTab/add.png';
import CreateAdFilled from '../bottomTab/addFilled.png';

export const Icons = {
    Main: {
        activeIcon: MainTabBarFilled,
        inActiveIcon: MainTabBarOutlined,
    },
    Catalog: {
        activeIcon: CatalogTabBarFilled,
        inActiveIcon: CatalogTabBarOutlined,
    },
    CreateAd: {
        activeIcon: CreateAdFilled,
        inActiveIcon: CreateAd,
    },
    Favorites: {
        activeIcon: FavoritesTabBarFilled,
        inActiveIcon: FavoritesTabBarOutlined,
    },
    Profile: {
        activeIcon: ProfileTabBarFilled,
        inActiveIcon: ProfileTabBarOutlined,
    },
};

export interface IconProps {
    type: string;
    name: string;
    color?: string;
    size?: number;
    style?: StyleProp<ViewStyle>;
}

const Icon = ({ type, name, color, size = 22, style }: IconProps) => {

    return (
        <>
            {type && name && (
                <Image
                    source={name}
                    style={[{ tintColor: color, width: size, height: size }, style]}
                    resizeMode={"contain"}
                />
            )}
        </>
    );
};

export default Icon;