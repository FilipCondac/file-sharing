export const calcBytes = (sizeInBytes: string): string => {
  const sizeInBytesConverted: number = +sizeInBytes;

  return `${(sizeInBytesConverted / (1024 * 1024)).toFixed(2)} MB`;
};

//Function to convert bytes to MB
