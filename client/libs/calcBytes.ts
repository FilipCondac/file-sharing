export const calcBytes = (sizeInBytes: string): string => {
  let sizeInBytesConverted: number = +sizeInBytes;

  return `${(sizeInBytesConverted / (1024 * 1024)).toFixed(2)} MB`;
};
