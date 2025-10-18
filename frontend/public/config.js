var config = {
  showDevices: false,
  showThingDescriptions: false,
  showQuery: false,
  showCustomers: false,
  showThingsboard : false,
  showKeycloak: false,
  title: "test",
  publicEdcEndpoint: "http://localhost:8080/api/v1/dsp",
  theme: {
    light: {
      palette: {
        primary: { main: "#0043ce" },
        secondary: { main: "#1D49B8" },
        background: { default: "#ffffff" },
        text: {
          primary: "#544f5a",
          secondary: "#89868D"
        }
      },
      logo: {
        sx: {
          height: 40,
          width: 40
        }
      }
    },
    dark: {
      palette: {
        primary: { main: "#9055fd" },
        secondary: { main: "#FF83F6" },
        background: { default: "#110e1c", paper: "#151221" }
      },
      logo: {
        sx: {
          height: 40,
          width: 40
        }
      }
    }
  }
}