import PythonCodeEditor from "../code-editor/PythonCodeEditor";
import HTMLCodeEditor from "../code-editor/HTMLCodeEditor";
import CSSCodeEditor from "../code-editor/CSSCodeEditor";
import JSCodeEditor from "../code-editor/JSCodeEditor";
import MDCodeEditor from "../code-editor/MDCodeEditor";
import CodeEditor from "../code-editor/CodeEditor";

import styles from "./CodeViewer.module.scss";

const languageToEditor = {
  "language-python": PythonCodeEditor,
  "language-html": HTMLCodeEditor,
  "language-css": CSSCodeEditor,
  "language-js": JSCodeEditor,
  "language-md": MDCodeEditor,
};

export function CodeViewer({ className, children }) {
  const Editor = languageToEditor[className] ?? CodeEditor;
  return (
    <div className={styles.codePreview}>
      <Editor readOnly={true} code={children[0].trim()} />
    </div>
  );
}

export default CodeViewer;
