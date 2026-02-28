import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import {
  LayerManager,
  PrismConfig,
  PrismWebGlobalStyles,
  Theming,
} from "@doordash/prism-react";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrismWebGlobalStyles fontsToAdd={["Legacy", "WoltMerchant", "DeliverooMerchant"]} />
    <PrismConfig>
      <Theming>
        <LayerManager>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LayerManager>
      </Theming>
    </PrismConfig>
  </StrictMode>
);
