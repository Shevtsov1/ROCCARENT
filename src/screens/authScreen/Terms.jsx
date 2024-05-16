import React, { useState } from "react";
import { View, Text, Modal, Button, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Icon } from "@rneui/base";

const Terms = ({ theme, isVisible, onClose, handleConfirm, isChecked }) => {
  const [isScrollAtBottom, setIsScrollAtBottom] = useState(isChecked);

  const handleAccept = () => {
    handleConfirm();
    onClose();
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20; // Adjust the threshold as needed
    setIsScrollAtBottom(isAtBottom);
  };


  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      padding: 20,
      borderRadius: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme.colors.text,
    },
    text: {
      marginBottom: 20,
      color: theme.colors.text,
      fontSize: 18,
    },
    closeButton: {
      position: "absolute",
      top: hp(0.5),
      right: wp(0.5),
      height: 72,
      width: 72,
      justifyContent: "center",
      alignItems: "center",
    },closeImage: {
      width: 30, height: 30, tintColor: theme.colors.text,
    },
  });

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Пользовательское соглашение RoccaRent</Text>
          <TouchableOpacity onPress={() => onClose()} style={styles.closeButton}>
            <Icon size={24} color={theme.colors.text} type={'ionicon'} name={'close'}/>
          </TouchableOpacity>
          <ScrollView
            style={{ maxHeight: "100" }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <Text style={styles.text}>
              <Text style={styles.text}>
                Добро пожаловать в RoccaRent! Пожалуйста, ознакомьтесь с нашим пользовательским соглашением перед
                использованием нашего мобильного приложения и сайта. Ваше использование RoccaRent подразумевает ваше
                согласие с нижеследующими условиями:

                {"\n\n"}

                1. Принятие условий использования:{"\n"}
                1.1. При использовании нашего мобильного приложения и сайта RoccaRent, вы соглашаетесь с настоящими
                условиями использования.{"\n"}
                1.2. Если вы не согласны с каким-либо условием, пожалуйста, прекратите использование RoccaRent.{"\n"}

                {"\n\n"}

                2. Описание услуг:{"\n"}
                2.1. RoccaRent предоставляет платформу, где пользователи могут предлагать и арендовать вещи друг у
                друга.{"\n"}
                2.2. Мы не являемся владельцами арендуемых вещей, а только обеспечиваем платформу для связи между
                пользователями.{"\n"}

                {"\n\n"}

                3. Регистрация и аккаунт:{"\n"}
                3.1. Для использования RoccaRent вы должны создать учетную запись.{"\n"}
                3.2. При регистрации вы обязуетесь предоставить достоверную информацию о себе.{"\n"}
                3.3. Вы несете ответственность за безопасность вашей учетной записи и пароля.{"\n"}
                3.4. Вы несете ответственность за все действия, совершенные с использованием вашей учетной записи.{"\n"}

                {"\n\n"}

                4. Правила использования:{"\n"}
                4.1. Вы обязуетесь использовать RoccaRent только в законных целях и соблюдать все применимые законы и
                правила.{"\n"}
                4.2. Вы обязуетесь не использовать RoccaRent для распространения незаконного, вредоносного,
                оскорбительного или непристойного контента.{"\n"}
                4.3. Вы обязуетесь не нарушать права других пользователей RoccaRent.{"\n"}

                {"\n\n"}

                5. Объявления и аренда:{"\n"}
                5.1. Пользователи могут размещать объявления о вещах, доступных для аренды.{"\n"}
                5.2. Пользователи могут арендовать вещи, размещенные другими пользователями.{"\n"}
                5.3. RoccaRent не несет ответственности за состояние арендуемых вещей или за саму аренду.{"\n"}

                {"\n\n"}

                6. Отмена и возврат:{"\n"}
                6.1. Пользователи могут отменить аренду в соответствии с правилами, установленными в каждом
                объявлении.{"\n"}
                6.2. Возврат средств при отмене аренды определяется в соответствии с политикой RoccaRent.{"\n"}

                {"\n\n"}

                7. Ответственность и ограничение ответственности:{"\n"}
                7.1. RoccaRent не несет ответственности за любой ущерб, понесенный пользователями в результате
                использования платформы.{"\n"}
                7.2. RoccaRent не несет ответственности за действия пользователей на платформе.{"\n"}
                7.3. RoccaRent не гарантирует точность, надежность и доступность платформы.{"\n"}

                {"\n\n"}

                8. Интеллектуальная собственность:{"\n"}
                8.1. RoccaRent является владельцем прав на интеллектуальную собственность, связанную с платформой.{"\n"}
                8.2. Пользователи несут ответственность за контент, который они размещают на RoccaRent, и предоставляют
                RoccaRent неисключительную лицензию на использование этого контента.{"\n"}

                {"\n\n"}

                9. Изменения в условиях использования:{"\n"}
                9.1. RoccaRent оставляет за собой право в любое время изменять настоящие условия использования.{"\n"}
                9.2. Изменения вступают в силу с момента их публикации на RoccaRent.{"\n"}
                9.3. Ваше продолжение использования RoccaRent после внесения изменений означает ваше согласие с
                измененными условиями.{"\n"}

                {"\n\n"}

                10. Прекращение использования:{"\n"}
                10.1. Вы можете прекратить использование RoccaRent в любое время.{"\n"}
                10.2. RoccaRent может прекратить вашу учетную запись или доступ к платформе в случае нарушения вами
                настоящих условий использования.{"\n"}

                {"\n\n"}

                11. Заключительные положения:{"\n"}
                11.1. Настоящее пользовательское соглашение регулируется законами, применимыми на территории, где
                предоставляется RoccaRent.{"\n"}
                11.2. Любые споры, связанные с настоящим пользовательским соглашением или использованием RoccaRent,
                подлежат разрешению в компетентных судах.{"\n"}

                {"\n\n"}

                Спасибо за ознакомление с нашим пользовательским соглашением. Мы надеемся, что ваше использование
                RoccaRent будет приятным и полезным. Если у вас есть вопросы или требуется дополнительная информация,
                пожалуйста, свяжитесь с нами (roccarent.help@gmail.com).
              </Text>
            </Text>
          </ScrollView>
          <Button
            title="Принять"
            onPress={handleAccept}
            color={theme.colors.accent}
            disabled={!isScrollAtBottom}
          />
        </View>
      </View>
    </Modal>
  );
};

export default Terms;
