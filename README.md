# KemystryJS

KemystryJS is a library designed to make writing and using plugins fun and simple. 


For Developers:

It's an abstraction library that takes care of the boilerplate, so you can focus on what the plugin actually does.


For Users:

It's a simple way to add functionality to elements with minimal effort.


## Introduction

For Developers:

The hardest part of building plugins is not the logic itself, it's the boring stuff; setting up event listeners, merging user configs, managing classes, handling "states", dispatching events, etc... 

Furthermore, on the Web today, most plugins are released as "jQuery" plugins, dont get me wrong, jQuery is great, but why should I load all of jQuery if the only reason is a plugin. Most plugins regardless of if through jQuery or Standalone exist isolated from each other, which means they all repeat the same expensive tasks and are unable to work togeather. KemystryJS solves this problem. It provides a common API for plugin authors to hook in to, so all the hard work happens once, and all plugins can communicate which allows them to extend or react to other plugins. AND! One last added bonus, KemystryJS's styling system automaticly manages all styles of a plugin and any of its states using a style tag, no inline styles here, which allows for better readability, cleaner html, and easier overwriting by non KemystryJS stylesheets due to lower specificity than inline styles. :)


For Users:

We all know the story of plugins in the wild.
Just a couple examples: 
+ Include jQuery-2.0.js and jquery.superPlugin.js to your html, then Add "$(".selector").superPlugin({some: options});" to your main js file.
+ Add "superplugin.js" the add the class "superPlugin-item-class-js" to the elements you want to check and call "superPluginInit();" in your main js file.

If only running one plugin on one set of elements the above may be relativly harmless. But, what if you wanted to even just use 3 plugins across multiple sets of elements. Implementation can quickly become sloppy and haphazard using class names that should only be used for styling, or creating new classes for each plugin to use on its own. Why!? AND I didnt even mention if you wanted each to have different basic config differences! woop! There must be a better way?

In KemystryJS all plugins, also known as Kemycals, use the exact same simple interface and don't rely on classes at all. Instead, KemystryJS uses Formulas. You can think of Formulas like classes on crack or classes 2.0 because Formulas don't just tell a plugin where it should execute but can also tell the plugin simple instance configuration options or status information. 

Additionally, Every KemystryJS plugin, also known as a Kemycal, that you add to your page are automaticly loaded and when found in a Formula are automaticly executed. No need to figure out selectors and call a silly function. You may not even need to touch javascript at all in most situations. 

## Advantages

- Easy to use for everyone.
- Easy to extend and build kemycals.
- There is *no need* for *third party* libraries.
- No extra functionality that you don't use or need.
- Increases you're speed of development.
- Gives developers an easy way to quikly build reusable kemycals.
- Gives users an easy way to quikly add lots of functionality with no javascript coding.

 
## Usage

##### Include *KemystryJS*.
```html
    <script src="kemystry.js"></script>
```
##### Add the *kemycals* that you want to utilize on the page.
```html
    <script src="kemystry.js"></script>
    <script src="trig.keymcal.js"></script> <!-- A simple toggle keymcal -->
```
##### Start doing Kemystry by adding the data-kemy attribute to any HTML element.
```html
    <body>
        <div data-kemy="trig:clicky,show">
            When you click the button I appear! Click it again and I disappear!
        </div>
        <button data-kemy="trig:clicky,toggle">
            Click Me!
        </button>
        <script src="kemystry.js"></script>
        <script src="trig.keymcal.js"></script>
    </body>
```

## Glossary
These are just brief descriptions about terms associtated with KemystryJS. For extended documentation see: [Full KemystryJS Documentation](http://wearekemy.com). 

Kemystry was based on a pun of *chemisty* mixed with *Kemy*, from [We Are Kemy](http://wearekemy.com). With that the core idea of KemystryJS lended itself to many of the terms and methods set forth in real chemistry... hehe ... If you know about chemistry hopefully alot of these terms actually make it easier to use.

**Kemycal**: 
> A component/plugin/addon built for use with `KemystryJS`.

**Symbol**:
> The identifier of a `Kemycal`. Often used in a `Kemycal` `Formula`. 
> 
> *ex.* data-kemy="`symbol`:state"

**State**: 
> The phase or value of a `Kemycal` instance. 
> 
> *ex.* data-kemy="symbol:`state`"

**KemycalMixture**:
> A collection of `Kemycal`s that you can execute special methods on.

**Beaker**: 
> `Beaker`s are used to create, prepare, and source properties for all `Kemycal` instances by defining things like the `Kemycal`'s' `Symbol`, `Extensive` Properties, `Intensive` Properties, `Procedures`, and more.

**Extensive**:
> These are `Kemycal` properties that can change based on user conditions or react `Procedures`.

**Intensive**:
> These are `Kemycal` properties that cannot be changed and are defined by the `Kemycal`.

**Procedures**:
> These are standard or custom operations/functions that can be executed as defined by the `Kemycal` instance.

**Formula**: 
> A string of `Symbol`/`State` pairs. A `Formula` usually this refers to the contents of the `data-kemy` attribute but can be any string indicating `Symbol`/`State` pairs. 
> 
> *ex.* data-kemy="`trig:key,act uc:p,t,20 size:1/2`"

**Tube**: 
> A `Tube` is a dom element with a `KemystryJS` `Formula` attached to it. These usually have a `KemycalMixture` associated with it.

**TubeRack**:
> A collection of `Tube`s that you can execute special methods on.


## License
 
The MIT License (MIT)

Copyright © 2016 Keal Jones <keal@wearekemy.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
