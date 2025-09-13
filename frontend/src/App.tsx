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
import WebStoriesIcon from "@mui/icons-material/WebStories";
import InventoryIcon from "@mui/icons-material/Inventory";
import HandshakeIcon from "@mui/icons-material/Handshake";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Toolbar from "@mui/material/Toolbar";
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
import { Catalog } from "./pages/catalog";
import contractnegotiations from "./pages/contract_negotiations";
import contractagreements from "./pages/contract_agreements";
import transferprocesses from "./pages/transfer_processes";
import { DataRequestShow } from "./pages/datarequests";
import {
  DataConsumerPullShow,
  RawDataDownloadShow,
} from "./pages/data_consumer_pull";
import { darkTheme, theme } from "./theme";

const CustomAppBar = () => (
  <AppBar>
    <Toolbar />
    <span style={{ flex: 1 }} />
  </AppBar>
);

const CustomMenu = () => {
  return (
    <Menu dense={false} sx={{ pt: 1 }}>
      {window.config.showAssets && <Menu.ResourceItem name="assets" />}
      {window.config.showPolicies && <Menu.ResourceItem name="policies" />}
      {window.config.showContractDefinitions && (
        <Menu.ResourceItem name="contractdefinitions" />
      )}
      {window.config.showCatalog && (
        <Menu.Item
          to="/catalog"
          primaryText="Catalog"
          leftIcon={<AutoStoriesIcon />}
        />
      )}
      {window.config.showContractAgreements && (
        <Menu.ResourceItem name="contractagreements" />
      )}
      {window.config.showTransferProcesses && (
        <Menu.ResourceItem name="transferprocesses" />
      )}
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
      {window.config.showCatalog && (
        <Route path="/catalog" element={<Catalog />} />
      )}
      <Route
        path="/contractnegotiations/:id/terminate"
        element={<contractnegotiations.terminate />}
      />
      <Route
        path="/transferprocesses/:id/terminate"
        element={<transferprocesses.terminate />}
      />
    </CustomRoutes>
    {window.config.showAssets && (
      <Resource
        name="assets"
        options={{ label: "Assets" }}
        icon={InventoryIcon}
        list={AssetsList}
        show={AssetShow}
        create={AssetCreate}
        edit={AssetEdit}
      />
    )}
    {window.config.showPolicies && (
      <Resource
        name="policies"
        options={{ label: "Policies" }}
        icon={PolicyIcon}
        list={PoliciesList}
        show={PolicyShow}
        create={PolicyCreate}
        edit={PolicyEdit}
      />
    )}
    {window.config.showContractDefinitions && (
      <Resource
        name="contractdefinitions"
        options={{ label: "Contract Definitions" }}
        icon={GavelIcon}
        list={ContractDefinitionsList}
        show={ContractDefinitionShow}
        create={ContractDefinitionCreate}
        edit={ContractDefinitionEdit}
      />
    )}
    <Resource
      name="contractnegotiations"
      options={{ label: "Contract Negotiations" }}
      icon={HandshakeIcon}
      list={contractnegotiations.list}
      show={contractnegotiations.show}
      create={contractnegotiations.create}
    />
    {window.config.showContractAgreements && (
      <Resource
        name="contractagreements"
        options={{ label: "Contract Agreements" }}
        icon={AssignmentTurnedInIcon}
        list={contractagreements.list}
        show={contractagreements.show}
      />
    )}
    {window.config.showTransferProcesses && (
      <Resource
        name="transferprocesses"
        icon={AutoModeIcon}
        options={{ label: "Transfer Processes" }}
        list={transferprocesses.list}
        show={transferprocesses.show}
        create={transferprocesses.create}
      />
    )}
    <Resource
      name="datarequests"
      options={{ label: "Data Requests" }}
      show={DataRequestShow}
    />
    <Resource
      name="dataconsumerpull"
      options={{ label: "Data Consumer Pull" }}
      show={DataConsumerPullShow}
    />
    <Resource
      name="rawdataconsumerpull"
      options={{ label: "Data Download" }}
      show={RawDataDownloadShow}
    ></Resource>
  </Admin>
);
