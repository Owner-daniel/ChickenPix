import React from 'react';
import { Stack } from 'expo-router';
import { SessaoProvider } from '../src/context/SessaoContext';

export default function RootLayout() {
    return (
        <SessaoProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </SessaoProvider>
    );
}