import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";

const Belarus = [
  { "Minsk Region": [{ "Minsk Region": "Минский район" }, { "Minsk": "Минск" }, { "Barysaw": "Борисов" }, { "Salihorsk": "Солигорск" }, { "Maladzyechna": "Молодечно" }, { "Zhodzina": "Жодино" }, { "Slutsk": "Слуцк" }, { "Vilyeyka": "Вилейка" }, { "Dzyarzhynsk": "Дзержинск" }, { "Maryina Horka": "Марьина Горка" }, { "Stowbtsy": "Столбцы" }, { "Smalyavichy": "Смолевичи" }, { "Zaslawye": "Заславль" }, { "Nyasvizh": "Несвиж" }, { "Fanipal": "Фаниполь" }, { "Byerazino": "Березино" }, { "Lyuban": "Любань" }, { "Lahoysk": "Логойск" }, { "Staryya Darohi": "Старые Дороги" }, { "Klyetsk": "Клецк" }, { "Valozhyn": "Воложин" }, { "Chervyen": "Червень" }, { "Kapyl": "Копыль" }, { "Uzda": "Узда" }, { "Krupki": "Крупки" }, { "Myadzyel": "Мядель" }] },
  { "Vitsyebsk Region": [{ "Vitsyebsk Region": "Витебский район" }, { "Vitsyebsk": "Витебск" }, { "Orsha": "Орша" }, { "Navapolatsk": "Новополоцк" }, { "Polatsk": "Полоцк" }, { "Pastavy": "Поставы" }, { "Hlybokaye": "Глубокое" }, { "Lyepyel": "Лепель" }, { "Novalukoml": "Новолукомль" }, { "Haradok": "Городок" }, { "Baran": "Барань" }, { "Talachyn": "Толочин" }, { "Braslaw": "Браслав" }, { "Chashniki": "Чашники" }, { "Myory": "Миоры" }, { "Syanno": "Сенно" }, { "Dubrowna": "Дубровно" }, { "Vyerkhnyadzvinsk": "Верхнедвинск" }, { "Dokshytsy": "Докшицы" }, { "Dzisna": "Дисна" }] },
  { "Mahilyow Region": [{ "Mahilyow Region": "Могилёвский район" }, { "Mahilyow": "Могилёв" }, { "Babruysk": "Бобруйск" }, { "Horki": "Горки" }, { "Asipovichy": "Осиповичи" }, { "Krychaw": "Кричев" }, { "Klimavichy": "Климовичи" }, { "Bykhaw": "Быхов" }, { "Shklow": "Шклов" }, { "Kastsyukovichy": "Костюковичи" }, { "Mstsislaw": "Мстиславль" }, { "Chavusy": "Чаусы" }, { "Byalynichy": "Белыничи" }, { "Kirawsk": "Кировск" }, { "Cherykaw": "Чериков" }, { "Slawharad": "Славгород" }, { "Kruhlaye": "Круглое" }, { "Klichaw": "Кличев" }] },
  { "Homyel Region": [{ "Homyel Region": "Гомельский район" }, { "Homyel": "Гомель" }, { "Mazyr": "Мозырь" }, { "Zhlobin": "Жлобин" }, { "Svyetlahorsk": "Светлогорск" }, { "Rechytsa": "Речица" }, { "Kalinkavichy": "Калинковичи" }, { "Rahachow": "Рогачёв" }, { "Dobrush": "Добруш" }, { "Zhytkavichy": "Житковичи" }, { "Khoyniki": "Хойники" }, { "Pyetrykaw": "Петриков" }, { "Yelsk": "Ельск" }, { "Buda-Kashalyova": "Буда-Кошелёво" }, { "Narowlya": "Наровля" }, { "Chachersk": "Чечерск" }, { "Vyetka": "Ветка" }, { "Vasilyevichy": "Василевичи" }, { "Turaw": "Туров" }] },
  { "Brest Region": [{ "Brest Region": "Брестский район" }, { "Brest": "Брест" }, { "Baranavichy": "Барановичи" }, { "Pinsk": "Пинск" }, { "Kobryn": "Кобрин" }, { "Byaroza": "Берёза" }, { "Luninyets": "Лунинец" }, { "Ivatsevichy": "Ивацевичи" }, { "Pruzhany": "Пружаны" }, { "Ivanava": "Иваново" }, { "Drahichyn": "Дрогичин" }, { "Hantsavichy": "Ганцевичи" }, { "Zhabinka": "Жабинка" }, { "Mikashevichy": "Микашевичи" }, { "Byelaazyorsk": "Белоозёрск" }, { "Stolin": "Столин" }, { "Malaryta": "Малорита" }, { "Lyakhavichy": "Ляховичи" }, { "Kamyenyets": "Каменец" }, { "Davyd-Haradok": "Давид-Городок" }, { "Vysokaye": "Высокое" }, { "Kosava": "Коссово" }] },
  { "Hrodna Region": [{ "Hrodna Region": "Гроднейнский район" }, { "Hrodna": "Гродно" }, { "Lida": "Лида" }, { "Slonim": "Слоним" }, { "Vawkavysk": "Волковыск" }, { "Smarhon": "Сморгонь" }, { "Navahrudak": "Новогрудок" }, { "Masty": "Мосты" }, { "Shchuchyn": "Щучин" }, { "Ashmyany": "Ошмяны" }, { "Skidzyel": "Скидель" }, { "Byarozawka": "Берёзовка" }, { "Astravyets": "Островец" }, { "Iwye": "Ивье)" }, { "Dzyatlava": "Дятлово" }, { "Svislach": "Свислочь" }] },
];


