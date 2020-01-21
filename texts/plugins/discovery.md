---
title: CORE Discovery installation instructions
---

## EPrints

*The EPrints version of the&nbsp;plugin works only with the default
HTML template but it should work fine with custom CSS.
Although, if something goes wrong, please [let us know][team-email].*

You can install the&nbsp;plugin by copying and pasting the following snippet.
Please note that due to the way that the EPrints template engine works,
the script URL contains escaped HTML entities.

```html
<script
  type="text/javascript"
  src="https://discovery.core.ac.uk/plugin.js?template=eprints&amp;id={{ key }}" 
  async="async"
></script>
```

CORE&nbsp;Discovery repository plugin will automatically position itself after
the heading and author section in the metadata page. However, if you experience
any issues with automatic snippet injection, copy the following code and paste
it wherever you wish the CORE&nbsp;Discovery to appear.

```html
<div id="core-discovery-root"></div>
```

You can take a glimpse of the&nbsp;plugin at [Open Research
Online](http://oro.open.ac.uk/56725/), The Open University (or see an example
below). The&nbsp;plugin will look similar on your repository.

<div class="card card-body mb-3">
  <a href="http://oro.open.ac.uk/54889/" title="Open example in ORO">
    <img
      class="img-fluid"
      src="https://core.ac.uk/images/discovery/oro-repository-plugin.png"
      alt="CORE Discovery repository plugin at Open Research Online"
    >
  </a>
</div>

To customise the&nbsp;plugin, go through the Custom styling section.


## Everyone else (non-Eprints)

Install the CORE&nbsp;Discovery repository plugin in any non-EPrints repository
or website. Add the following snippet on every web page you wish
the&nbsp;plugin to display on.

```html
<script 
  src="https://discovery.core.ac.uk/plugin.js?id={{ key }}" 
  async
></script>
```

Also, add a `div` element with the following structure wherever you wish
the&nbsp;plugin to appear.

```html
<div id="core-discovery-root"></div>
```

After the installation, if the full text is not available from the repository
but is discovered by CORE, the script will display a link to the full text as
shown in the example above.

## Custom styling {#styling}

The&nbsp;plugin is influenced by the repository or website CSS. Feel free to 
customise the&nbsp;plugin right from there.

If you want to add something specific for the&nbsp;plugin only, encapsulate the
selector by prefixing it with `#core-discovery-root` like the example below.
Also, feel free to add any additional class names or attributes to the plugin
root element but note, if you use EPrints you need to add the element 
manually in order to be able to do that. 

```css
#core-discovery-root a {
  text-decoration: underline;
}
```

We recommend that you rely on element types (e.&nbsp;g.&nbsp;`table`, `a`, `p`) 
or any other generic selectors (i.&nbsp;e.&nbsp;attribute, pseudo-classes) and
do not recommend to customise styles based on our class names like 
`core_label__1ORqN` because they are generated automatically and may change
from build to build.

## Internationalization

The plugin supports internationalization via the `lang` HTML attribute. 
It tries to detect desired plugin language by checking the `lang` attribute
locally in the `<div id="core-discovery-root">` tag
and globally in the `<html>` tag.

We recommend to add a `lang` attribute into the `<html>` tag.
However, if you want to change the language of CORE&nbsp;Discovery locally,
add the attribute to `<div id="core-discovery-root">`, like in the example
below.

```html
<div id="core-discovery-root" lang="en"></div>
```

English is the default language of the plugin. If you add the `lang` attribute
but the plugin will be in English, please [contact us][team-email] and
we will sort it out.


## How to blacklist a resource

In case you would like to block the&nbsp;plugin for a specific resource,
[email us][team-email] with the DOI of the resource.

## Troubleshooting

CORE&nbsp;Discovery repository plugin crawls the meta-tags of a metadata record
in the repository to check the availability of full text. If the tag
`citation_pdf_url` does not exist the&nbsp;plugin is triggered, otherwise
nothing happens.

If you find that the CORE&nbsp;Discovery repository plugin does not work in your
repository or website please ensure that the `dc.*` or `citation_` meta-tags
have been added.

If you are sure that the problem is on our side, do [contact us][team-email].


[team-email]: mailto:thet&#101;&#97;m&#64;c&#111;re&#46;&#97;c&#46;&#117;k
