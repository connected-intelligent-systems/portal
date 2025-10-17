import {
  Admin,
  Resource,
  CustomRoutes,
  Layout,
  Menu,
  AppBar,
} from "react-admin";
import { Route } from "react-router-dom";
import Container from "@mui/material/Container";
import PolicyIcon from "@mui/icons-material/Policy";
import GavelIcon from "@mui/icons-material/Gavel";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import InventoryIcon from "@mui/icons-material/Inventory";
import HandshakeIcon from "@mui/icons-material/Handshake";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import dataProvider from "./dataProvider";
import { i18nProvider } from "./i18n";
import { AssetCreate, AssetEdit, AssetShow, AssetsList } from "./pages/assets";
import {
  PoliciesList,
  PolicyCreate,
  PolicyShow,
  PolicyEdit,
} from "./pages/policies";
import {
  ContractDefinitionCreate,
  ContractDefinitionShow,
  ContractDefinitionsList,
  ContractDefinitionEdit,
} from "./pages/contract_definitions";
import {
  CatalogList,
  CatalogShow,
  CatalogCreate,
  CatalogEdit,
} from "./pages/catalogs";
import contractnegotiations from "./pages/contract_negotiations";
import contractagreements from "./pages/contract_agreements";
import transferprocesses from "./pages/transfer_processes";
import { DataRequestShow } from "./pages/datarequests";
import { DatasetShow } from "./pages/datasets";
import { darkTheme, getThemeLogo, theme } from "./theme";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";

const CustomAppBar = () => {
  const theme = useTheme();
  const paletteMode = theme.palette.mode === "dark" ? "dark" : "light";
  const logoConfig =
    getThemeLogo(paletteMode) || getThemeLogo("light") || undefined;

  return (
    <AppBar>
      <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          component={logoConfig?.src ? "img" : "div"}
          src={logoConfig?.src}
          alt={logoConfig?.alt || window.config.title || "Portal logo"}
          sx={{
            height: 40,
            width: 40,
            objectFit: "contain",
            ...logoConfig?.sx,
          }}
        />
        {window.config.title && (
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            {window.config.title}
          </Typography>
        )}
        <Box sx={{ flexGrow: window.config.title ? 0 : 1 }} />
      </Toolbar>
      <span style={{ flexGrow: 1 }} />
    </AppBar>
  );
};

const CustomMenu = () => {
  return (
    <Menu dense={false} sx={{ pt: 1 }}>
      <Menu.ResourceItem name="assets" />
      <Menu.ResourceItem name="policies" />
      <Menu.ResourceItem name="contractdefinitions" />
      <Menu.ResourceItem name="catalogs" />
      <Menu.ResourceItem name="contractnegotiations" />
      <Menu.ResourceItem name="contractagreements" />
      <Menu.ResourceItem name="transferprocesses" />
    </Menu>
  );
};

const CustomLayout = (props: any) => {
  return (
    <Layout menu={CustomMenu} appBar={CustomAppBar} sx={{ pt: 2 }}>
      <Container maxWidth="lg">{props.children}</Container>
    </Layout>
  );
};

// Redirect component for dataset show - redirects to nested route
const DatasetShowRedirect = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      // Split composite ID: catalogId--datasetId
      const [catalogId, datasetId] = id.split("--");
      if (catalogId && datasetId) {
        navigate(`/catalogs/${catalogId}/datasets/${datasetId}/show`, {
          replace: true,
        });
      }
    }
  }, [id, navigate]);

  return null;
};

export const App = () => (
  <Admin
    loginPage={false}
    layout={CustomLayout}
    dataProvider={dataProvider}
    i18nProvider={i18nProvider}
    theme={theme}
    darkTheme={darkTheme}
    disableTelemetry={true}
  >
    <CustomRoutes>
      <Route
        path="/contractnegotiations/:id/terminate"
        element={<contractnegotiations.terminate />}
      />
      <Route
        path="/transferprocesses/:id/terminate"
        element={<transferprocesses.terminate />}
      />
      <Route
        path="/catalogs/:catalogId/datasets/:datasetId/show"
        element={<DatasetShow />}
      />
    </CustomRoutes>
    <Resource
      name="assets"
      options={{ label: "Assets" }}
      icon={InventoryIcon}
      list={AssetsList}
      show={AssetShow}
      create={AssetCreate}
      edit={AssetEdit}
    />
    <Resource
      name="policies"
      options={{ label: "Policies" }}
      icon={PolicyIcon}
      list={PoliciesList}
      show={PolicyShow}
      create={PolicyCreate}
      edit={PolicyEdit}
    />
    <Resource
      name="contractdefinitions"
      options={{ label: "Contract Definitions" }}
      icon={GavelIcon}
      list={ContractDefinitionsList}
      show={ContractDefinitionShow}
      create={ContractDefinitionCreate}
      edit={ContractDefinitionEdit}
    />
    <Resource
      name="contractnegotiations"
      options={{ label: "Contract Negotiations" }}
      icon={HandshakeIcon}
      list={contractnegotiations.list}
      show={contractnegotiations.show}
      create={contractnegotiations.create}
    />
    <Resource
      name="contractagreements"
      options={{ label: "Contract Agreements" }}
      icon={AssignmentTurnedInIcon}
      list={contractagreements.list}
      show={contractagreements.show}
    />
    <Resource
      name="transferprocesses"
      icon={AutoModeIcon}
      options={{ label: "Transfer Processes" }}
      list={transferprocesses.list}
      show={transferprocesses.show}
      create={transferprocesses.create}
    />
    <Resource
      name="datarequests"
      options={{ label: "Data Requests" }}
      show={DataRequestShow}
    />
    <Resource
      name="catalogs"
      options={{ label: "Catalogs" }}
      icon={AutoStoriesIcon}
      list={CatalogList}
      show={CatalogShow}
      create={CatalogCreate}
      edit={CatalogEdit}
    />
    <Resource name="datasets" show={DatasetShowRedirect} />
    <Resource name="contractagreementnegotiation" />
  </Admin>
);
