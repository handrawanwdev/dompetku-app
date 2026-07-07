import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProviders } from './src/app/AppProviders';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <AppProviders />
    </>
  );
}
