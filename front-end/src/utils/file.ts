const units = ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

export function niceBytes(x: string | number) {
  let l = 0,
    n = parseInt(String(x), 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
}

export function mimeTypeToString(supportedFileType: { [key: string]: string }) {
  let i: number = 0;
  let types: string = "";
  for (const mime in supportedFileType) {
    if (i !== 0) types += ", ";
    types += supportedFileType[mime];
    i++;
  }
  return types;
}
