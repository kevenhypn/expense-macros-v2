import React from "react";
import {
  Modal as RNModal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  ScrollView,
} from "react-native";

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function BottomModal({ visible, onClose, title, children }: ModalProps) {
  return (
    <RNModal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Pressable
          className="flex-1 bg-black/60 justify-end px-4 pb-8"
          onPress={onClose}
        >
          <Pressable
            className="bg-background border border-border rounded-3xl p-5 gap-4"
            onPress={() => {}}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-secondary uppercase tracking-wider font-semibold">
                {title}
              </Text>
              <Pressable onPress={onClose} hitSlop={12}>
                <Text className="text-xs text-secondary">Close</Text>
              </Pressable>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ gap: 16, paddingBottom: 8 }}
              bounces={false}
            >
              {children}
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </RNModal>
  );
}
