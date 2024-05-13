import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";

const Belarus = [
  {"Minsk Region": [{'Minsk Region': 'Минский район'}, { "Minsk": "Минск" }, { "Barysaw": "Борисов" }, { "Salihorsk": "Солигорск" }, { "Maladzyechna": "Молодечно" }, { "Zhodzina": "Жодино" }, { "Slutsk": "Слуцк" }, { "Vilyeyka": "Вилейка" }, { "Dzyarzhynsk": "Дзержинск" }, { "Maryina Horka": "Марьина Горка" }, { "Stowbtsy": "Столбцы" }, { "Smalyavichy": "Смолевичи" }, { "Zaslawye": "Заславль" }, { "Nyasvizh": "Несвиж" }, { "Fanipal": "Фаниполь" }, { "Byerazino": "Березино" }, { "Lyuban": "Любань" }, { "Lahoysk": "Логойск" }, { "Staryya Darohi": "Старые Дороги" }, { "Klyetsk": "Клецк" }, { "Valozhyn": "Воложин" }, { "Chervyen": "Червень" }, { "Kapyl": "Копыль" }, { "Uzda": "Узда" }, { "Krupki": "Крупки" }, { "Myadzyel": "Мядель" }]},
  {"Vitsyebsk Region": [{'Vitsyebsk Region': 'Витебский район'},{ "Vitsyebsk": "Витебск" }, { "Orsha": "Орша" }, { "Navapolatsk": "Новополоцк" }, { "Polatsk": "Полоцк" }, { "Pastavy": "Поставы" }, { "Hlybokaye": "Глубокое" }, { "Lyepyel": "Лепель" }, { "Novalukoml": "Новолукомль" }, { "Haradok": "Городок" }, { "Baran": "Барань" }, { "Talachyn": "Толочин" }, { "Braslaw": "Браслав" }, { "Chashniki": "Чашники" }, { "Myory": "Миоры" }, { "Syanno": "Сенно" }, { "Dubrowna": "Дубровно" }, { "Vyerkhnyadzvinsk": "Верхнедвинск" }, { "Dokshytsy": "Докшицы" }, { "Dzisna": "Дисна" }]},
  {"Mahilyow Region": [{'Mahilyow Region': 'Могилёвский район'},{ "Mahilyow": "Могилёв" }, { "Babruysk": "Бобруйск" }, { "Horki": "Горки" }, { "Asipovichy": "Осиповичи" }, { "Krychaw": "Кричев" }, { "Klimavichy": "Климовичи" }, { "Bykhaw": "Быхов" }, { "Shklow": "Шклов" }, { "Kastsyukovichy": "Костюковичи" }, { "Mstsislaw": "Мстиславль" }, { "Chavusy": "Чаусы" }, { "Byalynichy": "Белыничи" }, { "Kirawsk": "Кировск" }, { "Cherykaw": "Чериков" }, { "Slawharad": "Славгород" }, { "Kruhlaye": "Круглое" }, { "Klichaw": "Кличев" }]},
  {"Homyel Region": [{'Homyel Region': 'Гомельский район'},{ "Homyel": "Гомель" }, { "Mazyr": "Мозырь" }, { "Zhlobin": "Жлобин" }, { "Svyetlahorsk": "Светлогорск" }, { "Rechytsa": "Речица" }, { "Kalinkavichy": "Калинковичи" }, { "Rahachow": "Рогачёв" }, { "Dobrush": "Добруш" }, { "Zhytkavichy": "Житковичи" }, { "Khoyniki": "Хойники" }, { "Pyetrykaw": "Петриков" }, { "Yelsk": "Ельск" }, { "Buda-Kashalyova": "Буда-Кошелёво" }, { "Narowlya": "Наровля" }, { "Chachersk": "Чечерск" }, { "Vyetka": "Ветка" }, { "Vasilyevichy": "Василевичи" }, { "Turaw": "Туров" }]},
  {"Brest Region": [{'Brest Region': 'Брестский район'},{ "Brest": "Брест" }, { "Baranavichy": "Барановичи" }, { "Pinsk": "Пинск" }, { "Kobryn": "Кобрин" }, { "Byaroza": "Берёза" }, { "Luninyets": "Лунинец" }, { "Ivatsevichy": "Ивацевичи" }, { "Pruzhany": "Пружаны" }, { "Ivanava": "Иваново" }, { "Drahichyn": "Дрогичин" }, { "Hantsavichy": "Ганцевичи" }, { "Zhabinka": "Жабинка" }, { "Mikashevichy": "Микашевичи" }, { "Byelaazyorsk": "Белоозёрск" }, { "Stolin": "Столин" }, { "Malaryta": "Малорита" }, { "Lyakhavichy": "Ляховичи" }, { "Kamyenyets": "Каменец" }, { "Davyd-Haradok": "Давид-Городок" }, { "Vysokaye": "Высокое" }, { "Kosava": "Коссово" }]},
  {"Hrodna Region": [{'Hrodna Region': 'Гроднейнский район'},{ "Hrodna": "Гродно" }, { "Lida": "Лида" }, { "Slonim": "Слоним" }, { "Vawkavysk": "Волковыск" }, { "Smarhon": "Сморгонь" }, { "Navahrudak": "Новогрудок" }, { "Masty": "Мосты" }, { "Shchuchyn": "Щучин" }, { "Ashmyany": "Ошмяны" }, { "Skidzyel": "Скидель" }, { "Byarozawka": "Берёзовка" }, { "Astravyets": "Островец" }, { "Iwye": "Ивье)" }, { "Dzyatlava": "Дятлово" }, { "Svislach": "Свислочь" }]},
];


