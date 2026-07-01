import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StitchWebScreen } from "../stitch/StitchWebScreen";

const URI = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2I3ODdlYWI5YjQ3NDQ4MDFhN2Y4YjQ4NzRjMWMzZDNkEgsSBxDQx-7m9RQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxMjAyODE1MTU5ODUwOTUxNw&filename=&opi=89354086";

export function PracticeSessionScreen() {
  const navigation = useNavigation<any>();
  const handleAction = ({ label }: { label: string }) => {
    if (label.includes("Finish")) navigation.navigate("PracticeResults");
    if (label.includes("Done")) navigation.navigate("PracticeResults");
  };

  return <StitchWebScreen uri={URI} onAction={handleAction} />;
}
