# Smart Custom Element 

JavaScript library that wraps the W3C standard Web Components family of APIs to provide a compact, feature-rich interface for `Custom Elements` development.

Smart Custom Element provides a set of useful API, Data Binding, Templates, Device Agnostic Event Handling, Resize handling, Style Change Notifications, Property and Attribute Change Notifications, Property Value and Type validation, Localization, Lifecycle callback functions and much more. Our framework allows you to easily build Custom HTML Elements. Custom Elements are the web platform's native solution for component-based development. With Custom Elements, you get reusable HTML tags that can be used just like the browser’s built-in native html elements, or break your app up into small pieces, making your code cleaner and easier to maintain.

## Installation
- `npm install smart-custom-element --save`

In your web page, include `<script src="smart.element.js"></script>`

Optional polyfill for browsers without custom elements support: `webcomponents-lite.js`

## Working with Transpiled ES5 Files
When using ES5/minified files, you would also need to include a reference to the file **native-shim.js** (it can be found alongside **smart.element.js** and **smart.element-polyfills.js**).

## Version and Deployment
- This package is version according to [semantic versioning](http://semver.org).

## Browser Support and Compatibility

**[Requires ES2015 classes](https://caniuse.com/es6-class). IE11 and below not supported.**

- **If targeting browsers that natively support ES2015, but not native Web Components:**

  You will also need the [Shady DOM + Custom Elements polyfill](https://github.com/webcomponents/webcomponentsjs).

  See caniuse.com for support on [Custom Elements v1](https://caniuse.com/#feat=custom-elementsv1) and [Shadow DOM v1](https://caniuse.com/#feat=shadowdomv1)..
  
## How to Use?

Include HTML tag (e.g. ```<my-button id='button'></my-button>)``` in any time of document lifecycle. You can use your elements in e.g. SPA application just by including HTML tag. Custom Elements will auto initialize when added into document. You can include them in e.g. Vue, Angular or React projects and browser will take care of detecting it and initialization. You use it just like a native HTML Element, by changing attributes with ```button.setAttribute(attributeName, attributeValue);```, setting properties with ```button.disabled = true;``` or listening to events with ```button.addEventListener('click', function(event) { });```. 
You also take advantage of features like lazy-loading, that allows for loading components on demand, only when user add them to document

## Introduction

A basic element definition looks like this:

```javascript
Smart('smart-test', class TestElement extends Smart.BaseElement {
        // properties.
        static get properties() {
            return {
                'content': {
                    type: 'string'
                }
            };
        }

        /** Element's template. */
        template() {
            return '<div inner-h-t-m-l=\'[[innerHTML]]\'></div>';
        }

        ready() {
            super.ready();
        }

        propertyChangedHandler(propertyName, oldValue, newValue) {
            super.propertyChangedHandler(propertyName, oldValue, newValue);        
        }
    });
```

An extended element definition looks like this:

```javascript
Smart('smart-button', class Button extends Smart.ContentElement {
// Button's properties.
static get properties() {
    return {
        'value': {
            type: 'string'
        },
        'name': {
            type: 'string'
        },
        'type': {
            type: 'string'
        },
        'clickMode': {
            allowedValues: ['hover', 'press', 'release'],
            type: 'string',
            value: 'release'
        }
    };
}

/** Button's template. */
template() {
    return '<button class=\'smart-button\' inner-h-t-m-l=\'[[innerHTML]]\' id=\'button\' type=\'[[type]]\' name=\'[[name]]\' value=\'[[value]]\' disabled=\'[[disabled]]\' role=\'button\'></button>';
}

static get listeners() {
    return {
        'button.mousedown': '_mouseDownHandler',
        'button.mouseenter': '_mouseEnterHandler',
        'button.click': '_clickHandler'
    };
}

_clickHandler(event) {
    const that = this;

    if (that.clickMode !== 'release') {
        event.preventDefault();
        event.stopPropagation();
    }
}

_mouseDownHandler() {
    const that = this;

    if (that.clickMode === 'press') {
        that.$.fireEvent('click');
    }
}

_mouseEnterHandler() {
    const that = this;

    if (that.clickMode === 'hover') {
        that.$.fireEvent('click');
    }
}
});
```

The base custom element class is called `BaseElement` and is accessible through `Smart.BaseElement`. Most elements derive from `Smart.BaseElement`. `Smart.ContentElement` extends the `Smart.BaseElement` by adding `content` and `innerHTML` properties to it. It is useful when you need to append a child element by setting a single property.

## Register a Custom Element

To register a custom element, use the `Smart` function and pass in the element's tag name and class. By specification, the custom element's name must contain a dash (-). The library internally checks whether Custom Elements v1 is supported and uses its lifecycle callbacks and customElements.define. Otherwise, it uses document.registerElement and the v0 lifecycle callbacks. To use custom elements, you will need a browser which natively supports Custom Elements or you will need to load polyfills such as `webcomponentsjs`.

Resources: 

* https://developer.mozilla.org/en-US/docs/Web/Web_Components
* https://developers.google.com/web/fundamentals/getting-started/primers/customelements
* http://webcomponents.org/
* **webcomponentsjs** polyfill:
  * https://github.com/webcomponents/webcomponentsjs
  * https://www.npmjs.com/package/@webcomponents/webcomponentsjs
    * The files **webcomponents-lite.js** and **webcomponents-loader.js** have to be referenced (in this order).


## Lifecycle callbacks

* created - Called when the element has been created, but before property values are set and local DOM is initialized.
Use for one-time set-up before property values are set.
* attached - Called after the element is attached to the document. Can be called multiple times during the lifetime of an element.
* ready - Called when the element is ready. Use for one-time configuration of your element. 
* detached - Called after the element is detached from the document. Can be called multiple times during the lifetime of an element.

## Properties

To add properties on your custom element, you can use the `properties` object. All properties part of the `properties` object are automatically serialized and deserialized by the element and can also be set through attributes by using the dash(-) syntax in the HTML markup. Each property can have the following members:

* reflectToAttribute - Type: Boolean. Set to `true` to cause the corresponding attribute to be set on the host node when the property value changes. If the property value is `Boolean`, the attribute is created as a standard HTML boolean attribute (set if true, not set if false). For other property types, the attribute value is a string representation of the property value. The default value of this member is `true`. 
* defaultReflectToAttribute - Type: Boolean. Set to `true` when we want a default attribute value to be set on the host node. 
* readOnly - Type: Boolean. Determines whether the property is readyonly. if `true` the property can't be set by the user.
* type - Type: String. Used for deserializing from an attribute.
    * any - allows assigning any value to a property. 
    * string - allows assigning a `String` to a property.
    * string? - allows assigning a 'String' or null to a property.
    * boolean or bool - allows assigning a `Boolean` to a property.
    * boolean? or bool? - allows assigning a 'Boolean' or null to a property.
    * number or float - allows assigning a 'Number' to a property.
    * number? or float? - allows assigning a 'Number' or null to a property.
    * int or integer - allows assigning an 'Integer' to a property.
    * int? or integer? - allows assigning an 'Integer' or null to a property.
    * date - allows assigning a 'Date' to a property.
    * date? - allows assigning a 'Date' or null to a property.
    * array - allows assigning an 'Array' to a property.
    * object - allows assigning an 'Object' to a property.
* allowedValues - Type: Array. Used for defining a set of values which are allowed to be set. For other values, an exception is thrown.
* notify - Type: Boolean. Determines whether an event is raised when a property is changed. The event name is: property's attribute name + - 'changed'. Example: Property's name is 'clickMode', the event's name will be 'click-mode-changed'.
Example:
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="styles/smart.base.css" type="text/css" />
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.1.0/webcomponents-lite.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.1.0/webcomponents-loader.js"></script>
    <script type="text/javascript" src="smart.element.js"></script>
    <script type="text/javascript" src="smart.button.js"></script>
    <script type="text/javascript" src="smart.scrollbar.js"></script>
    <script type="text/javascript" src="smart.listbox.js"></script>
    <script type="text/javascript" src="smart.checkbox.js"></script>
    <script type="text/javascript" src="smart.radiobutton.js"></script>
    <script>
        window.onload = function () {
            var list = document.getElementById('list');

            var data = [
                {
                    label: "Andrew",
                    value: 1,
                    group: "A"
                },
                {
                    label: "Natalia",
                    value: 5,
                    group: "B"
                },
                {
                    label: "Michael",
                    value: 4,
                    group: "B"
                },
                {
                    label: "Angel",
                    value: 2,
                    group: "A"
                },
                {
                    label: "Hristo",
                    value: 6,
                    group: "C"
                },
               {
                   label: "Peter",
                   value: 3,
                   group: "A"
               },
               {
                   label: "Albert",
                   value: 4,
                   group: "A"
               },
               {
                   label: "Boyko",
                   value: 8,
                   group: "A"
               },
               {
                   label: "Dimitar",
                   value: 9,
                   group: "B"
               },
               {
                   label: "George",
                   value: 10,
                   group: "C"
               }
            ];

            list.dataSource = data;
        
            list.addEventListener('disabled-changed', function (event) {
                if (event.target === list) {
                    alert('disabled changed');
                }
            });

            document.getElementById("disabled").onclick = function () {
                list.disabled = !list.disabled;
            }

            list.properties['disabled'].notify = true;
        }
    </script>
</head>
<body>
    <smart-list-box style="float:left;" selection-mode="checkBox" id="list"></smart-list-box>
    <div style="float: left; margin-left:100px;">
        <smart-button style="width:auto;" id="disabled">Enable/Disable</smart-button>
    </div>
</body>
</html>
```
* value - Default value for the property.
* observer - Type: String. A name of a function called within the Element when the property is changed. The arguments passed to your observer are the property's `oldValue` and `newValue`.
* validator - Type: String. A name of a function called within the Element when the property is changing.  The arguments passed to your validator are the property's `oldValue` and `newValue`. The function `returns` the updated value. If it `returns undefined`, the newValue remains unchanged.
 
`propertyChangedHandler(propertyName, oldValue, newValue)` method is called when a property is changed by the user. This method is useful for updating the element when the user makes some changes.

The user may watch for property changes by using the element's instance. `watch(propertiesArray, propertyChangedCallback)`. The arguments passed to the `propertyChangedCallback` function are `propertyName, oldValue, newValue`.
## Template

The `template` object determines the internal HTML structure of the Element. Within that structure you can data bind properties by using two-way or one-way data binding.

```javascript
    template() {
        return '<button class=\'smart-button\' inner-h-t-m-l=\'[[innerHTML]]\' id=\'button\' type=\'[[type]]\' name=\'[[name]]\' value=\'[[value]]\' disabled=\'[[disabled]]\' role=\'button\'></button>';
    }
````

Text surrounded by double curly bracket ({{ }}) or double square bracket ([[ ]]) delimiters. Identifies the host element's property being bound.

* Double-curly brackets (}) is used for two-way data flow.
* Double square brackets ([[ ]]) is used for one-way downward from host element to target element data flow.

Two-way binding to a Native HTML element.
```javascript
nativeElementProperty="{{hostElementProperty::nativeElementEvent}}"
```

```javascript
Smart('my-element', class MyElement extends Smart.BaseElement {
    static get properties() {
        return {
            'check': {
                type: 'boolean'
            }
        };
    }
 
    template() {
        return '<div><input type="checkbox" checked="{{check::change}}" /></div>';
    }
});
```
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="styles/smart.base.css" type="text/css" />
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.1.0/webcomponents-lite.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.1.0/webcomponents-loader.js"></script>
    <script type="text/javascript" src="../../source/smart.element.js"></script>
    <script type="text/javascript" src="../../source/myelement.js"></script>
     <script>
         window.onload = function () {
             var myElement = document.querySelector('my-element');
             myElement.onchange = function () {
                 console.log(myElement.check);
             }
         }
    </script>
</head>
<body>
    <my-element></my-element>
</body>
</html>
```

Content insertion point determines where the HTML elements which are within the custom element's body during initialization go during the initialization. By default that is the Custom Element itself, but you can specify a custom content insertion point, you can define a `content` tag within the template's structure as in the below example:

```javascript
template() {
    return `<div>
        <svg width="100%" height="100%" viewPort="0 0 100 100" viewBox="0 0 100 100">
           <circle id="value" class ="smart-value" r="50" cx="50" cy="50" transform="rotate(270 50 50)"></circle>
        </svg>
        <div class="smart-label-container"><content></content><div id="label" class="smart-label"></div></div>
    </div>`;
}
```


After the template is parsed, each element of the HTML Structure is accessible via its `id` and the `$` symbol. Note the `checkboxInput` element in the below example:

```javascript
/**
* CheckBox custom element.
*/
Smart('smart-checkbox', class CheckBox extends Smart.ToggleButton {
    // CheckBox's properties.
    static get properties() {
        return {
            'enableContainerClick': {
                value: true,
                type: 'boolean'
            }
        };
    }

    /** Checkbox's Html template. */
    template() {
        return `<div id='container' class='smart-container'>
                 <div id='checkboxAnimation' class ='smart-animation'></div>
                 <span id='checkboxInput' class ='smart-input'></span>
                 <span id='checkboxLabel' inner-h-t-m-l='[[innerHTML]]' class ='smart-label'><content></content></span>
               </div>`;
    }

    static get listeners() {
        return {
            'click': '_clickHandler'
        };
    }

    /** Called when the element is ready. Used for one-time configuration of the Checkbox. */
    ready() {
    }

    /** Changes the check state wneh widget container is clicked. */
    _clickHandler(event) {
        const that = this;

        if (that.disabled) {
            return;
        }

        const isInputClicked = event.target === that.$.checkboxInput;

        if ((that.enableContainerClick === true && !isInputClicked) || isInputClicked) {
            that._changeCheckState('pointer');
            that.focus();
        }
    }
});

```
A set of utility functions is accessible throught the `$` symbol. The syntax is `element.$`.The utilify functions are:
*   addClass(className) - adds a class or classes to the element separated by space.
*   removeClass(className) - removes a class or classes separated by space.
*   isNativeElement - returns `true` if the element is native HTML Element. Otherwise returns `false`.
*   fireEvent(eventType, detail, options) - fires a Custom Event.
    * eventType - String. Determines the event's type.
    * detail - Object. Determines custom event object passed to the user.
    * options - Object. Determines the event's options like `cancelable` or `bubbles`. Read more on: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
*   listen(eventType, handler) - adds an event listener to the element. A set of Mobile-friendly events are supported by default. By passing any of these event types: `down, up, move, tap, taphold, swipeleft, swiperight, swipetop, swipebottom`, you will be notified when the user taps, swipes or touches with finger or mouse the element. If you listen to the `resize` event, you will be notified whenever the element's boundaries are changed.
*   unlisten(eventType)  - removes event listener by type.
*   getAttributeValue(attributeName, type) - gets the attribute's typed value.
*   setAttributeValue(attributeName, value, type) - sets the attribute's value by using a typed value.

By invoking `Smart.Utilities.Extend(element)` you can extend any element with the above utility functions. 

In order to add a custom utility class, you can use `Smart.Utilities.Assign(classDefinition)`.

```javascript
Smart.Utilities.Assign('BaseNumericProcessor', class BaseNumericProcessor {
}
```

To access that class, you can use `Smart.Utilities.BaseNumericProcessor`.

```*if and *items template directives.```

If in the Template's definition, we have a HTMLTemplateElement, we can use these directives to insert HTML.

* *if - Conditionally includes a template based on the value of a property.
* *items - Repeating a template by using each item of an iterable as that template's context.
* templateAttached - function called when the HTMLTemplateElement is attahed to the DOM.
* templateDetached - function called when the HTMLTemplateElement is detached from the DOM.
* refreshTemplate - you can use this function to re-evaluate and refresh the HTMLTemplateElement.

The below example creates a custom element called ```smart-test```. Within its template, the *if and *items directives are used. When the value of a property called ```condition``` is set to true, we render all items contained in the ```source``` property. When the value is set to false, we render again all items, but by using INPUT tags.

```
<!DOCTYPE html>
<html lang="en">
<head>

    <script type="text/javascript" src="../../source/smart.element.js"></script>
    <script>
        Smart('smart-test', class Test extends Smart.BaseElement {
            // Toggle Button's properties.
            static get properties() {
                return {
                    'name': {
                        value: 'test',
                        type: 'string'
                    },
                    'name2': {
                        value: 'Atest',
                        type: 'string'
                    },
                    'condition': {
                        value: true,
                        type: 'boolean'
                    },
                    'disabled': {
                        value: false,
                        type: 'boolean'
                    },
                    'source': {
                        value: [],
                        type: 'array'
                    }
                };
            }

            template() {
                return '<div><div>{{name2}}</div><template><div *if={{condition}}><span>{{name}}</span></div><ul  *if={{condition}} *items={{source}}><li>{{item.name}}<input  disabled={{disabled}}  value="{{item.name}}"></input</li></ul></template></div>'
            }

            templateAttached(template) {
                var inputs = template.querySelectorAll('input');

                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].addEventListener('change', function () {
                        alert('test');
                    });
                }
            }

            templateDetached(template) {

            }

            test() {
                return this.condition;
            }
            /**
            * Toggle Button's event listeners.
            */
            static get listeners() {
                return {
             
                };
            }

            /** Called when the element is ready. Used for one-time configuration of the ToggleButton. */
            ready() {
                super.ready();
            }
        });


        window.onload = function () {
            var test = document.querySelector('smart-test');

            test.source = [
                { name: "Name 1" },
                { name: "Name 2" },
                { name: "Name 3" },
                { name: "Name 4" },
                { name: "Name 5" }
            ]

            document.querySelector('button').onclick = function () {
                test.name2 = "TEST";
        
                test.source = [
                { name: "New Name 1" },
                { name: "New Name 2" },
                { name: "New Name 3" },
                { name: "New Name 4" },
                { name: "New Name 5" }
                ]
                test.disabled = true;
                test.condition = true;

            }
        }
    </script>
</head>
<body>
    <smart-test></smart-test>
    <button>Update</button>
</body>
</html>
```
## Events

The `listeners` object allows you to add and map events to event handlers. 

In the below example, the `listeners` object defines that a method called `_clickHandler` is called when the element is clicked. To listen to an event of an element from the template, you can use `nodeId.eventName` like `checkboxInput.click:_clickHandler`. 

```javascript
/**
* CheckBox custom element.
*/
Smart('smart-checkbox', class CheckBox extends Smart.ToggleButton {
    // CheckBox's properties.
    static get properties() {
        return {
            'enableContainerClick': {
                value: true,
                type: 'boolean'
            }
        };
    }

    /** Checkbox's Html template. */
    template() {
        return `<div id='container' class='smart-container'>
                 <div id='checkboxAnimation' class ='smart-animation'></div>
                 <span id='checkboxInput' class ='smart-input'></span>
                 <span id='checkboxLabel' inner-h-t-m-l='[[innerHTML]]' class ='smart-label'><content></content></span>
               </div>`;
    }

    static get listeners() {
        return {
            'click': '_clickHandler'
        };
    }

    /** Called when the element is ready. Used for one-time configuration of the Checkbox. */
    ready() {
    }

    /** Changes the check state wneh widget container is clicked. */
    _clickHandler(event) {
        const that = this;

        if (that.disabled) {
            return;
        }

        const isInputClicked = event.target === that.$.checkboxInput;

        if ((that.enableContainerClick === true && !isInputClicked) || isInputClicked) {
            that._changeCheckState('pointer');
            that.focus();
        }
    }
});

```
Binding to events within the Element's template.
```javascript
Smart('my-element', class MyElement extends Smart.BaseElement {
    static get properties() {
        return {
            'check': {
                type: 'boolean'
            }
        };
    }
 
    template() {
        return '<div><input id="checkbox" (change)="_changeHandler" type="checkbox" checked="{{check::change}}" /></div>';
    }

    _changeHandler() {
        alert('Checkbox State Changed');
    }
});
```

By using the utility functions described in the previous section, you can dynamically add and remove event listeners.

## Data Context

The Data Context functionality of Smart Custom Element enables:

* Dependency tracking - automatically updates parts of UI whenever a data model changes. 
* Declarative bindings - a way to connect parts of UI to a data model. 

The DataContext can be applied in two ways - by calling a method called ```applyDataContext``` or by setting a ```data-context``` attribute in the element's definition pointing to a DataModel object.

The following example demonstrates how to use the ```DataContext``` feature.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.0.22/webcomponents-lite.js"></script>
    <link rel="stylesheet" href="styles/smart.base.css" type="text/css" />
    <script type="text/javascript" src="smart.element.js"></script>
    <script type="text/javascript" src="smart.button.js"></script>
    <script type="text/javascript" src="smart.scrollbar.js"></script>
    <script type="text/javascript" src="smart.listbox.js"></script>
    <script type="text/javascript" src="smart.checkbox.js"></script>
    <script type="text/javascript" src="smart.radiobutton.js"></script>
    <script type="text/javascript" src="smart.dropdownlist.js"></script>
    <script type="text/javascript" src="smart.combobox.js"></script>
    <script type="text/javascript" src="smart.textbox.js"></script>
    <script>
        window.onload = function () {
            const data = [
            {
                label: "Andrew",
                value: 1,
                group: "A"
            },
            {
                label: "Natalia",
                value: 5,
                group: "B"
            },
            {
                label: "Michael",
                value: 4,
                group: "B"
            },
            {
                label: "Angel",
                value: 2,
                group: "A"
            },
            {
                label: "Hristo",
                value: 6,
                group: "C"
            },
           {
               label: "Peter",
               value: 3,
               group: "A"
           },
           {
               label: "Albert",
               value: 2,
               group: "A"
           },
           {
               label: "Boyko",
               value: 8,
               group: "A"
           },
           {
               label: "Dimitar",
               value: 2,
               group: "B"
           },
           {
               label: "George",
               value: 10,
               group: "C"
           }
            ];

            window.listBoxSettings = {
                dataSource: data,
                selectionMode: 'checkBox'
            }

            const SimpleListModel = function (items) {
                this.items = items;
                this.itemToAdd = "";
                this.addItem = function () {
                    if (this.itemToAdd !== "") {
                        this.items = this.items.concat(this.itemToAdd);
                        this.itemToAdd = ""; // Clears the text box, because it's bound to the "itemToAdd" observable
                    }
                }.bind(this);  // Ensure that "this" is always this view model
            };


            const listBox = document.querySelector('smart-list-box');
            const textBox = document.querySelector('smart-text-box');
            const button = document.querySelector('smart-button');
            const model = new SimpleListModel(["Alpha", "Beta", "Gamma"]);

            listBox.applyDataContext(model);
            textBox.applyDataContext(model);
            button.applyDataContext(model);

        }
    </script>
</head>
<body>
    <smart-list-box style="float:left;"  data-source="{{items}}"  id="list">
    </smart-list-box>
    <smart-text-box value="{{itemToAdd}}">
    </smart-text-box>
    <div style="float: left; margin-left:100px;">
        <smart-button (click)="addItem()" id="changeSource">Add</smart-button>
    </div>
</body>
</html>
```

By using double-curly braces, we declare the property bindings. By using braces, we define the event bindings. The ```dataSource``` property is bound to the ```SimpleListModel```'s ```items``` property. When the property is changed, the UI is automatically updated. The button's ```click``` event is bound to the ```SimpleListModel```'s ```addItem``` function. When the button is clicked, the function is called. The ```value``` of the TextBox updates the ```SimpleListModel```'s ```itemToAdd``` property and vice versa.

## Modules

To add a missing feature or override a feature of a Custom Element, you can define a Module. The module represents a javascript class. By defining its `properties` object, you can add new properties or override existing properties of the custom element. Methods defined within that class also extend or override custom element methods. The lifecycle callback functions usage is the same as in the element.  To add a module to a custom element, you can use the `addModule` function. The owner element is accessible through a property called `ownerElement`.

```javascript
window.Smart.Elements.whenRegistered('smart-button', function (proto) {
    proto.addModule(ColorModule);
});
```

Custom Module which adds a new `color` property to the `smart-button` custom element. 
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="../../source/styles/smart.base.css" type="text/css" />
    <link rel="stylesheet" href="../styles/demos.css" type="text/css" />
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.1.0/webcomponents-lite.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.1.0/webcomponents-loader.js"></script>
    <script type="text/javascript" src="../../source/smart.element.js"></script>
    <script type="text/javascript" src="../../source/smart.button.js"></script>
    <script>
        class ColorModule  {
             static get properties() {
                 const properties =
                 {
                     'color': {
                         value: 'red',
                         type: 'string',
                         observer: 'setColor'
                     }
                 }

                 return properties;
             }

            attached() {
            }

            detached() {
            }

            created() {
            }

            ready() {
                this.ownerElement.$.button.style.color = this.color;
            }

            setColor(oldColor, color) {
                this.ownerElement.$.button.style.color = this.color;
            }
        }
  
        window.Smart.Elements.whenRegistered('smart-button', function (proto) {
            proto.addModule(ColorModule);
        });
    </script>

    <script>
        function clickMe(event) {
            let button = document.getElementById("button");
            button.color = 'green';
        }
    </script>
</head>
<body>
    <smart-button id="button" onclick="clickMe(event)">Click Me</smart-button>
</body>
</html>
```

It is a good practise to implement the 'moduleName' property when you create a custom module.

```javascript
static get moduleName() {
    return 'MyModule';
}
```

## Inheritance

You can create a new Custom Element which extends an existing one. When you call the `Smart` function, pass a class as a second argument which determines which element should be extended. All elements are registered within the `Smart` global namespace and are accessible through their class name. 

The below example demonstrates how to create a new element called `smart-repeat-button` which extends the `smart-button` element.
```javascript
/**
* Repeat Button.
*/
Smart('smart-repeat-button', class RepeatButton extends Smart.Button {
    // button's properties.
    static get properties() {
        return {
            'delay': {
                value: 50,
                type: 'number'
            },
            'initialDelay': {
                value: 150,
                type: 'number'
            }
        };
    }

    static get listeners() {
        return {
            'button.mousedown': '_startRepeat',
            'button.mouseenter': '_updateInBoundsFlag',
            'button.mouseleave': '_updateInBoundsFlag',
            'document.mouseup': '_stopRepeat'
        };
    }

    _updateInBoundsFlag(event) {
        const that = this;

        that._isPointerInBounds = true;

        if (event.type === 'mouseleave') {
            that._isPointerInBounds = false;
        }
    }

    _startRepeat(event) {
        const that = this;

        if (!that._initialTimer) {
            that._initialTimer = setTimeout(function () {
                that._repeatTimer = setInterval(() => {
                    if (that._isPointerInBounds) {
                        const buttons = ('buttons' in event) ? event.buttons : event.which;
                        that.$.fireEvent('click', { buttons: buttons });
                    }
                }, that.delay);
                that._initialTimer = null;
            }, that.initialDelay);
        }
    }

    _stopRepeat() {
        const that = this;

        if (that._repeatTimer) {
            clearInterval(that._repeatTimer);
            that._repeatTimer = null;
        }

        if (that._initialTimer) {
            clearTimeout(that._initialTimer);
            that._initialTimer = null;
        }
    }
});
```


