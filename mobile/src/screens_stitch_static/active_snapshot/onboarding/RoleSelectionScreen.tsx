import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StitchWebScreen } from "../stitch/StitchWebScreen";

const URI = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzYzNjAwNGEwMzVmNTQ1NTdhNjU1OTU5ZTgxNTA3NjA4EgsSBxDQx-7m9RQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxMjAyODE1MTU5ODUwOTUxNw&filename=&opi=89354086";

export function RoleSelectionScreen() {
  const navigation = useNavigation<any>();
  const handleAction = ({ label }: { label: string }) => {
    if (label.includes("Continue")) navigation.navigate("AgeGradeSelection");
  };

  return <StitchWebScreen uri={URI} onAction={handleAction} />;
}
