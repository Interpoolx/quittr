import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/layout';
import { FontSizes, FontWeights } from '../constants/typography';

interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'primary' | 'success';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'primary',
}) => {
    const getButtonColor = () => {
        switch (type) {
            case 'danger': return Colors.danger;
            case 'success': return Colors.success;
            default: return Colors.primary;
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.confirmButton, { backgroundColor: getButtonColor() }]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmButtonText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    modalContent: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    title: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: Colors.dark.textPrimary,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    message: {
        fontSize: FontSizes.base,
        color: Colors.dark.textSecondary,
        marginBottom: Spacing.xl,
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    cancelButton: {
        flex: 1,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    cancelButtonText: {
        color: Colors.dark.textPrimary,
        fontWeight: FontWeights.semibold,
    },
    confirmButton: {
        flex: 2,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontWeight: FontWeights.bold,
    },
});
