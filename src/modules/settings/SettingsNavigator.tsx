import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  SettingsMainScreen,
  SettingsStackParamList,
} from "./screens/SettingsMainScreen";
import { ParametersScreen } from "./screens/ParametersScreen";
import { CategoriesScreen } from "./screens/CategoriesScreen";
import { ReportScreen } from "./screens/ReportScreen";
import { GoalsNavigator } from "../goals/GoalsNavigator";
import { PassiveIncomeNavigator } from "../passiveIncome/PassiveIncomeNavigator";
import { FireCalculatorScreen } from "./screens/FireCalculatorScreen";
import { AchievementsScreen } from "./screens/AchievementsScreen";
import { LevelGuideScreen } from "./screens/LevelGuideScreen";
import { DiagnosisScreen } from "./screens/DiagnosisScreen";
import { DevToolsScreen } from "./screens/DevToolsScreen";
import { COLORS } from "../../theme";

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerShadowVisible: false,
        headerTintColor: COLORS.text,
        headerTitle: "",
        headerBackTitle: "Kembali",
      }}
    >
      <Stack.Screen
        name="SettingsMain"
        component={SettingsMainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ParametersScreen" component={ParametersScreen} />
      <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} />
      <Stack.Screen name="ReportScreen" component={ReportScreen} />
      <Stack.Screen
        name="GoalsNavScreen"
        component={GoalsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PassiveIncomeNavScreen"
        component={PassiveIncomeNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FireCalculatorScreen"
        component={FireCalculatorScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AchievementsScreen"
        component={AchievementsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LevelGuideScreen"
        component={LevelGuideScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="DiagnosisScreen" component={DiagnosisScreen} />
      {__DEV__ && (
        <Stack.Screen name="DevToolsScreen" component={DevToolsScreen} />
      )}
    </Stack.Navigator>
  );
}
