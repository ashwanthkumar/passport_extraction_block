import {
  Box,
  Text,
  Link,
  FormField,
  Input,
  useViewport,
  useGlobalConfig,
  Heading,
  Button,
  Icon,
  Loader,
  useSettingsButton,
} from "@airtable/blocks/ui";
import React, { useState } from "react";
import { NANONETS_API_KEY, NANONETS_MODEL_ID } from "./settings";
import { AppStates } from "./index";
import { useSettings } from "./settings";

export function Welcome({ appData, setAppData, onShowSettings }) {
  const globalConfig = useGlobalConfig();
  const apiKeyExists = globalConfig.get(NANONETS_API_KEY) as string;
  const modelIdExists = globalConfig.get(NANONETS_MODEL_ID) as string;
  const [apiKey, setApiKey] = useState(apiKeyExists || "");
  const [modelId, setModelId] = useState(modelIdExists || "");
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const viewport = useViewport();
  const saveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    globalConfig.setAsync(NANONETS_API_KEY, apiKey);
    globalConfig.setAsync(NANONETS_MODEL_ID, modelId);
    setAppData({ appState: AppStates.PASSPORT_EXTRACTION });
    // onShowSettings(false);
    // setIsSettingsVisible(false);
  };
  useSettingsButton(() => {
    viewport.enterFullscreenIfPossible();
  });

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      border="default"
      flexDirection="column"
      width={viewport.size.width}
      height={viewport.size.height}
      padding={0}
    >
      <Box maxWidth="650px">
        <Box marginBottom="15px">
          <Heading size="xlarge">Passport Extraction</Heading>
          <Text size="large" marginBottom="10px" textAlign="justify">
            This block uses models that are built in nanonets. You can setup an
            account in nanonets and add the Passport OCR model to get started.
            Provide below the api key and the id of the model you want to use.
          </Text>
          <Box marginBottom="25px">
            <Link href="https://nanonets.com" target="_blank" icon="hyperlink">
              Nanonets
            </Link>
          </Box>
          <Box>
            <Heading size="large">Nanonets API Settings</Heading>
          </Box>
        </Box>

        <form onSubmit={saveSettings}>
          <Box>
            <FormField label="Nanonets API Key">
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </FormField>
            <FormField label="Nanonets Model Id">
              <Input
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
              />
            </FormField>
          </Box>

          <Box>
            {errorMessage !== "" && (
              <Text paddingBottom="5px" textColor="red">
                Note: {errorMessage}
              </Text>
            )}
            <Button
              icon={(isLoading && <Loader />) || <Icon name="settings" />}
              variant="primary"
              disabled={
                !apiKey ||
                apiKey === "" ||
                !modelId ||
                modelId === "" ||
                isLoading
              }
              onClick={saveSettings}
            >
              Done
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
