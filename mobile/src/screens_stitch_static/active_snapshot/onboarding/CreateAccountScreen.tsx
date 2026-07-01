import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StitchWebAction, StitchWebScreen } from "../stitch/StitchWebScreen";
import { useAuth } from "../../context/AuthContext";
import { emailFrom, nameFrom, passwordFrom } from "../stitch/actionFields";

const URI = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2ZjZTNiMzIyOGJhZDQxY2I4ZWEzNmVlMTg1NzI4NzQxEgsSBxDQx-7m9RQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxMjAyODE1MTU5ODUwOTUxNw&filename=&opi=89354086";

export function CreateAccountScreen() {
  const navigation = useNavigation<any>();
  const { register } = useAuth();
  const handleAction = async ({ label, fields }: StitchWebAction) => {
    if (label.includes("Sign in") || label.includes("Log in")) navigation.navigate("Login");
    if (label.includes("Create") || label.includes("Get Started") || label.includes("Continue")) {
      await register({
        email: emailFrom(fields) || "demo@lexloo.app",
        password: passwordFrom(fields) || "password123",
        displayName: nameFrom(fields) || "LexLoo Learner",
        role: "student",
      });
      navigation.navigate("RoleSelection");
    }
  };

  return <StitchWebScreen uri={URI} onAction={handleAction} />;
}
