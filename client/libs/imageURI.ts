export const createImageUri = (imageUri: string) => {
  return new URL(imageUri, import.meta.url).href;
};
