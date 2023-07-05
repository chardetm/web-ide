import styles from "./materialComponents.module.scss";

import { BasicButton } from "./basicComponents";
import { ButtonGroup } from "@mui/material";
import { Button } from "@mui/material";

export function RoundedButton({
  className = null,
  icon = null,
  label = null,
  border = false,
  background = false,
  round = false,
  badgeContent = ".",
  badgeVisible = false,
  badgeColor,
  ...props
}) {
  return (
    <BasicButton
      className={`${styles.roundedButton}${
        border ? ` ${styles.withBorder}` : ""
      }${background ? ` ${styles.withBackground}` : ""}${
        round ? ` ${styles.round}` : ""
      }${className ? ` ${className}` : ""}`}
      badge-content={badgeContent.toString()}
      badge-visible={badgeVisible.toString()}
      {...props}
    >
      {icon && <span className={styles.roundedButtonIcon}>{icon}</span>}
      {label && <span className={styles.roundedButtonLabel}>{label}</span>}
    </BasicButton>
  );
}

export function MaterialButtonGroup({ className, children }) {
  return (
    <div
      className={`${styles.materialButtonGroup}${
        className ? ` ${className}` : ""
      }`}
    >
      {children}
    </div>
  );
}

export function MaterialButtonSeparator() {
  return <div className={styles.materialButtonSeparator} />;
}

export function MaterialIcon({
  name,
  variant = "material-symbols-outlined",
  className = null,
}) {
  return (
    <span
      className={`material-symbols ${variant}${
        className ? ` ${className}` : ""
      }`}
    >
      {name}
    </span>
  );
}

MaterialIcon.Outlined = function ({ name, ...props }) {
  return (
    <MaterialIcon name={name} variant="material-symbols-outlined" {...props} />
  );
};

MaterialIcon.Rounded = function ({ name, ...props }) {
  return (
    <MaterialIcon name={name} variant="material-symbols-rounded" {...props} />
  );
};

MaterialIcon.Sharp = function ({ name, ...props }) {
  return (
    <MaterialIcon name={name} variant="material-symbols-sharp" {...props} />
  );
};

export function MaterialTileSelector({
  options,
  selected,
  onChange,
  size = "medium",
}) {
  return (
    <div className={styles.materialTileSelector}>
      <ButtonGroup
        size={size}
        variant="outlined"
        aria-label="outlined primary button group"
      >
        {Object.keys(options).map((optionKey) => (
          <Button
            key={optionKey}
            variant={optionKey === selected ? "contained" : "outlined"}
            onClick={() => onChange(optionKey)}
          >
            {options[optionKey]}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}
