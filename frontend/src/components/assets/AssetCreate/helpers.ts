import get from 'lodash/get';
import set from 'lodash/set';

export const transformData = (data: any) => {
  const result: any = {
    "@context": {
      "dct": "http://purl.org/dc/terms/",
      "dcat": "http://www.w3.org/ns/dcat#",
      "prov": "http://www.w3.org/ns/prov#",
      "odrl": "http://www.w3.org/ns/odrl/2/",
      "dqv": "http://www.w3.org/ns/dqv#",
      "wot": "https://www.w3.org/2019/wot/td#",
      "dpv": "https://w3id.org/dpv#",
      "schema": "http://schema.org/",
      "owl": "http://www.w3.org/2002/07/owl#"
    },
    "@type": "dcat:Dataset",
  };

  Object.keys(data).forEach(key => {
    const value = get(data, key);
    if (value !== undefined && value !== null) {
        set(result, key, value);
    }
  });

  if (result["dpv:hasPersonalDataHandling"]) {
    result["dpv:hasPersonalDataHandling"] = result["dpv:hasPersonalDataHandling"].map((item: any) => ({
      ...item,
      "@type": "dpv:PersonalDataHandling",
    }));
  }

  if (get(result, 'dct:license.@id') === 'Custom') {
    set(result, 'dct:license.@id', get(result, 'dct:license.custom'));
    delete result['dct:license']['custom'];
  }

  // Convert dataAddress boolean values to strings
  if (result.dataAddress) {
    Object.keys(result.dataAddress).forEach(key => {
      const value = result.dataAddress[key];
      if (typeof value === 'boolean') {
        result.dataAddress[key] = value.toString();
      }
    });
  }

  return result;
};