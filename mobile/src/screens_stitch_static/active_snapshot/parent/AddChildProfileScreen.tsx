import React from "react";
import { StitchWebScreen } from "../stitch/StitchWebScreen";

const URI = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2VkZGZhYjQ2NjFmZjQ5MzJiMzU5ZTliOTViNTNkYmZjEgsSBxDQx-7m9RQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxMjAyODE1MTU5ODUwOTUxNw&filename=&opi=89354086";

export function AddChildProfileScreen() {
  return <StitchWebScreen uri={URI} />;
}
