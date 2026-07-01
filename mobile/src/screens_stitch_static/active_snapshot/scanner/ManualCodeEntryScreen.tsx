import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StitchWebAction, StitchWebScreen } from "../stitch/StitchWebScreen";
import { useAuth } from "../../context/AuthContext";
import { useScanTile } from "../../api/queries";
import { codeFrom } from "../stitch/actionFields";

const URI = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzIyNjY5ZDNmMjA4MDRjNzJhNjQwOWI1YWNiZTk5YWIxEgsSBxDQx-7m9RQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxMjAyODE1MTU5ODUwOTUxNw&filename=&opi=89354086";

export function ManualCodeEntryScreen() {
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const scanTile = useScanTile();

  const handleAction = async ({ label, fields }: StitchWebAction) => {
    if (label.includes("Back")) navigation.goBack();
    if (label.includes("Submit") || label.includes("Unlock") || label.includes("Continue")) {
      if (!activeProfile) return;
      const result = await scanTile.mutateAsync({
        profileId: activeProfile.id,
        code: codeFrom(fields) || "LEX1001",
        source: "manual",
      });
      if (result.word) navigation.navigate("WordDetail", { wordId: result.word.id });
    }
  };

  return <StitchWebScreen uri={URI} onAction={handleAction} />;
}
