import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StitchWebScreen } from "../stitch/StitchWebScreen";
import { useAuth } from "../../context/AuthContext";

const URI = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzdmMDBmOGY0YjBjNDRkZWM5ODk0ZTFmOTU3NmM5YmNiEgsSBxDQx-7m9RQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxMjAyODE1MTU5ODUwOTUxNw&filename=&opi=89354086";

export function OnboardingCompleteScreen() {
  const navigation = useNavigation<any>();
  const { markOnboarded } = useAuth();
  const handleAction = ({ label }: { label: string }) => {
    if (label.includes("Start") || label.includes("Begin") || label.includes("Continue")) {
      markOnboarded();
      navigation.navigate("Main");
    }
  };

  return <StitchWebScreen uri={URI} onAction={handleAction} />;
}
