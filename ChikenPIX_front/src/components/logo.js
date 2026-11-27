import React from 'react';
import { Image } from 'react-native';

export default function Logo({ size = 96 }) {
    return (
        <Image
            source={require('../../assets/images/logo-chiken.png')}
            style={{ width: size, height: size, tintColor: '#00A88F' }}
            resizeMode="contain"
        />
    );
}