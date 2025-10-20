import { TranslationMessages } from "ra-core";
import { getCategoryTranslations } from "../utils/categories";

const germanMessages: Partial<TranslationMessages> = {
  resources: {
    contractdefinitions: {
      name: "Vertragsdefinition |||| Vertragsdefinitionen",
    },
    catalogs: {
      name: "Katalog |||| Kataloge",
    },
    contractagreements: {
      name: "Vertragsvereinbarung |||| Vertragsvereinbarungen",
      fields: {
        id: "ID",
        assetId: "Asset-ID",
        consumerId: "Konsumenten-ID",
        providerId: "Anbieter-ID",
        contractSigningDate: "Vertragsunterzeichnung",
        policyType: "Richtlinientyp",
        policyTarget: "Richtlinienziel",
        dataset: "Datensatz",
        asset: "Asset",
      },
      filters: {
        consumerId: "Konsumenten-ID",
        providerId: "Anbieter-ID",
      },
      sections: {
        policy: "Richtlinie",
      },
      actions: {
        transferDataset: "Datensatz übertragen",
      },
      messages: {
        loading: "Lädt...",
      },
    },
    assets: {
      name: "Asset |||| Assets",
      fields: {
        id: "ID",
        title: "Titel",
        category: "Kategorie",
        mediaType: "Medientyp",
        keywords: "Schlüsselwörter",
        dataAddressType: "Datenadressentyp",
        description: "Beschreibung",
        version: "Version",
        versioning: "Versionierung",
        creator: "Ersteller",
        created: "Erstellt",
        modified: "Geändert",
        contentType: "Inhaltstyp",
        byteSize: "Größe (Bytes)",
      },
      tabs: {
        basicInfo: "Grundinformationen",
        detailedDescription: "Detaillierte Beschreibung",
        versioning: "Versionierung",
        provenance: "Herkunft",
        dataPrivacy: "Datenschutz",
        dataQuality: "Datenqualität",
        dataAddress: "Datenadresse",
        thingDescription: "Thing Description",
        thingDescriptionTab: {
          noDescription: "Keine Thing Description verfügbar",
        },
        serviceInformationTab: {
          description:
            "Technische Serviceinformationen und Endpunkt-Details für den Zugriff auf diesen Datensatz.",
          format: "Format",
          endpointUrl: "Endpunkt-URL",
          serviceType: "Service-Typ",
          endpointDescription: "Endpunkt-Beschreibung",
          distribution: "Distribution",
          noDistributionInformation:
            "Keine Distributionsinformationen verfügbar",
        },
        basicInformation: {
          shortDescription: "Kurzbeschreibung",
          noShortDescription: "Keine Kurzbeschreibung verfügbar",
          keywords: "Schlüsselwörter",
          noKeywords: "Keine Schlüsselwörter verfügbar",
          category: "Kategorie",
          mediaType: "Medientyp",
        },
        versioningTab: {
          description:
            "Verfolgen Sie die Versionshistorie und Metadaten für dieses Asset.",
          version: "Version",
          creator: "Ersteller",
          created: "Erstellt",
          modified: "Geändert",
          previousVersions: "Vorherige Versionen",
          noPreviousVersions: "Keine vorherigen Versionen",
          versionLabel: "Version:",
          issuedLabel: "Ausgestellt:",
        },
        provenanceTab: {
          description:
            "Informationen über den Ursprung und die Geschichte dieses Assets.",
          shortDescription:
            "Informationen über den Ursprung und die Geschichte dieses Assets.",
          wasDerivedFrom: "Abgeleitet von",
          noSourceEntity: "Keine Quell-Entität angegeben",
          wasGeneratedBy: "Erzeugt durch",
          noActivityDescription: "Keine Aktivitätsbeschreibung bereitgestellt",
          wasAttributedTo: "Zugeschrieben an",
          noAgent: "Kein Agent angegeben",
        },
        dataPrivacyTab: {
          description:
            "Informationen über die Verarbeitung personenbezogener Daten.",
          shortDescription:
            "Datenschutz und rechtliche Informationen zur Verarbeitung personenbezogener Daten.",
          personalDataHandling: "Verarbeitung personenbezogener Daten",
          noPersonalDataHandling:
            "Keine Verarbeitung personenbezogener Daten angegeben",
          personalDataType: "Art personenbezogener Daten",
          purpose: "Zweck",
          legalBasis: "Rechtsgrundlage",
          applicableLaw: "Anwendbares Recht",
        },
        dataQualityTab: {
          description: "Qualitätsmessungen und Bewertungen für dieses Asset.",
          shortDescription:
            "Qualitätsmessungen und Bewertungen für dieses Asset.",
          qualityMeasurements: "Qualitätsmessungen",
          noQualityMeasurements: "Keine Qualitätsmessungen angegeben",
          measurement: "Messung",
          value: "Wert",
          measurementDescription: "Beschreibung",
        },
        dataAddressTab: {
          description:
            "Konfiguration für den Zugriff auf die Daten dieses Assets.",
          dataAddressType: "Datenadressentyp",
          httpConfiguration: "HTTP-Konfiguration",
          s3Configuration: "Amazon S3-Konfiguration",
          baseUrl: "Basis-URL",
          acceptHeader: "Accept-Header",
          proxyPath: "Proxy-Pfad",
          proxyQueryParams: "Proxy-Abfrageparameter",
          proxyBody: "Proxy-Body",
          proxyMethod: "Proxy-Methode",
          authorizationHeader: "Autorisierungsheader",
          region: "Region",
          endpointOverride: "Endpoint-Override",
          bucketName: "Bucket-Name",
          objectName: "Objekt-Name",
          objectPrefix: "Objekt-Präfix",
          accessKeyId: "Access Key ID",
          secretAccessKey: "Secret Access Key",
          yes: "Ja",
          no: "Nein",
        },
      },
      messages: {
        noDescription: "Keine detaillierte Beschreibung verfügbar",
        assetCreated: "Asset erfolgreich erstellt",
        assetCreationFailed: "Asset-Erstellung fehlgeschlagen",
        assetUpdated: "Asset erfolgreich aktualisiert",
        assetUpdateFailed: "Asset-Aktualisierung fehlgeschlagen",
        somethingWentWrong: "Etwas ist schief gelaufen",
        unexpectedError: "Ein unerwarteter Fehler ist aufgetreten",
      },
      create: {
        steps: {
          basicInformation: "Grundinformationen",
          dataAddress: "Datenadresse",
          optionalFeatures: "Optionale Funktionen",
          versioning: "Versionierung",
          detailedDescription: "Detaillierte Beschreibung",
          provenance: "Herkunft",
          dataPrivacy: "Datenschutz",
          dataQuality: "Datenqualität",
        },
        tabs: {
          versioning: "Versionierung",
          detailedDescription: "Detaillierte Beschreibung",
          provenance: "Herkunft",
          dataPrivacy: "Datenschutz",
          dataQuality: "Datenqualität",
          thingDescription: "Thing Description",
        },
        buttons: {
          back: "Zurück",
          next: "Weiter",
          addOptionalFeatures: "Optionale Funktionen hinzufügen",
          createAsset: "Asset erstellen",
          save: "Speichern",
        },
        chips: {
          required: "erforderlich",
          optional: "optional",
        },
        basicInformation: {
          title: "Grundinformationen",
          fields: {
            title: "Titel",
            titleHelper:
              'Ein Name für den Datensatz. Z.B. "Wetterbeobachtungsdatensatz"',
            shortDescription: "Kurzbeschreibung",
            shortDescriptionHelper:
              "Eine kurze Zusammenfassung des Datensatzes (max. 255 Zeichen). Dies wird in Kataloglisten angezeigt.",
            shortDescriptionValidation:
              "Kurzbeschreibung darf maximal 255 Zeichen lang sein",
            keywords: "Schlüsselwörter",
            keyword: "Schlüsselwort",
            keywordHelper:
              'Ein Schlüsselwort oder Tag, das den Datensatz beschreibt. Z.B. "Wetter", "Temperatur"',
            category: "Kategorie",
            categoryHelper: "Eine Hauptkategorie des Datensatzes.",
            mediaType: "Medientyp",
            mediaTypeHelper: "Der Medientyp der Datensatzverteilung.",
          },
          categories: getCategoryTranslations("de"),
          mediaTypes: {
            csv: "CSV",
            json: "JSON",
            xml: "XML",
            yaml: "YAML",
            parquet: "Parquet",
            hdf5: "HDF5",
            avro: "Avro",
            orc: "ORC",
          },
        },
        dataAddress: {
          title: "Datenadresse",
          description:
            "Konfigurieren Sie die Datenadresse für den Zugriff auf dieses Asset.",
          dataAddressType: "Datenadressentyp",
          httpConfiguration: "HTTP-Konfiguration",
          s3Configuration: "Amazon S3-Konfiguration",
          fields: {
            authorizationHeader: "Autorisierungsheader",
            authorizationHeaderHelper:
              "Der Autorisierungsheader für die Datenadresse.",
            baseUrl: "Basis-URL",
            baseUrlHelper:
              "Die Basis-URL der Datenadresse z.B. http://example.com/api/v1/",
            acceptHeader: "Accept-Header",
            acceptHeaderHelper:
              "Der Accept-Header der Datenadresse z.B. application/json",
            proxyPath: "Proxy-Pfad",
            proxyPathHelper: "Ermöglicht die Angabe zusätzlicher Pfadsegmente.",
            proxyQueryParams: "Proxy-Abfrageparameter",
            proxyQueryParamsHelper:
              "Ermöglicht die Angabe von Abfrageparametern.",
            proxyBody: "Proxy-Body",
            proxyBodyHelper: "Ermöglicht das Anhängen eines Body.",
            proxyMethod: "Proxy-Methode",
            proxyMethodHelper:
              "Ermöglicht die Angabe der HTTP-Methode (Standard `GET`)",
            region: "Region",
            regionHelper: "Die Region des S3-Buckets.",
            endpointOverride: "Endpoint-Override",
            endpointOverrideHelper: "Der Endpoint-Override des S3-Buckets.",
            bucketName: "Bucket-Name",
            bucketNameHelper: "Der Name des S3-Buckets.",
            objectName: "Objektname",
            objectNameHelper: "Der Name des S3-Objekts.",
            objectPrefix: "Objektpräfix",
            objectPrefixHelper: "Das Präfix des S3-Objekts.",
            accessKeyId: "Access Key ID",
            accessKeyIdHelper: "Die Access Key ID des S3-Buckets.",
            secretAccessKey: "Secret Access Key",
            secretAccessKeyHelper: "Der Secret Access Key des S3-Buckets.",
          },
          dataTypes: {
            http: "HTTP",
            s3: "Amazon S3",
          },
        },
        versioning: {
          title: "Versionierung",
          description:
            "Verfolgen Sie die Versionshistorie und Metadaten für dieses Asset.",
          fields: {
            version: "Version",
            versionHelper: "Die Version des Datensatzes.",
            creator: "Ersteller",
            creatorHelper:
              "Eine Entität, die hauptsächlich für die Erstellung des Datensatzes verantwortlich ist.",
            created: "Erstellt",
            createdHelper: "Das Erstellungsdatum des Datensatzes.",
            modified: "Geändert",
            modifiedHelper: "Das Datum der letzten Änderung des Datensatzes.",
            previousVersions: "Vorherige Versionen",
            previousVersion: "Version",
            previousVersionHelper:
              "Die Versionsnummer einer vorherigen Version.",
            issued: "Ausgegeben",
            issuedHelper: "Das Ausgabedatum einer vorherigen Version.",
          },
        },
        detailedDescription: {
          title: "Detaillierte Beschreibung",
          description:
            "Stellen Sie umfassende Dokumentation für diesen Datensatz bereit, indem Sie Markdown-Formatierung verwenden. Diese detaillierte Beschreibung ist optional, wird aber für eine bessere Auffindbarkeit und Nutzung des Datensatzes empfohlen.",
        },
        provenance: {
          description:
            "Dokumentieren Sie, woher dieser Datensatz stammt und wie er erstellt wurde.",
          fields: {
            wasDerivedFrom: "Wurde abgeleitet von",
            sourceEntityUri: "Quell-Entitäts-URI",
            sourceEntityUriHelper:
              'Die URI der Entität, von der der Datensatz abgeleitet wurde. Z.B. "https://dataspace.example.org/assets/weather-dataset-001/v2.0"',
            wasGeneratedBy: "Wurde generiert von",
            activityDescription: "Aktivitätsbeschreibung",
            activityDescriptionHelper:
              'Eine Beschreibung der Aktivität, die den Datensatz generiert hat. Z.B. "Automatisierte Aggregation von IoT-Sensordaten von WeatherNet-Knoten."',
            wasAttributedTo: "Wurde zugeschrieben an",
            agentUri: "Agent-URI",
            agentUriHelper:
              'Die URI des Agenten, dem der Datensatz zugeschrieben wird. Z.B. "https://example.org/org/EnviroLab"',
          },
        },
        dataPrivacy: {
          description:
            "Definieren Sie, wie personenbezogene Daten in diesem Asset gesammelt, verarbeitet und geschützt werden.",
          fields: {
            personalDataHandling: "Behandlung personenbezogener Daten",
            personalData: "Personenbezogene Daten",
            personalDataHelper:
              "Die Art der personenbezogenen Daten, die im Datensatz verarbeitet werden.",
            purpose: "Zweck",
            purposeHelper:
              "Der Zweck, für den personenbezogene Daten verarbeitet werden.",
            legalBasis: "Rechtsgrundlage",
            legalBasisHelper:
              "Die Rechtsgrundlage für die Verarbeitung personenbezogener Daten.",
            law: "Gesetz",
            lawHelper:
              "Das Gesetz, das die Verarbeitung personenbezogener Daten regelt.",
          },
          personalDataTypes: {
            location: "Standort",
            demographic: "Demografisch",
            financial: "Finanziell",
            health: "Gesundheit",
            biometric: "Biometrisch",
            genetic: "Genetisch",
            communication: "Kommunikation",
            social: "Sozial",
            tracking: "Verfolgung",
            behavioural: "Verhaltensbasiert",
            identity: "Identität",
          },
          purposes: {
            researchAndDevelopment: "Forschung und Entwicklung",
            marketing: "Marketing",
            advertising: "Werbung",
            security: "Sicherheit",
            personalisation: "Personalisierung",
            serviceProvision: "Dienstleistung",
            analytics: "Analyse",
            customerManagement: "Kundenverwaltung",
          },
          legalBases: {
            consent: "Einwilligung",
            contract: "Vertrag",
            legalObligation: "Rechtliche Verpflichtung",
            vitalInterest: "Vitales Interesse",
            publicInterest: "Öffentliches Interesse",
            legitimateInterest: "Berechtigtes Interesse",
          },
          laws: {
            gdpr: "DSGVO",
            ccpa: "CCPA",
            lgpd: "LGPD",
            pipeda: "PIPEDA",
          },
        },
        dataQuality: {
          description:
            "Fügen Sie Qualitätsmessungen und Bewertungen für dieses Asset hinzu.",
          fields: {
            qualityMeasurements: "Qualitätsmessungen",
            measurement: "Messung",
            measurementHelper: "Die Qualitätsmetrik, die gemessen wird.",
            value: "Wert",
            valueHelper: "Der Wert der Qualitätsmessung.",
            description: "Beschreibung",
            descriptionHelper: "Eine Beschreibung der Qualitätsmessung.",
          },
        },
        thingDescription: {
          title: "W3C Thing Description",
          description:
            "Laden Sie eine W3C Thing Description JSON-Datei hoch. Die Datei wird gegen das W3C TD-Schema validiert, und alle href-Werte werden automatisch durch den öffentlichen EDC-Endpunkt ersetzt, bevor sie gespeichert werden.",
          uploadButton: "JSON-Datei hochladen",
          validating: "Validierung läuft...",
          viewDescription: "Thing Description anzeigen",
          errors: {
            invalidJson:
              "Ungültiges JSON-Format. Bitte überprüfen Sie Ihre Eingabe.",
            validationFailed:
              "Thing Description-Validierung fehlgeschlagen. Bitte beheben Sie die unten aufgeführten Fehler:",
            details: "Validierungsfehler:",
          },
        },
      },
      edit: {
        steps: {
          basicInformation: "Grundinformationen",
          dataAddress: "Datenadresse",
          optionalFeatures: "Optionale Funktionen",
        },
        buttons: {
          back: "Zurück",
          next: "Weiter",
          save: "Speichern",
        },
      },
    },
    catalog: {
      connect: {
        edcAddress: "EDC-Adresse",
        edcAddressPlaceholder: "EDC-Endpunkt-URL eingeben...",
        edcAddressHelper:
          "Geben Sie eine EDC-Katalog-Endpunkt-URL ein oder wählen Sie aus dem Verlauf aus",
        connect: "Verbinden",
        disconnect: "Trennen",
      },
      list: {
        loading: "Laden...",
        noDatasetsFound: "Keine Datensätze gefunden",
        emptyCatalogMessage:
          "Der Katalog scheint leer zu sein oder die Verbindung ist fehlgeschlagen.",
        failedToLoadDataset: "Fehler beim Laden des Datensatzes",
      },
      dataset: {
        unnamedDataset: "Unbenannter Datensatz",
        id: "ID",
        idLabel: "ID: {{id}}",
        aria: {
          datasetId: "Datensatz-ID: {{id}}",
          viewAndNegotiate: "Datensatz anzeigen und verhandeln: {{title}}",
          closeDialog: "Dialog schließen",
          startNegotiation: "Vertragsverhandlung starten",
          confirmNegotiation: "Verhandlung bestätigen und starten",
          openConfirmMenu: "Verhandlungsoptionen öffnen",
        },
        noDescriptionAvailable: "Keine Beschreibung verfügbar",
        shortDescription: "Kurze Beschreibung",
        keywords: "Schlüsselwörter",
        noKeywordsAvailable: "Keine Schlüsselwörter verfügbar",
        unknownCategory: "Unbekannte Kategorie",
        policiesAvailable: "Richtlinien verfügbar",
        policyAvailable: "Richtlinie verfügbar",
        viewAndNegotiate: "Anzeigen & Verhandeln",
        datasetDetailsAndNegotiation: "Datensatzdetails & Verhandlung",
        close: "Schließen",
        startNegotiation: "Verhandlung starten",
        selectPolicy: "Richtlinie auswählen",
        confirmNegotiation: "Verhandlung bestätigen",
        confirmNegotiationAndWait: "Verhandlung bestätigen & warten",
        creatingNegotiation: "Verhandlung wird erstellt...",
        waitingForNegotiation:
          "Warte auf Abschluss der Vertragsvereinbarung...",
        noPolicies: "Keine Richtlinien verfügbar",
        noPoliciesDescription:
          "Dieser Datensatz hat keine Richtlinien für die Verhandlung verfügbar.",
        selectPolicyForNegotiation:
          "Wählen Sie eine Richtlinie für die Vertragsverhandlung aus",
        policy: "Richtlinie",
        tabs: {
          overview: "Übersicht",
          versioning: "Versionierung",
          provenance: "Herkunft",
          dataPrivacy: "Datenschutz",
          dataQuality: "Datenqualität",
          serviceInfo: "Service-Info",
        },
      },
      permissions: {
        permissions: "Berechtigungen",
        noPermissions: "Keine Berechtigungen",
        action: "Aktion",
        target: "Ziel",
        assignee: "Beauftragter",
        assigner: "Zuweiser",
        constraint: "Einschränkung",
        constraints: "Einschränkungen",
        leftOperand: "Linker Operand",
        operator: "Operator",
        rightOperand: "Rechter Operand",
        duty: "Pflicht",
      },
      manager: {
        title: "Katalogverwaltung",
        addCatalog: "Katalog hinzufügen",
        noCatalogs: "Keine Kataloge konfiguriert",
        noCatalogsMessage:
          "Fügen Sie einen Katalog hinzu, um Datensätze zu durchsuchen",
        addFirstCatalog: "Fügen Sie Ihren ersten Katalog hinzu",
        status: "Status",
        catalogName: "Name",
        description: "Beschreibung",
        active: "Aktiv",
        added: "Hinzugefügt am",
        lastConnected: "Zuletzt verbunden",
        activate: "Aktivieren",
        deactivate: "Deaktivieren",
        openUrl: "URL öffnen",
        delete: "Löschen",
        lastConnectedAt: "Zuletzt verbunden: {{value}}",
      },
      add: {
        title: "Neuen Katalog hinzufügen",
        url: "Katalog-URL",
        name: "Katalogname",
        description: "Beschreibung (optional)",
        testConnection: "Verbindung testen",
        save: "Katalog hinzufügen",
      },
      fields: {
        name: "Name",
        url: "URL",
        description: "Beschreibung",
        dateAdded: "Hinzugefügt am",
        lastConnected: "Zuletzt verbunden",
        datasets: "Datensätze",
      },
      filters: {
        search: "Suche",
        category: "Kategorie",
      },
      forms: {
        urlHelper:
          "Geben Sie die EDC-Katalog-Endpunkt-URL ein (z. B. https://example.com/api/dsp)",
        editUrlHelper: "Die EDC-Katalog-Endpunkt-URL",
        nameHelper: "Ein benutzerfreundlicher Name für diesen Katalog",
        descriptionHelper: "Optionale Beschreibung",
      },
      connectionTest: {
        button: "Verbindung testen",
        requiresUrl: "Bitte geben Sie zuerst eine URL ein",
        successNotification: "Verbindung erfolgreich!",
        failureNotification: "Verbindung fehlgeschlagen",
        errorNotification: "Verbindungstest fehlgeschlagen",
        successStatus: "\u2713 Verbindung erfolgreich",
        errorStatusPrefix: "\u2717 {{error}}",
      },
      errorBoundary: {
        title: "Etwas ist schiefgelaufen",
        unexpected: "Es ist ein unerwarteter Fehler aufgetreten",
        retry: "Erneut versuchen",
      },
    },
    policies: {
      name: "Richtlinie |||| Richtlinien",
      fields: {
        id: "ID",
        name: "Name",
        description: "Beschreibung",
        createdAt: "Erstellt am",
        type: "Typ",
        policyType: "Richtlinientyp",
      },
      create: {
        title: "Richtlinie erstellen",
        fields: {
          name: "Name",
          nameHelper:
            "Geben Sie einen eindeutigen Namen für diese Richtlinie ein",
          description: "Beschreibung",
          descriptionHelper:
            "Geben Sie eine detaillierte Beschreibung des Zwecks und Umfangs dieser Richtlinie an",
          permissions: "Berechtigungen",
        },
        permissions: {
          permissions: "Berechtigungen",
          addPermission: "Berechtigung hinzufügen",
          timeBased: "Zeitbasiert",
          identityBased: "Identitätsbasiert",
          locationBased: "Standortbasiert",
          identityBasedPermission: "Identitätsbasierte Berechtigung",
          timeBasedPermission: "Zeitbasierte Berechtigung",
          locationBasedPermission: "Standortbasierte Berechtigung",
          operator: "Operator",
          operatorHelper: "Wählen Sie den Operator aus",
          identities: "Identitäten",
          identity: "Identität",
          selectCountries: "Wählen Sie die Länder aus",
          selectCountry: "Wählen Sie das Land aus",
          selectDate: "Wählen Sie das Datum aus",
          dateTime: "Datum & Zeit",
          equals: "Gleich",
          notEquals: "Nicht gleich",
          isNoneOf: "Ist keiner von",
          isPartOf: "Ist Teil von",
          after: "Nach",
          before: "Vor",
        },
      },
      list: {
        rules: "Regeln",
        noRules: "Keine Regeln",
      },
      show: {
        permissions: "Berechtigungen",
        obligations: "Verpflichtungen",
        prohibitions: "Verbote",
        action: "Aktion",
        constraint: "Einschränkung",
        constraints: "Einschränkungen",
        leftOperand: "Linker Operand",
        operator: "Operator",
        rightOperand: "Rechter Operand",
        // Permission type labels
        timeBasedPermission: "Zeitbasierte Berechtigung",
        identityBasedPermission: "Identitätsbasierte Berechtigung",
        locationBasedPermission: "Standortbasierte Berechtigung",
        customPermission: "Benutzerdefinierte Berechtigung",
        // Time-based translations
        timeCondition: "Zeitbedingung",
        dateTime: "Datum & Zeit",
        after: "Nach",
        before: "Vor",
        at: "Am",
        // Identity-based translations
        identities: "Identitäten",
        equals: "Gleich",
        notEquals: "Nicht gleich",
        isNoneOf: "Ist keiner von",
        isPartOf: "Ist Teil von",
        // Location-based translations
        location: "Standort",
        // General translations
        noDescription: "Keine Beschreibung verfügbar",
        noPermissions: "Keine Berechtigungen definiert",
        noObligations: "Keine Verpflichtungen definiert",
        noProhibitions: "Keine Verbote definiert",
      },
    },
    contractnegotiations: {
      name: "Vertragsverhandlung |||| Vertragsverhandlungen",
      fields: {
        id: "ID",
        createdAt: "Erstellt am",
        type: "Typ",
        counterPartyAddress: "Gegenpartei-Adresse",
        counterPartyId: "Gegenpartei-ID",
        protocol: "Protokoll",
        state: "Status",
        contractAgreementId: "Vertragsvereinbarung",
        errorDetail: "Fehlerdetails",
        policy: "Richtlinie",
        reason: "Grund",
      },
      actions: {
        terminate: "Beenden",
      },
      messages: {
        negotiationStarted: "Vertragsverhandlung erfolgreich gestartet",
        negotiationFailed: "Fehler beim Starten der Vertragsverhandlung",
        negotiationMonitoring:
          "Vertragsverhandlung gestartet. Wir leiten weiter, sobald die Vereinbarung vorliegt.",
        negotiationFinalized:
          "Vertragsvereinbarung abgeschlossen. Weiterleitung zur Vereinbarung...",
        negotiationFinalizationTimeout:
          "Die Verhandlung dauert länger als erwartet. Bitte prüfen Sie sie manuell.",
        negotiationPollingFailed:
          "Die Verhandlung konnte nicht automatisch überwacht werden. Bitte prüfen Sie sie manuell.",
        loading: "Wird geladen...",
        cannotTerminateFinalized:
          "Abgeschlossene Vertragsverhandlungen können nicht beendet werden.",
      },
      filters: {
        state: "Status",
        type: "Typ",
      },
    },
    contract_definitions: {
      name: "Vertragsdefinition |||| Vertragsdefinitionen",
      fields: {
        id: "ID",
        name: "Name",
        description: "Beschreibung",
        type: "Typ",
        accessPolicy: "Zugriffsrichtlinie",
        contractPolicy: "Vertragsrichtlinie",
        selectedAssets: "Ausgewählte Assets",
      },
      list: {
        name: "Name",
        warningTitle:
          "Diese Vertragsdefinition gilt für ALLE Assets (keine Assets ausgewählt)",
        unnamedAsset: "Unbenanntes Asset",
      },
      create: {
        title: "Vertragsdefinition erstellen",
        fields: {
          name: "Name",
          nameHelper:
            "Geben Sie einen eindeutigen Namen für diese Vertragsdefinition ein",
          description: "Beschreibung",
          descriptionHelper:
            "Geben Sie eine detaillierte Beschreibung dieser Vertragsdefinition an",
          accessPolicy: "Zugriffsrichtlinie",
          accessPolicyHelper:
            "Wird vor Vertragsverhandlungen geprüft - entscheidet, wer berechtigt ist, einen Vertrag für das Asset anzufordern",
          contractPolicy: "Vertragsrichtlinie",
          contractPolicyHelper:
            "Wird nach Vertragsvereinbarung angewendet - definiert die Nutzungsbedingungen der Daten",
          assetSelector: "Asset-Auswahl",
          assetSelectorDescription:
            "Wählen Sie die spezifischen Assets aus, auf die diese Vertragsdefinition angewendet werden soll.",
          assetByIdSelector: "Asset nach ID Auswahl",
          assetByIdSelectorHelper:
            "Wählen Sie die Assets aus, auf die diese Vertragsdefinition angewendet werden soll",
        },
        warnings: {
          noAssetsSelected:
            "⚠️ Warnung: Keine Assets ausgewählt - diese Vertragsdefinition gilt für ALLE Assets.",
        },
      },
      show: {
        appliesToAllAssets:
          "Diese Vertragsdefinition gilt für ALLE Assets (keine Assets ausgewählt)",
      },
    },
    datarequests: {
      name: "Datenanfrage |||| Datenanfragen",
      fields: {
        id: "ID",
        endpoint: "Endpunkt",
        authType: "Authentifizierungstyp",
        authorization: "Autorisierung",
      },
    },
    transferprocesses: {
      name: "Übertragungsprozess |||| Übertragungsprozesse",
      fields: {
        id: "ID",
        reason: "Grund",
        asset: "Asset",
        dataset: "Datensatz",
        assetId: "Asset-ID",
        transferDirection: "Richtung",
        transferType: "Übertragungstyp",
        state: "Status",
        stateTimestamp: "Status-Zeitstempel",
        correlationId: "Korrelations-ID",
        contractId: "Vertragsvereinbarung",
        errorDetail: "Fehlerdetails",
        dataRequest: "Datenanfrage",
        counterPartyAddress: "Gegenpartei-Adresse",
        contractAgreementId: "Vertragsvereinbarungs-ID",
        protocol: "Protokoll",
        dataDestinationType: "Datenziel-Typ",
        baseUrl: "Basis-URL",
        region: "Region",
        endpointOverride: "Endpoint-Override",
        bucketName: "Bucket-Name",
        objectName: "Objekt-Name",
        accessKeyId: "Access Key ID",
        secretAccessKey: "Secret Access Key",
      },
      filters: {
        direction: "Richtung",
        transferType: "Übertragungstyp",
        state: "Status",
      },
      actions: {
        terminate: "Beenden",
        download: "Daten herunterladen",
        downloading: "Lädt herunter...",
      },
      messages: {
        cannotTerminateCompleted:
          "Abgeschlossene Übertragungsprozesse können nicht beendet werden.",
        downloadSuccessful: "Download erfolgreich",
        downloadFailed: "Download fehlgeschlagen",
      },
      create: {
        fields: {
          counterPartyAddressHelper: "Die Adresse der Gegenpartei",
          contractIdHelper: "Die Vertragsvereinbarungs-ID",
          assetIdHelper: "Die Asset-ID",
          protocolHelper: "Das zu verwendende Dataspace-Protokoll",
          transferTypeHelper: "Der Typ der Übertragung",
          dataDestinationTypeHelper: "Der Typ des Datenziels",
          baseUrlHelper: "Die Basis-URL, zu der die Daten übertragen werden",
          regionHelper: "Die Region des Amazon S3-Buckets",
          endpointOverrideHelper: "Der Endpoint-Override des Amazon S3-Buckets",
          bucketNameHelper: "Der Name des Amazon S3-Buckets",
          objectNameHelper: "Der Name des Objekts im Amazon S3-Bucket",
          accessKeyIdHelper: "Die Access Key ID des Amazon S3-Buckets",
          secretAccessKeyHelper: "Der Secret Access Key des Amazon S3-Buckets",
        },
      },
    },
  },
  datasets: {
    openapi: {
      conversionError:
        "Fehler beim Konvertieren der Thing Description in OpenAPI-Spezifikation",
    },
  },
};

export default germanMessages;
