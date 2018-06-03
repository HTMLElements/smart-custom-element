
/* Smart HTML Elements v1.0.0 (2018-April) 
Copyright (c) 2011-2018 jQWidgets. 
License: http://htmlelements.com/pricing/ */

"use strict";

(function () {
    
/* Smart HTML Elements v1.0.0 (2018-April) 
Copyright (c) 2011-2018 jQWidgets. 
License: http://htmlelements.com/pricing/ */

"use strict";

    /**
     * This is a base class for localization. Users can implement it in order to handle translations via i18n.
     */

    var LocalizationModule = function () {
        function LocalizationModule() {
            babelHelpers.classCallCheck(this, LocalizationModule);
        }

        babelHelpers.createClass(LocalizationModule, [{
            key: 'addMessages',


            /** 
             * Adds messages. 
             * @param {String} - the string value's key.
             * @param {Object} - the messages object.
             */
            value: function addMessages(messageKey, messages) {
                var that = this;

                Object.assign(that.messages[messageKey], messages);
            }

            /**
              * Translates a text.
              * @param {String} the string value's key.
              * @param {Object} the values to be replaced in the string.
              * @return {String} the translated text.
             */

        }, {
            key: 'localize',
            value: function localize(messageKey, messageArguments) {
                var that = this;

                if (!that.messages || !that.messages[that.locale]) {
                    return undefined;
                }

                var message = that.messages[that.locale][messageKey];

                if (!message) {
                    return undefined;
                }

                var defaultMessage = message;
                for (var messageName in messageArguments) {
                    var messageValue = messageArguments[messageName];
                    message = message.replace(new RegExp('{{' + messageName + '}}', 'g'), messageValue);
                }

                if (that.localizeFormatFunction) {
                    that.localizeFormatFunction(defaultMessage, message, messageArguments);
                }

                return message;
            }
        }], [{
            key: 'moduleName',
            get: function get() {
                return 'LocalizationModule';
            }
        }, {
            key: 'properties',
            get: function get() {
                var properties = {
                    'messages': {
                        value: { en: {} },
                        type: 'object',
                        inherit: true,
                        reflectToAttribute: false
                    },
                    'locale': {
                        value: 'en',
                        type: 'string',
                        reflectToAttribute: false
                    },
                    'localizeFormatFunction': {
                        value: undefined,
                        type: 'function',
                        reflectToAttribute: false
                    }
                };

                return properties;
            }
        }]);
        return LocalizationModule;
    }();

    /**
     * This is a base class for error logging.
     */


    var ErrorModule = function () {
        function ErrorModule() {
            babelHelpers.classCallCheck(this, ErrorModule);
        }

        babelHelpers.createClass(ErrorModule, [{
            key: 'log',


            /** Displays a log in the console.*/
            value: function log(message) {
                var that = this;

                that._logger('log', message);
            }

            /** Displays a warning in the console.*/

        }, {
            key: 'warn',
            value: function warn(message) {
                var that = this;

                that._logger('warn', message);
            }

            /** Displays an error in the console.*/

        }, {
            key: 'error',
            value: function error(message) {
                var that = this;

                that._logger('warn', message);
            }

            /**
              Logs an Error.
              @param {String} the error's level - 'warn', 'error' or 'log'.
              @param {Error} the error to be logged.
             */

        }, {
            key: '_logger',
            value: function _logger(level, error) {
                var that = this;

                if (that.debugMode) {
                    var errorMessage = error instanceof Error ? error.message : error.toString();

                    console[level](errorMessage);
                }

                if (that.rethrowError) {
                    throw error;
                }
            }
        }], [{
            key: 'moduleName',
            get: function get() {
                return 'ErrorModule';
            }
        }, {
            key: 'properties',
            get: function get() {
                var properties = {
                    'rethrowError': {
                        value: true,
                        type: 'boolean',
                        reflectToAttribute: false
                    },
                    'debugMode': {
                        value: true,
                        type: 'boolean',
                        reflectToAttribute: false
                    }
                };

                return properties;
            }
        }]);
        return ErrorModule;
    }();

    /**
     * This is a base class for data binding.
     */


    var BindingModule = function () {
        function BindingModule() {
            babelHelpers.classCallCheck(this, BindingModule);
        }

        babelHelpers.createClass(BindingModule, [{
            key: 'getBindings',


            /**
             * @typedef {Object} bindings
             * @property {Array<Node>} children The child nodes.
             * @property {Node} node The node.
             * @property {BindingData} data The node's binding data.
             */

            /**
             * @typedef {Object} BindingData
             * @property {Boolean} twoWay - Deterimes whether it's one way or two way data binding.
             * @property {Boolean} updating - Determines whether the node is in update state.
             * @property {Object}  value - The bound property's value.
             * @property {String}  name - The bound property's name.
             */
            value: function getBindings(node) {
                var that = this;

                var index = 0;
                var map = {};
                var boundData = function (node) {
                    if (node instanceof HTMLElement) {
                        return that.parseAttributes(node);
                    } else {
                        var boundProperty = that.parseProperty(node.data, 'textContent', node);

                        if (boundProperty) {
                            if (node.parentNode === that.ownerElement.$.content) {
                                boundProperty.value = that.ownerElement.$.html !== '' ? that.ownerElement.$.html : undefined;
                                that.ownerElement.innerHTML = '';
                            }

                            return { 'textContent': boundProperty };
                        }
                    }

                    return undefined;
                }(node);

                if (boundData) {
                    map.data = boundData;
                }

                if (node.getAttribute) {
                    map.nodeId = node.getAttribute('smart-id');
                }

                map.node = node;

                if (node.firstChild) {
                    map.children = {};
                }

                for (var child = node.firstChild; child; child = child.nextSibling) {
                    map.children[index++] = that.getBindings(child);
                }

                return map;
            }

            /**
             * Parses the element's attributes.
             * @param {HTMLElement} - html element.
             * @return {Array<BindingData>}
             */

        }, {
            key: 'parseAttributes',
            value: function parseAttributes(htmlElement) {
                var that = this;

                var boundProperties = undefined;

                for (var i = 0; i < htmlElement.attributes.length; i++) {
                    var attribute = htmlElement.attributes[i];
                    var attributeName = attribute.name;
                    var attributeValue = attribute.value;
                    if (!BindingModule.cache['toCamelCase' + attributeName]) {
                        BindingModule.cache['toCamelCase' + attributeName] = Utilities.Core.toCamelCase(attributeName);
                    }

                    var propertyName = BindingModule.cache['toCamelCase' + attributeName];

                    if (attributeName.indexOf('(') >= 0) {
                        var eventName = attributeName.substring(1, attributeName.length - 1);
                        if (!that.ownerElement.dataContext) {
                            that.ownerElement.templateListeners[htmlElement.getAttribute('smart-id') + '.' + eventName] = attributeValue;
                            htmlElement.removeAttribute(attributeName);
                            continue;
                        } else {
                            if (!boundProperties) {
                                boundProperties = {};
                            }

                            var handlerName = attributeValue.substring(0, attributeValue.indexOf('('));

                            boundProperties[propertyName] = { isEvent: true, name: eventName, value: handlerName };
                            continue;
                        }
                    }

                    var boundProperty = that.parseProperty(attributeValue, attributeName, htmlElement);
                    if (!boundProperty) {
                        continue;
                    }

                    if (!boundProperties) {
                        boundProperties = {};
                    }

                    boundProperties[propertyName] = boundProperty;
                }

                return boundProperties;
            }

            /**
             * Parses a property.
             * @param {String} - The string to parse.
             * @param {name} - property's name.
             * @param {Node} - the node.
             * @return {BindingData}
             */

        }, {
            key: 'parseProperty',
            value: function parseProperty(text /*, name, node*/) {
                if (!text || !text.length) return;

                var that = this;

                var boundProperty = void 0;
                var length = text.length;
                var startIndex = 0,
                    lastIndex = 0,
                    endIndex = 0;
                var twoWay = true;

                while (lastIndex < length) {
                    startIndex = text.indexOf('{{', lastIndex);
                    var twoWayStart = text.indexOf('[[', lastIndex);
                    var terminator = '}}';

                    if (twoWayStart >= 0 && (startIndex < 0 || twoWayStart < startIndex)) {
                        startIndex = twoWayStart;
                        twoWay = false;
                        terminator = ']]';
                    }

                    endIndex = startIndex < 0 ? -1 : text.indexOf(terminator, startIndex + 2);

                    if (endIndex < 0) {
                        return;
                    }

                    boundProperty = boundProperty || {};
                    var pathString = text.slice(startIndex + 2, endIndex).trim();
                    var attributeName = pathString;

                    /*   if (twoWay) {
                           const updateToken = function (value) {
                               boundProperty.value = value;
                                    if (node.$ && node.$.isNativeElement) {
                                        if (!BindingModule.cache['toDash' + name]) {
                                       BindingModule.cache['toDash' + name] = Utilities.Core.toDash(name);
                                   }
                                        const attributeName = BindingModule.cache['toDash' + name];
                                   const oldValue = node.$.getAttributeValue(attributeName, boundProperty.type);
                                        if (oldValue !== boundProperty.value) {
                                       node.$.setAttributeValue(attributeName, boundProperty.value, boundProperty.type);
                                   }
                               }
                           }
                                if (pathString.indexOf('::') >= 0) {
                               const eventIndex = pathString.indexOf('::');
                               const eventName = pathString.substring(eventIndex + 2);
                                    that.ownerElement['$' + node.getAttribute('smart-id')].listen(eventName, function () {
                                   updateToken(node[name]);
                                        const boundPropertyName = boundProperty.name.substring(0, boundProperty.name.indexOf('::'));
                                   that.updateBoundProperty(boundPropertyName, boundProperty);
                               });
                           }
                                if (node.$ && node.$.isCustomElement) {
                               if (!BindingModule.cache['toDash' + name]) {
                                   BindingModule.cache['toDash' + name] = Utilities.Core.toDash(name);
                               }
                                    const attributeName = BindingModule.cache['toDash' + name];
                               const propertyName = Utilities.Core.toCamelCase(attributeName);
                               
                               if (node._properties && node._properties[propertyName]) {
                                   node._properties[propertyName].notify = true;
                               }
                                    that.ownerElement['$' + node.getAttribute('smart-id')].listen(attributeName + '-changed', function (event) {
                                   const detail = event.detail;
                                        updateToken(detail.value);
                                        const context = that.ownerElement.context;
                                   
                                   if (event.context !== document) {
                                       that.ownerElement.context = that.ownerElement;
                                   }
                                        that.updateBoundProperty(name, boundProperty);
                                        that.ownerElement.context = context;
                               });
                           }
                       }*/

                    boundProperty.name = attributeName;
                    lastIndex = endIndex + 2;
                }

                var propertyName = boundProperty.name;
                var elementProperty = that.ownerElement._properties[propertyName];

                boundProperty.twoWay = twoWay;
                boundProperty.ready = false;
                that.ownerElement.boundProperties[propertyName] = true;

                if (elementProperty) {
                    boundProperty.type = elementProperty.type;
                    boundProperty.reflectToAttribute = elementProperty.reflectToAttribute;
                } else {
                    boundProperty.type = 'string';
                    boundProperty.reflectToAttribute = true;
                }

                return boundProperty;
            }

            /**
             * Updates element's data bound nodes.
             */

        }, {
            key: 'updateTextNodes',
            value: function updateTextNodes() {
                var that = this;

                that.updateTextNode(that.ownerElement.shadowRoot || that.ownerElement, that.ownerElement.bindings, that.ownerElement);
            }

            /**
             * Updates a data bound node.
             * @param {Node} - The bound node.
             * @param {Array<BindingData>} - The node's binding data.
             * @param {Element} - The element to be updated.
             */

        }, {
            key: 'updateTextNode',
            value: function updateTextNode(node, bindings, element) {
                var that = this;

                if (!bindings) {
                    return;
                }

                var index = 0;
                for (var child = node.firstChild; child; child = child.nextSibling) {
                    if (!bindings.children) {
                        break;
                    }

                    that.updateTextNode(child, bindings.children[index++], element);
                }

                if (!bindings || !bindings.data) {
                    return;
                }

                for (var name in bindings.data) {
                    var boundProperty = bindings.data[name];
                    var boundPropertyName = boundProperty.name;

                    if (name !== 'textContent' || !boundProperty.twoWay || boundProperty.updating || boundProperty.value === undefined) {
                        continue;
                    }

                    element[boundPropertyName] = boundProperty.value;
                }
            }

            /**
             * Updates a data bound property.
             * @param {String} - The propery's name.
             * @param {Object} - The property's value.
             */

        }, {
            key: 'updateBoundProperty',
            value: function updateBoundProperty(propertyName, propertyConfig) {
                if (propertyConfig.updating) {
                    return;
                }

                var that = this;
                var element = that.ownerElement;

                propertyConfig.updating = true;
                element[propertyName] = propertyConfig.value;
                propertyConfig.updating = false;
            }

            /**
             * Updates element's data bound nodes.
             */

        }, {
            key: 'updateBoundNodes',
            value: function updateBoundNodes(propertyName) {
                var that = this;

                that.updateBoundNode(that.ownerElement.shadowRoot || that.ownerElement, that.ownerElement.bindings, that.ownerElement, propertyName);
                if (that.ownerElement.detachedChildren.length > 0) {
                    var _loop = function _loop(i) {
                        var node = that.ownerElement.detachedChildren[i];
                        var smartId = node.getAttribute('smart-id');

                        var getBindings = function getBindings(bindings) {
                            if (bindings.nodeId === smartId) {
                                return bindings;
                            }

                            for (var index in bindings.children) {
                                var _node = bindings.children[index];
                                var attribute = _node.getAttribute ? _node.getAttribute('smart-id') : '';

                                if (attribute === smartId) {
                                    return bindings;
                                }

                                if (_node.children) {
                                    var result = getBindings(_node);
                                    if (result) {
                                        return result;
                                    }
                                }
                            }

                            return null;
                        };

                        var bindings = getBindings(that.ownerElement.bindings);

                        if (bindings) {
                            that.updateBoundNode(node, bindings, that.ownerElement, propertyName, true);
                        }
                    };

                    for (var i = 0; i < that.ownerElement.detachedChildren.length; i++) {
                        _loop(i);
                    }
                }
            }

            /**
             * Updates a data bound node.
             * @param {Node} - The bound node.
             * @param {Array<BindingData>} - The node's binding data.
             * @param {Element} - The element to be updated.
             */

        }, {
            key: 'updateBoundNode',
            value: function updateBoundNode(node, bindings, element, propertyName, detached) {
                var that = this;

                if (!bindings) {
                    return;
                }

                var index = 0;
                if (!detached) {
                    for (var child = node.firstChild; child; child = child.nextSibling) {
                        if (!bindings.children) {
                            break;
                        }
                        //       that.updateBoundNode(child, bindings.children[index++], element, propertyName);

                        if (child.getAttribute) {
                            (function () {
                                var childId = child.getAttribute('smart-id');
                                var childBindings = function () {
                                    for (var binding in bindings.children) {
                                        if (bindings.children[binding].nodeId === childId) {
                                            return bindings.children[binding];
                                        }
                                    }
                                }();

                                that.updateBoundNode(child, childBindings, element, propertyName);
                                index++;
                            })();
                        } else {
                            that.updateBoundNode(child, bindings.children[index++], element, propertyName);
                        }
                    }
                } else if (detached && !bindings.data) {
                    for (var _child = node.firstChild; _child; _child = _child.nextSibling) {
                        if (!bindings.children) {
                            break;
                        }

                        //   that.updateBoundNode(child, bindings.children[index++], element, propertyName, detached);

                        if (_child.getAttribute) {
                            (function () {
                                var childId = _child.getAttribute('smart-id');
                                var childBindings = function () {
                                    for (var binding in bindings.children) {
                                        if (bindings.children[binding].nodeId === childId) {
                                            return bindings.children[binding];
                                        }
                                    }
                                }();

                                that.updateBoundNode(_child, childBindings, element, propertyName);
                                index++;
                            })();
                        } else {
                            that.updateBoundNode(_child, bindings.children[index++], element, propertyName, detached);
                        }
                    }
                }

                if (!bindings || !bindings.data) {
                    return;
                }

                var _loop2 = function _loop2(name) {
                    var boundProperty = bindings.data[name];
                    var boundPropertyName = boundProperty.name;
                    if (boundProperty.updating) {
                        return 'continue';
                    }

                    if (propertyName !== undefined && propertyName !== boundPropertyName) {
                        return 'continue';
                    }

                    boundProperty.value = element[boundPropertyName];

                    if (boundPropertyName === 'innerHTML') {
                        if (node[name].toString().trim() !== element[boundPropertyName].toString().trim()) {
                            if (boundProperty.ready) {
                                node[name] = boundProperty.value.toString().trim();
                            } else if (element._properties[boundPropertyName].defaultValue !== boundProperty.value) {
                                node[name] = boundProperty.value.toString().trim();
                            }
                        }
                    } else {
                        node[name] = boundProperty.value;
                    }

                    if (node.$ && node.$.isNativeElement) {
                        if (!BindingModule.cache['toDash' + name]) {
                            BindingModule.cache['toDash' + name] = Utilities.Core.toDash(name);
                        }

                        var attributeName = BindingModule.cache['toDash' + name];
                        var oldValue = node.$.getAttributeValue(attributeName, boundProperty.type);
                        if (boundProperty.reflectToAttribute && (oldValue !== boundProperty.value || !boundProperty.ready)) {
                            node.$.setAttributeValue(attributeName, boundProperty.value, boundProperty.type);
                        }
                        if (!boundProperty.reflectToAttribute) {
                            node.$.setAttributeValue(attributeName, null, boundProperty.type);
                        }
                    }

                    if (!boundProperty.ready) {
                        if (node.$ && node.$.isCustomElement) {
                            if (!BindingModule.cache['toDash' + name]) {
                                BindingModule.cache['toDash' + name] = Utilities.Core.toDash(name);
                            }

                            var _attributeName = BindingModule.cache['toDash' + name];

                            if (!node._properties) {
                                node._beforeCreatedProperties = node._properties = node.propertyByAttributeName = [];
                            }

                            if (!node._properties[name]) {
                                node._properties[name] = {
                                    attributeName: _attributeName
                                };
                                node._beforeCreatedProperties[name] = node._properties[name];
                                node.propertyByAttributeName[_attributeName] = node._properties[name];
                            }

                            var propertyConfig = node._properties[name];

                            propertyConfig.isUpdating = true;

                            if (boundProperty.reflectToAttribute) {
                                node.$.setAttributeValue(propertyConfig.attributeName, boundProperty.value, boundProperty.type);
                            }

                            if (!boundProperty.reflectToAttribute) {
                                node.$.setAttributeValue(propertyConfig.attributeName, null, boundProperty.type);
                            }

                            propertyConfig.isUpdating = false;
                        }

                        if (boundProperty.twoWay) {
                            var updateToken = function updateToken(value) {
                                boundProperty.value = value;

                                if (node.$ && node.$.isNativeElement) {
                                    if (!BindingModule.cache['toDash' + name]) {
                                        BindingModule.cache['toDash' + name] = Utilities.Core.toDash(name);
                                    }

                                    var _attributeName2 = BindingModule.cache['toDash' + name];
                                    var _oldValue = node.$.getAttributeValue(_attributeName2, boundProperty.type);

                                    if (boundProperty.reflectToAttribute && _oldValue !== boundProperty.value) {
                                        node.$.setAttributeValue(_attributeName2, boundProperty.value, boundProperty.type);
                                    }
                                    if (!boundProperty.reflectToAttribute) {
                                        node.$.setAttributeValue(_attributeName2, null, boundProperty.type);
                                    }
                                }
                            };

                            if (boundProperty.name.indexOf('::') >= 0) {
                                var eventIndex = boundProperty.name.indexOf('::');
                                var eventName = boundProperty.name.substring(eventIndex + 2);

                                that.ownerElement['$' + node.getAttribute('smart-id')].listen(eventName, function () {
                                    updateToken(node[name]);
                                    that.updateBoundProperty(name, boundProperty);
                                });
                            }

                            if (node.$ && node.$.isCustomElement) {
                                if (node._properties[name]) {
                                    node._properties[name].notify = true;
                                }

                                if (!BindingModule.cache['toDash' + name]) {
                                    BindingModule.cache['toDash' + name] = Utilities.Core.toDash(name);
                                }

                                var _attributeName3 = BindingModule.cache['toDash' + name];

                                that.ownerElement['$' + node.getAttribute('smart-id')].listen(_attributeName3 + '-changed', function (event) {
                                    var detail = event.detail;
                                    updateToken(detail.value);

                                    var context = that.ownerElement.context;

                                    if (event.context !== document) {
                                        that.ownerElement.context = that.ownerElement;
                                    }

                                    that.updateBoundProperty(name, boundProperty);

                                    that.ownerElement.context = context;
                                });
                            }
                        }
                    }

                    boundProperty.ready = true;
                };

                for (var name in bindings.data) {
                    var _ret4 = _loop2(name);

                    if (_ret4 === 'continue') continue;
                }
            }
        }], [{
            key: 'clearCache',
            value: function clearCache() {
                var that = this;

                that.cache = {};
            }
        }, {
            key: 'moduleName',
            get: function get() {
                return 'BindingModule';
            }
        }]);
        return BindingModule;
    }();

    /** This is a class with utility methods for determing the type of a value. */


    var Types = function () {
        function Types() {
            babelHelpers.classCallCheck(this, Types);
        }

        babelHelpers.createClass(Types, null, [{
            key: 'isBoolean',

            /**
             * Determines whether a value is Boolean. 
             * @param {Object}.
             * @return {Boolean}.
             */
            value: function isBoolean(value) {
                return typeof value === 'boolean';
            }

            /**
             * Determines whether a value is Function. 
             * @param {Object}.
             * @return {Boolean}.
             */

        }, {
            key: 'isFunction',
            value: function isFunction(value) {
                return !!(value && value.constructor && value.call && value.apply);
            }

            /**
             * Determines whether a value is Array. 
             * @param {Object}.
             * @return {Boolean}.
             */

        }, {
            key: 'isArray',
            value: function isArray(value) {
                return Array.isArray(value);
            }

            /**
             * Determines whether a value is Object. 
             * @param {Object}.
             * @return {Boolean}.
             */

        }, {
            key: 'isObject',
            value: function isObject(value) {
                var that = this;

                return value && ((typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) === 'object' || that.isFunction(value)) || false;
            }

            /**
             * Determines whether a value is Date. 
             * @param {Object}.
             * @return {Boolean}.
             */

        }, {
            key: 'isDate',
            value: function isDate(value) {
                return value instanceof Date;
            }

            /**
             * Determines whether a value is String. 
             * @param {Object}.
             * @return {Boolean}.
             */

        }, {
            key: 'isString',
            value: function isString(value) {
                return typeof value === 'string';
            }

            /**
             * Determines whether a value is Number. 
             * @param {Object}.
             * @return {Boolean}.
             */

        }, {
            key: 'isNumber',
            value: function isNumber(value) {
                return typeof value === 'number';
            }

            /**
             * Determines the type of an object.
             * @param {Object}.
             * @return {String} The value's type or undefined, if the type is unknown.
             */

        }, {
            key: 'getType',
            value: function getType(value) {
                var that = this;

                var types = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'Object'];
                var type = types.find(function (type) {
                    if (that['is' + type](value)) {
                        return type;
                    }
                });

                return type ? type.toLowerCase() : undefined;
            }
        }]);
        return Types;
    }();

    var Ripple = function () {
        function Ripple() {
            babelHelpers.classCallCheck(this, Ripple);
        }

        babelHelpers.createClass(Ripple, null, [{
            key: 'animate',
            value: function animate(element, left, top) {
                var target = element;

                if (target.getElementsByClassName('ripple').length === 0) {
                    var span = document.createElement('span');

                    span.classList.add('ripple');

                    if (target.firstElementChild && !target.firstElementChild.noRipple && target.firstElementChild.offsetHeight > 0) {
                        target.firstElementChild.appendChild(span);
                    } else {
                        target.appendChild(span);
                    }
                }

                var ripple = target.getElementsByClassName('ripple')[0];

                ripple.innerHTML = '';
                ripple.classList.remove('animate');
                ripple.style.height = ripple.style.width = Math.max(target.offsetHeight, target.offsetWidth) + 'px';

                var rect = target.getBoundingClientRect(),
                    x = left - (rect.left + window.pageXOffset) - ripple.offsetWidth / 2,
                    y = top - (rect.top + window.pageYOffset) - ripple.offsetHeight / 2;

                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('animate');

                //Remove the ripple element when animation is over
                ripple.addEventListener('animationend', function handler() {
                    if (ripple.parentElement) {
                        ripple.parentElement.removeChild(ripple);
                    }

                    ripple.removeEventListener('animationend', handler);
                    ripple.removeEventListener('animationcancel', handler);
                });

                //Remove the ripple element if the animation is canceled. Just in case
                ripple.addEventListener('animationcancel', function handler() {
                    if (ripple.parentElement) {
                        ripple.parentElement.removeChild(ripple);
                    }

                    ripple.removeEventListener('animationcancel', handler);
                    ripple.removeEventListener('animationend', handler);
                });
            }
        }]);
        return Ripple;
    }();

    var Easings = function () {
        function Easings() {
            babelHelpers.classCallCheck(this, Easings);
        }

        babelHelpers.createClass(Easings, null, [{
            key: 'easeInQuad',
            value: function easeInQuad(t, b, c, d) {
                return c * (t /= d) * t + b;
            }
        }, {
            key: 'easeOutQuad',
            value: function easeOutQuad(t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            }
        }, {
            key: 'easeInOutQuad',
            value: function easeInOutQuad(t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t + b;
                }
                return -c / 2 * (--t * (t - 2) - 1) + b;
            }
        }, {
            key: 'easeInCubic',
            value: function easeInCubic(t, b, c, d) {
                return c * (t /= d) * t * t + b;
            }
        }, {
            key: 'easeOutCubic',
            value: function easeOutCubic(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            }
        }, {
            key: 'easeInOutCubic',
            value: function easeInOutCubic(t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t + b;
                }

                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        }, {
            key: 'easeInQuart',
            value: function easeInQuart(t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            }
        }, {
            key: 'easeOutQuart',
            value: function easeOutQuart(t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            }
        }, {
            key: 'easeInOutQuart',
            value: function easeInOutQuart(t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t * t + b;
                }
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        }, {
            key: 'easeInQuint',
            value: function easeInQuint(t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            }
        }, {
            key: 'easeOutQuint',
            value: function easeOutQuint(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            }
        }, {
            key: 'easeInOutQuint',
            value: function easeInOutQuint(t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t * t * t + b;
                }
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            }
        }, {
            key: 'easeInSine',
            value: function easeInSine(t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            }
        }, {
            key: 'easeOutSine',
            value: function easeOutSine(t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            }
        }, {
            key: 'easeInOutSine',
            value: function easeInOutSine(t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            }
        }, {
            key: 'easeInExpo',
            value: function easeInExpo(t, b, c, d) {
                return t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            }
        }, {
            key: 'easeOutExpo',
            value: function easeOutExpo(t, b, c, d) {
                return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            }
        }, {
            key: 'easeInOutExpo',
            value: function easeInOutExpo(t, b, c, d) {
                if (t === 0) {
                    return b;
                }
                if (t === d) {
                    return b + c;
                }
                if ((t /= d / 2) < 1) {
                    return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                }
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        }, {
            key: 'easeInCirc',
            value: function easeInCirc(t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            }
        }, {
            key: 'easeOutCirc',
            value: function easeOutCirc(t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            }
        }, {
            key: 'easeInOutCirc',
            value: function easeInOutCirc(t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                }
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }
        }, {
            key: 'easeInElastic',
            value: function easeInElastic(t, b, c, d) {
                var s = 1.70158;
                var p = 0;
                var a = c;

                if (t === 0) {
                    return b;
                }

                if ((t /= d) === 1) {
                    return b + c;
                }

                if (!p) {
                    p = d * .3;
                }

                if (a < Math.abs(c)) {
                    a = c;
                    s = p / 4;
                } else {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }

                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            }
        }, {
            key: 'easeOutElastic',
            value: function easeOutElastic(t, b, c, d) {
                var s = 1.70158;
                var p = 0;
                var a = c;

                if (t === 0) {
                    return b;
                }
                if ((t /= d) === 1) {
                    return b + c;
                }
                if (!p) {
                    p = d * .3;
                }
                if (a < Math.abs(c)) {
                    a = c;
                    s = p / 4;
                } else {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }

                return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
            }
        }, {
            key: 'easeInOutElastic',
            value: function easeInOutElastic(t, b, c, d) {
                var s = 1.70158;
                var p = 0;
                var a = c;

                if (t === 0) {
                    return b;
                }
                if ((t /= d / 2) === 2) {
                    return b + c;
                }
                if (!p) {
                    p = d * (.3 * 1.5);
                }
                if (a < Math.abs(c)) {
                    a = c;
                    s = p / 4;
                } else {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                if (t < 1) {
                    return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                }

                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            }
        }, {
            key: 'easeInBack',
            value: function easeInBack(t, b, c, d, s) {
                if (s === undefined) {
                    s = 1.70158;
                }

                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            }
        }, {
            key: 'easeOutBack',
            value: function easeOutBack(t, b, c, d, s) {
                if (s === undefined) {
                    s = 1.70158;
                }
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            }
        }, {
            key: 'easeInOutBack',
            value: function easeInOutBack(t, b, c, d, s) {
                if (s === undefined) {
                    s = 1.70158;
                }
                if ((t /= d / 2) < 1) {
                    return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
                }
                return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
            }
        }, {
            key: 'easeInBounce',
            value: function easeInBounce(t, b, c, d) {
                return c - this.easeOutBounce(d - t, 0, c, d) + b;
            }
        }, {
            key: 'easeOutBounce',
            value: function easeOutBounce(t, b, c, d) {
                if ((t /= d) < 1 / 2.75) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < 2 / 2.75) {
                    return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
                } else if (t < 2.5 / 2.75) {
                    return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
                }
            }
        }, {
            key: 'easeInOutBounce',
            value: function easeInOutBounce(t, b, c, d) {
                if (t < d / 2) {
                    return this.easeInBounce(t * 2, 0, c, d) * .5 + b;
                }
                return this.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        }]);
        return Easings;
    }();

    /** This is a class with utility methods. */


    var Core = function () {
        function Core() {
            babelHelpers.classCallCheck(this, Core);
        }

        babelHelpers.createClass(Core, null, [{
            key: 'toCamelCase',
            value: function toCamelCase(value) {
                return value.replace(/-([a-z])/g, function (g) {
                    return g[1].toUpperCase();
                });
            }
        }, {
            key: 'toDash',
            value: function toDash(value) {
                return value.split(/(?=[A-Z])/).join('-').toLowerCase();
            }
        }, {
            key: 'escapeHTML',
            value: function escapeHTML(value) {
                var entityMap = {
                    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;'
                };

                return String(value).replace(/[&<>"'`=\/]/g, function (s) {
                    return entityMap[s];
                });
            }
        }, {
            key: 'CSSVariablesSupport',
            value: function CSSVariablesSupport() {
                return window.CSS && window.CSS.supports && window.CSS.supports('(--fake-var: 0)');
            }
        }, {
            key: 'assign',
            value: function assign(target, source) {
                var _this = this;

                var isObject = function isObject(item) {
                    return item && (typeof item === 'undefined' ? 'undefined' : babelHelpers.typeof(item)) === 'object' && !Array.isArray(item) && item !== null;
                };

                var output = Object.assign({}, target);
                if (isObject(target) && isObject(source)) {
                    Object.keys(source).forEach(function (key) {
                        if (isObject(source[key])) {
                            if (!(key in target)) {
                                Object.assign(output, babelHelpers.defineProperty({}, key, source[key]));
                            } else {
                                output[key] = _this.assign(target[key], source[key]);
                            }
                        } else {
                            Object.assign(output, babelHelpers.defineProperty({}, key, source[key]));
                        }
                    });
                }

                return output;
            }
        }, {
            key: 'html',
            value: function html(node, htmlString) {
                var that = this;

                var output = '';
                var nodes = node.childNodes;

                if (htmlString) {
                    var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;

                    node.innerHTML = htmlString.replace(rxhtmlTag, '<$1></$2>');
                    return;
                }

                for (var i = 0, l = nodes.length, child; i < l && (child = nodes[i]); i++) {
                    var miscElements = ['strong'];

                    if (child instanceof HTMLElement || child.tagName && miscElements.indexOf(child.tagName.toLowerCase()) >= 0) {
                        var tagName = child.tagName.toLowerCase();
                        var attrs = child.attributes;

                        var nodeOutput = '<' + tagName;

                        for (var j = 0, attr; attr = attrs[j]; j++) {
                            nodeOutput += ' ' + attr.name + '="' + attr.value.replace(/[&\u00A0"]/g, Utilities.Core.escapeHTML) + '"';
                        }

                        nodeOutput += '>';

                        var voidElements = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

                        if (voidElements[tagName]) {
                            output += nodeOutput;
                        }

                        output = output + nodeOutput + that.html(child) + '</' + tagName + '>';
                    } else {
                        output += child.textContent.replace(/[&\u00A0<>]/g, Utilities.Core.escapeHTML);
                    }
                }
                return output;
            }
        }, {
            key: 'isMobile',
            get: function get() {
                var isMobile = /(iphone|ipod|ipad|android|iemobile|blackberry|bada)/.test(window.navigator.userAgent.toLowerCase());

                return isMobile;
            }
        }, {
            key: 'Browser',
            get: function get() {
                var versionSearchString = void 0;

                var browser = function browser() {
                    var data = [{ string: navigator.userAgent, subString: 'Edge', identity: 'Edge' }, { string: navigator.userAgent, subString: 'MSIE', identity: 'IE' }, { string: navigator.userAgent, subString: 'Trident', identity: 'IE' }, { string: navigator.userAgent, subString: 'Firefox', identity: 'Firefox' }, { string: navigator.userAgent, subString: 'Opera', identity: 'Opera' }, { string: navigator.userAgent, subString: 'OPR', identity: 'Opera' }, { string: navigator.userAgent, subString: 'Chrome', identity: 'Chrome' }, { string: navigator.userAgent, subString: 'Safari', identity: 'Safari' }];

                    for (var i = 0; i < data.length; i++) {
                        var dataString = data[i].string;
                        versionSearchString = data[i].subString;

                        if (dataString.indexOf(data[i].subString) !== -1) {
                            return data[i].identity;
                        }
                    }

                    return 'Other';
                };

                var version = function version(dataString) {
                    var index = dataString.indexOf(versionSearchString);
                    if (index === -1) {
                        return;
                    }

                    var rv = dataString.indexOf('rv:');

                    if (versionSearchString === 'Trident' && rv !== -1) {
                        return parseFloat(dataString.substring(rv + 3));
                    } else {
                        return parseFloat(dataString.substring(index + versionSearchString.length + 1));
                    }
                };

                var result = {};

                result[browser()] = true;
                result.version = version(navigator.userAgent) || version(navigator.appVersion) || 'Unknown';

                return result;
            }
        }]);
        return Core;
    }();

    var styleObservedElements = [];

    var StyleObserver = function () {
        function StyleObserver() {
            babelHelpers.classCallCheck(this, StyleObserver);
        }

        babelHelpers.createClass(StyleObserver, null, [{
            key: 'watch',
            value: function watch(element) {
                styleObservedElements.push(element);

                if (StyleObserver.interval) {
                    clearInterval(StyleObserver.interval);
                }

                StyleObserver.interval = setInterval(function () {
                    StyleObserver.observe();
                }, 100);
            }
        }, {
            key: 'observeElement',
            value: function observeElement(element) {
                var that = element;

                var computedStyle = document.defaultView.getComputedStyle(that, null);
                var canRaiseResize = true;
                var styleProperties = ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth', 'display', 'visibility', 'font-size', 'font-family', 'font-style', 'font-weight', 'max-height', 'min-height', 'max-width', 'min-width'];

                if (!that._styleInfo) {
                    that._styleInfo = [];

                    for (var i = 0; i < styleProperties.length; i++) {
                        var styleProperty = styleProperties[i];

                        that._styleInfo[styleProperty] = computedStyle[styleProperty];
                    }

                    return;
                }

                if (!element.isHidden) {
                    if (computedStyle['display'] !== 'none') {
                        if (element.offsetWidth === 0 || element.offsetHeight === 0) {
                            element.isHidden = true;
                        }
                    }
                }

                if (element.isHidden) {
                    element.visibilityChangedHandler();

                    if (!element.isHidden) {
                        canRaiseResize = false;
                    } else {
                        return;
                    }
                }

                var changedStyleProperties = [];

                for (var _i = 0; _i < styleProperties.length; _i++) {
                    var _styleProperty = styleProperties[_i];

                    if (that._styleInfo[_styleProperty] !== computedStyle[_styleProperty]) {
                        changedStyleProperties[_styleProperty] = { oldValue: that._styleInfo[_styleProperty], value: computedStyle[_styleProperty] };
                        changedStyleProperties.length++;
                    }

                    that._styleInfo[_styleProperty] = computedStyle[_styleProperty];
                }

                if (changedStyleProperties.length > 0) {
                    that.$.fireEvent('styleChanged', {
                        styleProperties: changedStyleProperties
                    }, {
                        bubbles: false,
                        cancelable: true
                    });

                    if (changedStyleProperties['display'] && canRaiseResize) {
                        that.$.fireEvent('resize', that, {
                            bubbles: false,
                            cancelable: true
                        });
                    }
                }
            }
        }, {
            key: 'observe',
            value: function observe() {
                for (var i = 0; i < styleObservedElements.length; i++) {
                    var that = styleObservedElements[i];
                    this.observeElement(that);
                }
            }
        }, {
            key: 'unwatch',
            value: function unwatch(element) {
                if (StyleObserver.interval) {
                    clearInterval(StyleObserver.interval);
                }

                styleObservedElements.splice(styleObservedElements.indexOf(element), 1);

                if (styleObservedElements.length > 0) {
                    StyleObserver.interval = setInterval(function () {
                        StyleObserver.observe();
                    }, 100);
                }
            }
        }]);
        return StyleObserver;
    }();

    var dataContextObservedObjects = [];
    var dataContextInfo = [];

    var DataContextObserver = function () {
        function DataContextObserver() {
            babelHelpers.classCallCheck(this, DataContextObserver);
        }

        babelHelpers.createClass(DataContextObserver, null, [{
            key: 'watch',
            value: function watch(dataContext) {
                dataContextObservedObjects.push(dataContext);

                if (DataContextObserver.interval) {
                    clearInterval(DataContextObserver.interval);
                }

                DataContextObserver.interval = setInterval(function () {
                    DataContextObserver.observe();
                }, 100);
            }
        }, {
            key: 'observeContext',
            value: function observeContext(dataContext) {
                var changedProperties = [];

                var getDataContextPropertyValue = function getDataContextPropertyValue(propertyName) {
                    if (propertyName.indexOf('.') >= 0) {
                        var path = propertyName.split('.');
                        var dataBoundObject = dataContext[path[0]];

                        for (var i = 1; i < path.length; i++) {
                            dataBoundObject = dataBoundObject[path[i]];
                        }

                        return dataBoundObject;
                    } else {
                        return dataContext[propertyName];
                    }
                };

                if (!dataContext._uid) {
                    dataContext._uid = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
                }

                if (!dataContextInfo[dataContext._uid]) {
                    dataContextInfo[dataContext._uid] = [];

                    for (var propertyName in dataContext) {
                        if (dataContext[propertyName].isEvent) {
                            continue;
                        }

                        dataContextInfo[dataContext._uid][propertyName] = getDataContextPropertyValue(propertyName);
                    }

                    return;
                }

                for (var _propertyName in dataContext) {
                    if (dataContext[_propertyName].isEvent) {
                        continue;
                    }

                    var propertyValue = getDataContextPropertyValue(_propertyName);

                    if (dataContextInfo[dataContext._uid][_propertyName] !== propertyValue) {
                        var propertyType = babelHelpers.typeof(dataContextInfo[dataContext._uid][_propertyName]);

                        if (propertyType === 'array' || propertyType === 'object') {
                            if (JSON.stringify(dataContextInfo[dataContext._uid][_propertyName]) !== JSON.stringify(propertyValue)) {
                                changedProperties[_propertyName] = { oldValue: dataContextInfo[dataContext._uid][_propertyName], value: propertyValue };
                                changedProperties.length++;
                            }
                        } else {
                            changedProperties[_propertyName] = { oldValue: dataContextInfo[dataContext._uid][_propertyName], value: propertyValue };
                            changedProperties.length++;
                        }
                    }

                    dataContextInfo[dataContext._uid][_propertyName] = propertyValue;
                }

                if (changedProperties.length > 0) {
                    $document.fireEvent('dataContextPropertyChanged', {
                        dataContext: dataContext,
                        properties: changedProperties
                    }, {
                        bubbles: false,
                        cancelable: true
                    });
                }
            }
        }, {
            key: 'observe',
            value: function observe() {
                for (var i = 0; i < dataContextObservedObjects.length; i++) {
                    var that = dataContextObservedObjects[i];
                    this.observeContext(that);
                }
            }
        }, {
            key: 'unwatch',
            value: function unwatch(dataContext) {
                if (DataContextObserver.interval) {
                    clearInterval(DataContextObserver.interval);
                }

                dataContextObservedObjects = dataContextObservedObjects.splice(dataContextObservedObjects.indexOf(dataContext), 1);

                if (dataContextObservedObjects.length > 0) {
                    DataContextObserver.interval = setInterval(function () {
                        DataContextObserver.observe();
                    }, 100);
                }
            }
        }]);
        return DataContextObserver;
    }();

    var inputEventTypes = ['resize', 'down', 'up', 'move', 'tap', 'taphold', 'swipeleft', 'swiperight', 'swipetop', 'swipebottom'];

    /** This is a class which extends an element and adds custom input events to it. */

    var InputEvents = function () {
        function InputEvents(target) {
            babelHelpers.classCallCheck(this, InputEvents);

            var that = this;

            that.target = target;
            that.$target = new _Extend(target);
            that.$document = new _Extend(document);
            that.id = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
            // that.target === document ? '' : that.target.id || that.target.getAttribute('smart-id');

            var result = { handlers: {}, boundEventTypes: [], listen: that.listen.bind(that), unlisten: that.unlisten.bind(that) };

            //The taphold delay. If this delay is passed then taphold event will be fired.
            that.tapHoldDelay = 750;
            //Defines the minimum swipe distance required by the plugin.
            that.swipeMin = 10;
            //Defines the maximum swipe distance. After it is passed the propagation of the event will be restored, therefore the scrolling will be available.
            that.swipeMax = 5000;
            //The swipe delay. After it is passed swipe event won't be fired.
            that.swipeDelay = 1000;
            //The taphold delay. If this delay is passed then taphold event will be fired.
            that.tapHoldDelay = 750;

            that.inputEventProperties = ['clientX', 'clientY', 'pageX', 'pageY', 'screenX', 'screenY'];

            inputEventTypes.forEach(function (eventType) {
                result[eventType] = function (handler) {
                    result.handlers[eventType] = handler;
                };

                that[eventType] = function (event) {
                    if (!result.handlers[event.type]) {
                        if ((event.type === 'mousemove' || event.type === 'pointermove' || event.type === 'touchmove') && result.handlers['move']) {
                            var moveEvent = that.createEvent(event, 'move');
                            result.handlers['move'](moveEvent);
                        }

                        return true;
                    }

                    return result.handlers[event.type](event);
                };
            });

            that.listen();

            that.handlers = result.handlers;

            return result;
        }

        babelHelpers.createClass(InputEvents, [{
            key: 'listen',
            value: function listen(eventType) {
                var that = this;

                if (eventType === 'resize') {
                    if (!that.target.resizeTrigger && that.target !== document && that.target !== window) {
                        var container = document.createElement('div');
                        container.className = 'smart-resize-trigger-container';
                        container.innerHTML = '<div class="smart-resize-trigger-container">' + '<div class="smart-resize-trigger"></div>' + '</div>' + '<div class="smart-resize-trigger-container">' + '<div class="smart-resize-trigger-shrink"></div>' + '</div>';

                        that.target.appendChild(container);
                        that.target.resizeTrigger = container;

                        var expand = container.childNodes[0];
                        var expandChild = expand.childNodes[0];
                        var shrink = container.childNodes[1];
                        var reset = function reset() {
                            expandChild.style.width = '100000px';
                            expandChild.style.height = '100000px';

                            expand.scrollLeft = 100000;
                            expand.scrollTop = 100000;

                            shrink.scrollLeft = 100000;
                            shrink.scrollTop = 100000;
                        };

                        var dirty = void 0,
                            requestAnimationFrameId = void 0,
                            newWidth = void 0,
                            newHeight = void 0;

                        var lastWidth = that.target.offsetWidth;
                        var lastHeight = that.target.offsetHeight;

                        reset();

                        that.target.resizeHandler = function () {
                            if (!requestAnimationFrameId) {
                                requestAnimationFrameId = requestAnimationFrame(function () {
                                    requestAnimationFrameId = 0;
                                    newWidth = that.target.offsetWidth;
                                    newHeight = that.target.offsetHeight;
                                    dirty = newWidth !== lastWidth || newHeight !== lastHeight;
                                    if (that.target.requiresLayout) {
                                        dirty = true;
                                    }

                                    if (!dirty) {
                                        return;
                                    }

                                    lastWidth = newWidth;
                                    lastHeight = newHeight;

                                    var resizeEvent = new CustomEvent('resize', {
                                        bubbles: false,
                                        cancelable: true
                                    });

                                    that.resize(resizeEvent);

                                    that.target.requiresLayout = false;
                                });
                            }

                            reset();
                        };

                        expand.addEventListener('scroll', that.target.resizeHandler);
                        shrink.addEventListener('scroll', that.target.resizeHandler);
                    }
                }

                if (that.isListening) {
                    return;
                }

                that.isListening = true;
                that.isPressed = false;
                that.isReleased = false;
                that.isInBounds = false;

                if (window.PointerEvent) {
                    that.$target.listen('pointerdown.inputEvents' + that.id, that.pointerDown.bind(that));
                    that.$target.listen('pointerup.inputEvents' + that.id, that.pointerUp.bind(that));
                    that.$target.listen('pointermove.inputEvents' + that.id, that.pointerMove.bind(that));
                    that.$target.listen('pointercancel.inputEvents' + that.id, that.pointerCancel.bind(that));
                } else {
                    var hasTouch = 'ontouchstart' in window;

                    if (hasTouch) {
                        that.$target.listen('touchmove.inputEvents' + that.id, that.touchMove.bind(that));
                        that.$target.listen('touchstart.inputEvents' + that.id, that.touchStart.bind(that));
                        that.$target.listen('touchend.inputEvents' + that.id, that.touchEnd.bind(that));
                        that.$target.listen('touchcancel.inputEvents' + that.id, that.touchCancel.bind(that));
                    }

                    that.$target.listen('mousedown.inputEvents' + that.id, that.mouseDown.bind(that));
                    that.$target.listen('mouseup.inputEvents' + that.id, that.mouseUp.bind(that));
                    that.$target.listen('mousemove.inputEvents' + that.id, that.mouseMove.bind(that));
                    that.$target.listen('mouseleave.inputEvents' + that.id, that.mouseLeave.bind(that));
                }

                that.$document.listen('mouseup.inputEvents' + that.id, that.handleDocumentUp.bind(that));
            }
        }, {
            key: 'unlisten',
            value: function unlisten(eventType) {
                var that = this;

                that.isListening = false;

                if (window.PointerEvent) {
                    that.$target.unlisten('pointerdown.inputEvents' + that.id);
                    that.$target.unlisten('pointerup.inputEvents' + that.id);
                    that.$target.unlisten('pointermove.inputEvents' + that.id);
                    that.$target.unlisten('pointercancel.inputEvents' + that.id);
                } else {
                    var hasTouch = 'ontouchstart' in window;
                    if (hasTouch) {
                        that.$target.unlisten('touchstart.inputEvents' + that.id);
                        that.$target.unlisten('touchmove.inputEvents' + that.id);
                        that.$target.unlisten('touchend.inputEvents' + that.id);
                        that.$target.unlisten('touchcancel.inputEvents' + that.id);
                    }

                    that.$target.unlisten('mousedown.inputEvents' + that.id);
                    that.$target.unlisten('mouseup.inputEvents' + that.id);
                    that.$target.unlisten('mousemove.inputEvents' + that.id);
                    that.$target.unlisten('mouseleave.inputEvents' + that.id);
                }

                that.$document.unlisten('mouseup.inputEvents' + that.id, that.handleDocumentUp);

                if (eventType === 'resize' && that.target.resizeTrigger) {
                    var container = that.target.resizeTrigger;
                    var expand = container.childNodes[0];
                    var shrink = container.childNodes[1];

                    expand.removeEventListener('scroll', that.target.resizeHandler);
                    shrink.removeEventListener('scroll', that.target.resizeHandler);

                    that.target.resizeHandler = null;
                    that.target.removeChild(container);
                    delete that.target.resizeTrigger;
                }
            }
        }, {
            key: 'handleDocumentUp',
            value: function handleDocumentUp(event) {
                var that = this;

                that.isPressed = false;
                that.isReleased = false;
                that.resetSwipe(event);
            }
        }, {
            key: 'createEvent',
            value: function createEvent(event, eventType) {
                var that = this;
                var touches = event.touches;
                var changedTouches = event.changedTouches;
                var touch = touches && touches.length ? touches[0] : changedTouches && changedTouches.length ? changedTouches[0] : undefined;
                var customEvent = new CustomEvent(eventType, {
                    bubbles: true,
                    cancelable: true
                });
                customEvent.originalEvent = event;
                if (touch) {
                    for (var j = 0; j < that.inputEventProperties.length; j++) {
                        var key = that.inputEventProperties[j];

                        customEvent[key] = touch[key];
                    }

                    return customEvent;
                }

                for (var _key in event) {
                    if (!(_key in customEvent)) {
                        customEvent[_key] = event[_key];
                    }
                }

                return customEvent;
            }
        }, {
            key: 'fireTap',
            value: function fireTap(event) {
                var that = this;

                clearTimeout(this.tapHoldTimeout);
                if (!this.tapHoldFired && this.isInBounds) {
                    var tap = that.createEvent(event, 'tap');
                    that.tap(tap);
                }
            }
        }, {
            key: 'initTap',
            value: function initTap(event) {
                var that = this;

                that.isInBounds = true;
                that.tapHoldFired = false;
                that.tapHoldTimeout = setTimeout(function () {
                    if (that.isInBounds) {
                        that.tapHoldFired = true;
                        var taphold = that.createEvent(event, 'taphold');
                        that.taphold(taphold);
                    }
                }, that.tapHoldDelay);
            }
        }, {
            key: 'pointerDown',
            value: function pointerDown(event) {
                var that = this;

                return that.handleDown(event);
            }
        }, {
            key: 'mouseDown',
            value: function mouseDown(event) {
                var that = this;

                if (that.isPressed || that.touchStartTime && new Date() - that.touchStartTime < 500) {
                    return;
                }

                return that.handleDown(event);
            }
        }, {
            key: 'touchStart',
            value: function touchStart(event) {
                var that = this;

                that.touchStartTime = new Date();
                that.isTouchMoved = true;

                return that.handleDown(event);
            }
        }, {
            key: 'mouseUp',
            value: function mouseUp(event) {
                var that = this;

                if (that.isReleased || that.touchEndTime && new Date() - that.touchEndTime < 500) {
                    return;
                }

                return that.handleUp(event);
            }
        }, {
            key: 'handleDown',
            value: function handleDown(event) {
                var that = this;

                that.isReleased = false;
                that.isPressed = true;

                var down = that.createEvent(event, 'down');

                if (that.handlers['tap'] || that.handlers['taphold']) {
                    that.initTap(down);
                }

                if (that.handlers['swipeleft'] || that.handlers['swiperight'] || that.handlers['swipetop'] || that.handlers['swipebottom']) {
                    that.initSwipe(down);
                }

                return that.down(down);
            }
        }, {
            key: 'handleUp',
            value: function handleUp(event) {
                var that = this;

                that.isReleased = true;
                that.isPressed = false;

                var up = that.createEvent(event, 'up');
                var result = that.up(up);

                if (that.handlers['tap'] || that.handlers['taphold']) {
                    that.fireTap(up);
                }

                that.resetSwipe(up);

                return result;
            }
        }, {
            key: 'handleMove',
            value: function handleMove(event) {
                var that = this;

                var eventResult = that.move(event);

                if (that.isPressed) {
                    that._maxSwipeVerticalDistance = Math.max(that._maxSwipeVerticalDistance, Math.abs(that._startY - event.pageY));
                    that._maxSwipeHorizontalDistance = Math.max(that._maxSwipeHorizontalDistance, Math.abs(that._startX - event.pageX));
                    eventResult = that.handleSwipeEvents(event);
                }

                return eventResult;
            }
        }, {
            key: 'touchEnd',
            value: function touchEnd(event) {
                var that = this;

                that.touchEndTime = new Date();
                return that.handleUp(event);
            }
        }, {
            key: 'pointerUp',
            value: function pointerUp(event) {
                var that = this;

                return that.handleUp(event);
            }
        }, {
            key: 'pointerCancel',
            value: function pointerCancel(event) {
                var that = this;

                that.pointerUp(event);
            }
        }, {
            key: 'touchCancel',
            value: function touchCancel(event) {
                var that = this;

                that.touchEnd(event);
            }
        }, {
            key: 'mouseLeave',
            value: function mouseLeave() {
                var that = this;

                that.isInBounds = false;
            }
        }, {
            key: 'mouseMove',
            value: function mouseMove(event) {
                var that = this;

                if (that.isTouchMoved) {
                    return;
                }

                return that.handleMove(event);
            }
        }, {
            key: 'pointerMove',
            value: function pointerMove(event) {
                var that = this;

                return that.handleMove(event);
            }
        }, {
            key: 'touchMove',
            value: function touchMove(event) {
                var that = this;
                var touches = event.touches;
                var changedTouches = event.changedTouches;
                var touch = touches && touches.length ? touches[0] : changedTouches && changedTouches.length ? changedTouches[0] : undefined;

                for (var j = 0; j < that.inputEventProperties.length; j++) {
                    var key = that.inputEventProperties[j];

                    if (event[key] === undefined) {
                        event[key] = touch[key];
                    }
                }

                that.isTouchMoved = true;

                return that.handleMove(event);
            }
        }, {
            key: 'handleSwipeEvents',
            value: function handleSwipeEvents(event) {
                var that = this;

                var eventResult = true;

                if (that.handlers['swipetop'] || that.handlers['swipebottom']) {
                    eventResult = this.handleVerticalSwipeEvents(event);
                }

                if (eventResult === false) {
                    return eventResult;
                }

                if (that.handlers['swipeleft'] || that.handlers['swiperight']) {
                    eventResult = this.handleHorizontalSwipeEvents(event);
                }

                return eventResult;
            }
        }, {
            key: 'handleVerticalSwipeEvents',
            value: function handleVerticalSwipeEvents(event) {
                var current = void 0,
                    diff = void 0;
                current = event.pageY;
                diff = current - this._startY;

                return this.swiped(event, diff, 'vertical');
            }
        }, {
            key: 'handleHorizontalSwipeEvents',
            value: function handleHorizontalSwipeEvents(event) {
                var current = void 0,
                    diff = void 0;
                current = event.pageX;
                diff = current - this._startX;

                return this.swiped(event, diff, 'horizontal');
            }
        }, {
            key: 'swiped',
            value: function swiped(event, diff, direction) {
                var that = this;

                direction = direction || 0;
                if (Math.abs(diff) >= that.swipeMin && !that._swipeEvent && !that._swipeLocked) {
                    var eventType = diff < 0 ? 'swipeleft' : 'swiperight';
                    if (direction === 'horizontal') {
                        that._swipeEvent = that.createEvent(event, eventType);
                    } else {
                        eventType = diff < 0 ? 'swipetop' : 'swipebottom';
                        that._swipeEvent = that.createEvent(event, diff < 0 ? 'swipetop' : 'swipebottom');
                    }

                    if (that[eventType]) {
                        that[eventType](this._swipeEvent);
                        if (Math.abs(diff) <= this.swipeMax) {
                            event.stopImmediatePropagation();
                            return false;
                        }
                    }
                }

                return true;
            }
        }, {
            key: 'resetSwipe',
            value: function resetSwipe() {
                var that = this;

                that._swipeEvent = null;
                clearTimeout(this._swipeTimeout);
            }
        }, {
            key: 'initSwipe',
            value: function initSwipe(event) {
                var that = this;

                that._maxSwipeVerticalDistance = 0;
                that._maxSwipeHorizontalDistance = 0;
                that._startX = event.pageX;
                that._startY = event.pageY;
                that._swipeLocked = false;
                that._swipeEvent = null;
                that._swipeTimeout = setTimeout(function () {
                    that._swipeLocked = true;
                }, that.swipeDelay);
            }
        }]);
        return InputEvents;
    }();

    var Scroll = function () {
        babelHelpers.createClass(Scroll, [{
            key: 'scrollWidth',
            get: function get() {
                var that = this;

                if (that.horizontalScrollBar) {
                    return that.horizontalScrollBar.max;
                }

                return -1;
            },
            set: function set(value) {
                var that = this;

                if (value < 0) {
                    value = 0;
                }

                if (that.horizontalScrollBar) {
                    that.horizontalScrollBar.max = value;
                }
            }
        }, {
            key: 'scrollHeight',
            get: function get() {
                var that = this;

                if (that.verticalScrollBar) {
                    return that.verticalScrollBar.max;
                }

                return -1;
            },
            set: function set(value) {
                var that = this;

                if (value < 0) {
                    value = 0;
                }

                if (that.verticalScrollBar) {
                    that.verticalScrollBar.max = value;
                }
            }
        }, {
            key: 'scrollLeft',
            get: function get() {
                var that = this;

                if (that.horizontalScrollBar) {
                    return that.horizontalScrollBar.value;
                }

                return -1;
            },
            set: function set(value) {
                var that = this;

                if (value < 0) {
                    value = 0;
                }

                if (that.horizontalScrollBar) {
                    that.horizontalScrollBar.value = value;
                }
            }
        }, {
            key: 'scrollTop',
            get: function get() {
                var that = this;

                if (that.verticalScrollBar) {
                    return that.verticalScrollBar.value;
                }

                return -1;
            },
            set: function set(value) {
                var that = this;

                if (value < 0) {
                    value = 0;
                }

                if (that.verticalScrollBar) {
                    that.verticalScrollBar.value = value;
                }
            }
        }, {
            key: 'vScrollBar',
            get: function get() {
                var that = this;

                return that.verticalScrollBar;
            }
        }, {
            key: 'hScrollBar',
            get: function get() {
                var that = this;

                return that.horizontalScrollBar;
            }
        }]);

        function Scroll(container, horizontalScrollBar, verticalScrollBar) {
            babelHelpers.classCallCheck(this, Scroll);

            var that = this;

            that.container = container;
            that.horizontalScrollBar = horizontalScrollBar;
            that.verticalScrollBar = verticalScrollBar;
            that.listen();
        }

        babelHelpers.createClass(Scroll, [{
            key: 'listen',
            value: function listen() {
                var that = this;
                var isMobile = Core.isMobile;
                var horizontalScrollBar = that.horizontalScrollBar;
                var verticalScrollBar = that.verticalScrollBar;

                that.inputEvents = new InputEvents(that.container);

                var dragStarted = void 0,
                    rafId = void 0,
                    pointerCaptured = void 0,
                    timestamp = void 0,
                    ticker = void 0,
                    now = void 0,
                    elapsed = void 0,
                    timeConstant = 500,
                    currentScrollInfo = void 0;

                var createScrollInfo = function createScrollInfo(scrollBar) {
                    return {
                        amplitude: 0,
                        delta: 0,
                        initialValue: 0,
                        min: 0,
                        max: scrollBar.max,
                        previousValue: 0,
                        pointerPosition: 0,
                        targetValue: 0,
                        scrollBar: scrollBar,
                        value: 0,
                        velocity: 0
                    };
                };

                var hScrollInfo = createScrollInfo(horizontalScrollBar);
                var vScrollInfo = createScrollInfo(verticalScrollBar);

                var track = function track() {
                    now = Date.now();
                    elapsed = now - timestamp;
                    timestamp = now;

                    var updateScrollInfo = function updateScrollInfo(scrollInfo) {
                        scrollInfo.delta = scrollInfo.value - scrollInfo.previousValue;
                        scrollInfo.previousValue = scrollInfo.value;
                        var velocity = 1000 * scrollInfo.delta / (1 + elapsed);
                        scrollInfo.velocity = 0.8 * velocity + 0.2 * scrollInfo.velocity;
                    };

                    updateScrollInfo(vScrollInfo);
                    updateScrollInfo(hScrollInfo);
                };

                var scroll = function scroll(value) {
                    currentScrollInfo.value = value > currentScrollInfo.max ? currentScrollInfo.max : value < currentScrollInfo.min ? currentScrollInfo.min : value;
                    currentScrollInfo.scrollBar.value = currentScrollInfo.value;

                    return value > currentScrollInfo.max ? 'max' : value < currentScrollInfo.min ? 'min' : 'value';
                };

                function autoScroll() {
                    var elapsed = void 0,
                        delta = void 0;
                    if (currentScrollInfo.amplitude) {
                        elapsed = Date.now() - timestamp;
                        delta = -currentScrollInfo.amplitude * Math.exp(-elapsed / timeConstant);
                        if (delta > 5 || delta < -5) {
                            scroll(currentScrollInfo.targetValue + delta);
                            cancelAnimationFrame(rafId);
                            rafId = 0;
                            rafId = requestAnimationFrame(autoScroll);
                        } else {
                            scroll(currentScrollInfo.targetValue);
                        }
                    }
                }

                that.inputEvents['down'](function (event) {
                    if (!isMobile) {
                        return;
                    }

                    pointerCaptured = true;
                    dragStarted = false;

                    var updateScrollInfo = function updateScrollInfo(scrollInfo, pointerPosition) {
                        scrollInfo.amplitude = 0;
                        scrollInfo.pointerPosition = pointerPosition;
                        scrollInfo.previousValue = scrollInfo.value;
                        scrollInfo.value = scrollInfo.scrollBar.value;
                        scrollInfo.initialValue = scrollInfo.value;
                        scrollInfo.max = scrollInfo.scrollBar.max;
                    };

                    updateScrollInfo(vScrollInfo, event.clientY);
                    updateScrollInfo(hScrollInfo, event.clientX);

                    timestamp = Date.now();
                    clearInterval(ticker);
                    ticker = setInterval(track, timeConstant);
                });

                that.inputEvents['up'](function () {
                    if (!pointerCaptured) {
                        return true;
                    }

                    clearInterval(ticker);

                    var startScroll = function startScroll(scrollInfo) {
                        currentScrollInfo = scrollInfo;
                        scrollInfo.amplitude = 0.8 * scrollInfo.velocity;
                        scrollInfo.targetValue = Math.round(scrollInfo.value + scrollInfo.amplitude);
                        timestamp = Date.now();
                        cancelAnimationFrame(rafId);
                        rafId = requestAnimationFrame(autoScroll);
                        scrollInfo.velocity = 0;
                    };

                    if (vScrollInfo.velocity > 10 || vScrollInfo.velocity < -10) {
                        startScroll(vScrollInfo);
                    } else if (hScrollInfo.velocity > 10 || hScrollInfo.velocity < -10) {
                        startScroll(hScrollInfo);
                    }

                    pointerCaptured = false;
                });

                that.inputEvents['move'](function (event) {
                    if (!pointerCaptured) {
                        return true;
                    }

                    if (dragStarted) {
                        event.originalEvent.preventDefault();
                        event.originalEvent.stopPropagation();
                    }

                    hScrollInfo.visible = horizontalScrollBar.offsetHeight > 0;
                    vScrollInfo.visible = verticalScrollBar.offsetWidth > 0;

                    if (!pointerCaptured || !hScrollInfo.visible && !vScrollInfo.visible) {
                        return;
                    }

                    vScrollInfo.ratio = -vScrollInfo.max / vScrollInfo.scrollBar.offsetHeight;
                    vScrollInfo.delta = (event.clientY - vScrollInfo.pointerPosition) * vScrollInfo.ratio;

                    hScrollInfo.ratio = -hScrollInfo.max / hScrollInfo.scrollBar.offsetWidth;
                    hScrollInfo.delta = (event.clientX - hScrollInfo.pointerPosition) * hScrollInfo.ratio;

                    var dragged = 'value';

                    var doDrag = function doDrag(scrollInfo, pointerPosition, event) {
                        if (scrollInfo.delta > 5 || scrollInfo.delta < -5) {
                            currentScrollInfo = scrollInfo;

                            dragged = scrollInfo.initialValue + scrollInfo.delta > currentScrollInfo.max ? 'max' : scrollInfo.initialValue + scrollInfo.delta < currentScrollInfo.min ? 'min' : 'value';

                            if (dragged === 'min' && scrollInfo.initialValue === 0) {
                                return true;
                            }

                            if (dragged === 'max' && scrollInfo.initialValue === scrollInfo.max) {
                                return true;
                            }

                            if (!scrollInfo.visible) {
                                return true;
                            }

                            scroll(scrollInfo.initialValue + scrollInfo.delta);
                            track();

                            event.originalEvent.preventDefault();
                            event.originalEvent.stopPropagation();
                            dragStarted = true;

                            return false;
                        }

                        return null;
                    };

                    var verticalDragResult = doDrag(vScrollInfo, event.clientY, event);
                    if (verticalDragResult === null) {
                        var horizontalDragResult = doDrag(hScrollInfo, event.clientX, event);
                        if (horizontalDragResult !== null) {
                            return horizontalDragResult;
                        }
                    } else {
                        return verticalDragResult;
                    }
                });

                var elapsedScrollTo = void 0;
                that.scrollTo = function (value, vertically) {
                    var scrollInfo = vertically === false ? hScrollInfo : vScrollInfo;
                    var isScrolling = false;

                    if (!timestamp) {
                        timestamp = Date.now();
                    }

                    if (!elapsedScrollTo) {
                        elapsedScrollTo = Date.now();
                    }

                    if (Math.abs(Date.now() - elapsedScrollTo) > 375) {
                        timestamp = Date.now();
                    } else {
                        isScrolling = true;
                    }

                    elapsedScrollTo = Date.now();

                    scrollInfo.value = scrollInfo.scrollBar.value;
                    scrollInfo.delta = value - scrollInfo.value;
                    scrollInfo.max = scrollInfo.scrollBar.max;

                    if (value <= scrollInfo.min) {
                        value = scrollInfo.min;
                    }

                    if (value >= scrollInfo.max) {
                        value = scrollInfo.max;
                    }

                    scrollInfo.targetValue = value;

                    var to = value;
                    var from = scrollInfo.value;

                    scrollInfo.velocity = 100 * scrollInfo.delta / (1 + scrollInfo.max);
                    scrollInfo.from = from;

                    var scroll = function scroll(value) {
                        scrollInfo.value = value > scrollInfo.max ? scrollInfo.max : value < scrollInfo.min ? scrollInfo.min : value;
                        scrollInfo.scrollBar.value = scrollInfo.value;

                        return value > scrollInfo.max ? 'max' : value < scrollInfo.min ? 'min' : 'value';
                    };

                    var autoScroll = function autoScroll() {
                        var delta = void 0;
                        var duration = 375;
                        var time = Date.now() - elapsedScrollTo;
                        var elapsed = Math.min(1000, Date.now() - timestamp);
                        var amplitude = scrollInfo.velocity * Math.exp(elapsed / duration);

                        if (isScrolling) {
                            if (amplitude < 0 && scrollInfo.value <= value) {
                                amplitude = 0;
                            } else if (amplitude > 0 && scrollInfo.value >= value) {
                                amplitude = 0;
                            }
                            if (scrollInfo.value + amplitude <= scrollInfo.min || scrollInfo.value + amplitude >= scrollInfo.max) {
                                amplitude = 0;
                            }

                            if (amplitude > 0.5 || amplitude < -0.5) {
                                scroll(scrollInfo.value + amplitude);
                                cancelAnimationFrame(rafId);
                                rafId = 0;
                                rafId = requestAnimationFrame(autoScroll);
                            } else {
                                scroll(scrollInfo.targetValue);
                            }
                        } else {
                            if (time >= duration) {
                                cancelAnimationFrame(rafId);
                                rafId = 0;
                                return;
                            }

                            delta = Utilities.Animation.Easings.easeInSine(time, from, to - from, duration);
                            scroll(delta);
                            cancelAnimationFrame(rafId);
                            rafId = 0;
                            rafId = requestAnimationFrame(autoScroll);
                        }
                    };

                    cancelAnimationFrame(rafId);
                    rafId = requestAnimationFrame(autoScroll);
                };

                that.inputEvents.listen();
            }
        }, {
            key: 'unlisten',
            value: function unlisten() {
                var that = this;

                if (that.inputEvents) {
                    that.inputEvents.unlisten();
                }

                delete that.inputEvents;
            }
        }]);
        return Scroll;
    }();

    /** This is a class which extends an element with utility methods. */


    var _Extend = function () {
        function Extend(element) {
            babelHelpers.classCallCheck(this, Extend);

            this.events = {};
            this.handlers = {};
            this.element = element;
        }

        /**
         * Gets whether an element has a CSS Class. 
         * @param {String}.
         */


        babelHelpers.createClass(Extend, [{
            key: 'hasClass',
            value: function hasClass(className) {
                var that = this;
                var classNames = className.split(' ');

                for (var i = 0; i < classNames.length; i++) {
                    var result = that.element.classList.contains(classNames[i]);

                    if (!result) {
                        return false;
                    }
                }

                return true;
            }

            /**
             * Adds a CSS Class to an element. 
             * @param {String}.
             */

        }, {
            key: 'addClass',
            value: function addClass(className) {
                var that = this;

                if (that.hasClass(className)) {
                    return;
                }

                var classNames = className.split(' ');

                for (var i = 0; i < classNames.length; i++) {
                    that.element.classList.add(classNames[i]);
                }

                if (!that.isNativeElement) {
                    StyleObserver.observeElement(that.element);
                }
            }

            /**
             * Removes a CSS Class from an element. 
             * @param {String}.
             */

        }, {
            key: 'removeClass',
            value: function removeClass(className) {
                var that = this;

                if (arguments.length === 0) {
                    that.element.removeAttribute('class');
                    return;
                }

                var classNames = className.split(' ');

                for (var i = 0; i < classNames.length; i++) {
                    that.element.classList.remove(classNames[i]);
                }

                if (that.element.className === '') {
                    that.element.removeAttribute('class');
                }
                if (!that.isNativeElement) {
                    StyleObserver.observeElement(that.element);
                }
            }
        }, {
            key: 'dispatch',


            /** 
             * Applies the event handlers.
             * @param {Event} - event object.
             */
            value: function dispatch(event) {
                var that = this;
                var handleObjects = that.events[event.type];

                for (var i = 0; i < handleObjects.length; i++) {
                    var handleObject = handleObjects[i];
                    event.namespace = handleObject.namespace;
                    event.context = handleObject.context;

                    if (event.defaultPrevented) {
                        break;
                    }

                    var result = handleObject.handler.apply(that.element, [event]);

                    if (result !== undefined) {
                        event.result = result;

                        if (result === false) {
                            event.preventDefault();
                            event.stopPropagation();
                            break;
                        }
                    }
                }

                return event.result;
            }

            /** 
             * Fires a new event.
             * @param {String} - event type.
             * @param {Object} - event details.
             * @param {Object} - event options.
             */

        }, {
            key: 'fireEvent',
            value: function fireEvent(eventType, detail, options) {
                var that = this;

                if (!options) {
                    options = {
                        bubbles: true,
                        cancelable: true
                    };
                }
                options.detail = detail || {};

                var customEvent = new CustomEvent(eventType, options);
                customEvent.originalStopPropagation = customEvent.stopPropagation;
                customEvent.stopPropagation = function () {
                    customEvent.isPropagationStopped = true;
                    return customEvent.originalStopPropagation();
                };

                that.dispatchEvent(customEvent);

                return customEvent;
            }
        }, {
            key: 'dispatchEvent',

            /** 
                * Dispatches an event.
                * @param {CustomEvent} - event.
                */
            value: function dispatchEvent(customEvent) {
                var that = this;
                var eventType = customEvent.type;
                var context = that.element.context;

                that.element.context = document;

                if (that.element['on' + eventType]) {
                    that.element['on' + eventType](customEvent);
                } else {
                    that.element.dispatchEvent(customEvent);
                }

                that.element.context = context;
            }

            /** 
             * Adds an event listener.
             * @param {String} - event types.
             * @param {Function} - the event handler.
             */

        }, {
            key: 'listen',
            value: function listen(types, handler) {
                var that = this;
                var typesArray = types.split('.');
                var namespace = typesArray.slice(1).join('.');
                var eventType = typesArray[0];

                if (!that.events[eventType]) {
                    that.events[eventType] = [];
                }

                var handleObject = {
                    type: eventType,
                    handler: handler,
                    context: that.element,
                    namespace: namespace
                };

                if (inputEventTypes.indexOf(eventType) >= 0) {
                    if (!that.inputEvents) {
                        that.inputEvents = new InputEvents(that.element);
                    }

                    that.inputEvents[eventType](function (event) {
                        that.dispatchEvent(event);
                    });

                    that.inputEvents.boundEventTypes.push(eventType);
                    that.inputEvents.listen(eventType);
                }

                if (that.events[eventType].length === 0) {
                    that.handlers[eventType] = that.dispatch.bind(that);

                    if (eventType === 'wheel') {
                        that.element.addEventListener('wheel', that.handlers[eventType], that.isPassiveSupported ? { passive: false } : false);
                    } else {
                        that.element.addEventListener(eventType, that.handlers[eventType], false);
                    }
                }

                that.events[eventType].push(handleObject);
            }

            /** 
             * Removes an event listener.
             * @param {String} - event types.
             */

        }, {
            key: 'unlisten',
            value: function unlisten(types) {
                var that = this;
                var typesArray = types.split('.');
                var namespace = typesArray.slice(1).join('.');
                var eventType = typesArray[0];

                var handleObjects = that.events[eventType];

                if (that.inputEvents && that.inputEvents.boundEventTypes.indexOf(eventType) >= 0) {
                    that.inputEvents.boundEventTypes.splice(that.inputEvents.boundEventTypes.indexOf(eventType), 1);
                    if (that.inputEvents.boundEventTypes.length === 0) {
                        that.inputEvents.unlisten(eventType);
                    }
                }

                if (!handleObjects) {
                    return;
                }

                for (var i = 0; i < handleObjects.length; i++) {
                    if (namespace !== '') {
                        var index = handleObjects.findIndex(function (o) {
                            return o.namespace === namespace;
                        });
                        handleObjects.splice(index, 1);
                        break;
                    } else {
                        handleObjects = [];
                    }
                }
                if (handleObjects.length === 0) {
                    that.element.removeEventListener(eventType, that.handlers[eventType]);
                    that.events[eventType] = [];
                    delete that.handlers[eventType];
                }
            }

            /** 
            * Gets the element's attribute value by using the property's value.
            * @param {String} - attribute's name.
            * @param {String} - property's type.
            * @return {Object} The converted from String attribute value. 
            */

        }, {
            key: 'getAttributeValue',
            value: function getAttributeValue(attributeName, type) {
                var that = this;
                var attributeString = that.element.getAttribute(attributeName);

                if (that.isNativeElement) {
                    return that.deserialize(attributeString, type);
                }

                var propertyConfig = that.element.propertyByAttributeName[attributeName];
                var typedValue = propertyConfig.deserialize === undefined ? that.deserialize(attributeString, type, propertyConfig.nullable) : that.element[propertyConfig.deserialize](attributeString);

                return typedValue;
            }

            /** 
             * Sets the element's attribute using the property's value.
             * @param {String} - attribute's name.
             * @param {Object} - property's value.
             * @param {String} - property's type.
             */

        }, {
            key: 'setAttributeValue',
            value: function setAttributeValue(attributeName, value, type) {
                var that = this;
                var newAttributeValue = void 0;
                var nullable = false;

                if (!that.isNativeElement) {
                    var propertyConfig = that.element.propertyByAttributeName[attributeName];

                    nullable = propertyConfig.nullable;

                    if (propertyConfig.serialize) {
                        newAttributeValue = that.element[propertyConfig.serialize](value);
                    } else {
                        newAttributeValue = that.serialize(value, type, nullable);
                    }
                } else {
                    newAttributeValue = that.serialize(value, type);
                    if (type === 'boolean') {
                        var booleans = ['checked', 'selected', 'async', 'autofocus', 'autoplay', 'controls', 'defer', 'disabled', 'hidden', 'ismap', 'loop', 'multiple', 'open', 'readonly', 'required', 'scoped'];
                        if (booleans.indexOf(attributeName) >= 0) {
                            if (!value) {
                                that.element.removeAttribute(attributeName);
                            } else {
                                that.element.setAttribute(attributeName, '');
                            }
                            return;
                        }
                    }
                }

                if (type === 'array' || type === 'object') {
                    if (newAttributeValue === '[]' || newAttributeValue === '{}') {
                        that.element.removeAttribute(attributeName);
                        return;
                    }
                }

                if (newAttributeValue === undefined) {
                    that.element.removeAttribute(attributeName);
                } else {
                    that.element.setAttribute(attributeName, newAttributeValue);
                }
            }

            /** 
             * Converts a javascript value to string.
             * @param {Object} the value to be converted.
             * @return {String} The converted to String value. If the type is unknown, returns undefined.
             */

        }, {
            key: 'serialize',
            value: function serialize(value, type, nullable) {
                if (type === undefined) {
                    type = Utilities.Types.getType(value);
                }

                if (value === undefined || !nullable && value === null) {
                    return undefined;
                }

                if (nullable && value === null) {
                    return 'null';
                }

                if (type === 'string') {
                    return Utilities.Core.escapeHTML(value);
                }

                if (type === 'boolean' || type === 'bool') {
                    if (value === true || value === 'true' || value === 1 || value === '1') {
                        return '';
                    } else if (value === false || value === 'false' || value === 0 || value === '0') {
                        return undefined;
                    }
                }

                if (type === 'array') {
                    return JSON.stringify(value);
                }

                var types = ['string', 'number', 'int', 'integer', 'float', 'date', 'any', 'function'];
                if (types.indexOf(type) >= 0) {
                    return value.toString();
                }

                if (type === 'object') {
                    return JSON.stringify(value);
                }

                return undefined;
            }

            /** 
             * Converts a string to a Javascript value.
             * @param {String}
             * @param {String}
             * @return {Object} The converted String value.
             */

        }, {
            key: 'deserialize',
            value: function deserialize(stringValue, type, nullable) {
                var nullValue = stringValue === 'null';

                if (stringValue === undefined || nullValue && !nullable) {
                    return undefined;
                }

                if (nullValue && nullable) {
                    return null;
                }

                if (type === 'boolean' || type === 'bool') {
                    if (stringValue === null) {
                        return false;
                    }

                    // Boolean properties are set based on the presence of the attribute: if the attribute exists at all, the value is true.
                    return true;
                } else if (type === 'number' || type === 'float') {
                    if (stringValue === 'NaN') {
                        return NaN;
                    }

                    if (stringValue === 'Infinity') {
                        return Infinity;
                    }

                    if (stringValue === '-Infinity') {
                        return -Infinity;
                    }

                    return parseFloat(stringValue);
                } else if (type === 'int' || type === 'integer') {
                    if (stringValue === 'NaN') {
                        return NaN;
                    }

                    if (stringValue === 'Infinity') {
                        return Infinity;
                    }

                    if (stringValue === '-Infinity') {
                        return -Infinity;
                    }

                    return parseInt(stringValue);
                } else if (type === 'string' || type === 'any') {
                    return stringValue;
                } else if (type === 'date') {
                    return new Date(stringValue);
                } else if (type === 'function') {
                    if (typeof window[stringValue] === 'function') {
                        return window[stringValue];
                    }
                } else if (type === 'array' || type === 'object') {
                    try {
                        var jsonObject = JSON.parse(stringValue);

                        if (jsonObject) {
                            return jsonObject;
                        }
                    } catch (er) {
                        if (window[stringValue] && babelHelpers.typeof(window[stringValue]) === 'object') {
                            return window[stringValue];
                        }
                    }
                }

                return undefined;
            }
        }, {
            key: 'isCustomElement',
            get: function get() {
                var that = this;

                if (that.element instanceof window.Smart.BaseElement === true) {
                    return true;
                }

                if (document.createElement(that.element.nodeName) instanceof window.Smart.BaseElement === true) {
                    return true;
                }

                return false;
            }

            /** Determines whether this element is native HTMLElement. */

        }, {
            key: 'isNativeElement',
            get: function get() {
                var that = this;

                if (!that.isCustomElement) {
                    return true;
                }

                return false;
            }
        }, {
            key: 'isPassiveSupported',
            get: function get() {
                // Test via a getter in the options object to see if the passive property is accessed
                var that = this;

                if (that.supportsPassive !== undefined) {
                    return that.supportsPassive;
                }

                that.supportsPassive = false;
                try {
                    var opts = Object.defineProperty({}, 'passive', {
                        get: function get() {
                            that.supportsPassive = true;
                        }
                    });
                    window.addEventListener('testPassive', null, opts);
                    window.removeEventListener('testPassive', null, opts);
                } catch (e) {
                    //
                }

                return that.supportsPassive;
            }
        }]);
        return Extend;
    }();

    /** Animation class. */


    var Animation = function () {
        function Animation() {
            babelHelpers.classCallCheck(this, Animation);
        }

        babelHelpers.createClass(Animation, null, [{
            key: 'Ripple',


            /** Get access to Ripple class. */
            get: function get() {
                return Ripple;
            }

            /** Get access to Easings class. */

        }, {
            key: 'Easings',
            get: function get() {
                return Easings;
            }
        }]);
        return Animation;
    }();

    /** Utilities class. */


    var Utilities = function () {
        function Utilities() {
            babelHelpers.classCallCheck(this, Utilities);
        }

        babelHelpers.createClass(Utilities, null, [{
            key: 'Extend',


            /**
             * Extends Element with useful methods.
             * @param {HTMLElement}
             */
            value: function Extend(element) {
                return new _Extend(element);
            }
        }, {
            key: 'Assign',
            value: function Assign(moduleName, module) {
                Utilities[moduleName] = module;
            }
        }, {
            key: 'Types',


            /** Get access to Types class. */
            get: function get() {
                return Types;
            }
        }, {
            key: 'Core',
            get: function get() {
                return Core;
            }
        }, {
            key: 'Animation',
            get: function get() {
                return Animation;
            }
        }, {
            key: 'Scroll',
            get: function get() {
                return Scroll;
            }
        }, {
            key: 'InputEvents',
            get: function get() {
                return InputEvents;
            }
        }]);
        return Utilities;
    }();

    var $document = Utilities.Extend(document);

    BindingModule.cache = {};
    /**
     * This is a base class for Smart Elements. It extends HTMLElement.
     */

    var BaseElement = function (_HTMLElement) {
        babelHelpers.inherits(BaseElement, _HTMLElement);

        function BaseElement() {
            babelHelpers.classCallCheck(this, BaseElement);
            return babelHelpers.possibleConstructorReturn(this, (BaseElement.__proto__ || Object.getPrototypeOf(BaseElement)).apply(this, arguments));
        }

        babelHelpers.createClass(BaseElement, [{
            key: 'template',


            /**
             * Gets the element's HTML Template.
             *
             * @returns {String} - element's template.
             */
            value: function template() {
                return '<div></div>';
            }

            /** Called when the element is registered. */

        }, {
            key: 'registered',
            value: function registered() {
                var that = this;

                if (that.onRegistered) {
                    that.onRegistered();
                }
            }

            /** Called when the element has been created. */

        }, {
            key: 'created',
            value: function created() {
                var that = this;

                that.isReady = false;
                that._initElement(that);
                that._setModuleState('created');

                if (that.onCreated) {
                    that.onCreated();
                }
            }

            /** Called when the element is rendered and configured. Use for one-time post configuration of your element. */

        }, {
            key: 'completed',
            value: function completed() {
                var that = this;

                that.isCompleted = true;

                if (that._onCompleted) {
                    that._onCompleted();
                }

                if (that.onCompleted) {
                    that.onCompleted();
                }
            }
        }, {
            key: 'whenReady',
            value: function whenReady(callback) {
                var that = this;

                if (that.isCompleted) {
                    callback();
                    return;
                }

                if (!that.whenReadyCallbacks) {
                    that.whenReadyCallbacks = [];
                }

                that.whenReadyCallbacks.push(callback);
            }

            /** Called when the element is ready. Use for one-time configuration of your element. */

        }, {
            key: 'ready',
            value: function ready() {
                var _this3 = this;

                var that = this;

                var requires = function requires() {
                    var missingModules = [];

                    var requires = that.getStaticMember('requires');

                    for (var require in requires) {
                        var modules = require.split('.');

                        if (modules.length > 2) {
                            if (!window.Smart.Utilities[modules[2]]) {
                                missingModules.push(requires[require]);
                            }
                        } else if (!window.Smart[modules[1]]) {
                            missingModules.push(requires[require]);
                        }
                    }

                    if (missingModules.length > 0) {
                        var _that = _this3;

                        _that.error(_that.localize('missingReference', { elementType: _that.nodeName.toLowerCase(), files: missingModules.join(', ') }));
                    }
                };

                requires();

                if (that.dataContext) {
                    that.dataContextProperties = that.parseAttributes(that);
                    that.dataContextListeners = {};
                    that.applyDataContext();
                }

                if (that.onReady) {
                    that.onReady();
                }
            }
        }, {
            key: 'applyDataContext',
            value: function applyDataContext() {
                var that = this;
                var dataContext = typeof that.dataContext === 'string' ? window[that.dataContext] || document[that.dataContext] : that.dataContext;

                if (!dataContext || !that.dataContextProperties) {
                    that.dataContextProperties = null;
                    return;
                }

                that.updatingDataContext = true;

                for (var _boundProperty in that.dataContextProperties) {
                    var binding = that.dataContextProperties[_boundProperty];
                    var name = binding.name;

                    binding.propertyName = _boundProperty;

                    if (!BindingModule.cache['toDash' + _boundProperty]) {
                        BindingModule.cache['toDash' + _boundProperty] = Utilities.Core.toDash(name);
                    }

                    if (binding.isEvent) {
                        (function () {
                            var handlerName = binding.value;
                            if (that.dataContextListeners[name]) {
                                that.removeEventListener(name, that.dataContextListeners[name]);
                            }

                            that.dataContextListeners[name] = function (event) {
                                dataContext[handlerName](event);
                            };
                            that.addEventListener(name, that.dataContextListeners[name]);
                        })();
                    }

                    if (name.indexOf('.') >= 0) {
                        var path = name.split('.');
                        var dataBoundObject = dataContext[path[0]];

                        for (var i = 1; i < path.length; i++) {
                            dataBoundObject = dataBoundObject[path[i]];
                        }

                        if (dataBoundObject !== undefined) {
                            that[_boundProperty] = dataBoundObject;
                        }
                    } else {
                        that[_boundProperty] = dataContext[name];
                    }
                }

                that.dataContextPropertyChangedHandler = function (event) {
                    var properties = event.detail.properties;
                    var dataContext = event.detail.dataContext;
                    var elementDataContext = typeof that.dataContext === 'string' ? window[that.dataContext] || document[that.dataContext] : that.dataContext;

                    if (dataContext === elementDataContext) {
                        for (var property in properties) {
                            that[property] = properties[property].value;
                        }
                    }
                };

                $document.listen('dataContextPropertyChanged', that.dataContextPropertyChangedHandler);

                that.updatingDataContext = false;

                DataContextObserver.watch(dataContext);
            }
        }, {
            key: 'updateDataContextProperty',
            value: function updateDataContextProperty(propertyName) {
                var that = this;
                var dataContext = typeof that.dataContext === 'string' ? window[that.dataContext] || document[that.dataContext] : that.dataContext;
                var boundProperty = that.dataContextProperties[propertyName];

                if (that.updatingDataContext) {
                    return;
                }

                if (boundProperty.twoWay) {
                    var name = boundProperty.name;

                    if (name.indexOf('.') >= 0) {
                        var path = name.split('.');
                        var dataBoundObject = dataContext[path[0]];

                        for (var i = 1; i < path.length; i++) {
                            dataBoundObject = dataBoundObject[path[i]];
                        }

                        if (dataBoundObject !== undefined) {
                            dataBoundObject = that[propertyName];

                            if (dataContextInfo[dataContext._uid]) {
                                dataContextInfo[dataContext._uid][propertyName] = dataBoundObject;
                            }
                        }
                    } else {
                        dataContext[name] = that[propertyName];

                        if (dataContextInfo[dataContext._uid]) {
                            dataContextInfo[dataContext._uid][propertyName] = dataContext[name];
                        }
                    }
                }
            }
        }, {
            key: 'setup',
            value: function setup() {
                var that = this;

                that.context = this;

                if (that.isReady && !that.isCompleted) {
                    return;
                }

                if (that.isReady) {
                    that._setModuleState('attached');
                    that.isAttached = true;
                    that.attached();
                    that._handleListeners('listen');
                    that.context = document;
                    return;
                }

                if (that.ownerElement && that.ownerElement.detachedChildren.indexOf(that) >= 0) {
                    that.ownerElement.detachedChildren.splice(that.ownerElement.detachedChildren.indexOf(that), 1);
                }

                that.isReady = true;

                var isMobile = Core.isMobile;

                if (isMobile) {
                    that.classList.add('smart-mobile');
                }
                /* Updates the properties by using the attribute values. */

                for (var i = 0; i < that.attributes.length; i += 1) {
                    var property = that.propertyByAttributeName[that.attributes[i].name];

                    if (!property) {
                        continue;
                    }

                    var attributeValue = that.$.getAttributeValue(property.attributeName, property.type);
                    var attributeValueString = attributeValue ? attributeValue.toString() : '';

                    if (attributeValueString.indexOf('{{') >= 0 || attributeValueString.indexOf('[[') >= 0) {
                        continue;
                    }

                    if (property.type !== 'object' && property.type !== 'array') {
                        if (that.attributes[i].value.indexOf('{{') >= 0 || that.attributes[i].value.indexOf('[[') >= 0) {
                            continue;
                        }
                    }

                    if (attributeValue !== undefined && property.value !== attributeValue) {
                        var attributeValueType = Utilities.Types.getType(attributeValue);
                        var attributeUntypedValue = that.attributes[i].value;

                        if (property.type === 'any' || property.type === 'object') {
                            if ('' + that[property.name] === attributeValue) {
                                continue;
                            }
                        }

                        if (property.type === 'array') {
                            if (that[property.name] && JSON.stringify(that[property.name]) === attributeValue) {
                                continue;
                            }
                        }

                        if (attributeValueType === 'number' && isNaN(attributeValue) && attributeUntypedValue !== 'NaN' && attributeUntypedValue !== 'Infinity' && attributeUntypedValue !== '-Infinity') {
                            var localizedError = that.localize('propertyInvalidValueType', { name: property.name, actualType: 'string', type: property.type });
                            that.log(localizedError);
                        }

                        property.isUpdatingFromAttribute = true;
                        that[property.name] = attributeValue;
                        property.isUpdatingFromAttribute = false;
                    }
                }

                /* Set the default boolean and innerhtml attributes by using the property values. */
                for (var propertyName in that._properties) {
                    var _property = that._properties[propertyName];

                    if (propertyName === 'innerHTML' && _property.value === _property.defaultValue) {
                        _property.value = _property.defaultValue = Utilities.Core.html(that);
                    }

                    if (_property.type === 'boolean' || _property.type === 'bool') {
                        if (that.getAttribute(_property.attributeName) === 'false') {
                            _property.isUpdating = true;
                            that.setAttribute(_property.attributeName, '');
                            _property.isUpdating = false;
                        }
                    }

                    if (!_property.defaultReflectToAttribute || !_property.reflectToAttribute) {
                        continue;
                    }

                    if (_property.defaultReflectToAttribute && _property.defaultReflectToAttributeConditions) {
                        var reflectToAttribute = true;

                        for (var _i2 = 0; _i2 < _property.defaultReflectToAttributeConditions.length; _i2++) {
                            var condition = _property.defaultReflectToAttributeConditions[_i2];
                            var conditionName = void 0;
                            var conditionValue = void 0;

                            for (var name in condition) {
                                conditionName = name;
                                conditionValue = condition[name];
                            }

                            if (that._properties[conditionName] && that._properties[conditionName].value !== conditionValue) {
                                reflectToAttribute = false;
                            }
                        }

                        if (!reflectToAttribute) {
                            continue;
                        }
                    }

                    that.$.setAttributeValue(_property.attributeName, _property.value, _property.type);
                }

                var children = [];

                if (that.children.length > 0) {
                    for (var _i3 = 0; _i3 < that.children.length; _i3++) {
                        var _node2 = that.children[_i3];

                        if (Utilities.Extend(_node2).isCustomElement) {
                            children.push(_node2);
                        }
                    }
                }

                that.applyTemplate();

                that.complete = function () {
                    if (!that.templateBindingsReady) {
                        var updateTemplateBindings = function updateTemplateBindings(node) {
                            if (node.templateBindingsReady) {
                                return;
                            }

                            node.templateBindingsReady = true;
                            node.updateTextNodes();
                            node.updateBoundNodes();
                        };

                        if (!that.ownerElement) {
                            updateTemplateBindings(that);
                        } else {
                            var owner = that.ownerElement;
                            var owners = [];
                            while (owner) {
                                owners.push(owner);
                                owner = owner.ownerElement;
                            }

                            for (var _i4 = owners.length - 1; _i4 >= 0; _i4--) {
                                updateTemplateBindings(owners[_i4]);
                            }

                            updateTemplateBindings(that);
                        }
                    }

                    that._setModuleState('ready');

                    that.ready();

                    that.isAttached = true;
                    that._setModuleState('attached');
                    that.attached();
                    that._handleListeners('listen');

                    if (that.offsetWidth === 0 || that.offsetHeight === 0) {
                        that.isHidden = true;
                    }

                    that.completed();

                    if (that.whenReadyCallbacks) {
                        for (var _i5 = 0; _i5 < that.whenReadyCallbacks.length; _i5++) {
                            that.whenReadyCallbacks[_i5]();
                        }

                        that.whenReadyCallbacks = [];
                    }

                    that.context = document;
                };

                // All of the registered elements inside the element's local DOM are ready, and have had their ready methods called.
                var templateNodes = [].slice.call(that.querySelectorAll('[smart-id]')).concat(children);

                if (templateNodes.length === 0) {
                    that.complete();
                } else {
                    that._completeListeners = 0;

                    var _loop3 = function _loop3(_i6) {
                        var node = templateNodes[_i6];

                        if (Utilities.Extend(node).isCustomElement) {
                            var completeEventHandler = function () {
                                that._completeListeners--;
                                if (that._completeListeners === 0) {
                                    that.complete();

                                    delete that._completeListeners;
                                }
                            }.bind(that);

                            if (!node.isCompleted) {
                                that._completeListeners++;

                                if (!node._onCompleted) {
                                    node.completeHandlers = [];

                                    node._onCompleted = function () {
                                        for (var _i7 = 0; _i7 < node.completeHandlers.length; _i7++) {
                                            node.completeHandlers[_i7]();
                                        }
                                    };
                                }
                                node.completeHandlers.push(completeEventHandler);
                            }
                        }
                    };

                    for (var _i6 = 0; _i6 < templateNodes.length; _i6++) {
                        _loop3(_i6);
                    }

                    if (that._completeListeners === 0) {
                        that.complete();
                    }
                }
            }
        }, {
            key: 'visibilityChangedHandler',
            value: function visibilityChangedHandler() {
                var that = this;

                if (!that.isReady) {
                    return;
                }

                if (!that.isHidden && that.offsetWidth === 0 || that.offsetHeight === 0) {
                    that.isHidden = true;
                } else {
                    if (that.isHidden) {
                        that.$.fireEvent('resize', that, {
                            bubbles: false,
                            cancelable: true
                        });
                        that.isHidden = false;
                    }
                }
            }

            /** Called when an attribute is changed. */

        }, {
            key: 'attributeChangedCallback',
            value: function attributeChangedCallback(name, oldValue, newValue) {
                var that = this;
                var property = that.propertyByAttributeName[name];

                if (name === 'class' || name === 'style') {
                    that.visibilityChangedHandler();
                }

                if (!property) {
                    that.attributeChanged(name, oldValue, newValue);
                }

                if (!property || property && property.isUpdating) {
                    return;
                }

                var newPropertyValue = that.$.getAttributeValue(property.attributeName, property.type);
                if (newValue !== undefined && that[property.name] !== newPropertyValue) {
                    property.isUpdatingFromAttribute = true;
                    if (newPropertyValue !== undefined) {
                        that[property.name] = newPropertyValue;
                    } else {
                        that[property.name] = that._properties[property.name].defaultValue;
                    }
                    property.isUpdatingFromAttribute = false;
                }
            }

            /** Called when one of the element's attributes is changed. Use to handle attribute changes that don't correspond to declared properties. */

        }, {
            key: 'attributeChanged',
            value: function attributeChanged(name, oldValue, newValue) {
                if (oldValue !== newValue) {
                    /* attribute change handling logic here. */
                }
            }
        }, {
            key: 'attached',


            /** Called after the element is attached to the document. Can be called multiple times during the lifetime of an element. */
            value: function attached() {
                var that = this;

                if (that.hasStyleObserver) {
                    StyleObserver.watch(that);
                }

                if (that.onAttached) {
                    that.onAttached();
                }
            }

            /** Called after the element is detached from the document. Can be called multiple times during the lifetime of an element. */

        }, {
            key: 'detached',
            value: function detached() {
                var that = this;

                if (that.hasStyleObserver) {
                    StyleObserver.unwatch(that);
                }

                that._setModuleState('detached');
                that.isAttached = false;

                if (that.ownerElement && that.ownerElement.detachedChildren.indexOf(that) === -1) {
                    that.ownerElement.detachedChildren.push(that);
                }
                that._handleListeners('unlisten');

                if (that.onDetached) {
                    that.onDetached();
                }
            }

            /** Called when a property value is changed. */

        }, {
            key: 'propertyChangedHandler',
            value: function propertyChangedHandler(propertyName, oldValue, newValue) {
                var that = this;

                if (oldValue === newValue) {
                    return;
                }

                if (that.propertyChanged) {
                    that.propertyChanged(propertyName, oldValue, newValue);
                }
                /* Property changed logic goes here. */
            }
        }, {
            key: '_handleListeners',
            value: function _handleListeners(action) {
                var that = this;
                var tagName = that.tagName.toLowerCase();
                var listeners = that.getStaticMember('listeners');

                var processListeners = function processListeners(listeners) {
                    var _loop4 = function _loop4(listener) {
                        var path = listener.split('.');
                        var eventType = path[0];
                        var element = that.$;

                        if (path[1]) {
                            eventType = path[1];
                            element = that['$' + path[0]];

                            if (path[0] === 'document') {
                                var id = that.smartId;
                                if (id === '') {
                                    id = Utilities.Core.toCamelCase(tagName);
                                }
                                eventType = eventType + '.' + id;
                            }
                        }

                        var handlerName = listeners[listener];
                        var handler = function handler(event) {
                            var context = that.context;
                            that.context = that;
                            if (that[handlerName]) {
                                that[handlerName].apply(that, [event]);
                            }
                            that.context = context;
                        };

                        if (!element) {
                            return 'continue';
                        }

                        element[action](eventType, handler);
                    };

                    for (var listener in listeners) {
                        var _ret7 = _loop4(listener);

                        if (_ret7 === 'continue') continue;
                    }
                };

                processListeners(listeners);
                processListeners(that.templateListeners);
            }

            /** Parses the element's template. */

        }, {
            key: 'parseTemplate',
            value: function parseTemplate() {
                var that = this;
                var template = that.template();
                var fragment = document.createDocumentFragment();

                if (template === '') {
                    return null;
                }

                /* Create a wrapper DIV tag. */
                var tmpElement = document.createElement('div');
                fragment.appendChild(tmpElement);

                /* Fill the nodes array with the wrapper's childNodes. */
                tmpElement.innerHTML = template;
                var nodes = tmpElement.childNodes;

                /* Remove the wrapper DIV tag. */
                tmpElement.parentNode.removeChild(tmpElement);

                /* Add the nodes to the fragment. */
                for (var i = 0; i < nodes.length; i++) {
                    fragment.appendChild(nodes[i]);
                }

                return fragment;
            }
        }, {
            key: 'applyTemplate',
            value: function applyTemplate() {
                var that = this;

                var templateElement = that.parseTemplate();

                if (!templateElement) {
                    return;
                }

                var template = document.importNode(templateElement, true);

                if (!template.hasChildNodes) {
                    return;
                }

                var rootElement = template.childNodes[0];
                var map = function map(name, element) {
                    that['$' + name] = element.$ = Utilities.Extend(element);
                    that.$[name] = element;
                    element.ownerElement = that;
                };

                /* Create a content element. */
                var contentElement = rootElement;

                if (rootElement.getElementsByTagName('content').length > 0) {
                    var contentInsertionPoint = rootElement.getElementsByTagName('content')[0];
                    contentElement = contentInsertionPoint.parentNode;
                    contentElement.removeChild(contentInsertionPoint);
                } else {
                    var preudoContentElement = template.querySelectorAll('[inner-h-t-m-l]');
                    if (preudoContentElement && preudoContentElement.length > 0) {
                        contentElement = preudoContentElement[0];
                    }
                }

                /* Build nodes map. */
                var templateNodes = template.querySelectorAll('[id]');
                if (templateNodes.length === 0) {
                    templateNodes = template.querySelectorAll('*');
                }

                map('root', rootElement);
                map('content', contentElement);

                that.$.html = that.innerHTML.toString().trim();

                for (var i = 0; i < templateNodes.length; i += 1) {
                    var templateNode = templateNodes[i];
                    if (templateNode.id === '') {
                        templateNode.id = 'child' + i;
                    }

                    map(templateNode.id, templateNode);
                    templateNode.setAttribute('smart-id', templateNode.id);

                    if (!that.shadowRoot) {
                        templateNode.removeAttribute('id');
                    }
                }

                that.bindings = that.getBindings(template);
                that.$root.addClass('smart-container');
                /* Move element's initial nodes to the content element. */
                while (that.childNodes.length) {
                    contentElement.appendChild(that.firstChild);
                }

                /* Append the template. */
                that.appendTemplate(template);
            }
        }, {
            key: 'appendTemplate',
            value: function appendTemplate(template) {
                var that = this;

                that.appendChild(template);
            }

            /** Defines the custom element's default modules. The function is called once when the element's script file is referred. */

        }, {
            key: 'defineElementModules',
            value: function defineElementModules() {
                var that = this;

                var proto = that.constructor.prototype;
                proto.modules = that.constructor.modules;

                var modules = proto.modules;

                for (var i = 0; i < modules.length; i += 1) {
                    that.addModule(modules[i]);
                }
            }
        }, {
            key: 'watch',
            value: function watch(properties, propertyChangedCallback) {
                var that = this;

                if (properties === null || propertyChangedCallback === null) {
                    that._watch = null;
                    return;
                }

                that._watch = {
                    properties: properties,
                    propertyChangedCallback: propertyChangedCallback
                };
            }
        }, {
            key: 'unwatch',
            value: function unwatch() {
                var that = this;

                that._watch = null;
            }
        }, {
            key: '_setModuleState',
            value: function _setModuleState(stateName, args) {
                var that = this;
                var statusName = 'is' + stateName.substring(0, 1).toUpperCase() + stateName.substring(1);
                var callbackName = 'on' + stateName.substring(0, 1).toUpperCase() + stateName.substring(1);

                for (var i = 0; i < that.modulesList.length; i++) {
                    var module = that.modulesList[i];

                    module[statusName] = true;

                    if (module[stateName]) {
                        module[stateName](args);
                    }

                    if (module[callbackName]) {
                        module[callbackName](args);
                    }
                }
            }

            /**
             * Adds a module to the the element. Module's methods and properties are mixed into the element's prototype.
             * @param {Object}.
             */

        }, {
            key: 'addModule',
            value: function addModule(module) {
                var that = this;

                if (!module) {
                    return;
                }

                var modules = that.modules.slice(0);
                var proto = module.prototype;

                if (!module.moduleName && module.name) {
                    module.moduleName = module.name;
                }

                if (modules.findIndex(function (currentModule) {
                    return module.moduleName === currentModule.moduleName;
                }) === -1) {
                    modules.push(module);
                }

                that.defineModule(module);
                that.defineElementMethods(proto.methodNames, proto);
                that.defineElementProperties(module.properties);

                var elementProto = that.constructor.prototype;
                elementProto.modules = modules;
            }

            /** Defines a module and creates its properties. */

        }, {
            key: 'defineModule',
            value: function defineModule(module) {
                if (module.isDefined) {
                    return;
                }

                module.prototype._initModule = function (element) {
                    var that = this;

                    that.ownerElement = element;
                };

                var properties = module.properties || {};
                var propertyNames = Object.keys(properties);
                var methodNames = Object.getOwnPropertyNames(module.prototype);

                module.prototype.methodNames = methodNames;

                var _loop5 = function _loop5(j) {
                    var propertyName = propertyNames[j];
                    var property = properties[propertyName];

                    Object.defineProperty(module.prototype, propertyName, {
                        configurable: false,
                        enumerable: true,
                        get: function get() {
                            var that = this;

                            if (!that.ownerElement) {
                                return property.value;
                            }

                            return that.ownerElement[propertyName];
                        },
                        set: function set(value) {
                            var that = this;

                            that.ownerElement[propertyName] = value;
                        }
                    });
                };

                for (var j = 0; j < propertyNames.length; j += 1) {
                    _loop5(j);
                }

                module.isDefined = true;
            }
        }, {
            key: 'getStaticMember',
            value: function getStaticMember(memberName) {
                var that = this;
                var element = window.Smart[that.elementName];

                var staticMember = element[memberName];
                var inheritedStaticMember = {};
                var baseProto = Object.getPrototypeOf(element);
                var protoChain = [];

                while (baseProto[memberName]) {
                    protoChain.push(baseProto[memberName]);
                    baseProto = Object.getPrototypeOf(baseProto);
                }

                for (var i = protoChain.length - 1; i >= 0; i--) {
                    inheritedStaticMember = Utilities.Core.assign(inheritedStaticMember, protoChain[i]);
                }

                return Utilities.Core.assign(inheritedStaticMember, staticMember);
            }

            /** Defines the element properties, methods and modules. */

        }, {
            key: 'defineElement',
            value: function defineElement() {
                var that = this;
                var proto = that.constructor.prototype;
                var properties = that.getStaticMember('properties');
                var methods = Object.getOwnPropertyNames(proto);

                proto.extendedProperties = {};
                proto.boundProperties = {};
                proto.templateListeners = {};

                that.defineElementModules();
                that.defineElementMethods(methods, proto);
                that.defineElementProperties(properties);

                /* Initialization of element's instance properties. */
                proto._initElement = function () {
                    var that = this;

                    var properties = proto.extendedProperties;
                    var propertyNames = Object.keys(properties);
                    var modules = that.modules;

                    that.$ = Utilities.Extend(that);
                    that.$document = $document;
                    that.smartId = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();

                    if (!that.isCreated) {
                        that.modulesList = [];
                        that._properties = [];
                        if (that._beforeCreatedProperties) {
                            that._properties = that._beforeCreatedProperties;
                            delete that._beforeCreatedProperties;
                        }

                        that.detachedChildren = [];
                        that.propertyByAttributeName = [];
                    }

                    for (var i = 0; i < modules.length; i += 1) {
                        var module = modules[i];
                        var moduleInstance = new module();
                        moduleInstance._initModule(that);
                        that.modulesList.push(moduleInstance);
                    }

                    var _loop6 = function _loop6(_i8) {
                        var propertyName = propertyNames[_i8];
                        var property = properties[propertyName];
                        var defaultValue = property.value;

                        if (that._properties[propertyName]) {
                            if (that._properties[propertyName].notify !== undefined) {
                                return 'continue';
                            } else {
                                delete that._properties[propertyName];
                            }
                        }

                        if (isOldChrome && propertyName === 'innerHTML') {
                            delete that[propertyName];
                        }

                        if (window.navigator.userAgent.indexOf('PhantomJS') === -1 && that.hasOwnProperty(propertyName)) {
                            defaultValue = that[propertyName];

                            delete that[propertyName];
                        }

                        if (property.type === 'array' && defaultValue !== undefined && defaultValue !== null) {
                            defaultValue = defaultValue.slice(0);
                        }

                        if (property.type === 'object' && defaultValue !== undefined && defaultValue !== null) {
                            if (defaultValue instanceof Array) {
                                defaultValue = defaultValue.slice(0);
                            } else {
                                defaultValue = Object.assign({}, defaultValue);
                            }
                        }

                        that._properties[propertyName] = {
                            name: propertyName,
                            notify: property.notify,
                            allowedValues: property.allowedValues,
                            type: property.type,
                            nullable: property.nullable,
                            reflectToAttribute: property.reflectToAttribute,
                            defaultReflectToAttribute: property.defaultReflectToAttribute,
                            defaultReflectToAttributeConditions: property.defaultReflectToAttributeConditions,
                            value: defaultValue,
                            readOnly: property.readOnly,
                            defaultValue: defaultValue,
                            attributeName: property.attributeName,
                            observer: property.observer,
                            inherit: property.inherit,
                            extend: property.extend,
                            validator: property.validator
                        };

                        that.propertyByAttributeName[property.attributeName] = that._properties[propertyName];

                        if (!property.hasOwnProperty('type')) {
                            var localizedError = that.localize('propertyUnknownType', { name: propertyName });
                            that.log(localizedError);
                        }

                        if (property.type === 'any') {
                            return 'continue';
                        }

                        var defaultValueType = Utilities.Types.getType(defaultValue);
                        if (defaultValue !== undefined && defaultValue !== null && property.type !== defaultValueType && !property.validator) {
                            if (property.type === 'object' && defaultValueType === 'array') {
                                return 'continue';
                            }

                            if (defaultValueType === 'number') {
                                var types = ['integer', 'int', 'float'];
                                var propertyIndex = types.findIndex(function (type) {
                                    return type === property.type;
                                });

                                if (propertyIndex >= 0) {
                                    return 'continue';
                                }
                            }
                            var _localizedError = that.localize('propertyInvalidValueType', { name: propertyName, actualType: defaultValueType, type: property.type });
                            that.log(_localizedError);
                        }
                    };

                    for (var _i8 = 0; _i8 < propertyNames.length; _i8 += 1) {
                        var _ret9 = _loop6(_i8);

                        if (_ret9 === 'continue') continue;
                    }

                    that.isCreated = true;
                };

                /* Calls the registered method. It is useful for one-time configuration. */
                proto.registered();
            }

            /**
             * Defines Element's methods. 
             * {Array} - methods.
             * {Object} - method owner's prototype.
             */

        }, {
            key: 'defineElementMethods',
            value: function defineElementMethods(methods, proto) {
                var that = this;
                var elementProto = that.constructor.prototype;

                var invokeMethod = function invokeMethod(method, methodName) {
                    var args = Array.prototype.slice.call(arguments, 2);

                    var elementMethod = function elementMethod() {
                        /* Raise an exception when the method is invoked while the element is not in Ready state. */
                        if (!this.isReady && methodName !== 'localize' && methodName !== 'log') {
                            var localizedError = this.localize('elementNotInDOM');
                            this.log(localizedError);
                        }

                        var methodContext = this;
                        for (var i = 0; i < this.modulesList.length; i++) {
                            var module = this.modulesList[i];
                            if (methodName in module) {
                                methodContext = module;
                                break;
                            }
                        }

                        var context = this.context;
                        this.context = this;
                        var result = method.apply(methodContext, args.concat(Array.prototype.slice.call(arguments)));
                        this.context = context;

                        return result;
                    };

                    return elementMethod;
                };

                /* Exclude these methods. */
                var excludeMethods = ['constructor', 'ready', 'created', 'attached', 'detached', 'appendChild', 'insertBefore', 'removeChild', 'propertyChangedHandler'];

                /* Wrap Custom Element's methods. */

                var _loop7 = function _loop7(index) {
                    var methodName = methods[index];

                    if (methodName.startsWith('_') || excludeMethods.find(function (excludeMethodName) {
                        return excludeMethodName === methodName;
                    }) !== undefined) {
                        return 'continue';
                    }

                    if (elementProto.extendedProperties[methodName]) return 'continue';

                    if (!Utilities.Types.isFunction(proto[methodName])) return 'continue';

                    elementProto[methodName] = invokeMethod(proto[methodName], methodName);
                };

                for (var index in methods) {
                    var _ret10 = _loop7(index);

                    if (_ret10 === 'continue') continue;
                }
            }

            /** Defines the custom element's properties. The function is called once when an element's script file is referred. */

        }, {
            key: 'defineElementProperties',
            value: function defineElementProperties(properties) {
                if (!properties) {
                    return;
                }

                var that = this;
                var proto = that.constructor.prototype;
                var propertyNames = Object.keys(properties);
                var defaultProperties = that.getStaticMember('properties');

                Object.assign(proto.extendedProperties, properties);

                /* Called when a property is set. Updates the property and synchronizes with the attribute. */
                var updateProperty = function updateProperty(context, property, value) {
                    var that = context;

                    if (property.readOnly) {
                        return;
                    }

                    /* Raises an exception when the new value is not in the allowedValues list. */
                    if (property.allowedValues) {
                        var isValidValue = false;

                        for (var i = 0; i < property.allowedValues.length; i++) {
                            if (property.allowedValues[i] === value) {
                                isValidValue = true;
                                break;
                            }
                        }

                        if (!isValidValue) {
                            var allowedValuesString = JSON.stringify(property.allowedValues).replace(/\[|\]/gi, '').replace(',', ', ').replace(/"/gi, '\'');
                            var actualValueString = '\'' + value + '\'';
                            var localizedError = that.localize('propertyInvalidValue', { name: property.name, actualValue: actualValueString, value: allowedValuesString });

                            that.log(localizedError);
                            return;
                        }
                    }

                    var propertyName = property.name;
                    var oldValue = that._properties[propertyName].value;

                    /* Calls the property's validator, if defined. */
                    if (property.validator) {
                        if (that[property.validator]) {
                            var _context = that.context;

                            that.context = that;

                            var validatedResult = that[property.validator](oldValue, value);

                            if (validatedResult !== undefined) {
                                value = validatedResult;
                            }

                            that.context = _context;
                        }
                    }

                    if (oldValue === value) {
                        return;
                    }

                    if (!property.hasOwnProperty('type')) {
                        var _localizedError2 = that.localize('propertyUnknownType', { name: propertyName });
                        that.log(_localizedError2);
                    }

                    if (property.type === 'array' && JSON.stringify(oldValue) === JSON.stringify(value)) {
                        return;
                    }

                    if (value !== undefined && value !== null && property.type !== 'any' && property.type !== Utilities.Types.getType(value) && !property.validator || value === null && !property.nullable) {
                        var throwError = true;

                        if (property.type === 'object' && Utilities.Types.getType(value) === 'array') {
                            throwError = false;
                        }

                        if (Utilities.Types.getType(value) === 'number') {
                            var types = ['integer', 'int', 'float'];
                            var propertyIndex = types.findIndex(function (type) {
                                return type === property.type;
                            });

                            if (propertyIndex >= 0) {
                                throwError = false;
                            }
                        }

                        if (throwError) {
                            var _localizedError3 = that.localize('propertyInvalidValueType', { name: propertyName, actualType: Utilities.Types.getType(value), type: property.type });
                            that.log(_localizedError3);
                            return;
                        }
                    }

                    property.isUpdating = true;
                    that._properties[propertyName].value = value;

                    /* Updates the element's attribute value. */
                    if (!property.isUpdatingFromAttribute && property.reflectToAttribute) {
                        that.$.setAttributeValue(property.attributeName, value, property.type);
                    }

                    /* Calls the element's propertyChangedHandler function when the element is in Ready state and the property is observed. */
                    var isReady = that.isReady && (!that.ownerElement || that.ownerElement && that.ownerElement.isReady);

                    if (isReady) {
                        if (that.context !== that) {
                            /* Setting context to that prevents calling propertyChangedHandler, if the custom element's developer
                             * sets another element property within the propertyChangedHandler. 
                            */
                            var _context2 = that.context;

                            that.context = that;
                            that.propertyChangedHandler(propertyName, oldValue, value);
                            that.context = _context2;

                            /* Calls the property's observer, if defined. */
                            if (property.observer) {
                                if (that[property.observer]) {
                                    that.context = that;
                                    that[property.observer](oldValue, value);
                                    that.context = document;
                                }
                            }

                            if (that._watch && that._watch.properties.indexOf(propertyName) >= 0) {
                                that._watch.propertyChangedCallback(propertyName, oldValue, value);
                            }
                        }

                        /* Dispatch an event when property's notify member is set. */
                        var notify = property.notify || that.boundProperties[propertyName];
                        if (notify) {
                            that.$.fireEvent(property.attributeName + '-changed', { context: that.context, oldValue: oldValue, value: value });
                            if (that.boundProperties[propertyName]) {
                                that.updateBoundNodes(propertyName);
                            }
                        }

                        if (that.dataContextProperties) {
                            if (propertyName === 'dataContext') {
                                that.applyDataContext();
                            } else if (that.dataContextProperties[propertyName]) {
                                that.updateDataContextProperty(propertyName);
                            }
                        }
                    }
                    property.isUpdating = false;
                };

                /* Defines element's properties. */

                var _loop8 = function _loop8(i) {
                    var propertyName = propertyNames[i];
                    var property = properties[propertyName];
                    var attributeName = Utilities.Core.toDash(propertyName);
                    var type = property.type || 'any';
                    var nullable = type.indexOf('?') >= 0 || type === 'any';

                    if (nullable && type !== 'any') {
                        property.type = type.substring(0, type.length - 1);
                    }

                    property.nullable = nullable;
                    property.attributeName = attributeName.toLowerCase();
                    property.name = propertyName;
                    property.reflectToAttribute = property.reflectToAttribute !== undefined ? property.reflectToAttribute : true;

                    if (property.inherit && defaultProperties[propertyName]) {
                        property.value = defaultProperties[propertyName].value;
                    }

                    if (property.extend && defaultProperties[propertyName]) {
                        Utilities.Core.assign(property.value, defaultProperties[propertyName].value);
                    }

                    if (proto.hasOwnProperty(propertyName)) {
                        return 'continue';
                    }

                    Object.defineProperty(proto, propertyName, {
                        configurable: false,
                        enumerable: true,
                        get: function get() {
                            var that = this;

                            return that._properties[propertyName].value;
                        },
                        set: function set(value) {
                            var that = this;

                            updateProperty(that, that._properties[propertyName], value);
                        }
                    });
                };

                for (var i = 0; i < propertyNames.length; i += 1) {
                    var _ret11 = _loop8(i);

                    if (_ret11 === 'continue') continue;
                }
            }
        }, {
            key: 'properties',
            get: function get() {
                var that = this;

                if (!that._properties) {
                    that._properties = [];
                }

                return that._properties;
            }

            /**
             * Gets the element's parents.
             *
             * @return {Array<HTMLElement>} - element's parents.
             */

        }, {
            key: 'parents',
            get: function get() {
                var that = this;

                var matched = [],
                    current = that.parentNode;

                while (current && current.nodeType !== 9) {
                    if (current instanceof HTMLElement === true) {
                        matched.push(current);
                    }
                    current = current.parentNode;
                }
                return matched;
            }

            /**
             * Gets if the element is currently focused.
             *
             * @return {Boolean}.
             */

        }, {
            key: 'focused',
            get: function get() {
                return this.contains(document.activeElement);
            }
        }, {
            key: 'hasStyleObserver',
            get: function get() {
                return true;
            }
        }], [{
            key: 'properties',

            /**
             * Element's properties.
             *
             * @return {Object} - element's properties.
             */
            get: function get() {
                return {
                    'unfocusable': {
                        value: false,
                        type: 'boolean'
                    },
                    'disabled': {
                        value: false,
                        type: 'boolean'
                    },
                    'dataContext': {
                        value: null,
                        reflectToAttribute: false,
                        type: 'any'
                    },
                    'readonly': {
                        value: false,
                        type: 'boolean'
                    },
                    'rightToLeft': {
                        value: false,
                        type: 'boolean'
                    },
                    'messages': {
                        value: {
                            'en': {
                                'propertyUnknownType': '\'{{name}}\' property is with undefined \'type\' member!',
                                'propertyInvalidValue': 'Invalid \'{{name}}\' property value! Actual value: {{actualValue}}, Expected value: {{value}}!',
                                'propertyInvalidValueType': 'Invalid \'{{name}}\' property value type! Actual type: {{actualType}}, Expected type: {{type}}!',
                                'elementNotInDOM': 'Element does not exist in DOM! Please, add the element to the DOM, before invoking a method.',
                                'moduleUndefined': 'Module is undefined.',
                                'missingReference': '{{elementType}}: Missing reference to {{files}}.',
                                'htmlTemplateNotSuported': '{{elementType}}: Browser doesn\'t support HTMLTemplate elements.',
                                'invalidTemplate': '{{elementType}}: "{{property}}" property accepts a string that must match the id of an HTMLTemplate element from the DOM.'
                            }
                        },
                        reflectToAttribute: false,
                        type: 'object'
                    }
                };
            }

            /**
             * Element's requires.
             *
             * @return {Object} - element's required modules.
             */

        }, {
            key: 'requires',
            get: function get() {
                return {};
            }

            /**
             * Element's listeners.
             *
             * @return {Object} - element's listeners.
             */

        }, {
            key: 'listeners',
            get: function get() {
                return {};
            }

            /**
             * Element's modules.
             *
             * @return {Array<Module>} - element's modules.
             */

        }, {
            key: 'modules',
            get: function get() {
                return window.Smart.Modules;
            }
        }]);
        return BaseElement;
    }(HTMLElement);

    var customElements = [];
    var registeredCallbacks = [];
    var registeredLoadedCallbacks = [];
    var isOldChrome = false;

    var chromeAgent = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    if (chromeAgent) {
        var chromeVersion = parseInt(chromeAgent[2], 10);
        if (chromeVersion <= 50) {
            isOldChrome = true;
        }
    }

    //const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    var isIE = navigator.userAgent.match(/MSIE/) || !!window.MSInputMethodContext && !!document.documentMode;
    var supportsCustomElementsV1 = !isIE && 'customElements' in window;
    var connectElements = function connectElements() {
        if (document.readyState !== 'complete') {
            return;
        }

        registeredLoadedCallbacks.sort(function (element1, element2) {
            var indexA = element1.element.parents.length;
            var indexB = element2.element.parents.length;

            if (indexA < indexB) {
                return -1;
            }
            if (indexA > indexB) {
                return 1;
            }

            return 0;
        });

        for (var i = 0; i < registeredLoadedCallbacks.length; i++) {
            registeredLoadedCallbacks[i].callback();
            registeredLoadedCallbacks[i].element.isLoading = false;
        }

        registeredLoadedCallbacks = [];
        document.removeEventListener('readystatechange', connectElements);
    };

    document.addEventListener('readystatechange', connectElements);

    var BaseCustomElement = function (_BaseElement) {
        babelHelpers.inherits(BaseCustomElement, _BaseElement);

        function BaseCustomElement() {
            babelHelpers.classCallCheck(this, BaseCustomElement);
            return babelHelpers.possibleConstructorReturn(this, (BaseCustomElement.__proto__ || Object.getPrototypeOf(BaseCustomElement)).apply(this, arguments));
        }

        babelHelpers.createClass(BaseCustomElement, [{
            key: 'createdCallback',

            /** Called when an instance of the custom element is created. */
            value: function createdCallback() {
                /*  initialization code goes here. */
                var that = this;

                that.classList.add('smart-element-init');
                that.created();
            }

            /** Called when an instance of custom element is attached to the DOM. */

        }, {
            key: 'attachedCallback',
            value: function attachedCallback() {
                var that = this;

                if (that.isLoading) {
                    return;
                }

                var updateVisibility = function updateVisibility() {
                    that.classList.remove('smart-element-init');
                };

                if (document.readyState === 'complete' /*&& !ElementRegistry.isRegistering */) {
                        updateVisibility();
                        that.setup();
                    } else {
                    that.isLoading = true;
                    registeredLoadedCallbacks.push({
                        element: this, callback: function () {
                            if (this.isReady) {
                                return;
                            }

                            updateVisibility();
                            this.setup();
                        }.bind(that)
                    });
                }
            }

            /** Called when an instance of custom element is detached from the DOM. V0 spec. */

        }, {
            key: 'detachedCallback',
            value: function detachedCallback() {
                var that = this;

                if (!that.isAttached) {
                    return;
                }

                that.detached();
            }
        }]);
        return BaseCustomElement;
    }(BaseElement);

    var BaseCustomElementV1 = function (_BaseElement2) {
        babelHelpers.inherits(BaseCustomElementV1, _BaseElement2);
        babelHelpers.createClass(BaseCustomElementV1, [{
            key: 'scopedStyle',
            value: function scopedStyle() {
                var scopedStyle = '\n                :host {\n                    display: block;\n                    overflow: hidden;\n                }\n                :host, :host > *:first-child, :host > * {\n                    box-sizing: border-box;\n                }\n                :host[disabled] {\n                    opacity: 0.55;\n                    cursor: default;\n                }\n                .smart-container {\n                    box-sizing: border-box;\n                    font-family: Arial, sans-serif;\n                    font-size: inherit;\n                    display: block;\n                    width: 100%;\n                    height: 100%;\n                    outline: none;\n                    margin: 0;\n                    padding: 0;\n                }\n            ';
                return scopedStyle;
            }
        }, {
            key: 'addExternalStylesheet',
            value: function addExternalStylesheet(path) {
                var that = this;

                if (!that.shadowRoot || !path) {
                    return;
                }

                var link = document.createElement('link');

                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = path;

                that.shadowRoot.insertBefore(link, that.shadowRoot.firstChild);
            }
        }, {
            key: 'attributeChanged',
            value: function attributeChanged(name, oldValue, newValue) {
                if (name === 'external-style') {
                    this.externalStyle = newValue;
                }
            }
        }, {
            key: 'attributeChangedCallback',
            value: function attributeChangedCallback(name, oldValue, newValue) {
                var that = this;

                if (!that.isReady) {
                    return;
                }

                babelHelpers.get(BaseCustomElementV1.prototype.__proto__ || Object.getPrototypeOf(BaseCustomElementV1.prototype), 'attributeChangedCallback', this).call(this, name, oldValue, newValue);
            }
            /** Called when an instance of the custom element is created. */

        }, {
            key: 'externalStyle',
            get: function get() {
                return this._externalStylePath;
            },
            set: function set(path) {
                this._externalStylePath = path;
            }
        }], [{
            key: 'observedAttributes',
            get: function get() {
                var that = this;
                var observedAttributes = ['external-style'];

                for (var _propertyName2 in that.prototype.extendedProperties) {
                    var propertyConfig = that.prototype.extendedProperties[_propertyName2];

                    observedAttributes.push(propertyConfig.attributeName);
                }

                return observedAttributes;
            }
        }]);

        function BaseCustomElementV1() {
            babelHelpers.classCallCheck(this, BaseCustomElementV1);

            /*  initialization code goes here. */
            var _this5 = babelHelpers.possibleConstructorReturn(this, (BaseCustomElementV1.__proto__ || Object.getPrototypeOf(BaseCustomElementV1)).call(this));

            var that = _this5;

            that._externalStylePath = '';
            // Uncomment when scopedStyle is implemented in all elements.
            //that.attachShadow({ mode: 'open' });
            that.created();
            return _this5;
        }

        babelHelpers.createClass(BaseCustomElementV1, [{
            key: 'connect',
            value: function connect() {
                var that = this;

                var isReady = that.isReady;
                var templateStyle = void 0;

                if (!isReady) {
                    if (that.children.length > 0 && that.children[0] instanceof HTMLStyleElement) {
                        templateStyle = that.children[0];
                        that.removeChild(templateStyle);
                    }
                }

                that.setup();

                if (!isReady && that.shadowRoot) {
                    if (templateStyle) {
                        that.shadowRoot.insertBefore(templateStyle, that.shadowRoot.firstChild);
                    }

                    that.addExternalStylesheet(that._externalStylePath);

                    var scopedStyle = document.createElement('style');
                    scopedStyle.innerHTML = that.scopedStyle();
                    that.shadowRoot.insertBefore(scopedStyle, that.shadowRoot.firstChild);
                }
            }
            /** Called when an instance of custom element is attached to the DOM. */

        }, {
            key: 'connectedCallback',
            value: function connectedCallback() {
                var that = this;

                if (that.isLoading) {
                    return;
                }

                that.classList.add('smart-element-init');

                var updateVisibility = function updateVisibility() {
                    that.classList.remove('smart-element-init');
                };

                if (document.readyState === 'complete' /*&& !ElementRegistry.isRegistering */) {
                        updateVisibility();
                        that.connect();
                    } else {
                    that.isLoading = true;
                    registeredLoadedCallbacks.push({
                        element: this, callback: function () {
                            if (this.isReady) {
                                return;
                            }

                            updateVisibility();
                            this.connect();
                        }.bind(that)
                    });
                }
            }

            /** Called when an instance of custom element is detached from the DOM. V0 spec. */

        }, {
            key: 'disconnectedCallback',
            value: function disconnectedCallback() {
                var that = this;

                if (!that.isAttached) {
                    return;
                }

                that.detached();
            }

            /** Called when an instance of custom element is attached to the DOM. */

        }, {
            key: 'adoptedCallback',
            value: function adoptedCallback() {
                var that = this;

                that.setup();
            }
        }, {
            key: 'appendTemplate',
            value: function appendTemplate(template) {
                var that = this;

                if (that.shadowRoot) {
                    that.shadowRoot.appendChild(template);
                } else {
                    that.appendChild(template);
                }
            }
        }]);
        return BaseCustomElementV1;
    }(BaseElement);

    /**
     * This is a base class for registration of custom elements.
     */


    var ElementRegistry = function () {
        function ElementRegistry() {
            babelHelpers.classCallCheck(this, ElementRegistry);
        }

        babelHelpers.createClass(ElementRegistry, null, [{
            key: 'register',

            /**
             * Called by each custom element to register it. 
               @param {String} - tag name.
               @param {Object} - element's object like Button, NumericTextBox, etc.
             */
            value: function register(tagName, element) {
                var proto = element.prototype;
                var elementName = Core.toCamelCase(tagName).replace(/[a-z]+/, '');

                if (customElements[tagName]) {
                    return;
                }

                customElements[tagName] = window.Smart[elementName] = element;
                proto.elementName = elementName;
                proto.defineElement();
                if (registeredCallbacks[tagName]) {
                    registeredCallbacks[tagName](proto);
                }

                /** Use customElements v1 spec, if it is supported. */
                if (supportsCustomElementsV1) {
                    window.customElements.define(tagName, element);
                    return;
                }

                document.registerElement(tagName, element);
            }
        }, {
            key: 'registerElements',
            value: function registerElements() {
                var that = this;

                if (!that.toRegister) {
                    return;
                }

                that.isRegistering = true;

                for (var i = that.toRegister.length - 1; i >= 0; i--) {
                    var toRegisterItem = that.toRegister[i];

                    that.register(toRegisterItem.tagName, toRegisterItem.element);
                }

                that.isRegistering = false;
            }

            /**
             * Returns the element's object.
             * @param {String} - tag name.
             * @return {Object} - custom element's object.
             */

        }, {
            key: 'get',
            value: function get(tagName) {
                if (customElements[tagName]) {
                    return customElements[tagName];
                }
                return undefined;
            }

            /**
             * Determines whether the element is registered.
             * @param {String} - tag name.
             * @param {Function} - the callback function which is called when the element is registered.
             */

        }, {
            key: 'whenRegistered',
            value: function whenRegistered(tagName, callback) {
                if (!tagName) {
                    throw new Error('Syntax Error: Invalid tag name');
                }

                var that = this;
                var existingCallback = registeredCallbacks[tagName];
                var element = that.get(tagName);
                var modulesLength = element ? element.modules.length : 3;

                try {
                    if (!existingCallback && !element) {
                        registeredCallbacks[tagName] = function (proto) {
                            try {
                                callback(proto);
                            } catch (error) {
                                var errorMessage = error instanceof Error ? error.message : error.toString();

                                console.log(errorMessage);
                            }
                        };
                    } else if (!existingCallback && element) {
                        callback(element.prototype);
                        registeredCallbacks[tagName] = undefined;
                    } else if (existingCallback && !element) {
                        registeredCallbacks[tagName] = function (proto) {
                            existingCallback(proto);
                            callback(proto);
                        };
                    } else if (existingCallback && element) {
                        existingCallback(element.proto);
                        callback(element.proto);
                        registeredCallbacks[tagName] = undefined;
                    }
                } catch (error) {
                    var errorMessage = error instanceof Error ? error.message : error.toString();

                    console.log(errorMessage);
                }

                if (element && modulesLength !== element.prototype.modules.length) {
                    var elements = document.querySelectorAll(tagName);

                    for (var j = 0; j < elements.length; j++) {
                        var _element = elements[j];

                        if (_element.isCreated) {
                            _element._initElement();
                        }
                    }
                }
            }
        }]);
        return ElementRegistry;
    }();

    ElementRegistry.lazyRegister = false;
    ElementRegistry.tagNames = [];

    /*
     * Defines the 'Smart' namespace.
     * @param {String} - the tag's name.
     * @param {Object} - the custom element.
     */
    window.Smart = function (tagName, element) {
        var name = tagName;

        if (ElementRegistry.tagNames[name]) {
            name = ElementRegistry.tagNames[name];
        }

        if (ElementRegistry.lazyRegister) {
            if (!ElementRegistry.toRegister) {
                ElementRegistry.toRegister = [];
            }

            var elementName = Core.toCamelCase(name).replace(/[a-z]+/, '');
            window.Smart[elementName] = element;

            ElementRegistry.toRegister.push({ tagName: name, element: element });
            return;
        }

        ElementRegistry.register(name, element);
    };

    Object.assign(window.Smart, {
        Elements: ElementRegistry,
        Modules: [ErrorModule, LocalizationModule, BindingModule],
        BaseElement: supportsCustomElementsV1 ? BaseCustomElementV1 : BaseCustomElement,
        Utilities: Utilities,
        Version: '1.9.2'
    });

    /**
    * Content element.
    */
    window.Smart('smart-content-element', function (_window$Smart$BaseEle) {
        babelHelpers.inherits(ContentElement, _window$Smart$BaseEle);

        function ContentElement() {
            babelHelpers.classCallCheck(this, ContentElement);
            return babelHelpers.possibleConstructorReturn(this, (ContentElement.__proto__ || Object.getPrototypeOf(ContentElement)).apply(this, arguments));
        }

        babelHelpers.createClass(ContentElement, [{
            key: 'template',


            /** Content Element's template. */
            value: function template() {
                return '<div inner-h-t-m-l=\'[[innerHTML]]\'></div>';
            }
        }, {
            key: 'ready',
            value: function ready() {
                babelHelpers.get(ContentElement.prototype.__proto__ || Object.getPrototypeOf(ContentElement.prototype), 'ready', this).call(this);

                var that = this;
                that.applyContent();
            }
        }, {
            key: 'clearContent',
            value: function clearContent() {
                var that = this;

                while (that.$.content.firstChild) {
                    that.$.content.removeChild(that.$.content.firstChild);
                }
            }
        }, {
            key: 'applyContent',
            value: function applyContent() {
                var that = this;

                if (that.content === undefined) {
                    that.content = that.$.content;
                    return;
                }

                if (that.content === '' || that.content === null) {
                    that.clearContent();
                    return;
                }

                if (that.content instanceof HTMLElement) {
                    that.clearContent();
                    that.$.content.appendChild(that.content);
                    return;
                }

                var fragment = document.createDocumentFragment();

                /* Create a wrapper DIV tag. */
                var tmpElement = document.createElement('div');
                fragment.appendChild(tmpElement);

                /* Fill the nodes array with the wrapper's childNodes. */
                if (that.content instanceof HTMLElement) {
                    tmpElement.appendChild(that.content);
                } else {
                    tmpElement.innerHTML = that.content;
                }

                var nodes = tmpElement.childNodes;

                /* Remove the wrapper DIV tag. */
                tmpElement.parentNode.removeChild(tmpElement);

                /* Add the nodes to the fragment. */
                var length = nodes.length;

                while (length) {
                    var currentLength = length;
                    fragment.appendChild(nodes[0]);
                    if (length === currentLength) {
                        length--;
                    }
                }

                that.clearContent();
                that.$.content.appendChild(fragment);
            }
        }, {
            key: 'propertyChangedHandler',
            value: function propertyChangedHandler(propertyName, oldValue, newValue) {
                babelHelpers.get(ContentElement.prototype.__proto__ || Object.getPrototypeOf(ContentElement.prototype), 'propertyChangedHandler', this).call(this, propertyName, oldValue, newValue);

                var that = this;

                if (oldValue === newValue) {
                    return;
                }

                if (propertyName === 'innerHTML') {
                    that.content = newValue;
                    that.applyContent();
                    that.innerHTML = that.content = Utilities.Core.html(that.$.content);
                }

                if (propertyName === 'content') {
                    that.applyContent();
                }
            }
        }], [{
            key: 'properties',

            // Button's properties.
            get: function get() {
                return {
                    'content': {
                        type: 'any',
                        reflectToAttribute: false
                    },
                    'innerHTML': {
                        type: 'string',
                        reflectToAttribute: false
                    }
                };
            }
        }]);
        return ContentElement;
    }(window.Smart.BaseElement));
})();