# KemystryJS

KemystryJS is a different kind of library. It is 

## Getting Started


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

**TestTube**: 
> A `TestTube` is a dom element with a `KemystryJS` `Formula` attached to it. These usually have a `KemycalMixture` associated with it.

**TestTubeRack**:
> A collection of `TestTube`s that you can execute special methods on.


## License
 
The MIT License (MIT)

Copyright © 2016 Keal Jones <keal@wearekemy.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
