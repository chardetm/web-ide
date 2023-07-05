// This file is used to generate the files that will be used in the project.

export function noPageSelectedHTML() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: sans-serif;
    }
  </style>
  <title> </title>
</head>
<body>
  <h1>Aucune page sélectionnée</h1>
  <p>Aucune page n'est sélectionnée. Sélectionnez une page HTML dans l'éditeur.
  </p>
</body>
</html>`;
}


// TODO: Remove what is below this line when there is a proper way to load an
// exercise.

export function page1HTML() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>Première page</title>
</head>
<body>
  <h1>Première page</h1>
  <p>Ceci est la première page.</p>
  <p>Vous pouvez aller voir la deuxième page <a href="page2.html">ici</a>.</p>
  <script src="script.js"></script>
</body>
</html>`;
}

export function page2HTML() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="style2.css">
  <title>Deuxième page</title>
</head>
<body>
  <h1>Deuxième page</h1>
  <p>Ceci est la deuxième page.</p>
  <p>Vous pouvez retourner sur la première page <a href="page.html">ici</a>.</p>
  <p>Attention, la <a href="page3.html">page 3</a> n'existe pas.</p>
  <p>Vous pouvez aussi aller sur <a href="https://capytale2.ac-paris.fr/">Capytale</a>.</p>
</body>
</html>`;
}

export function linkCSS() {
  return `body {
  background-color: #f0f0f0;
  font-family: sans-serif;
}`;
}

export function link2CSS() {
  return `h1 {
  color: #aa2222;
}`;
}

export function statementMD() {
  return `# Titre de l'exercice
Bienvenue dans cet exercice ! Cet exercice est un exercice de type
"développement web". Il vous permettra de vous familiariser avec les bases du
développement web.

:::remark{title="Remarque"}
Ceci est un bloc de remarque. Il est utilisé pour donner des informations
supplémentaires sur l'exercice.
:::

## Titre de la section

Voici le contenu de la section.

### Titre du sous-titre

Voici le contenu du sous-titre.

#### Titre du sous-sous-titre

Voici le contenu du sous-sous-titre.

:::remark
Ceci est un bloc de remarque sans titre.
:::

##### Titre du sous-sous-sous-titre

Voici du \`code en ligne\`.

Voici du code HTML en bloc :

\`\`\`html
<header>En-tête</header>
<main>Contenu principal</main>
<footer>Pied de page</footer>
\`\`\`

Voici du code CSS en bloc :

\`\`\`css
.header {
  background-color: #f0f0f0;
  font-family: sans-serif;
}

.main {
  background-color: #ffffff;
  font-family: sans-serif;
}

.footer {
  background-color: #f0f0f0;
  font-family: sans-serif;
}
\`\`\`

Voici du code Javascript en bloc :

\`\`\`js
function helloWorld() {
  console.log("Hello world !");
}

helloWorld();
\`\`\`

Il est possible d'utiliser du code HTML directement dans le texte, ceci permet
notamment de définir des styles personnalisés grâce à l'attribut \`style\` :

<div style="color: blue">Hello world !</div>
`;
}


