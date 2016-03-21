Cardigan uses a *simple namespacing convention*, *meaningful hyphens*, and *magical capital letters* to help you write and maintain your styles.

### Namespaces

Namespaces are used to separate concerns with regards to styling.

They have the added bonus of providing a quick and easy way to add project specific autocompletion to your IDE or text editor.

![](https://placehold.it/1600x400&text=screenshot+of+that+happening)

#### Components

    c-ComponentName

Components are prefixed with a <code>c-</code> and are written using PascalCase.

They are the only elements to use PascalCase and so stand out in the <abr>DOM</abr>.

They are concrete, implementation specific parts of the <abr>UI</abr> and are things clients will refer to.

Due to their nature, modifying component classes is relatively safe.

Components may have descendants and/or modifiers.



<div style="display:flex";>

<div>
<a href="#" class="c-Teaser u-bg--tango u-roundedEdges">
</div>

<div class="c-Teaser-imageContainer">
<img src="https://placehold.it/400x200&amp;text=😃" alt="Antenatal advice and support" class="c-Teaser-image">
</div>

<div class="c-Teaser-label">
<h2 class="c-Teaser-title">
Ways to raise
</h2>
<span class="c-Teaser-text">
From games nights to extreme challenges, there&#x27;s a something for everyone
</span>
</div>

</a>

<div>
<a href="#" class="c-Teaser u-bg--pink u-roundedEdges">
</div>

<div class="c-Teaser-imageContainer">
<img src="https://placehold.it/400x200&amp;text=😃" alt="Antenatal advice and support" class="c-Teaser-image">
</div>

<div class="c-Teaser-label">
<h2 class="c-Teaser-title">
Fundraising packs
</h2>
<span class="c-Teaser-text">
Ready to go forms and postsers - just pick your date and venue!
</span>
</div>

</a>

<div>
<a href="#" class="c-Teaser u-bg--taxi u-roundedEdges">
</div>

<div class="c-Teaser-imageContainer">
<img src="https://placehold.it/400x200&amp;text=😃" alt="Antenatal advice and support" class="c-Teaser-image">
</div>

<div class="c-Teaser-label">
<h2 class="c-Teaser-title">
Events
</h2>
<span class="c-Teaser-text">
Get inspiration from previous fundraisers
</span>
</div>

</a>
</div>


    c-Teaser

     c-Teaser-label

#### Objects

    o-objectName

Objects are prefixed with an <code>o-</code> and are written using camelCase.

They are reusable patterns that appear many times across the codebase.

Due to their nature modification is dangerous as it may have knock-on effects in unrelated parts of the project.

Objects may have descendants and/or modifiers.


#### Utilities

<pre class="u-textCenter">
  <code>u-textCenter</code>
</pre>

Utilities are prefixed with a u- and are written using camelCase.

They have very specific roles and follow the SRP and often only have one declaration that uses an !important.


#### Theme

    t-youthZone

Themes are prefixed with a t- and are written using camelCase.

They are responsible for adding a theme to a view. This lets us know that child Components may appear differently as a result.



<div class="t-youthZone" style="display:flex;" >
<a href="#" class="c-Teaser u-bg--scrubs u-roundedEdges u-block" style="flex-basis:33%;display:flex;align-items:center">

<div class="c-Teaser-label">
<h2 class="c-Teaser-title">
Antenatal advice and support
</h2>
</div>

</a>
<a href="#" class="c-Teaser u-bg--pink u-roundedEdges u-block" style="flex-basis:33%;display:flex;align-items:center" >

<div class="c-Teaser-label">
<h2 class="c-Teaser-title">
Get involved
</h2>
</div>

</a>
<a href="#" class="c-Teaser u-bg--blue u-roundedEdges u-block" style="flex-basis:33%;display:flex;align-items:center" >

<div class="c-Teaser-label">
<h2 class="c-Teaser-title">
Support when you need it most
</h2>
</div>

</a>
</div>


#### Scope

    s-cmsContent

Scopes are prefixed with a s- and are written using camelCase.

They are similar to themes however they are used for scoping particular styles to a particular part of the site.

They are similar to themes however they are used for scoping particular styles to a particular part of the site.

An example of this may be a WYSIWYG editor, as [it's easier to change the styles on the scope than in the content](https://css-tricks.com/class-up-templates-not-content).


#### State

    is-animating or has-dropdown

States are prefixed with <code>is-</code> or <code>has-</code> and are written using camelCase.

Stateful namespaces tell us about short-lived or temporary states of the UI. They are used by chaining classes from the component they are attached to, eg. .c-Form.is-submitting. This allows the same state to be reused on multiple components throughout the project.

They also signify in the CSS which possible states a Component may have:

    .c-Modal {

      &.is-loading {…}

      &.is-open {…}

    }


#### Hack

    _hack

Hacks are prefixed with an underscore _ and are written using camelCase.

They are used to clearly signify hacky code or a temporary override on the rare occasion that some is used.

They signify that the code should not be extended or modified and that, given enough resources, this should be refactored.


#### JavaScript Behaviour

    js-menuButton

Elements that have attached JavaScript functionality are prefixed with js- and are written using camelCase.

JavaScript and CSS are separate concerns and as such should use different hooks.


#### QA

    qa-errorLogin

QA hooks are prefixed with qa- and are written using camelCase.

They are used as hooks when running automated tests. The reasoning behind this is to separate styling from testing, as you can now refactor styling classes whilst leaving testing alone.

### Meaningful Hyphens

Hyphens are used to signify relationships between classes.

Of all the possible combinations of hyphen usage around the web, ie. SUIT or BEM/BEMIT, the following were chosen as they are the easiest to work with in IDEs and text editors.

Try double clicking on the nouns inside the following:

    BEM c-component-name__child-element--modifier

    SUIT c-ComponentName-childElement--modifier

The difference becomes more obvious when working inside an editor.

#### Descendents

    c-ComponentName-descendentName

Child elements are prefixed with a single dash - and are written using camelCase.

This encapsulates the styles of this descendent.

#### Modifiers

    c-ComponentName--modifier

Modifiers of a component are prefixed with two dashes -- and are written using camelCase.

They should be used in addition to the base component class eg. <code>&lt;div class="c-ComponentName c-ComponentName--modifer"&gt;</code> as the modifier class will only apply the additional modified styles. By chaining different modifiers you can create a variety of different components from the original.

### Further reading

- http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/
- http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/
- https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md
- https://benfrain.com/fun-css-naming-convention-explained/
