import React from 'react';

import {
  Modal,
  View,
  Text,
  Pressable,
} from 'react-native';

import { S } from '../styles/allStyles';
import { C } from '../constants/colors';

export default function ConfirmModal({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View
        style={S.modalOverlay}
      >
        <View
          style={S.modalCard}
        >
          <Text
            style={S.modalTitle}
          >
            {title}
          </Text>

          <Text
            style={S.modalText}
          >
            {message}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              marginTop: 24,
            }}
          >
            <Pressable
              style={S.modalButton}
              onPress={onCancel}
            >
              <Text
                style={{
                  color: '#fff',
                }}
              >
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={[
                S.modalButton,
                {
                  backgroundColor:
                    '#701020',
                },
              ]}
              onPress={onConfirm}
            >
              <Text
                style={{
                  color: '#fff',
                }}
              >
                Reset
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}