import {
  Labeled,
  FunctionField,
} from "react-admin";
import { Box } from "@mui/material";
import { MarkdownField } from "../../markdown";

export const BasicInformationShow = () => {
  return (
    <Box>
      <Labeled fullWidth label="Description">
        <FunctionField render={(record: any) => {
          const description = record?.properties?.["http://purl.org/dc/terms/description"];
          if (!description) {
            return <span>-</span>;
          }
          return <MarkdownField source="description" record={{ description }} />;
        }} />
      </Labeled>

      <Labeled fullWidth label="Keywords">
        <FunctionField render={(record: any) => {
          const keywords = record?.properties?.["http://www.w3.org/ns/dcat#keyword"];
          if (!keywords) {
            return "No keywords";
          }
          
          // Handle case where single keyword is returned as string instead of array
          const keywordsArray = Array.isArray(keywords) ? keywords : [keywords];
          
          if (keywordsArray.length === 0) {
            return "No keywords";
          }
          
          return keywordsArray.map((keyword: string, index: number) => (
            <span key={index} style={{ marginRight: '8px' }}>
              {keyword}{index < keywordsArray.length - 1 ? ', ' : ''}
            </span>
          ));
        }} />
      </Labeled>

      <Labeled fullWidth label="Category">
        <FunctionField render={(record: any) => 
          record?.properties?.["http://www.w3.org/ns/dcat#theme"]?.["http://purl.org/dc/terms/title"] || "-"
        } />
      </Labeled>


      <Labeled fullWidth label="Media Type">
        <FunctionField render={(record: any) => 
          record?.properties?.["http://www.w3.org/ns/dcat#mediaType"] || "-"
        } />
      </Labeled>
    </Box>
  );
};