export const getAddressName = (fullAddress) => {
  let finalArr = [];
  if (typeof fullAddress === "string") {
    finalArr = fullAddress.split(",");
  }
  return finalArr[4] + ", " + finalArr[3];
};


export const translateAddressName = (fullAddress) => {
  if (typeof fullAddress !== "string") {
    return null;
  }

  const addressParts = fullAddress.split(", ");
  const city = addressParts.pop().trim();
  const region = addressParts.pop().trim();

  let translatedRegion = null;
  let translatedCity = null;

  for (const regionObj of Belarus) {
    const regionName = Object.keys(regionObj)[0];
    if (region === regionName) {
      translatedRegion = regionObj[regionName][0][regionName];
      for (const cityObj of regionObj[regionName]) {
        const cityName = Object.keys(cityObj)[0];
        if (city === cityName) {
          translatedCity = cityObj[cityName];
          break;
        }
      }
      break;
    }
  }

  return translatedRegion && translatedCity ? translatedRegion + ", " + translatedCity : fullAddress;
};

const verifySelectedImages = (selectedImages) => {
  return selectedImages.length > 0 && selectedImages.length <= 20;
};

const verifyCategory = (category) => {
  return !!category;
};

const verifySubcategory = (subcategory) => {
  return !!subcategory;
};

const verifyFieldsData = (fieldsData) => {
  const title = fieldsData.title;
  const description = fieldsData.description;
  const price = fieldsData.price;
  const dates = fieldsData.dates;

  const verifyTitle = () => {
    if (title) {
      const titleRegex = /^[a-zA-Zа-яА-Я\d\s.\-()]+$/;
      return titleRegex.test(title);
    }
    return false;
  };

  const verifyDescription = () => {
    if (description) {
      const descriptionRegex = /^[a-zA-Zа-яА-Я\d\s.\-()\/_~!$&*'+,;=@[\]%#]+$/;
      return descriptionRegex.test(description);
    }
    return false;
  };

  const verifyPrice = () => {
    if (price) {
      const priceRegex = /^\d+(.\d{1,2})?$/;
      return priceRegex.test(price);
    }
    return false;
  };

  const verifyDates = () => {
    if (dates) {
      if (dates.startsDay && dates.endsDay) {
        return true;
      }
    }
    return false;
  };

  const titleReady = verifyTitle();
  const descriptionReady = verifyDescription();
  const priceReady = verifyPrice();
  const datesReady = verifyDates();
  return titleReady && descriptionReady && priceReady && datesReady;
};

const verifySelectedCoordinates = (selectedCoordinates) => {
  if (selectedCoordinates) {
    if (selectedCoordinates.address) {
      return true;
    }
  }
  return false;
};

export const verifyNewListingDataBeforeCreating = ({
                                  theme,
                                  selectedImages,
                                  category,
                                  subcategory,
                                  fieldsData,
                                  selectedCoordinates,
                                  setIsSubmitBtnEnabled,
                                }) => {

  const selectedImagesReady = verifySelectedImages(selectedImages);
  const categoryReady = verifyCategory(category);
  const subcategoryReady = verifySubcategory(subcategory);
  const fieldsDataReady = verifyFieldsData(fieldsData);
  const selectedCoordinatesReady = verifySelectedCoordinates(selectedCoordinates);

  if (selectedImagesReady && categoryReady && subcategoryReady && fieldsDataReady && selectedCoordinatesReady) {
    setIsSubmitBtnEnabled(true);
  } else {
    setIsSubmitBtnEnabled(false);
  }
};
