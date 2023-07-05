import styles from "./basicComponents.module.scss";

export function BasicButton({ disabled, ...props }) {
  return disabled ? (
    <button disabled={true} {...props} />
  ) : (
    <button {...props} />
  );
}

export function Spacer() {
  return <div className={styles.spacer} />;
}
