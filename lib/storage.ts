import Storage from "react-native-storage";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
const storage = new Storage({
  size: 1000,
  storageBackend: Platform.OS === "web" ? localStorage : AsyncStorageLib,
  defaultExpires: 1000 * 3600 * 24 * 7,
  enableCache: false
});
export default storage;