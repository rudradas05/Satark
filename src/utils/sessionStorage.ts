import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readSessionItem(key: string): Promise<string | null> {
  return AsyncStorage.getItem(key);
}

export async function writeSessionItem(
  key: string,
  value: string,
): Promise<void> {
  await AsyncStorage.setItem(key, value);
}

export async function removeSessionItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
