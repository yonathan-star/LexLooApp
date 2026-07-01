import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RoleSelectionScreen } from "../screens/onboarding/RoleSelectionScreen";
import { AgeGradeSelectionScreen } from "../screens/onboarding/AgeGradeSelectionScreen";
import { LearningGoalSelectionScreen } from "../screens/onboarding/LearningGoalSelectionScreen";
import { ReminderSetupScreen } from "../screens/onboarding/ReminderSetupScreen";
import { OnboardingCompleteScreen } from "../screens/onboarding/OnboardingCompleteScreen";

const Stack = createNativeStackNavigator();

export function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="AgeGradeSelection" component={AgeGradeSelectionScreen} />
      <Stack.Screen name="LearningGoalSelection" component={LearningGoalSelectionScreen} />
      <Stack.Screen name="ReminderSetup" component={ReminderSetupScreen} />
      <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />
    </Stack.Navigator>
  );
}
