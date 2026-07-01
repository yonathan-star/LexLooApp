import React from "react";
import { StitchWebScreen } from "../stitch/StitchWebScreen";

const URI = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2QxNmU4NTZkNWJjYzQ0Y2U5MzkwNjU5Yzc2ZDhkYjFiEgsSBxDQx-7m9RQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxMjAyODE1MTU5ODUwOTUxNw&filename=&opi=89354086";

export function EditProfileScreen() {
  return <StitchWebScreen uri={URI} />;
}
