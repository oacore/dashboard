---
title: CORE Recommenders instructions
---

## Eprints Recommender instructions

    {% if recommenders is not defined or recommenders is null or recommenders is empty  %}
        XXXXXX
    {% else %}
        {{ recommenders[0]["idRecommender"] }}
    {% endif %}


Write down this identifier, you will use it shortly.

1. Ensure your Eprints repository is on version 3.3 or larger. (If you have an older version of Eprints stop using these instructions and look at the "Everyone else (non-Eprints)" section.)
2. Go to "Admin" -> "System Tools" -> "Eprints Bazaar"
3. Under the "Available" tab search for "CORE Recommender" Searching
4. Click "Install" to get "the CORE Recommender"
5. When the Recommender is installed you will see this:
`Installation finished`
6. Once installed, click on the CORE Recommender "Configure" button:
`Press Configure button`
7. Then click on the "Edit config file" button:
`Edit config file`
8. In the window that opens, replace the "recommenderID" with the ID you have written down at the beginning of the process
Line with ID
9. Save the changes in the file:
`Save changes`
10. Click the button "Reload Configuration". You will see a success message:
`Reload Configuration`
11. Go the the Admin page
12. Then click at "System Tools" tab:
`System Tools`
13. Then click at "Regenerate Abstracts" button
14. Go again at the "System Tools" tab and click on "Regenerate Views" this time.
15. Visit a document in your repository to see CORE’s similar suggested documents at the bottom of the page.
If you need any help contact [theteam@core.ac.uk](theteam@core.ac.uk)


Everyone else (non-Eprints) Recommender instructions
---

Use the following guide to install the recommender in a non-EPrints repository software, or an EPrints repository software that runs in a version older than 3.3.

You will need to paste the following code before the closing </head> tag on every web page on the site you wish the plugin to display on. You may need to consult your repository software documentation to find out how to do this.

    <script>
        (function (d, s, idScript, idRec, userInput) {
            var coreAddress = 'https://core.ac.uk/';
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(idScript))
                return;
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
        }(document, 'script', 'recommender-embed', '{% if recommenders is not defined or recommenders is null or recommenders is empty  %}XXXXXX{% else %}{{ recommenders[0]["idRecommender"] }}{% endif %}', {}));
    </script>


Once the snippet is inserted in the `<head></head>` of the html, insert the following division tag in the location where you would like the recommender to appear.

    <div id="coreRecommenderOutput"></div>
    
If you need any help contact [theteam@core.ac.uk](theteam@core.ac.uk)



Advanced Recommender instructions
---

**How does the recommender get the metadata?**

The plugin automatically finds the document metadata by scanning the current HTML page for the following tag names. 
They are usually inserted by the repository software (e.g. EPrints or DSpace) at the `<head></head>` of the HTML page:

1. for **OAI**:

        <meta name="eprints.eprintid">
    
2. for **document Url**:

        <meta name="DC.identifier">
        <meta name="DCTERMS.identifier">
        <meta name="eprints.document_url">
    
3. for **Title**:

        <meta name="DC.title">  
        <meta name="DCTERMS.title">  
        <meta name="eprints.title">  
    
4. for **Authors**:

        <meta name="DC.creator">
        <meta name="DCTERMS.creator">
        <meta name="eprints.creators_name">
    
5. for **Abstract**:

        <meta name="DC.description">
        <meta name="DCTERMS.abstract">
        <meta name="eprints.abstract">
    
The recommender will only provide recommendations if the **Title** and **Description** tags are present. If other metadata is included, they will be used to improve the recommendations.

**What if I don't have meta tags?**

It is possible to set the metadata manually via javascript. Again, the documentTitle and documentAbstract must be provided. Other tags are optional but including them will generate higher quality recommendations.

    var documentInput = {
            documentTitle: "The Title of the Document",
            documentAbstract: "The Abstract of the document",
            documentOAI: "oai:example.org:document-id",
            documentAuthors: ['Firstname Surname1','Firstname2 Surname2'],
            documentUrl: "https://linktofulltextpdf",
            }
    
In the widget code, change the last line:


        } (document, 'script', 'recommender-embed', 
        '{% if recommenders is not defined or recommenders is null or recommenders is empty  %}XXXXXX{% else %}{{ recommenders[0]["idRecommender"] }}{% endif %}', {})
    
to


        } (document, 'script', 'recommender-embed', 
        '{% if recommenders is not defined or recommenders is null or recommenders is empty  %}XXXXXX{% else %}{{ recommenders[0]["idRecommender"] }}{% endif %}', documentInput)
    

**How to change the default CSS style?**

You can change our default CSS style and apply your own design by replacing the following line in the snippet with a path to your own custom CSS:


        link.setAttribute('href', coreAddress + 'recommender/embed-default-style.css');
    
to


        link.setAttribute('href', 'https://example.com/path/to/my/custom.css');
    
If you need any help contact [theteam@core.ac.uk](theteam@core.ac.uk)
