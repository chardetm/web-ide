import { React, useState, useMemo, Fragment } from "react";
import { Spacer } from "../ui/basicComponents";
import { RoundedButton } from "../ui/materialComponents";
import { BaseWindow } from "./BaseWindow";
import { MaterialIcon } from "../ui/materialComponents";

import styles from "./style.module.scss";
import { appendClassnames } from "../../utils";
import { Toolbar, WindowContent } from "./contents";

export function WindowTab({
  children,
  title,
  icon = null,
  onClose = null,
  ...props
}) {
  return (
    <div className={styles.windowTab} {...props}>
      {children}
    </div>
  );
}

function Tab({
  title,
  active,
  onSelect,
  icon = null,
  onClose = null,
  ...props
}) {
  return (
    <div
      className={`${styles.tab}`}
      active={active.toString()}
      onMouseDown={onSelect}
      title={title}
      {...props}
    >
      {icon && <div className={styles.tabIcon}>{icon}</div>}
      <div className={styles.tabTitle}>{title}</div>
      <Spacer />
      {onClose && (
        <div className={styles.closeButton}>
          <RoundedButton
            icon={<MaterialIcon.Outlined name="close" />}
            title="Fermer l'onglet"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            round={true}
          />
        </div>
      )}
    </div>
  );
}

export function TabbedWindow({
  title,
  icon,
  tabs = {},
  activeTabId,
  onHide,
  onMaximize,
  onDemaximize,
  onTabChange,
  onNewTab,
  className,
  windowContentClassName,
  toolbarContent,
  children,
  ...props
}) {
  const [tabHoverIndex, setTabHoverIndex] = useState(-1);
  const activeTabIndex = useMemo(
    () => Object.keys(tabs).indexOf(activeTabId),
    [activeTabId, tabs]
  );
  return (
    <BaseWindow
      onHide={onHide}
      onDemaximize={onDemaximize}
      onMaximize={onMaximize}
      no-toolbar={toolbarContent ? "false" : "true"}
      className={appendClassnames(styles.tabbedWindow, className)}
      {...props}
    >
      <div className={appendClassnames(styles.windowTitle, styles.withTabs)}>
        <div className={styles.topbar}>
          {/* The window-icon hardcoded class is used to set the icon color for
          each window independently in CSS */}
          <div className={appendClassnames("window-icon", styles.windowIcon)}>
            {icon}
          </div>
          <div className={styles.tabs}>
            {Object.entries(tabs).map(([tabId, tabData], index) => (
              <Fragment key={tabId}>
                <Tab
                  onMouseOver={() => setTabHoverIndex(index)}
                  onMouseLeave={() => setTabHoverIndex(-1)}
                  title={tabData.title}
                  icon={tabData.icon}
                  onClose={tabData.onClose}
                  active={tabId === activeTabId}
                  onSelect={function () {
                    if (onTabChange) {
                      onTabChange(tabId);
                    }
                  }}
                />
                <div
                  className={styles.tabsEndMarker}
                  visible={(
                    index !== activeTabIndex &&
                    index !== activeTabIndex - 1 &&
                    index !== tabHoverIndex &&
                    index !== tabHoverIndex - 1
                  ).toString()}
                ></div>
              </Fragment>
            ))}
            {onNewTab && (
              <RoundedButton
                className={styles.addTabButton}
                icon={<MaterialIcon.Rounded name="add" />}
                round={true}
                onClick={onNewTab}
              />
            )}
          </div>
          <Spacer />
        </div>
      </div>
      {toolbarContent && <Toolbar>{toolbarContent}</Toolbar>}
      <WindowContent className={windowContentClassName}>
        {children}
      </WindowContent>
      {title && (
        <div
          className={appendClassnames(
            "tabbed-window-title",
            styles.tabbedWindowTitle
          )}
        >
          {/* The tabbed-window-title hardcoded class is used to set the icon
        color for each window independently in CSS */}
          {title}
        </div>
      )}
    </BaseWindow>
  );
}
