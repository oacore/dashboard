---
title: CORE Recommender installation instructions
---

## EPrints

1.  Ensure your EPrints repository is on version 3.3 or larger.
    If you have an older version of EPrints stop using these instructions
    and look at the "Everyone else (non-EPrints)" section.
2.  Go to _Admin_ → _System Tools_ → _EPrints Bazaar_
3.  Under the _Available_ tab search for _CORE&nbsp;Recommender_
4.  Click _Install_ to get CORE&nbsp;Recommender
5.  When the Recommender is installed you will see _Installation finished_
6.  Once installed, click on the CORE Recommender _Configure_ button
7.  Then click on the _Edit config file_ button
8.  In the window that opens, replace the _recommenderID_ with **{{ key }}**
9.  Save the changes in the file pressing _Save changes_
10. Click the button _Reload Configuration_. You will see a success message
11. Go the the _Admin_ page
12. Then click at _System Tools_ tab
13. Then click at _Regenerate Abstracts_ button
14. Go again at the _System Tools_ tab and click
    on _Regenerate Views_ this time
15. Visit a document in your repository to see CORE’s similar
    suggested documents at the bottom of the page.

If you need any help [contact us][team-email].


## Everyone else (non-EPrints)

Use the following guide to install the recommender in a non-EPrints 
repository software, or an EPrints repository software that runs in a version
older than 3.3.

You will need to paste the following code before the closing `</head>` tag on
every web page on the site you wish the plugin to display on.
You may need to consult your repository software documentation
to find out how to do this.

```html
<script>
  (function (d, s, idScript, idRec, userInput) {
    var coreAddress = 'https://core.ac.uk/';
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(idScript)) return;
    js = d.createElement(s);
    js.id = idScript;
    js.src = coreAddress + 'recommender/embed.js';
    fjs.parentNode.insertBefore(js, fjs);

    localStorage.setItem('idRecommender', idRec);
    localStorage.setItem('userInput', JSON.stringify(userInput));

    var link = d.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', coreAddress + 'recommender/embed-default-style.css');
    d.getElementsByTagName('head')[0].appendChild(link);
  }(document, 'script', 'recommender-embed', '{{ key }}', {}));
</script>
```

Once the snippet is inserted in the `<head></head>` of the HTML,
insert the following division element in the location where you would
like the recommender to appear.

```html
<div id="coreRecommenderOutput"></div>
```

If you need any help [contact us][team-email].

## Advanced

### How does the recommender get the metadata?

The plugin automatically finds the document metadata by scanning the current
HTML page for the following tag names. They are usually inserted by the
repository software (e.g.&nbsp;EPrints or DSpace) at the `<head></head>`
of the HTML page:

1. for **OAI**:
   - `<meta name="eprints.eprintid">`
2. for **document URL**:
   - `<meta name="DC.identifier">`
   - `<meta name="DCTERMS.identifier">`
   - `<meta name="eprints.document_url">`
3. for **title**:
   - `<meta name="DC.title">`
   - `<meta name="DCTERMS.title">`
   - `<meta name="eprints.title">` 
4. for **authors**:
   - `<meta name="DC.creator">`
   - `<meta name="DCTERMS.creator">`
   - `<meta name="eprints.creators_name">`
5. for **abstract**:
   - `<meta name="DC.description">`
   - `<meta name="DCTERMS.abstract">`
   - `<meta name="eprints.abstract">`

The recommender only provided recommendations if both **title**
and **description** tags are present. If other metadata included,
it is be used to improve the recommendations.

### What if I don't have meta tags?

It is possible to set the metadata manually via JavaScript. 
Both, `documentTitle` and `documentAbstract` must be provided.
Other properties are optional but including them improves
higher quality recommendations.

```js
var documentInput = {
  documentTitle: 'The Title of the Document',
  documentAbstract: 'The Abstract of the document',
  documentOAI: 'oai:example.org:document-id',
  documentAuthors: ['Firstname Surname1','Firstname2 Surname2'],
  documentUrl: 'https://linktofulltextpdf'
}
```

In the end of widget code, change the line:

```
}(document, 'script', 'recommender-embed', '{{ key }}', {}));
```
to
```
}(document, 'script', 'recommender-embed', '{{ key }}', documentInput));
```

### How to change the default CSS style?

You can change our default CSS style and apply your own design by replacing
the following line in the snippet with a path to your own custom CSS:

```js
link.setAttribute('href', coreAddress + 'recommender/embed-default-style.css');
```
to
```js
link.setAttribute('href', 'https://example.com/path/to/my/custom.css');
```

If you need any help [contact us][team-email].

[team-email]: mailto:thet&#101;&#97;m&#64;c&#111;re&#46;&#97;c&#46;&#117;k
