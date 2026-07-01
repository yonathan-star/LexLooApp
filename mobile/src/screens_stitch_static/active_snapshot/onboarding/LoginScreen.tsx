import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StitchWebAction, StitchWebScreen } from "../stitch/StitchWebScreen";
import { useAuth } from "../../context/AuthContext";
import { emailFrom, passwordFrom } from "../stitch/actionFields";

const URI = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzYzYWY5ZDc1YmE3NjRlNjRhMDQyYmQzYWI1ZDhkNTE0EgsSBxDQx-7m9RQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxMjAyODE1MTU5ODUwOTUxNw&filename=&opi=89354086";

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login } = useAuth();
  const handleAction = async ({ label, fields }: StitchWebAction) => {
    if (label.includes("Create account")) navigation.navigate("CreateAccount");
    if (label.includes("Get Started")) navigation.navigate("CreateAccount");
    if (label.includes("Sign in") || label.includes("Log in") || label.includes("Continue")) {
      await login(emailFrom(fields) || "demo@lexloo.app", passwordFrom(fields) || "password123");
    }
  };

  return <StitchWebScreen uri={URI} onAction={handleAction} />;
}
