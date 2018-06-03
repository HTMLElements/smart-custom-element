/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * This shim allows elements written in, or compiled to, ES5 to work on native
 * implementations of Custom Elements.
 *
 * ES5-style classes don't work with native Custom Elements because the
 * HTMLElement constructor uses the value of `new.target` to look up the custom
 * element definition for the currently called constructor. `new.target` is only
 * set when `new` is called and is only propagated via super() calls. super()
 * is not emulatable in ES5. The pattern of `SuperClass.call(this)`` only works
 * when extending other ES5-style classes, and does not propagate `new.target`.
 *
 * This shim allows the native HTMLElement constructor to work by generating and
 * registering a stand-in class instead of the users custom element class. This
 * stand-in class's constructor has an actual call to super().
 * `customElements.define()` and `customElements.get()` are both overridden to
 * hide this stand-in class from users.
 *
 * In order to create instance of the user-defined class, rather than the stand
 * in, the stand-in's constructor swizzles its instances prototype and invokes
 * the user-defined constructor. When the user-defined constructor is called
 * directly it creates an instance of the stand-in class to get a real extension
 * of HTMLElement and returns that.
 *
 * There are two important constructors: A patched HTMLElement constructor, and
 * the StandInElement constructor. They both will be called to create an element
 * but which is called first depends on whether the browser creates the element
 * or the user-defined constructor is called directly. The variables
 * `browserConstruction` and `userConstruction` control the flow between the
 * two constructors.
 *
 * This shim should be better than forcing the polyfill because:
 *   1. It's smaller
 *   2. All reaction timings are the same as native (mostly synchronous)
 *   3. All reaction triggering DOM operations are automatically supported
 *
 * There are some restrictions and requirements on ES5 constructors:
 *   1. All constructors in a inheritance hierarchy must be ES5-style, so that
 *      they can be called with Function.call(). This effectively means that the
 *      whole application must be compiled to ES5.
 *   2. Constructors must return the value of the emulated super() call. Like
 *      `return SuperClass.call(this)`
 *   3. The `this` reference should not be used before the emulated super() call
 *      just like `this` is illegal to use before super() in ES6.
 *   4. Constructors should not create other custom elements before the emulated
 *      super() call. This is the same restriction as with native custom
 *      elements.
 *
 *  Compiling valid class-based custom elements to ES5 will satisfy these
 *  requirements with the latest version of popular transpilers.
 */
(function () {
    
/* Smart HTML Elements v1.0.0 (2018-April) 
Copyright (c) 2011-2018 jQWidgets. 
License: http://htmlelements.com/pricing/ */

"use strict";

    if (!window.customElements) {
        return;
    }

    var NativeHTMLElement = window.HTMLElement;
    var nativeDefine = window.customElements.define;
    var nativeGet = window.customElements.get;

    /**
     * Map of user-provided constructors to tag names.
     *
     * @type {Map<Function, string>}
     */
    var tagnameByConstructor = new Map();

    /**
     * Map of tag anmes to user-provided constructors.
     *
     * @type {Map<string, Function>}
     */
    var constructorByTagname = new Map();


    /**
     * Whether the constructors are being called by a browser process, ie parsing
     * or createElement.
     */
    var browserConstruction = false;

    /**
     * Whether the constructors are being called by a user-space process, ie
     * calling an element constructor.
     */
    var userConstruction = false;

    window.HTMLElement = function () {
        if (!browserConstruction) {
            var tagname = tagnameByConstructor.get(this.constructor);
            var fakeClass = nativeGet.call(window.customElements, tagname);

            // Make sure that the fake constructor doesn't call back to this constructor
            userConstruction = true;
            var instance = new (fakeClass)();
            return instance;
        }
        // Else do nothing. This will be reached by ES5-style classes doing
        // HTMLElement.call() during initialization
        browserConstruction = false;
    };

    window.HTMLElement.prototype = Object.create(NativeHTMLElement.prototype);
    window.HTMLElement.prototype.constructor = window.HTMLElement;


    window.customElements.define = function(tagname, elementClass) {
        var elementProto = elementClass.prototype;
        var StandInElement = class extends NativeHTMLElement {
            constructor() {
                // Call the native HTMLElement constructor, this gives us the
                // under-construction instance as `this`:
                super();

                // The prototype will be wrong up because the browser used our fake
                // class, so fix it:
                Object.setPrototypeOf(this, elementProto);

                if (!userConstruction) {
                    // Make sure that user-defined constructor bottom's out to a do-nothing
                    // HTMLElement() call
                    browserConstruction = true;
                    // Call the user-defined constructor on our instance:
                    elementClass.call(this);
                }
                userConstruction = false;
            }
        };
        var standInProto = StandInElement.prototype;
        StandInElement.observedAttributes = elementClass.observedAttributes;
        standInProto.connectedCallback = elementProto.connectedCallback;
        standInProto.disconnectedCallback = elementProto.disconnectedCallback;
        standInProto.attributeChangedCallback = elementProto.attributeChangedCallback;
        standInProto.adoptedCallback = elementProto.adoptedCallback;

        tagnameByConstructor.set(elementClass, tagname);
        constructorByTagname.set(tagname, elementClass);
        nativeDefine.call(window.customElements, tagname, StandInElement);
    };

    window.customElements.get = function (tagname) {
        constructorByTagname.get(tagname);
    }

    // patch all built-in subclasses of HTMLElement to inherit from the new HTMLElement
    // See https://html.spec.whatwg.org/multipage/indices.html#element-interfaces

    /** @var */
    var htmlElementSubclasses = [
      'Button',
      'Canvas',
      'Data',
      'Head',
      'Mod',
      'TableCell',
      'TableCol',
      'Anchor',
      'Area',
      'Base',
      'Body',
      'BR',
      'DataList',
      'Details',
      'Dialog',
      'Div',
      'DList',
      'Embed',
      'FieldSet',
      'Form',
      'Heading',
      'HR',
      'Html',
      'IFrame',
      'Image',
      'Input',
      'Keygen',
      'Label',
      'Legend',
      'LI',
      'Link',
      'Map',
      'Media',
      'Menu',
      'MenuItem',
      'Meta',
      'Meter',
      'Object',
      'OList',
      'OptGroup',
      'Option',
      'Output',
      'Paragraph',
      'Param',
      'Picture',
      'Pre',
      'Progress',
      'Quote',
      'Script',
      'Select',
      'Slot',
      'Source',
      'Span',
      'Style',
      'TableCaption',
      'Table',
      'TableRow',
      'TableSection',
      'Template',
      'TextArea',
      'Time',
      'Title',
      'Track',
      'UList',
      'Unknown',
    ];

    for (var i = 0; i < htmlElementSubclasses.length; i++) {
        var ctor = window['HTML' + htmlElementSubclasses[i] + 'Element'];
        if (ctor) {
            ctor.prototype.__proto__ = window.HTMLElement.prototype;
        }
    }
})();