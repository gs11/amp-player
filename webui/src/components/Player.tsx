declare global {
  interface Window {
    Cowbell: any;
  }
}
const LIBOPENMPT_SUPPORTED_FORMATS = [
  "DBM",
  "FST",
  "IT",
  "MED",
  "MOD",
  "OKT",
  "S3M",
  "STK",
  "STM",
  "XM",
];

export function Player(props: any) {
  return <>{props.moduleId}</>;
}