export const getAddressName = (fullAddress) => {
  let finalArr = [];
  if (typeof fullAddress === "string") {
    finalArr = fullAddress.split(",");
  }
  return finalArr[4] + ', ' + finalArr[3];
};


export const translateAddressName = (fullAddress) => {
  if (typeof fullAddress !== 'string') {
    return null;
  }

  const addressParts = fullAddress.split(', ');
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

  return translatedRegion && translatedCity ? translatedRegion + ', ' + translatedCity : fullAddress;
}

export const categoryFieldsVerify = ({ theme, category, subcategory, fieldsData }) => {

  const verifyDefaultFields = () => {
    console.log("verify called");
  };

  console.log(category, subcategory);

  if (category === "Автомобили и транспорт") {
    if (subcategory === "Легковые автомобили" || subcategory === "Грузовики и коммерческий транспорт") {
      verifyDefaultFields();
    }
    if (subcategory === "Мотоциклы и скутеры") {
      return (<>
      </>);
    }
    if (subcategory === "Велосипеды") {
      return (<>
      </>);
    }
    if (subcategory === "Яхты и лодки") {
      return (<>
      </>);
    }
    if (subcategory === "Автодома и прицепы") {
      return (<>
      </>);
    }
  }

  if (category === "Недвижимость") {
    if (subcategory === "Квартиры") {
      return (<>
      </>);
    }
    if (subcategory === "Дома и коттеджи") {
      return (<>
      </>);
    }
    if (subcategory === "Коммерческая недвижимость") {
      return (<>
      </>);
    }
    if (subcategory === "Отпускные дома и виллы") {
      return (<>
      </>);
    }
    if (subcategory === "Земельные участки") {
      return (<>
      </>);
    }
  }

  if (category === "Электроника") {
    if (subcategory === "Телефоны и планшеты") {
      return (<>
      </>);
    }
    if (subcategory === "Компьютеры и ноутбуки") {
      return (<>
      </>);
    }
    if (subcategory === "Телевизоры и аудио-видео техника") {
      return (<>
      </>);
    }
    if (subcategory === "Фото- и видеокамеры") {
      return (<>
      </>);
    }
    if (subcategory === "Игровые приставки и аксессуары") {
      return (<>
      </>);
    }
  }

  if (category === "Спорт и отдых") {
    if (subcategory === "Спортивные снаряды и инвентарь") {
      return (<>
      </>);
    }
    if (subcategory === "Велосипеды и аксессуары") {
      return (<>
      </>);
    }
    if (subcategory === "Палатки и снаряжение для кемпинга") {
      return (<>
      </>);
    }
    if (subcategory === "Горнолыжное и сноубордическое снаряжение") {
      return (<>
      </>);
    }
    if (subcategory === "Рыболовные снасти") {
      return (<>
      </>);
    }
  }

  if (category === "Мода и аксессуары") {
    if (subcategory === "Одежда и обувь") {
      return (<>
      </>);
    }
    if (subcategory === "Сумки и аксессуары") {
      return (<>
      </>);
    }
    if (subcategory === "Украшения и часы") {
      return (<>
      </>);
    }
    if (subcategory === "Костюмы и наряды для особых случаев") {
      return (<>
      </>);
    }
    if (subcategory === "Косметика и парфюмерия") {
      return (<>
      </>);
    }
  }

  if (category === "Дом и сад") {
    if (subcategory === "Мебель и интерьер") {
      return (<>
      </>);
    }
    if (subcategory === "Бытовая техника") {
      return (<>
      </>);
    }
    if (subcategory === "Садовый инструмент и оборудование") {
      return (<>
      </>);
    }
    if (subcategory === "Декор и освещение") {
      return (<>
      </>);
    }
    if (subcategory === "Газоны и садовые участки") {
      return (<>
      </>);
    }
  }

};
