import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function TileNotOwnedScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const tileCode = route.params?.tileCode as string | undefined;

  return (
    <LuminousNativeScreen
      eyebrow="Tile"
      title="Tile Not Unlocked"
      subtitle={
        tileCode
          ? `Tile ${tileCode} is a LexLoo tile, but it is not linked to a word in your library yet.`
          : "This tile is not linked to your library yet. For MVP testing, you can enter a code manually or browse available packs."
      }
      medallion="◇"
      rows={[
        { label: "Tile code", value: tileCode ?? "Needs setup", accent: "blue" },
        { label: "Pack library", value: "Available", accent: "orange" },
      ]}
      primaryLabel="Enter Code"
      secondaryLabel="Browse Packs"
      onPrimary={() => navigation.navigate("ManualCodeEntry")}
      onSecondary={() => navigation.navigate("PackLibrary")}
    />
  );
}
