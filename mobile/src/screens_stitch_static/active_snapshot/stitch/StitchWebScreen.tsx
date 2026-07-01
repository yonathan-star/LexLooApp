import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { colors } from "../../theme";

interface StitchWebScreenProps {
  uri: string;
  onAction?: (event: StitchWebAction) => void;
}

export interface StitchWebAction {
  label: string;
  fields: Record<string, string>;
}

const injectedClickBridge = `
  (function () {
    function collectFields() {
      var fields = {};
      var inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(function (input, index) {
        var key = input.name || input.id || input.getAttribute('aria-label') || input.placeholder || input.type || ('field_' + index);
        fields[key] = input.value || '';
      });
      return fields;
    }
    document.addEventListener('click', function (event) {
      var target = event.target;
      while (target && target !== document.body && !/^(BUTTON|A)$/i.test(target.tagName)) {
        target = target.parentElement;
      }
      if (target && window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          label: (target.innerText || target.textContent || '').trim(),
          fields: collectFields()
        }));
      }
    }, true);
  })();
  true;
`;

export function StitchWebScreen({ uri, onAction }: StitchWebScreenProps) {
  const navigation = useNavigation<any>();

  function defaultAction({ label }: StitchWebAction) {
    if (!label) return;
    if (label.includes("Home")) navigation.navigate("HomeTab");
    else if (label.includes("Scan")) navigation.navigate("ScannerTab");
    else if (label.includes("Practice")) navigation.navigate("PracticeHub");
    else if (label.includes("Progress")) navigation.navigate("LexWorldTab");
    else if (label.includes("Settings")) navigation.navigate("Settings");
    else if (label.includes("Notifications")) navigation.navigate("NotificationsSettings");
    else if (label.includes("Help")) navigation.navigate("HelpCenter");
    else if (label.includes("Saved")) navigation.navigate("SavedWords");
    else if (label.includes("Achievements") || label.includes("Trophies")) navigation.navigate("Achievements");
    else if (label.includes("History")) navigation.navigate("LearningHistory");
    else if (label.includes("Weekly Report")) navigation.navigate("ParentWeeklyReport");
    else if (label.includes("Switch")) navigation.navigate("SwitchChildProfile");
    else if (label.includes("Add Child")) navigation.navigate("AddChildProfile");
    else if (label.includes("Back")) navigation.goBack();
  }

  return (
    <View style={styles.root}>
      <WebView
        source={{ uri }}
        style={styles.webview}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        injectedJavaScript={injectedClickBridge}
        onMessage={(event) => {
          try {
            const action = JSON.parse(event.nativeEvent.data);
            onAction?.(action);
            defaultAction(action);
          } catch {
            const action = { label: event.nativeEvent.data, fields: {} };
            onAction?.(action);
            defaultAction(action);
          }
        }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  webview: { flex: 1, backgroundColor: colors.background },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