export function getJSONExample() {
  return {
    "type": "attempt",
    "metadata": {
      "statement": "# Titre de l'exercice\nBienvenue dans cet exercice ! Cet exercice est un exercice de type\n\"développement web\". Il vous permettra de vous familiariser avec les bases du\ndéveloppement web.\n\n:::remark{title=\"Remarque\"}\nCeci est un bloc de remarque. Il est utilisé pour donner des informations\nsupplémentaires sur l'exercice.\n:::\n\n## Titre de la section\n\nVoici le contenu de la section.\n\n### Titre du sous-titre\n\nVoici le contenu du sous-titre.\n\n#### Titre du sous-sous-titre\n\nVoici le contenu du sous-sous-titre.\n\n:::remark\nCeci est un bloc de remarque sans titre.\n:::\n\n##### Titre du sous-sous-sous-titre\n\nVoici du `code en ligne`.\n\nVoici du code HTML en bloc :\n\n```html\n<header>En-tête</header>\n<main>Contenu principal</main>\n<footer>Pied de page</footer>\n```\n\nVoici du code CSS en bloc :\n\n```css\n.header {\n  background-color: #f0f0f0;\n  font-family: sans-serif;\n}\n\n.main {\n  background-color: #ffffff;\n  font-family: sans-serif;\n}\n\n.footer {\n  background-color: #f0f0f0;\n  font-family: sans-serif;\n}\n```\n\nVoici du code Javascript en bloc :\n\n```js\nfunction helloWorld() {\n  console.log(\"Hello world !\");\n}\n\nhelloWorld();\n```\n\nIl est possible d'utiliser du code HTML directement dans le texte, ceci permet\nnotamment de définir des styles personnalisés grâce à l'attribut `style` :\n\n<div style=\"color: blue\">Hello world !</div>\n"
    },
    "initialState": {
      "activeFile": "page.html",
      "activeHtmlFile": "page.html",
      "openedFiles": [
        "page.html"
      ],
      "studentSettings": {
        "previewIsLive": true,
        "allowedNewTextFileTypes": [
          "text/html",
          "text/css",
          "application/javascript"
        ],
        "canUploadTextFiles": true,
        "canUploadImageFiles": true,
        "canDownloadFiles": true,
        "canSeeFilesList": true,
        "canSetVisibilityBounds": true,
        "canSetFilesPermissions": true,
        "canSeeOutOfBounds": true,
        "canOpenAndCloseTabs": true,
        "canChangePreviewMode": true,
        "allowedSyntaxCheckers": [
          "text/html"
        ],
        "isCustomSettings": false
      },
      "filesData": {
        "page.html": {
          "content": "<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <link rel=\"stylesheet\" href=\"style.css\">\n  <title>Première page (prof)</title>\n</head>\n<body>\n  <h1>Première page</h1>\n  <p>Ceci est la première page.</p>\n  <p>Vous pouvez aller voir la deuxième page <a href=\"page2.html\">ici</a>.</p>\n  <script src=\"script.js\"></script>\n</body>\n</html>",
          "studentPermissions": {
            "firstVisibleLine": 1,
            "lastVisibleLine": 16,
            "canEdit": true,
            "canRename": true,
            "canDelete": true
          }
        },
        "page2.html": {
          "content": "<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <link rel=\"stylesheet\" href=\"style.css\">\n  <link rel=\"stylesheet\" href=\"style2.css\">\n  <title>Deuxième page</title>\n</head>\n<body>\n  <h1>Deuxième page</h1>\n  <p>Ceci est la deuxième page.</p>\n  <p>Vous pouvez retourner sur la première page <a href=\"page.html\">ici</a>.</p>\n  <p>Attention, la <a href=\"page3.html\">page 3</a> n'existe pas.</p>\n  <p>Vous pouvez aussi aller sur <a href=\"https://capytale2.ac-paris.fr/\">Capytale</a>.</p>\n</body>\n</html>",
          "studentPermissions": {
            "firstVisibleLine": 1,
            "lastVisibleLine": 18,
            "canEdit": true,
            "canRename": true,
            "canDelete": true
          }
        },
        "style.css": {
          "content": "body {\n  background-color: #f0f0f0;\n  font-family: sans-serif;\n}",
          "studentPermissions": {
            "firstVisibleLine": 1,
            "lastVisibleLine": 4,
            "canEdit": true,
            "canRename": true,
            "canDelete": true
          }
        },
        "style2.css": {
          "content": "h1 {\n  color: #aa2222;\n}",
          "studentPermissions": {
            "firstVisibleLine": 1,
            "lastVisibleLine": 3,
            "canEdit": true,
            "canRename": true,
            "canDelete": true
          }
        },
        "script.js": {
          "content": "",
          "studentPermissions": {
            "firstVisibleLine": 1,
            "lastVisibleLine": 1,
            "canEdit": true,
            "canRename": true,
            "canDelete": true
          }
        }
      }
    },
    "attemptState": {
      "currentFilesContent": {
        "page.html": "<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <link rel=\"stylesheet\" href=\"style.css\">\n  <title>Première page (élève)</title>\n</head>\n<body>\n  <h1>Première page</h1>\n  <p>Ceci est la première page.</p>\n  <p>Vous pouvez aller voir la deuxième page <a href=\"page2.html\">ici</a>.</p>\n  <script src=\"script.js\"></script>\n</body>\n</html>",
        "page2.html": "<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <link rel=\"stylesheet\" href=\"style.css\">\n  <link rel=\"stylesheet\" href=\"style2.css\">\n  <title>Deuxième page</title>\n</head>\n<body>\n  <h1>Deuxième page</h1>\n  <p>Ceci est la deuxième page.</p>\n  <p>Vous pouvez retourner sur la première page <a href=\"page.html\">ici</a>.</p>\n  <p>Attention, la <a href=\"page3.html\">page 3</a> n'existe pas.</p>\n  <p>Vous pouvez aussi aller sur <a href=\"https://capytale2.ac-paris.fr/\">Capytale</a>.</p>\n</body>\n</html>",
        "style.css": "body {\n  background-color: #f0f0f0;\n  font-family: sans-serif;\n}",
        "style2.css": "h1 {\n  color: #aa2222;\n}",
        "script.js": ""
      },
      "filesPreview": {
        "page.html": {
          "content": "<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <link rel=\"stylesheet\" href=\"style.css\">\n  <title>Première page</title>\n</head>\n<body>\n  <h1>Première page</h1>\n  <p>Ceci est la première page.</p>\n  <p>Vous pouvez aller voir la deuxième page <a href=\"page2.html\">ici</a>.</p>\n  <script src=\"script.js\"></script>\n</body>\n</html>",
          "upToDate": true
        },
        "page2.html": {
          "content": "<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <link rel=\"stylesheet\" href=\"style.css\">\n  <link rel=\"stylesheet\" href=\"style2.css\">\n  <title>Deuxième page</title>\n</head>\n<body>\n  <h1>Deuxième page</h1>\n  <p>Ceci est la deuxième page.</p>\n  <p>Vous pouvez retourner sur la première page <a href=\"page.html\">ici</a>.</p>\n  <p>Attention, la <a href=\"page3.html\">page 3</a> n'existe pas.</p>\n  <p>Vous pouvez aussi aller sur <a href=\"https://capytale2.ac-paris.fr/\">Capytale</a>.</p>\n</body>\n</html>",
          "upToDate": true
        },
        "style.css": {
          "content": "body {\n  background-color: #f0f0f0;\n  font-family: sans-serif;\n}",
          "upToDate": true
        },
        "style2.css": {
          "content": "h1 {\n  color: #aa2222;\n}",
          "upToDate": true
        },
        "script.js": {
          "content": "",
          "upToDate": true
        }
      },
      "openedFiles": [
        "page.html"
      ],
      "previewIsLive": true
    }
  };
}


