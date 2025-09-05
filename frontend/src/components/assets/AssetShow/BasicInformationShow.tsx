import { Labeled, FunctionField } from "react-admin";
import { Box, Typography } from "@mui/material";

export const BasicInformationShow = () => {
  return (
    <Box>
      <Labeled fullWidth label="Short Description">
        <FunctionField
          render={(record: any) => {
            const abstract =
              record?.properties?.["http://purl.org/dc/terms/abstract"];
            if (!abstract) {
              return (
                <Typography variant="body2" color="text.secondary">
                  No short description available
                </Typography>
              );
            }
            return <Typography variant="body2">{abstract}</Typography>;
          }}
        />
      </Labeled>

      <Labeled fullWidth label="Keywords">
        <FunctionField
          render={(record: any) => {
            const keywords =
              record?.properties?.["http://www.w3.org/ns/dcat#keyword"];
            if (!keywords) {
              return (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  No keywords available
                </Typography>
              );
            }

            // Handle case where single keyword is returned as string instead of array
            const keywordsArray = Array.isArray(keywords)
              ? keywords
              : [keywords];

            if (keywordsArray.length === 0) {
              return (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  No keywords available
                </Typography>
              );
            }

            return keywordsArray.map((keyword: string, index: number) => (
              <span key={index} style={{ marginRight: "8px" }}>
                {keyword}
                {index < keywordsArray.length - 1 ? ", " : ""}
              </span>
            ));
          }}
        />
      </Labeled>

      <Labeled fullWidth label="Category">
        <FunctionField
          render={(record: any) =>
            record?.properties?.["http://www.w3.org/ns/dcat#theme"]?.[
              "http://purl.org/dc/terms/title"
            ] || "-"
          }
        />
      </Labeled>

      <Labeled fullWidth label="Media Type">
        <FunctionField
          render={(record: any) =>
            record?.properties?.["http://www.w3.org/ns/dcat#mediaType"] || "-"
          }
        />
      </Labeled>
    </Box>
  );
};
