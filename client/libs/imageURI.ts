//Function to create a URI for an image to fix the issue of the image not showing up in the browser
export const createImageUri = (imageUri: string) => {
  return new URL(imageUri, import.meta.url).href;
};
