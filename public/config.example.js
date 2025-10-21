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

  // Optional: Configure custom media types with translations
  // If not specified, default media types will be used
  mediaTypes: [
    {
      id: "application/json",
      translations: {
        en: "JSON",
        de: "JSON",
      },
    },
    {
      id: "text/csv",
      translations: {
        en: "CSV",
        de: "CSV",
      },
    },
    {
      id: "application/xml",
      translations: {
        en: "XML",
        de: "XML",
      },
    },
    {
      id: "application/parquet",
      translations: {
        en: "Parquet",
        de: "Parquet",
      },
    },
    {
      id: "application/avro",
      translations: {
        en: "Avro",
        de: "Avro",
      },
    },
    {
      id: "application/octet-stream",
      translations: {
        en: "Binary Data",
        de: "Binärdaten",
      },
    },
    {
      id: "text/plain",
      translations: {
        en: "Plain Text",
        de: "Klartext",
      },
    },
    {
      id: "application/pdf",
      translations: {
        en: "PDF",
        de: "PDF",
      },
    },
    {
      id: "image/jpeg",
      translations: {
        en: "JPEG Image",
        de: "JPEG-Bild",
      },
    },
    {
      id: "image/png",
      translations: {
        en: "PNG Image",
        de: "PNG-Bild",
      },
    },
    {
      id: "application/zip",
      translations: {
        en: "ZIP Archive",
        de: "ZIP-Archiv",
      },
    },
    {
      id: "application/protobuf",
      translations: {
        en: "Protocol Buffers",
        de: "Protocol Buffers",
      },
    },
    // Add your custom media types here:
    // {
    //   id: "application/x-custom",
    //   translations: {
    //     en: "Custom Format",
    //     de: "Benutzerdefiniertes Format",
    //   },
    // },
  ],
};