export function getDefaultInitialContent() {
  return {
    "type": "exercise",
    "metadata": {
      "statement": "# Titre de l'exercice\nBienvenue dans cet exercice ! Cet exercice est un exercice de type\n\"développement web\". Il vous permettra de vous familiariser avec les bases du\ndéveloppement web.\n\n:::remark{title=\"Remarque\"}\nCeci est un bloc de remarque. Il est utilisé pour donner des informations\nsupplémentaires sur l'exercice.\n:::\n\n## Titre de la section\n\nVoici le contenu de la section.\n\n### Titre du sous-titre\n\nVoici le contenu du sous-titre.\n\n#### Titre du sous-sous-titre\n\nVoici le contenu du sous-sous-titre.\n\n:::remark\nCeci est un bloc de remarque sans titre.\n:::\n\n##### Titre du sous-sous-sous-titre\n\nVoici du `code en ligne`.\n\nVoici du code HTML en bloc :\n\n```html\n<header>En-tête</header>\n<main>Contenu principal</main>\n<footer>Pied de page</footer>\n```\n\nVoici du code CSS en bloc :\n\n```css\n.header {\n  background-color: #f0f0f0;\n  font-family: sans-serif;\n}\n\n.main {\n  background-color: #ffffff;\n  font-family: sans-serif;\n}\n\n.footer {\n  background-color: #f0f0f0;\n  font-family: sans-serif;\n}\n```\n\nVoici du code Javascript en bloc :\n\n```js\nfunction helloWorld() {\n  console.log(\"Hello world !\");\n}\n\nhelloWorld();\n```\n\nIl est possible d'utiliser du code HTML directement dans le texte, ceci permet\nnotamment de définir des styles personnalisés grâce à l'attribut `style` :\n\n<div style=\"color: blue\">Hello world !</div>\n"
    },
    "initialState": {
      "activeFile": "page.html",
      "activeHtmlFile": "page.html",
      "openedFiles": [
        "page.html"
      ],
      "studentSettings": {
        "previewIsLive": true,
        "allowedNewTextFileTypes": [
          "text/html",
          "text/css",
          "application/javascript"
        ],
        "canUploadTextFiles": true,
        "canUploadImageFiles": true,
        "canDownloadFiles": true,
        "canSeeFilesList": true,
        "canSetVisibilityBounds": true,
        "canSetFilesPermissions": true,
        "canSeeOutOfBounds": true,
        "canOpenAndCloseTabs": true,
        "canChangePreviewMode": true,
        "allowedSyntaxCheckers": [
          "text/html"
        ],
        "isCustomSettings": false
      },
      "filesData": {
        "page.html": {
          "content": "<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <link rel=\"stylesheet\" href=\"style.css\">\n  <title>Première page (prof)</title>\n</head>\n<body>\n  <h1>Première page</h1>\n  <p>Ceci est la première page.</p>\n  <p>Vous pouvez aller voir la deuxième page <a href=\"page2.html\">ici</a>.</p>\n  <script src=\"script.js\"></script>\n</body>\n</html>",
          "studentPermissions": {
            "firstVisibleLine": 1,
            "lastVisibleLine": 16,
            "canEdit": true,
            "canRename": true,
            "canDelete": true
          }
        },
        "page2.html": {
          "content": "<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <link rel=\"stylesheet\" href=\"style.css\">\n  <link rel=\"stylesheet\" href=\"style2.css\">\n  <title>Deuxième page</title>\n</head>\n<body>\n  <h1>Deuxième page</h1>\n  <p>Ceci est la deuxième page.</p>\n  <p>Vous pouvez retourner sur la première page <a href=\"page.html\">ici</a>.</p>\n  <p>Attention, la <a href=\"page3.html\">page 3</a> n'existe pas.</p>\n  <p>Vous pouvez aussi aller sur <a href=\"https://capytale2.ac-paris.fr/\">Capytale</a>.</p>\n</body>\n</html>",
          "studentPermissions": {
            "firstVisibleLine": 1,
            "lastVisibleLine": 18,
            "canEdit": true,
            "canRename": true,
            "canDelete": true
          }
        },
        "style.css": {
          "content": "body {\n  background-color: #f0f0f0;\n  font-family: sans-serif;\n}",
          "studentPermissions": {
            "firstVisibleLine": 1,
            "lastVisibleLine": 4,
            "canEdit": true,
            "canRename": true,
            "canDelete": true
          }
        },
        "style2.css": {
          "content": "h1 {\n  color: #aa2222;\n}",
          "studentPermissions": {
            "firstVisibleLine": 1,
            "lastVisibleLine": 3,
            "canEdit": true,
            "canRename": true,
            "canDelete": true
          }
        },
        "script.js": {
          "content": "",
          "studentPermissions": {
            "firstVisibleLine": 1,
            "lastVisibleLine": 1,
            "canEdit": true,
            "canRename": true,
            "canDelete": true
          }
        }
      }
    },
  };
}