import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StitchWebScreen } from "../stitch/StitchWebScreen";

const URI = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzkyNDRjMTM0NmFmNzQyNDVhODA2OTVjMzZlYjBkZjI1EgsSBxDQx-7m9RQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxMjAyODE1MTU5ODUwOTUxNw&filename=&opi=89354086";

export function SentenceBuilderScreen() {
  const navigation = useNavigation<any>();
  const handleAction = ({ label }: { label: string }) => {
    if (label.includes("Done")) navigation.navigate("PracticeResults");
  };

  return <StitchWebScreen uri={URI} onAction={handleAction} />;
}
