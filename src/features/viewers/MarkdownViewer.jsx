import ReactMarkdown from "react-markdown";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import styles from "./MarkdownViewer.module.scss";
import { CodeViewer } from "./CodeViewer";

const Remark = function ({ title = null, children }) {
  return (
    <div className={styles.remark}>
      {title && <div className={styles.remarkTitle}>{title}</div>}
      {children}
    </div>
  );
};

const Style = function ({ children }) {
  return (
    <div className={styles.notAllowed}>
      L'élément <code>style</code> n'est pas autorisé ici. Veuillez utiliser
      l'attribut <code>style</code> des balises HTML à la place.
    </div>
  );
};

const Script = function ({ children }) {
  return (
    <div className={styles.notAllowed}>
      L'élément <code>script</code> n'est pas autorisé ici.
    </div>
  );
};

const CodePreview = function ({ inline, children, ...props }) {
  if (inline) {
    return <code>{children[0]}</code>;
  }
  return <CodeViewer children={children} {...props} />;
};

export function MarkdownViewer({ source, allowHtml = false }) {
  return (
    // https://github.com/IGassmann/remark-directive-rehype
    <ReactMarkdown
      children={source}
      className={styles.renderedMarkdown}
      remarkPlugins={[remarkDirective, remarkDirectiveRehype, remarkGfm]}
      rehypePlugins={allowHtml ? [rehypeRaw] : []}
      components={{
        remark: Remark,
        style: Style,
        script: Script,
        code: CodePreview,
      }}
    />
  );
}
