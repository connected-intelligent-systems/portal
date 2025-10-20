window.config = {
  title: "EDC Portal",

  // Optional: Configure custom theme
  // theme: {
  //   light: {
  //     palette: {
  //       primary: { main: "#1976d2" },
  //     },
  //   },
  // },

  // Optional: Public EDC endpoint for Thing Descriptions
  // publicEdcEndpoint: "https://your-edc-endpoint.com",

  // Optional: Configure custom categories with translations
  // If not specified, default categories will be used:
  // IoTData, TimeSeries, APIService, MachineLearning, Geospatial, Stream, Document, Analytics
  categories: [
    {
      id: "IoTData",
      translations: {
        en: "IoT & Sensor Data",
        de: "IoT- & Sensordaten",
      },
    },
    {
      id: "TimeSeries",
      translations: {
        en: "Time Series",
        de: "Zeitreihen",
      },
    },
    {
      id: "APIService",
      translations: {
        en: "API & Services",
        de: "API & Dienste",
      },
    },
    {
      id: "MachineLearning",
      translations: {
        en: "Machine Learning & AI",
        de: "Machine Learning & KI",
      },
    },
    {
      id: "Geospatial",
      translations: {
        en: "Geospatial Data",
        de: "Geodaten",
      },
    },
    {
      id: "Stream",
      translations: {
        en: "Real-time Streams",
        de: "Echtzeit-Datenströme",
      },
    },
    {
      id: "Document",
      translations: {
        en: "Documents & Files",
        de: "Dokumente & Dateien",
      },
    },
    {
      id: "Analytics",
      translations: {
        en: "Analytics & Insights",
        de: "Analysen & Auswertungen",
      },
    },
    // Add your custom categories here:
    // {
    //   id: "Manufacturing",
    //   translations: {
    //     en: "Manufacturing Data",
    //     de: "Fertigungsdaten",
    //   },
    // },
  ],
};
