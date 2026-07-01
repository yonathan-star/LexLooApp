import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StitchWebScreen } from "../stitch/StitchWebScreen";

const URI = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2MzNmQxYmJmOWUyMTRmODA4MjhiOTE3ODE1ZTVhYmUxEgsSBxDQx-7m9RQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxMjAyODE1MTU5ODUwOTUxNw&filename=&opi=89354086";

export function ReminderSetupScreen() {
  const navigation = useNavigation<any>();
  const handleAction = ({ label }: { label: string }) => {
    if (label.includes("Continue")) navigation.navigate("OnboardingComplete");
    if (label.includes("Skip")) navigation.navigate("OnboardingComplete");
  };

  return <StitchWebScreen uri={URI} onAction={handleAction} />;
}
