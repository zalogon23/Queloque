import Constants from "expo-constants";
const environment = {
  domain: `${Constants.manifest?.extra?.DOMAIN || "http://192.168.0.2"}:5002`
};

export default environment;