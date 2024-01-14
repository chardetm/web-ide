declare module "*.jpg";
declare module "*.gif";
declare module "*.png";
declare module "*.scss";
declare module "*?raw" {
  const content: string;
  export default content;
}
