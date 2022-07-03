(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2008-2010 Sebastian Werner, http://sebastian-werner.net
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
       * Andreas Ecker (ecker)
  
     ======================================================================
  
     This class contains code based on the following work:
  
     * Sizzle CSS Selector Engine - v2.3.0
  
       Homepage:
         http://sizzlejs.com/
  
       Documentation:
         https://github.com/jquery/sizzle/wiki/Sizzle-Documentation
  
       Discussion:
         https://groups.google.com/forum/#!forum/sizzlejs
  
       Code:
         https://github.com/jquery/sizzle
  
       Copyright:
         (c) 2009, 2013 jQuery Foundation and other contributors
  
       License:
         MIT: http://www.opensource.org/licenses/mit-license.php
  
     ----------------------------------------------------------------------
  
      Copyright 2013 jQuery Foundation and other contributors
      http://jquery.com/
  
      Permission is hereby granted, free of charge, to any person obtaining
      a copy of this software and associated documentation files (the
      "Software"), to deal in the Software without restriction, including
      without limitation the rights to use, copy, modify, merge, publish,
      distribute, sublicense, and/or sell copies of the Software, and to
      permit persons to whom the Software is furnished to do so, subject to
      the following conditions:
  
      The above copyright notice and this permission notice shall be
      included in all copies or substantial portions of the Software.
  
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
      EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
      NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
      LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
      OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
      WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  
     ----------------------------------------------------------------------
  
      Version:
         v2.3.0
         commit  8d56cba3212f6722a0b47330143d329d7297277e
  
  ************************************************************************ */

  /**
   * The selector engine supports virtually all CSS 3 Selectors  – this even
   * includes some parts that are infrequently implemented such as escaped
   * selectors (<code>.foo\\+bar</code>), Unicode selectors, and results returned
   * in document order. There are a few notable exceptions to the CSS 3 selector
   * support:
   *
   * * <code>:root</code>
   * * <code>:target</code>
   * * <code>:nth-last-child</code>
   * * <code>:nth-of-type</code>
   * * <code>:nth-last-of-type</code>
   * * <code>:first-of-type</code>
   * * <code>:last-of-type</code>
   * * <code>:only-of-type</code>
   * * <code>:lang()</code>
   *
   * In addition to the CSS 3 Selectors the engine supports the following
   * additional selectors or conventions.
   *
   * *Changes*
   *
   * * <code>:not(a.b)</code>: Supports non-simple selectors in <code>:not()</code> (most browsers only support <code>:not(a)</code>, for example).
   * * <code>:not(div > p)</code>: Supports full selectors in <code>:not()</code>.
   * * <code>:not(div, p)</code>: Supports multiple selectors in <code>:not()</code>.
   * * <code>[NAME=VALUE]</code>: Doesn't require quotes around the specified value in an attribute selector.
   *
   * *Additions*
   *
   * * <code>[NAME!=VALUE]</code>: Finds all elements whose <code>NAME</code> attribute doesn't match the specified value. Is equivalent to doing <code>:not([NAME=VALUE])</code>.
   * * <code>:contains(TEXT)</code>: Finds all elements whose textual context contains the word <code>TEXT</code> (case sensitive).
   * * <code>:header</code>: Finds all elements that are a header element (h1, h2, h3, h4, h5, h6).
   * * <code>:parent</code>: Finds all elements that contains another element.
   *
   * *Positional Selector Additions*
   *
   * * <code>:first</code>/</code>:last</code>: Finds the first or last matching element on the page. (e.g. <code>div:first</code> would find the first div on the page, in document order)
   * * <code>:even</code>/<code>:odd</code>: Finds every other element on the page (counting begins at 0, so <code>:even</code> would match the first element).
   * * <code>:eq</code>/<code>:nth</code>: Finds the Nth element on the page (e.g. <code>:eq(5)</code> finds the 6th element on the page).
   * * <code>:lt</code>/<code>:gt</code>: Finds all elements at positions less than or greater than the specified positions.
   *
   * *Form Selector Additions*
   *
   * * <code>:input</code>: Finds all input elements (includes textareas, selects, and buttons).
   * * <code>:text</code>, <code>:checkbox</code>, <code>:file</code>, <code>:password</code>, <code>:submit</code>, <code>:image</code>, <code>:reset</code>, <code>:button</code>: Finds the input element with the specified input type (<code>:button</code> also finds button elements).
   *
   * Based on Sizzle by John Resig, see:
   *
   * * http://sizzlejs.com/
   *
   * For further usage details also have a look at the wiki page at:
   *
   * * https://github.com/jquery/sizzle/wiki/Sizzle-Home
   */
  qx.Bootstrap.define("qx.bom.Selector", {
    statics: {
      /**
       * Queries the document for the given selector. Supports all CSS3 selectors
       * plus some extensions as mentioned in the class description.
       *
       * @signature function(selector, context)
       * @param selector {String} Valid selector (CSS3 + extensions)
       * @param context {Element} Context element (result elements must be children of this element)
       * @return {Array} Matching elements
       */
      query: null,

      /**
       * Returns an reduced array which only contains the elements from the given
       * array which matches the given selector
       *
       * @signature function(selector, set)
       * @param selector {String} Selector to filter given set
       * @param set {Array} List to filter according to given selector
       * @return {Array} New array containing matching elements
       */
      matches: null
    }
  });
  /**
   * Below is the original Sizzle code. Snapshot date is mentioned in the head of
   * this file.
   * @lint ignoreUnused(j, rnot, rendsWithNot)
   */

  /*!
   * Sizzle CSS Selector Engine v2.3.0
   * https://sizzlejs.com/
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license
   * http://jquery.org/license
   *
   * Date: 2016-01-04
   */

  (function (window) {
    var i,
        support,
        Expr,
        getText,
        isXML,
        tokenize,
        compile,
        select,
        outermostContext,
        sortInput,
        hasDuplicate,
        // Local document vars
    setDocument,
        document,
        docElem,
        documentIsHTML,
        rbuggyQSA,
        rbuggyMatches,
        matches,
        contains,
        // Instance-specific data
    expando = "sizzle" + 1 * new Date(),
        preferredDoc = window.document,
        dirruns = 0,
        done = 0,
        classCache = createCache(),
        tokenCache = createCache(),
        compilerCache = createCache(),
        sortOrder = function sortOrder(a, b) {
      if (a === b) {
        hasDuplicate = true;
      }

      return 0;
    },
        // Instance methods
    hasOwn = {}.hasOwnProperty,
        arr = [],
        pop = arr.pop,
        push_native = arr.push,
        push = arr.push,
        slice = arr.slice,
        // Use a stripped-down indexOf as it's faster than native
    // https://jsperf.com/thor-indexof-vs-for/5
    indexOf = function indexOf(list, elem) {
      var i = 0,
          len = list.length;

      for (; i < len; i++) {
        if (list[i] === elem) {
          return i;
        }
      }

      return -1;
    },
        booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        // Regular expressions
    // http://www.w3.org/TR/css3-selectors/#whitespace
    whitespace = "[\\x20\\t\\r\\n\\f]",
        // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
    identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
        // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
    attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + // Operator (capture 2)
    "*([*^$|!~]?=)" + whitespace + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
    "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",
        pseudos = ":(" + identifier + ")(?:\\((" + // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
    // 1. quoted (capture 3; capture 4 or capture 5)
    "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" + // 2. simple (capture 6)
    "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" + // 3. anything else (capture 2)
    ".*" + ")\\)|)",
        // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
    rwhitespace = new RegExp(whitespace + "+", "g"),
        rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
        rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
        rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
        rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),
        rpseudo = new RegExp(pseudos),
        ridentifier = new RegExp("^" + identifier + "$"),
        matchExpr = {
      ID: new RegExp("^#(" + identifier + ")"),
      CLASS: new RegExp("^\\.(" + identifier + ")"),
      TAG: new RegExp("^(" + identifier + "|[*])"),
      ATTR: new RegExp("^" + attributes),
      PSEUDO: new RegExp("^" + pseudos),
      CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
      bool: new RegExp("^(?:" + booleans + ")$", "i"),
      // For use in libraries implementing .is()
      // We use this for POS matching in `select`
      needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
    },
        rinputs = /^(?:input|select|textarea|button)$/i,
        rheader = /^h\d$/i,
        rnative = /^[^{]+\{\s*\[native \w/,
        // Easily-parseable/retrievable ID or TAG or CLASS selectors
    rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        rsibling = /[+~]/,
        // CSS escapes
    // http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
    runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
        funescape = function funescape(_, escaped, escapedWhitespace) {
      var high = "0x" + escaped - 0x10000; // NaN means non-codepoint
      // Support: Firefox<24
      // Workaround erroneous numeric interpretation of +"0x"

      /* eslint-disable-next-line no-self-compare */

      return high !== high || escapedWhitespace ? escaped : high < 0 ? // BMP codepoint
      String.fromCharCode(high + 0x10000) : // Supplemental Plane codepoint (surrogate pair)
      String.fromCharCode(high >> 10 | 0xd800, high & 0x3ff | 0xdc00);
    },
        // CSS string/identifier serialization
    // https://drafts.csswg.org/cssom/#common-serializing-idioms

    /* eslint-disable-next-line no-control-regex */
    rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,
        fcssescape = function fcssescape(ch, asCodePoint) {
      if (asCodePoint) {
        // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
        if (ch === "\0") {
          return "\uFFFD";
        } // Control characters and (dependent upon position) numbers get escaped as code points


        return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
      } // Other potentially-special ASCII characters get backslash-escaped


      return "\\" + ch;
    },
        // Used for iframes
    // See setDocument()
    // Removing the function wrapper causes a "Permission Denied"
    // error in IE
    unloadHandler = function unloadHandler() {
      setDocument();
    },
        disabledAncestor = addCombinator(function (elem) {
      return elem.disabled === true;
    }, {
      dir: "parentNode",
      next: "legend"
    }); // Optimize for push.apply( _, NodeList )


    try {
      push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes); // Support: Android<4.0
      // Detect silently failing push.apply

      arr[preferredDoc.childNodes.length].nodeType;
    } catch (e) {
      push = {
        apply: arr.length ? // Leverage slice if possible
        function (target, els) {
          push_native.apply(target, slice.call(els));
        } : // Support: IE<9
        // Otherwise append directly
        function (target, els) {
          var j = target.length,
              i = 0; // Can't trust NodeList.length

          while (target[j++] = els[i++]) {}

          target.length = j - 1;
        }
      };
    }

    function Sizzle(selector, context, results, seed) {
      var m,
          i,
          elem,
          nid,
          match,
          groups,
          newSelector,
          newContext = context && context.ownerDocument,
          // nodeType defaults to 9, since context defaults to document
      nodeType = context ? context.nodeType : 9;
      results = results || []; // Return early from calls with invalid selector or context

      if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
        return results;
      } // Try to shortcut find operations (as opposed to filters) in HTML documents


      if (!seed) {
        if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
          setDocument(context);
        }

        context = context || document;

        if (documentIsHTML) {
          // If the selector is sufficiently simple, try using a "get*By*" DOM method
          // (excepting DocumentFragment context, where the methods don't exist)
          if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {
            // ID selector
            if (m = match[1]) {
              // Document context
              if (nodeType === 9) {
                if (elem = context.getElementById(m)) {
                  // Support: IE, Opera, Webkit
                  // TODO: identify versions
                  // getElementById can match elements by name instead of ID
                  if (elem.id === m) {
                    results.push(elem);
                    return results;
                  }
                } else {
                  return results;
                } // Element context

              } else {
                // Support: IE, Opera, Webkit
                // TODO: identify versions
                // getElementById can match elements by name instead of ID
                if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {
                  results.push(elem);
                  return results;
                }
              } // Type selector

            } else if (match[2]) {
              push.apply(results, context.getElementsByTagName(selector));
              return results; // Class selector
            } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
              push.apply(results, context.getElementsByClassName(m));
              return results;
            }
          } // Take advantage of querySelectorAll


          if (support.qsa && !compilerCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
            if (nodeType !== 1) {
              newContext = context;
              newSelector = selector; // qSA looks outside Element context, which is not what we want
              // Thanks to Andrew Dupont for this workaround technique
              // Support: IE <=8
              // Exclude object elements
            } else if (context.nodeName.toLowerCase() !== "object") {
              // Capture the context ID, setting it first if necessary
              if (nid = context.getAttribute("id")) {
                nid = nid.replace(rcssescape, fcssescape);
              } else {
                context.setAttribute("id", nid = expando);
              } // Prefix every selector in the list


              groups = tokenize(selector);
              i = groups.length;

              while (i--) {
                groups[i] = "#" + nid + " " + toSelector(groups[i]);
              }

              newSelector = groups.join(","); // Expand context for sibling selectors

              newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
            }

            if (newSelector) {
              try {
                push.apply(results, newContext.querySelectorAll(newSelector));
                return results;
              } catch (qsaError) {} finally {
                if (nid === expando) {
                  context.removeAttribute("id");
                }
              }
            }
          }
        }
      } // All others


      return select(selector.replace(rtrim, "$1"), context, results, seed);
    }
    /**
     * Create key-value caches of limited size
     * @return {function} Returns the Object data after storing it on itself with
     *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
     *	deleting the oldest entry
     */


    function createCache() {
      var keys = [];

      function cache(key, value) {
        // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
        if (keys.push(key + " ") > Expr.cacheLength) {
          // Only keep the most recent entries
          delete cache[keys.shift()];
        }

        return cache[key + " "] = value;
      }

      return cache;
    }
    /**
     * Mark a function for special use by Sizzle
     * @param fn {Function} The function to mark
     */


    function markFunction(fn) {
      fn[expando] = true;
      return fn;
    }
    /**
     * Support testing using an element
     * @param fn {Function} Passed the created element and returns a boolean result
     */


    function assert(fn) {
      var el = document.createElement("fieldset");

      try {
        return !!fn(el);
      } catch (e) {
        return false;
      } finally {
        // Remove from its parent by default
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        } // release memory in IE


        el = null;
      }
    }
    /**
     * Adds the same handler for all of the specified attrs
     * @param attrs {String} Pipe-separated list of attributes
     * @param handler {Function} The method that will be applied
     */


    function addHandle(attrs, handler) {
      var arr = attrs.split("|"),
          i = arr.length;

      while (i--) {
        Expr.attrHandle[arr[i]] = handler;
      }
    }
    /**
     * Checks document order of two siblings
     * @param a {Element}
     * @param b {Element}
     * @return {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
     */


    function siblingCheck(a, b) {
      var cur = b && a,
          diff = cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex; // Use IE sourceIndex if available on both nodes

      if (diff) {
        return diff;
      } // Check if b follows a


      if (cur) {
        while (cur = cur.nextSibling) {
          if (cur === b) {
            return -1;
          }
        }
      }

      return a ? 1 : -1;
    }
    /**
     * Returns a function to use in pseudos for input types
     * @param type {String}
     */


    function createInputPseudo(type) {
      return function (elem) {
        var name = elem.nodeName.toLowerCase();
        return name === "input" && elem.type === type;
      };
    }
    /**
     * Returns a function to use in pseudos for buttons
     * @param type {String}
     */


    function createButtonPseudo(type) {
      return function (elem) {
        var name = elem.nodeName.toLowerCase();
        return (name === "input" || name === "button") && elem.type === type;
      };
    }
    /**
     * Returns a function to use in pseudos for :enabled/:disabled
     * @param disabled {Boolean} true for :disabled; false for :enabled
     */


    function createDisabledPseudo(disabled) {
      // Known :disabled false positives:
      // IE: *[disabled]:not(button, input, select, textarea, optgroup, option, menuitem, fieldset)
      // not IE: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
      return function (elem) {
        // Check form elements and option elements for explicit disabling
        return "label" in elem && elem.disabled === disabled || "form" in elem && elem.disabled === disabled || // Check non-disabled form elements for fieldset[disabled] ancestors
        "form" in elem && elem.disabled === false && ( // Support: IE6-11+
        // Ancestry is covered for us
        elem.isDisabled === disabled || // Otherwise, assume any non-<option> under fieldset[disabled] is disabled

        /* jshint -W018 */
        elem.isDisabled !== !disabled && ("label" in elem || !disabledAncestor(elem)) !== disabled);
      };
    }
    /**
     * Returns a function to use in pseudos for positionals
     * @param fn {Function}
     */


    function createPositionalPseudo(fn) {
      return markFunction(function (argument) {
        argument = +argument;
        return markFunction(function (seed, matches) {
          var j,
              matchIndexes = fn([], seed.length, argument),
              i = matchIndexes.length; // Match elements found at the specified indexes

          while (i--) {
            if (seed[j = matchIndexes[i]]) {
              seed[j] = !(matches[j] = seed[j]);
            }
          }
        });
      });
    }
    /**
     * Checks a node for validity as a Sizzle context
     * @param context {Element|Object}
     * @return {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
     */


    function testContext(context) {
      return context && typeof context.getElementsByTagName !== "undefined" && context;
    } // Expose support vars for convenience


    support = Sizzle.support = {};
    /**
     * Detects XML nodes
     * @param elem {Element|Object} An element or a document
     * @return {Boolean} True iff elem is a non-HTML XML node
     */

    isXML = Sizzle.isXML = function (elem) {
      // documentElement is verified for cases where it doesn't yet exist
      // (such as loading iframes in IE - #4833)
      var documentElement = elem && (elem.ownerDocument || elem).documentElement;
      return documentElement ? documentElement.nodeName !== "HTML" : false;
    };
    /**
     * Sets document-related variables once based on the current document
     * @param doc {Element|Object} An element or document object to use to set the document
     * @return {Object} Returns the current document
     */


    setDocument = Sizzle.setDocument = function (node) {
      var hasCompare,
          subWindow,
          doc = node ? node.ownerDocument || node : preferredDoc; // Return early if doc is invalid or already selected

      if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
        return document;
      } // Update global variables


      document = doc;
      docElem = document.documentElement;
      documentIsHTML = !isXML(document); // Support: IE 9-11, Edge
      // Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)

      if (preferredDoc !== document && (subWindow = document.defaultView) && subWindow.top !== subWindow) {
        // Support: IE 11, Edge
        if (subWindow.addEventListener) {
          subWindow.addEventListener("unload", unloadHandler, false); // Support: IE 9 - 10 only
        } else if (subWindow.attachEvent) {
          subWindow.attachEvent("onunload", unloadHandler);
        }
      }
      /* Attributes
      ---------------------------------------------------------------------- */
      // Support: IE<8
      // Verify that getAttribute really returns attributes and not properties
      // (excepting IE8 booleans)


      support.attributes = assert(function (el) {
        el.className = "i";
        return !el.getAttribute("className");
      });
      /* getElement(s)By*
      ---------------------------------------------------------------------- */
      // Check if getElementsByTagName("*") returns only elements

      support.getElementsByTagName = assert(function (el) {
        el.appendChild(document.createComment(""));
        return !el.getElementsByTagName("*").length;
      }); // Support: IE<9

      support.getElementsByClassName = rnative.test(document.getElementsByClassName); // Support: IE<10
      // Check if getElementById returns elements by name
      // The broken getElementById methods don't pick up programmatically-set names,
      // so use a roundabout getElementsByName test

      support.getById = assert(function (el) {
        docElem.appendChild(el).id = expando;
        return !document.getElementsByName || !document.getElementsByName(expando).length;
      }); // ID find and filter

      if (support.getById) {
        Expr.find["ID"] = function (id, context) {
          if (typeof context.getElementById !== "undefined" && documentIsHTML) {
            var m = context.getElementById(id);
            return m ? [m] : [];
          }
        };

        Expr.filter["ID"] = function (id) {
          var attrId = id.replace(runescape, funescape);
          return function (elem) {
            return elem.getAttribute("id") === attrId;
          };
        };
      } else {
        // Support: IE6/7
        // getElementById is not reliable as a find shortcut
        delete Expr.find["ID"];

        Expr.filter["ID"] = function (id) {
          var attrId = id.replace(runescape, funescape);
          return function (elem) {
            var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
            return node && node.value === attrId;
          };
        };
      } // Tag


      Expr.find["TAG"] = support.getElementsByTagName ? function (tag, context) {
        if (typeof context.getElementsByTagName !== "undefined") {
          return context.getElementsByTagName(tag); // DocumentFragment nodes don't have gEBTN
        } else if (support.qsa) {
          return context.querySelectorAll(tag);
        }
      } : function (tag, context) {
        var elem,
            tmp = [],
            i = 0,
            // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
        results = context.getElementsByTagName(tag); // Filter out possible comments

        if (tag === "*") {
          while (elem = results[i++]) {
            if (elem.nodeType === 1) {
              tmp.push(elem);
            }
          }

          return tmp;
        }

        return results;
      }; // Class

      Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
        if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
          return context.getElementsByClassName(className);
        }
      };
      /* QSA/matchesSelector
      ---------------------------------------------------------------------- */
      // QSA and matchesSelector support
      // matchesSelector(:active) reports false when true (IE9/Opera 11.5)


      rbuggyMatches = []; // qSa(:focus) reports false when true (Chrome 21)
      // We allow this because of a bug in IE8/9 that throws an error
      // whenever `document.activeElement` is accessed on an iframe
      // So, we allow :focus to pass through QSA all the time to avoid the IE error
      // See https://bugs.jquery.com/ticket/13378

      rbuggyQSA = [];

      if (support.qsa = rnative.test(document.querySelectorAll)) {
        // Build QSA regex
        // Regex strategy adopted from Diego Perini
        assert(function (el) {
          // Select is set to empty string on purpose
          // This is to test IE's treatment of not explicitly
          // setting a boolean content attribute,
          // since its presence should be enough
          // https://bugs.jquery.com/ticket/12359
          docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a>" + "<select id='" + expando + "-\r\\' msallowcapture=''>" + "<option selected=''></option></select>"; // Support: IE8, Opera 11-12.16
          // Nothing should be selected when empty strings follow ^= or $= or *=
          // The test attribute must be unknown in Opera but "safe" for WinRT
          // https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section

          if (el.querySelectorAll("[msallowcapture^='']").length) {
            rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
          } // Support: IE8
          // Boolean attributes and "value" are not treated correctly


          if (!el.querySelectorAll("[selected]").length) {
            rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
          } // Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+


          if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
            rbuggyQSA.push("~=");
          } // Webkit/Opera - :checked should return selected option elements
          // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
          // IE8 throws error here and will not see later tests


          if (!el.querySelectorAll(":checked").length) {
            rbuggyQSA.push(":checked");
          } // Support: Safari 8+, iOS 8+
          // https://bugs.webkit.org/show_bug.cgi?id=136851
          // In-page `selector#id sibling-combinator selector` fails


          if (!el.querySelectorAll("a#" + expando + "+*").length) {
            rbuggyQSA.push(".#.+[+~]");
          }
        });
        assert(function (el) {
          el.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>"; // Support: Windows 8 Native Apps
          // The type and name attributes are restricted during .innerHTML assignment

          var input = document.createElement("input");
          input.setAttribute("type", "hidden");
          el.appendChild(input).setAttribute("name", "D"); // Support: IE8
          // Enforce case-sensitivity of name attribute

          if (el.querySelectorAll("[name=d]").length) {
            rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
          } // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
          // IE8 throws error here and will not see later tests


          if (el.querySelectorAll(":enabled").length !== 2) {
            rbuggyQSA.push(":enabled", ":disabled");
          } // Support: IE9-11+
          // IE's :disabled selector does not pick up the children of disabled fieldsets


          docElem.appendChild(el).disabled = true;

          if (el.querySelectorAll(":disabled").length !== 2) {
            rbuggyQSA.push(":enabled", ":disabled");
          } // Opera 10-11 does not throw on post-comma invalid pseudos


          el.querySelectorAll("*,:x");
          rbuggyQSA.push(",.*:");
        });
      }

      if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {
        assert(function (el) {
          // Check to see if it's possible to do matchesSelector
          // on a disconnected node (IE 9)
          support.disconnectedMatch = matches.call(el, "*"); // This should fail with an exception
          // Gecko does not error, returns false instead

          matches.call(el, "[s!='']:x");
          rbuggyMatches.push("!=", pseudos);
        });
      }

      rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
      rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));
      /* Contains
      ---------------------------------------------------------------------- */

      hasCompare = rnative.test(docElem.compareDocumentPosition); // Element contains another
      // Purposefully self-exclusive
      // As in, an element does not contain itself

      contains = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
        var adown = a.nodeType === 9 ? a.documentElement : a,
            bup = b && b.parentNode;
        return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
      } : function (a, b) {
        if (b) {
          while (b = b.parentNode) {
            if (b === a) {
              return true;
            }
          }
        }

        return false;
      };
      /* Sorting
      ---------------------------------------------------------------------- */
      // Document order sorting

      sortOrder = hasCompare ? function (a, b) {
        // Flag for duplicate removal
        if (a === b) {
          hasDuplicate = true;
          return 0;
        } // Sort on method existence if only one input has compareDocumentPosition


        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;

        if (compare) {
          return compare;
        } // Calculate position if both inputs belong to the same document


        compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : // Otherwise we know they are disconnected
        1; // Disconnected nodes

        if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
          // Choose the first element that is related to our preferred document
          if (a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
            return -1;
          }

          if (b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
            return 1;
          } // Maintain original order


          return sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
        }

        return compare & 4 ? -1 : 1;
      } : function (a, b) {
        // Exit early if the nodes are identical
        if (a === b) {
          hasDuplicate = true;
          return 0;
        }

        var cur,
            i = 0,
            aup = a.parentNode,
            bup = b.parentNode,
            ap = [a],
            bp = [b]; // Parentless nodes are either documents or disconnected

        if (!aup || !bup) {
          return a === document ? -1 : b === document ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0; // If the nodes are siblings, we can do a quick check
        } else if (aup === bup) {
          return siblingCheck(a, b);
        } // Otherwise we need full lists of their ancestors for comparison


        cur = a;

        while (cur = cur.parentNode) {
          ap.unshift(cur);
        }

        cur = b;

        while (cur = cur.parentNode) {
          bp.unshift(cur);
        } // Walk down the tree looking for a discrepancy


        while (ap[i] === bp[i]) {
          i++;
        }

        return i ? // Do a sibling check if the nodes have a common ancestor
        siblingCheck(ap[i], bp[i]) : // Otherwise nodes in our document sort first
        ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
      };
      return document;
    };

    Sizzle.matches = function (expr, elements) {
      return Sizzle(expr, null, null, elements);
    };

    Sizzle.matchesSelector = function (elem, expr) {
      // Set document vars if needed
      if ((elem.ownerDocument || elem) !== document) {
        setDocument(elem);
      } // Make sure that attribute selectors are quoted


      expr = expr.replace(rattributeQuotes, "='$1']");

      if (support.matchesSelector && documentIsHTML && !compilerCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
        try {
          var ret = matches.call(elem, expr); // IE 9's matchesSelector returns false on disconnected nodes

          if (ret || support.disconnectedMatch || // As well, disconnected nodes are said to be in a document
          // fragment in IE 9
          elem.document && elem.document.nodeType !== 11) {
            return ret;
          }
        } catch (e) {}
      }

      return Sizzle(expr, document, null, [elem]).length > 0;
    };

    Sizzle.contains = function (context, elem) {
      // Set document vars if needed
      if ((context.ownerDocument || context) !== document) {
        setDocument(context);
      }

      return contains(context, elem);
    };

    Sizzle.attr = function (elem, name) {
      // Set document vars if needed
      if ((elem.ownerDocument || elem) !== document) {
        setDocument(elem);
      }

      var fn = Expr.attrHandle[name.toLowerCase()],
          // Don't get fooled by Object.prototype properties (jQuery #13807)
      val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;
      return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
    };

    Sizzle.escape = function (sel) {
      return (sel + "").replace(rcssescape, fcssescape);
    };

    Sizzle.error = function (msg) {
      throw new Error("Syntax error, unrecognized expression: " + msg);
    };
    /**
     * Document sorting and removing duplicates
     * @param results {ArrayLike}
     */


    Sizzle.uniqueSort = function (results) {
      var elem,
          duplicates = [],
          j = 0,
          i = 0; // Unless we *know* we can detect duplicates, assume their presence

      hasDuplicate = !support.detectDuplicates;
      sortInput = !support.sortStable && results.slice(0);
      results.sort(sortOrder);

      if (hasDuplicate) {
        while (elem = results[i++]) {
          if (elem === results[i]) {
            j = duplicates.push(i);
          }
        }

        while (j--) {
          results.splice(duplicates[j], 1);
        }
      } // Clear input after sorting to release objects
      // See https://github.com/jquery/sizzle/pull/225


      sortInput = null;
      return results;
    };
    /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param elem {Array|Element}
     */


    getText = Sizzle.getText = function (elem) {
      var node,
          ret = "",
          i = 0,
          nodeType = elem.nodeType;

      if (!nodeType) {
        // If no nodeType, this is expected to be an array
        while (node = elem[i++]) {
          // Do not traverse comment nodes
          ret += getText(node);
        }
      } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
        // Use textContent for elements
        // innerText usage removed for consistency of new lines (jQuery #11153)
        if (typeof elem.textContent === "string") {
          return elem.textContent;
        } else {
          // Traverse its children
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            ret += getText(elem);
          }
        }
      } else if (nodeType === 3 || nodeType === 4) {
        return elem.nodeValue;
      } // Do not include comment or processing instruction nodes


      return ret;
    };

    Expr = Sizzle.selectors = {
      // Can be adjusted by the user
      cacheLength: 50,
      createPseudo: markFunction,
      match: matchExpr,
      attrHandle: {},
      find: {},
      relative: {
        ">": {
          dir: "parentNode",
          first: true
        },
        " ": {
          dir: "parentNode"
        },
        "+": {
          dir: "previousSibling",
          first: true
        },
        "~": {
          dir: "previousSibling"
        }
      },
      preFilter: {
        ATTR: function ATTR(match) {
          match[1] = match[1].replace(runescape, funescape); // Move the given value to match[3] whether quoted or unquoted

          match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

          if (match[2] === "~=") {
            match[3] = " " + match[3] + " ";
          }

          return match.slice(0, 4);
        },
        CHILD: function CHILD(match) {
          /* matches from matchExpr["CHILD"]
          	1 type (only|nth|...)
          	2 what (child|of-type)
          	3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
          	4 xn-component of xn+y argument ([+-]?\d*n|)
          	5 sign of xn-component
          	6 x of xn-component
          	7 sign of y-component
          	8 y of y-component
          */
          match[1] = match[1].toLowerCase();

          if (match[1].slice(0, 3) === "nth") {
            // nth-* requires argument
            if (!match[3]) {
              Sizzle.error(match[0]);
            } // numeric x and y parameters for Expr.filter.CHILD
            // remember that false/true cast respectively to 0/1


            match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
            match[5] = +(match[7] + match[8] || match[3] === "odd"); // other types prohibit arguments
          } else if (match[3]) {
            Sizzle.error(match[0]);
          }

          return match;
        },
        PSEUDO: function PSEUDO(match) {
          var excess,
              unquoted = !match[6] && match[2];

          if (matchExpr["CHILD"].test(match[0])) {
            return null;
          } // Accept quoted arguments as-is


          if (match[3]) {
            match[2] = match[4] || match[5] || ""; // Strip excess characters from unquoted arguments
          } else if (unquoted && rpseudo.test(unquoted) && ( // Get excess from tokenize (recursively)
          excess = tokenize(unquoted, true)) && ( // advance to the next closing parenthesis
          excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
            // excess is a negative index
            match[0] = match[0].slice(0, excess);
            match[2] = unquoted.slice(0, excess);
          } // Return only captures needed by the pseudo filter method (type and argument)


          return match.slice(0, 3);
        }
      },
      filter: {
        TAG: function TAG(nodeNameSelector) {
          var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
          return nodeNameSelector === "*" ? function () {
            return true;
          } : function (elem) {
            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
          };
        },
        CLASS: function CLASS(className) {
          var pattern = classCache[className + " "];
          return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function (elem) {
            return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
          });
        },
        ATTR: function ATTR(name, operator, check) {
          return function (elem) {
            var result = Sizzle.attr(elem, name);

            if (result == null) {
              return operator === "!=";
            }

            if (!operator) {
              return true;
            }

            result += "";
            return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
          };
        },
        CHILD: function CHILD(type, what, argument, first, last) {
          var simple = type.slice(0, 3) !== "nth",
              forward = type.slice(-4) !== "last",
              ofType = what === "of-type";
          return first === 1 && last === 0 ? // Shortcut for :nth-*(n)
          function (elem) {
            return !!elem.parentNode;
          } : function (elem, context, xml) {
            var cache,
                uniqueCache,
                outerCache,
                node,
                nodeIndex,
                start,
                dir = simple !== forward ? "nextSibling" : "previousSibling",
                parent = elem.parentNode,
                name = ofType && elem.nodeName.toLowerCase(),
                useCache = !xml && !ofType,
                diff = false;

            if (parent) {
              // :(first|last|only)-(child|of-type)
              if (simple) {
                while (dir) {
                  node = elem;

                  while (node = node[dir]) {
                    if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                      return false;
                    }
                  } // Reverse direction for :only-* (if we haven't yet done so)


                  start = dir = type === "only" && !start && "nextSibling";
                }

                return true;
              }

              start = [forward ? parent.firstChild : parent.lastChild]; // non-xml :nth-child(...) stores cache data on `parent`

              if (forward && useCache) {
                // Seek `elem` from a previously-cached index
                // ...in a gzip-friendly way
                node = parent;
                outerCache = node[expando] || (node[expando] = {}); // Support: IE <9 only
                // Defend against cloned attroperties (jQuery gh-1709)

                uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                cache = uniqueCache[type] || [];
                nodeIndex = cache[0] === dirruns && cache[1];
                diff = nodeIndex && cache[2];
                node = nodeIndex && parent.childNodes[nodeIndex];

                while (node = ++nodeIndex && node && node[dir] || ( // Fallback to seeking `elem` from the start
                diff = nodeIndex = 0) || start.pop()) {
                  // When found, cache indexes on `parent` and break
                  if (node.nodeType === 1 && ++diff && node === elem) {
                    uniqueCache[type] = [dirruns, nodeIndex, diff];
                    break;
                  }
                }
              } else {
                // Use previously-cached element index if available
                if (useCache) {
                  // ...in a gzip-friendly way
                  node = elem;
                  outerCache = node[expando] || (node[expando] = {}); // Support: IE <9 only
                  // Defend against cloned attroperties (jQuery gh-1709)

                  uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                  cache = uniqueCache[type] || [];
                  nodeIndex = cache[0] === dirruns && cache[1];
                  diff = nodeIndex;
                } // xml :nth-child(...)
                // or :nth-last-child(...) or :nth(-last)?-of-type(...)


                if (diff === false) {
                  // Use the same loop as above to seek `elem` from the start
                  while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                    if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                      // Cache the index of each encountered element
                      if (useCache) {
                        outerCache = node[expando] || (node[expando] = {}); // Support: IE <9 only
                        // Defend against cloned attroperties (jQuery gh-1709)

                        uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                        uniqueCache[type] = [dirruns, diff];
                      }

                      if (node === elem) {
                        break;
                      }
                    }
                  }
                }
              } // Incorporate the offset, then check against cycle size


              diff -= last;
              return diff === first || diff % first === 0 && diff / first >= 0;
            }
          };
        },
        PSEUDO: function PSEUDO(pseudo, argument) {
          // pseudo-class names are case-insensitive
          // http://www.w3.org/TR/selectors/#pseudo-classes
          // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
          // Remember that setFilters inherits from pseudos
          var args,
              fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo); // The user may use createPseudo to indicate that
          // arguments are needed to create the filter function
          // just as Sizzle does

          if (fn[expando]) {
            return fn(argument);
          } // But maintain support for old signatures


          if (fn.length > 1) {
            args = [pseudo, pseudo, "", argument];
            return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
              var idx,
                  matched = fn(seed, argument),
                  i = matched.length;

              while (i--) {
                idx = indexOf(seed, matched[i]);
                seed[idx] = !(matches[idx] = matched[i]);
              }
            }) : function (elem) {
              return fn(elem, 0, args);
            };
          }

          return fn;
        }
      },
      pseudos: {
        // Potentially complex pseudos
        not: markFunction(function (selector) {
          // Trim the selector passed to compile
          // to avoid treating leading and trailing
          // spaces as combinators
          var input = [],
              results = [],
              matcher = compile(selector.replace(rtrim, "$1"));
          return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
            var elem,
                unmatched = matcher(seed, null, xml, []),
                i = seed.length; // Match elements unmatched by `matcher`

            while (i--) {
              if (elem = unmatched[i]) {
                seed[i] = !(matches[i] = elem);
              }
            }
          }) : function (elem, context, xml) {
            input[0] = elem;
            matcher(input, null, xml, results); // Don't keep the element (issue #299)

            input[0] = null;
            return !results.pop();
          };
        }),
        has: markFunction(function (selector) {
          return function (elem) {
            return Sizzle(selector, elem).length > 0;
          };
        }),
        contains: markFunction(function (text) {
          text = text.replace(runescape, funescape);
          return function (elem) {
            return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
          };
        }),
        // "Whether an element is represented by a :lang() selector
        // is based solely on the element's language value
        // being equal to the identifier C,
        // or beginning with the identifier C immediately followed by "-".
        // The matching of C against the element's language value is performed case-insensitively.
        // The identifier C does not have to be a valid language name."
        // http://www.w3.org/TR/selectors/#lang-pseudo
        lang: markFunction(function (lang) {
          // lang value must be a valid identifier
          if (!ridentifier.test(lang || "")) {
            Sizzle.error("unsupported lang: " + lang);
          }

          lang = lang.replace(runescape, funescape).toLowerCase();
          return function (elem) {
            var elemLang;

            do {
              if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                elemLang = elemLang.toLowerCase();
                return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
              }
            } while ((elem = elem.parentNode) && elem.nodeType === 1);

            return false;
          };
        }),
        // Miscellaneous
        target: function target(elem) {
          var hash = window.location && window.location.hash;
          return hash && hash.slice(1) === elem.id;
        },
        root: function root(elem) {
          return elem === docElem;
        },
        focus: function focus(elem) {
          return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
        },
        // Boolean properties
        enabled: createDisabledPseudo(false),
        disabled: createDisabledPseudo(true),
        checked: function checked(elem) {
          // In CSS3, :checked should return both checked and selected elements
          // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
          var nodeName = elem.nodeName.toLowerCase();
          return nodeName === "input" && !!elem.checked || nodeName === "option" && !!elem.selected;
        },
        selected: function selected(elem) {
          // Accessing this property makes selected-by-default
          // options in Safari work properly
          if (elem.parentNode) {
            elem.parentNode.selectedIndex;
          }

          return elem.selected === true;
        },
        // Contents
        empty: function empty(elem) {
          // http://www.w3.org/TR/selectors/#empty-pseudo
          // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
          //   but not by others (comment: 8; processing instruction: 7; etc.)
          // nodeType < 6 works because attributes (2) do not appear as children
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            if (elem.nodeType < 6) {
              return false;
            }
          }

          return true;
        },
        parent: function parent(elem) {
          return !Expr.pseudos["empty"](elem);
        },
        // Element/input types
        header: function header(elem) {
          return rheader.test(elem.nodeName);
        },
        input: function input(elem) {
          return rinputs.test(elem.nodeName);
        },
        button: function button(elem) {
          var name = elem.nodeName.toLowerCase();
          return name === "input" && elem.type === "button" || name === "button";
        },
        text: function text(elem) {
          var attr;
          return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && ( // Support: IE<8
          // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
          (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
        },
        // Position-in-collection
        first: createPositionalPseudo(function () {
          return [0];
        }),
        last: createPositionalPseudo(function (matchIndexes, length) {
          return [length - 1];
        }),
        eq: createPositionalPseudo(function (matchIndexes, length, argument) {
          return [argument < 0 ? argument + length : argument];
        }),
        even: createPositionalPseudo(function (matchIndexes, length) {
          var i = 0;

          for (; i < length; i += 2) {
            matchIndexes.push(i);
          }

          return matchIndexes;
        }),
        odd: createPositionalPseudo(function (matchIndexes, length) {
          var i = 1;

          for (; i < length; i += 2) {
            matchIndexes.push(i);
          }

          return matchIndexes;
        }),
        lt: createPositionalPseudo(function (matchIndexes, length, argument) {
          var i = argument < 0 ? argument + length : argument;

          for (; --i >= 0;) {
            matchIndexes.push(i);
          }

          return matchIndexes;
        }),
        gt: createPositionalPseudo(function (matchIndexes, length, argument) {
          var i = argument < 0 ? argument + length : argument;

          for (; ++i < length;) {
            matchIndexes.push(i);
          }

          return matchIndexes;
        })
      }
    };
    Expr.pseudos["nth"] = Expr.pseudos["eq"]; // Add button/input type pseudos

    for (i in {
      radio: true,
      checkbox: true,
      file: true,
      password: true,
      image: true
    }) {
      Expr.pseudos[i] = createInputPseudo(i);
    }

    for (i in {
      submit: true,
      reset: true
    }) {
      Expr.pseudos[i] = createButtonPseudo(i);
    } // Easy API for creating new setFilters


    function setFilters() {}

    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();

    tokenize = Sizzle.tokenize = function (selector, parseOnly) {
      var matched,
          match,
          tokens,
          type,
          soFar,
          groups,
          preFilters,
          cached = tokenCache[selector + " "];

      if (cached) {
        return parseOnly ? 0 : cached.slice(0);
      }

      soFar = selector;
      groups = [];
      preFilters = Expr.preFilter;

      while (soFar) {
        // Comma and first run
        if (!matched || (match = rcomma.exec(soFar))) {
          if (match) {
            // Don't consume trailing commas as valid
            soFar = soFar.slice(match[0].length) || soFar;
          }

          groups.push(tokens = []);
        }

        matched = false; // Combinators

        if (match = rcombinators.exec(soFar)) {
          matched = match.shift();
          tokens.push({
            value: matched,
            // Cast descendant combinators to space
            type: match[0].replace(rtrim, " ")
          });
          soFar = soFar.slice(matched.length);
        } // Filters


        for (type in Expr.filter) {
          if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
            matched = match.shift();
            tokens.push({
              value: matched,
              type: type,
              matches: match
            });
            soFar = soFar.slice(matched.length);
          }
        }

        if (!matched) {
          break;
        }
      } // Return the length of the invalid excess
      // if we're just parsing
      // Otherwise, throw an error or return tokens


      return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : // Cache the tokens
      tokenCache(selector, groups).slice(0);
    };

    function toSelector(tokens) {
      var i = 0,
          len = tokens.length,
          selector = "";

      for (; i < len; i++) {
        selector += tokens[i].value;
      }

      return selector;
    }

    function addCombinator(matcher, combinator, base) {
      var dir = combinator.dir,
          skip = combinator.next,
          key = skip || dir,
          checkNonElements = base && key === "parentNode",
          doneName = done++;
      return combinator.first ? // Check against closest ancestor/preceding element
      function (elem, context, xml) {
        while (elem = elem[dir]) {
          if (elem.nodeType === 1 || checkNonElements) {
            return matcher(elem, context, xml);
          }
        }
      } : // Check against all ancestor/preceding elements
      function (elem, context, xml) {
        var oldCache,
            uniqueCache,
            outerCache,
            newCache = [dirruns, doneName]; // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching

        if (xml) {
          while (elem = elem[dir]) {
            if (elem.nodeType === 1 || checkNonElements) {
              if (matcher(elem, context, xml)) {
                return true;
              }
            }
          }
        } else {
          while (elem = elem[dir]) {
            if (elem.nodeType === 1 || checkNonElements) {
              outerCache = elem[expando] || (elem[expando] = {}); // Support: IE <9 only
              // Defend against cloned attroperties (jQuery gh-1709)

              uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});

              if (skip && skip === elem.nodeName.toLowerCase()) {
                elem = elem[dir] || elem;
              } else if ((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                // Assign to newCache so results back-propagate to previous elements
                return newCache[2] = oldCache[2];
              } else {
                // Reuse newcache so results back-propagate to previous elements
                uniqueCache[key] = newCache; // A match means we're done; a fail means we have to keep checking

                if (newCache[2] = matcher(elem, context, xml)) {
                  return true;
                }
              }
            }
          }
        }
      };
    }

    function elementMatcher(matchers) {
      return matchers.length > 1 ? function (elem, context, xml) {
        var i = matchers.length;

        while (i--) {
          if (!matchers[i](elem, context, xml)) {
            return false;
          }
        }

        return true;
      } : matchers[0];
    }

    function multipleContexts(selector, contexts, results) {
      var i = 0,
          len = contexts.length;

      for (; i < len; i++) {
        Sizzle(selector, contexts[i], results);
      }

      return results;
    }

    function condense(unmatched, map, filter, context, xml) {
      var elem,
          newUnmatched = [],
          i = 0,
          len = unmatched.length,
          mapped = map != null;

      for (; i < len; i++) {
        if (elem = unmatched[i]) {
          if (!filter || filter(elem, context, xml)) {
            newUnmatched.push(elem);

            if (mapped) {
              map.push(i);
            }
          }
        }
      }

      return newUnmatched;
    }

    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
      if (postFilter && !postFilter[expando]) {
        postFilter = setMatcher(postFilter);
      }

      if (postFinder && !postFinder[expando]) {
        postFinder = setMatcher(postFinder, postSelector);
      }

      return markFunction(function (seed, results, context, xml) {
        var temp,
            i,
            elem,
            preMap = [],
            postMap = [],
            preexisting = results.length,
            // Get initial elements from seed or context
        elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),
            // Prefilter to get matcher input, preserving a map for seed-results synchronization
        matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
            matcherOut = matcher ? // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
        postFinder || (seed ? preFilter : preexisting || postFilter) ? // ...intermediate processing is necessary
        [] : // ...otherwise use results directly
        results : matcherIn; // Find primary matches

        if (matcher) {
          matcher(matcherIn, matcherOut, context, xml);
        } // Apply postFilter


        if (postFilter) {
          temp = condense(matcherOut, postMap);
          postFilter(temp, [], context, xml); // Un-match failing elements by moving them back to matcherIn

          i = temp.length;

          while (i--) {
            if (elem = temp[i]) {
              matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
            }
          }
        }

        if (seed) {
          if (postFinder || preFilter) {
            if (postFinder) {
              // Get the final matcherOut by condensing this intermediate into postFinder contexts
              temp = [];
              i = matcherOut.length;

              while (i--) {
                if (elem = matcherOut[i]) {
                  // Restore matcherIn since elem is not yet a final match
                  temp.push(matcherIn[i] = elem);
                }
              }

              postFinder(null, matcherOut = [], temp, xml);
            } // Move matched elements from seed to results to keep them synchronized


            i = matcherOut.length;

            while (i--) {
              if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {
                seed[temp] = !(results[temp] = elem);
              }
            }
          } // Add elements to results, through postFinder if defined

        } else {
          matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);

          if (postFinder) {
            postFinder(null, results, matcherOut, xml);
          } else {
            push.apply(results, matcherOut);
          }
        }
      });
    }

    function matcherFromTokens(tokens) {
      var checkContext,
          matcher,
          j,
          len = tokens.length,
          leadingRelative = Expr.relative[tokens[0].type],
          implicitRelative = leadingRelative || Expr.relative[" "],
          i = leadingRelative ? 1 : 0,
          // The foundational matcher ensures that elements are reachable from top-level context(s)
      matchContext = addCombinator(function (elem) {
        return elem === checkContext;
      }, implicitRelative, true),
          matchAnyContext = addCombinator(function (elem) {
        return indexOf(checkContext, elem) > -1;
      }, implicitRelative, true),
          matchers = [function (elem, context, xml) {
        var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml)); // Avoid hanging onto element (issue #299)

        checkContext = null;
        return ret;
      }];

      for (; i < len; i++) {
        if (matcher = Expr.relative[tokens[i].type]) {
          matchers = [addCombinator(elementMatcher(matchers), matcher)];
        } else {
          matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches); // Return special upon seeing a positional matcher

          if (matcher[expando]) {
            // Find the next relative operator (if any) for proper handling
            j = ++i;

            for (; j < len; j++) {
              if (Expr.relative[tokens[j].type]) {
                break;
              }
            }

            return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector( // If the preceding token was a descendant combinator, insert an implicit any-element `*`
            tokens.slice(0, i - 1).concat({
              value: tokens[i - 2].type === " " ? "*" : ""
            })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
          }

          matchers.push(matcher);
        }
      }

      return elementMatcher(matchers);
    }

    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
      var bySet = setMatchers.length > 0,
          byElement = elementMatchers.length > 0,
          superMatcher = function superMatcher(seed, context, xml, results, outermost) {
        var elem,
            j,
            matcher,
            matchedCount = 0,
            i = "0",
            unmatched = seed && [],
            setMatched = [],
            contextBackup = outermostContext,
            // We must always have either seed elements or outermost context
        elems = seed || byElement && Expr.find["TAG"]("*", outermost),
            // Use integer dirruns iff this is the outermost matcher
        dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1,
            len = elems.length;

        if (outermost) {
          outermostContext = context === document || context || outermost;
        } // Add elements passing elementMatchers directly to results
        // Support: IE<9, Safari
        // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id


        for (; i !== len && (elem = elems[i]) != null; i++) {
          if (byElement && elem) {
            j = 0;

            if (!context && elem.ownerDocument !== document) {
              setDocument(elem);
              xml = !documentIsHTML;
            }

            while (matcher = elementMatchers[j++]) {
              if (matcher(elem, context || document, xml)) {
                results.push(elem);
                break;
              }
            }

            if (outermost) {
              dirruns = dirrunsUnique;
            }
          } // Track unmatched elements for set filters


          if (bySet) {
            // They will have gone through all possible matchers
            if (elem = !matcher && elem) {
              matchedCount--;
            } // Lengthen the array for every element, matched or not


            if (seed) {
              unmatched.push(elem);
            }
          }
        } // `i` is now the count of elements visited above, and adding it to `matchedCount`
        // makes the latter nonnegative.


        matchedCount += i; // Apply set filters to unmatched elements
        // NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
        // equals `i`), unless we didn't visit _any_ elements in the above loop because we have
        // no element matchers and no seed.
        // Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
        // case, which will result in a "00" `matchedCount` that differs from `i` but is also
        // numerically zero.

        if (bySet && i !== matchedCount) {
          j = 0;

          while (matcher = setMatchers[j++]) {
            matcher(unmatched, setMatched, context, xml);
          }

          if (seed) {
            // Reintegrate element matches to eliminate the need for sorting
            if (matchedCount > 0) {
              while (i--) {
                if (!(unmatched[i] || setMatched[i])) {
                  setMatched[i] = pop.call(results);
                }
              }
            } // Discard index placeholder values to get only actual matches


            setMatched = condense(setMatched);
          } // Add matches to results


          push.apply(results, setMatched); // Seedless set matches succeeding multiple successful matchers stipulate sorting

          if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
            Sizzle.uniqueSort(results);
          }
        } // Override manipulation of globals by nested matchers


        if (outermost) {
          dirruns = dirrunsUnique;
          outermostContext = contextBackup;
        }

        return unmatched;
      };

      return bySet ? markFunction(superMatcher) : superMatcher;
    }

    compile = Sizzle.compile = function (selector, match
    /* Internal Use Only */
    ) {
      var i,
          setMatchers = [],
          elementMatchers = [],
          cached = compilerCache[selector + " "];

      if (!cached) {
        // Generate a function of recursive functions that can be used to check each element
        if (!match) {
          match = tokenize(selector);
        }

        i = match.length;

        while (i--) {
          cached = matcherFromTokens(match[i]);

          if (cached[expando]) {
            setMatchers.push(cached);
          } else {
            elementMatchers.push(cached);
          }
        } // Cache the compiled function


        cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers)); // Save selector and tokenization

        cached.selector = selector;
      }

      return cached;
    };
    /**
     * A low-level selection function that works with Sizzle's compiled
     *  selector functions
     * @param selector {String|Function} A selector or a pre-compiled
     *  selector function built with Sizzle.compile
     * @param context {Element}
     * @param results {Array}
     * @param seed {Array} A set of elements to match against
     */


    select = Sizzle.select = function (selector, context, results, seed) {
      var i,
          tokens,
          token,
          type,
          find,
          compiled = typeof selector === "function" && selector,
          match = !seed && tokenize(selector = compiled.selector || selector);
      results = results || []; // Try to minimize operations if there is only one selector in the list and no seed
      // (the latter of which guarantees us context)

      if (match.length === 1) {
        // Reduce context if the leading compound selector is an ID
        tokens = match[0] = match[0].slice(0);

        if (tokens.length > 2 && (token = tokens[0]).type === "ID" && support.getById && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
          context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];

          if (!context) {
            return results; // Precompiled matchers will still verify ancestry, so step up a level
          } else if (compiled) {
            context = context.parentNode;
          }

          selector = selector.slice(tokens.shift().value.length);
        } // Fetch a seed set for right-to-left matching


        i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;

        while (i--) {
          token = tokens[i]; // Abort if we hit a combinator

          if (Expr.relative[type = token.type]) {
            break;
          }

          if (find = Expr.find[type]) {
            // Search, expanding context for leading sibling combinators
            if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {
              // If seed is empty or no tokens remain, we can return early
              tokens.splice(i, 1);
              selector = seed.length && toSelector(tokens);

              if (!selector) {
                push.apply(results, seed);
                return results;
              }

              break;
            }
          }
        }
      } // Compile and execute a filtering function if one is not provided
      // Provide `match` to avoid retokenization if we modified the selector above


      (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
      return results;
    }; // One-time assignments
    // Sort stability


    support.sortStable = expando.split("").sort(sortOrder).join("") === expando; // Support: Chrome 14-35+
    // Always assume duplicates if they aren't passed to the comparison function

    support.detectDuplicates = !!hasDuplicate; // Initialize against the default document

    setDocument(); // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
    // Detached nodes confoundingly follow *each other*

    support.sortDetached = assert(function (el) {
      // Should return 1, but returns 4 (following)
      return el.compareDocumentPosition(document.createElement("fieldset")) & 1;
    }); // Support: IE<8
    // Prevent attribute/property "interpolation"
    // https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx

    if (!assert(function (el) {
      el.innerHTML = "<a href='#'></a>";
      return el.firstChild.getAttribute("href") === "#";
    })) {
      addHandle("type|href|height|width", function (elem, name, isXML) {
        if (!isXML) {
          return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
        }
      });
    } // Support: IE<9
    // Use defaultValue in place of getAttribute("value")


    if (!support.attributes || !assert(function (el) {
      el.innerHTML = "<input/>";
      el.firstChild.setAttribute("value", "");
      return el.firstChild.getAttribute("value") === "";
    })) {
      addHandle("value", function (elem, name, isXML) {
        if (!isXML && elem.nodeName.toLowerCase() === "input") {
          return elem.defaultValue;
        }
      });
    } // Support: IE<9
    // Use getAttributeNode to fetch booleans when getAttribute lies


    if (!assert(function (el) {
      return el.getAttribute("disabled") == null;
    })) {
      addHandle(booleans, function (elem, name, isXML) {
        var val;

        if (!isXML) {
          return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
        }
      });
    } // EXPOSE qooxdoo variant


    qx.bom.Selector.query = function (selector, context) {
      return Sizzle(selector, context);
    };

    qx.bom.Selector.matches = function (selector, set) {
      return Sizzle(selector, null, null, set);
    }; // EXPOSE qooxdoo variant

  })(window);

  qx.bom.Selector.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.lang.normalize.Function": {
        "require": true
      },
      "qx.lang.normalize.String": {
        "require": true
      },
      "qx.lang.normalize.Date": {
        "require": true
      },
      "qx.lang.normalize.Array": {
        "require": true
      },
      "qx.lang.normalize.Error": {
        "require": true
      },
      "qx.lang.normalize.Object": {
        "require": true
      },
      "qx.lang.normalize.Number": {
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (wittemann)
       * Daniel Wagner (danielwagner)
  
  ************************************************************************ */

  /**
   * Adds JavaScript features that may not be supported by all clients.
   *
   * @require(qx.lang.normalize.Function)
   * @require(qx.lang.normalize.String)
   * @require(qx.lang.normalize.Date)
   * @require(qx.lang.normalize.Array)
   * @require(qx.lang.normalize.Error)
   * @require(qx.lang.normalize.Object)
   * @require(qx.lang.normalize.Number)
   *
   * @group (Polyfill)
   */
  qx.Bootstrap.define("qx.module.Polyfill", {});
  qx.module.Polyfill.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Environment": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": ["device.name", "device.touch", "device.type", "device.pixelRatio"],
      "required": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * The class is responsible for device detection. This is specially useful
   * if you are on a mobile device.
   *
   * This class is used by {@link qx.core.Environment} and should not be used
   * directly. Please check its class comment for details how to use it.
   *
   * @internal
   */
  qx.Bootstrap.define("qx.bom.client.Device", {
    statics: {
      /** Maps user agent names to device IDs */
      __ids__P_95_0: {
        "Windows Phone": "iemobile",
        iPod: "ipod",
        iPad: "ipad",
        iPhone: "iphone",
        PSP: "psp",
        "PLAYSTATION 3": "ps3",
        "Nintendo Wii": "wii",
        "Nintendo DS": "ds",
        XBOX: "xbox",
        Xbox: "xbox"
      },

      /**
       * Returns the name of the current device if detectable. It falls back to
       * <code>pc</code> if the detection for other devices fails.
       *
       * @internal
       * @return {String} The string of the device found.
       */
      getName: function getName() {
        var str = [];

        for (var key in qx.bom.client.Device.__ids__P_95_0) {
          str.push(key);
        }

        var reg = new RegExp("(" + str.join("|").replace(/\./g, ".") + ")", "g");
        var match = reg.exec(navigator.userAgent);

        if (match && match[1]) {
          return qx.bom.client.Device.__ids__P_95_0[match[1]];
        }

        return "pc";
      },

      /**
       * Determines on what type of device the application is running.
       * Valid values are: "mobile", "tablet" or "desktop".
       * @return {String} The device type name of determined device.
       */
      getType: function getType() {
        return qx.bom.client.Device.detectDeviceType(navigator.userAgent);
      },

      /**
       * Detects the device type, based on given userAgentString.
       *
       * @param userAgentString {String} userAgent parameter, needed for decision.
       * @return {String} The device type name of determined device: "mobile","desktop","tablet"
       */
      detectDeviceType: function detectDeviceType(userAgentString) {
        if (qx.bom.client.Device.detectTabletDevice(userAgentString)) {
          return "tablet";
        } else if (qx.bom.client.Device.detectMobileDevice(userAgentString)) {
          return "mobile";
        }

        return "desktop";
      },

      /**
       * Detects if a device is a mobile phone. (Tablets excluded.)
       * @param userAgentString {String} userAgent parameter, needed for decision.
       * @return {Boolean} Flag which indicates whether it is a mobile device.
       */
      detectMobileDevice: function detectMobileDevice(userAgentString) {
        return /android.+mobile|ip(hone|od)|bada\/|blackberry|BB10|maemo|opera m(ob|in)i|fennec|NetFront|phone|psp|symbian|IEMobile|windows (ce|phone)|xda/i.test(userAgentString);
      },

      /**
       * Detects if a device is a tablet device.
       * @param userAgentString {String} userAgent parameter, needed for decision.
       * @return {Boolean} Flag which indicates whether it is a tablet device.
       */
      detectTabletDevice: function detectTabletDevice(userAgentString) {
        var iPadOS13Up = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
        var isIE10Tablet = /MSIE 10/i.test(userAgentString) && /ARM/i.test(userAgentString) && !/windows phone/i.test(userAgentString);
        var isCommonTablet = !/android.+mobile|Tablet PC/i.test(userAgentString) && /Android|ipad|tablet|playbook|silk|kindle|psp/i.test(userAgentString);
        return isIE10Tablet || isCommonTablet || iPadOS13Up;
      },

      /**
       * Detects the device's pixel ratio. Returns 1 if detection is not possible.
       *
       * @return {Number} The device's pixel ratio
       */
      getDevicePixelRatio: function getDevicePixelRatio() {
        if (typeof window.devicePixelRatio !== "undefined") {
          return window.devicePixelRatio;
        }

        return 1;
      },

      /**
       * Detects if either touch events or pointer events are supported.
       * Additionally it checks if touch is enabled for pointer events.
       *
       * @return {Boolean} <code>true</code>, if the device supports touch
       */
      getTouch: function getTouch() {
        return "ontouchstart" in window || window.navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
      }
    },
    defer: function defer(statics) {
      qx.core.Environment.add("device.name", statics.getName);
      qx.core.Environment.add("device.touch", statics.getTouch);
      qx.core.Environment.add("device.type", statics.getType);
      qx.core.Environment.add("device.pixelRatio", statics.getDevicePixelRatio);
    }
  });
  qx.bom.client.Device.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Browser": {
        "defer": "load",
        "require": true
      },
      "qx.bom.client.Engine": {
        "defer": "load",
        "require": true
      },
      "qx.bom.client.Device": {
        "defer": "load",
        "require": true
      },
      "qx.bom.client.Event": {
        "defer": "load",
        "require": true
      },
      "qxWeb": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "browser.name": {
          "defer": true,
          "className": "qx.bom.client.Browser"
        },
        "browser.version": {
          "defer": true,
          "className": "qx.bom.client.Browser"
        },
        "browser.quirksmode": {
          "defer": true,
          "className": "qx.bom.client.Browser"
        },
        "browser.documentmode": {
          "defer": true,
          "className": "qx.bom.client.Browser"
        },
        "engine.name": {
          "defer": true,
          "className": "qx.bom.client.Engine"
        },
        "engine.version": {
          "defer": true,
          "className": "qx.bom.client.Engine"
        },
        "device.name": {
          "defer": true,
          "className": "qx.bom.client.Device"
        },
        "device.type": {
          "defer": true,
          "className": "qx.bom.client.Device"
        },
        "event.touch": {
          "defer": true,
          "className": "qx.bom.client.Event"
        },
        "event.mspointer": {
          "defer": true,
          "className": "qx.bom.client.Event"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * Module for querying information about the environment / runtime.
   * It adds a static key <code>env</code> to qxWeb and offers the given methods.
   *
   * The following values are predefined:
   *
   * * <code>browser.name</code> : The name of the browser
   * * <code>browser.version</code> : The version of the browser
   * * <code>browser.quirksmode</code>  : <code>true</code> if the browser is in quirksmode
   * * <code>browser.documentmode</code> : The document mode of the browser
   *
   * * <code>device.name</code> : The name of the device e.g. <code>iPad</code>.
   * * <code>device.type</code> : Either <code>desktop</code>, <code>tablet</code> or <code>mobile</code>.
   *
   * * <code>engine.name</code> : The name of the browser engine
   * * <code>engine.version</code> : The version of the browser engine
   *
   * * <code>event.touch</code> : Checks if touch events are supported
   * * <code>event.mspointer</code> : Checks if MSPointer events are available
   * @group (Core)
   */
  qx.Bootstrap.define("qx.module.Environment", {
    statics: {
      /**
       * Get the value stored for the given key.
       *
       * @attachStatic {qxWeb, env.get}
       * @param key {String} The key to check for.
       * @return {var} The value stored for the given key.
       * @lint environmentNonLiteralKey(key)
       */
      get: function get(key) {
        return qx.core.Environment.get(key);
      },

      /**
       * Adds a new environment setting which can be queried via {@link #get}.
       * @param key {String} The key to store the value for.
       *
       * @attachStatic {qxWeb, env.add}
       * @param value {var} The value to store.
       * @return {qxWeb} The collection for chaining.
       */
      add: function add(key, value) {
        qx.core.Environment.add(key, value);
        return this;
      }
    },
    defer: function defer(statics) {
      // make sure the desired keys are available (browser.* and engine.*)
      qx.core.Environment.get("browser.name");
      qx.core.Environment.get("browser.version");
      qx.core.Environment.get("browser.quirksmode");
      qx.core.Environment.get("browser.documentmode");
      qx.core.Environment.get("engine.name");
      qx.core.Environment.get("engine.version");
      qx.core.Environment.get("device.name");
      qx.core.Environment.get("device.type");
      qx.core.Environment.get("event.touch");
      qx.core.Environment.get("event.mspointer");
      qxWeb.$attachAll(this, "env");
    }
  });
  qx.module.Environment.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.module.event.PointerHandler": {
        "defer": "runtime"
      },
      "qx.module.Polyfill": {
        "require": true,
        "defer": "runtime"
      },
      "qx.module.Environment": {
        "require": true,
        "defer": "runtime"
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qxWeb": {
        "defer": "runtime"
      },
      "qx.bom.Event": {},
      "qx.lang.Type": {},
      "qx.lang.Array": {},
      "qx.event.Emitter": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2011-2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (wittemann)
       * Daniel Wagner (danielwagner)
  
  ************************************************************************ */

  /**
   * Support for native and custom events.
   *
   * @require(qx.module.Polyfill)
   * @require(qx.module.Environment)
   * @use(qx.module.event.PointerHandler)
   * @group (Core)
   */
  qx.Bootstrap.define("qx.module.Event", {
    statics: {
      /**
       * Event normalization registry
       *
       * @internal
       */
      __normalizations__P_135_0: {},

      /**
       * Registry of event hooks
       * @internal
       */
      __hooks__P_135_1: {
        on: {},
        off: {}
      },
      __isReady__P_135_2: false,

      /**
       * Executes the given function once the document is ready.
       *
       * @attachStatic {qxWeb}
       * @param callback {Function} callback function
       */
      ready: function ready(callback) {
        // DOM is already ready
        if (document.readyState === "complete") {
          window.setTimeout(callback, 1);
          return;
        } // listen for the load event so the callback is executed no matter what


        var onWindowLoad = function onWindowLoad() {
          qx.module.Event.__isReady__P_135_2 = true;
          callback();
        };

        qxWeb(window).on("load", onWindowLoad);

        var wrappedCallback = function wrappedCallback() {
          qxWeb(window).off("load", onWindowLoad);
          callback();
        }; // Listen for DOMContentLoaded event if available (no way to reliably detect
        // support)


        if (qxWeb.env.get("engine.name") !== "mshtml" || qxWeb.env.get("browser.documentmode") > 8) {
          qx.bom.Event.addNativeListener(document, "DOMContentLoaded", wrappedCallback);
        } else {
          // Continually check to see if the document is ready
          var timer = function timer() {
            // onWindowLoad already executed
            if (qx.module.Event.__isReady__P_135_2) {
              return;
            }

            try {
              // If DOMContentLoaded is unavailable, use the trick by Diego Perini
              // http://javascript.nwbox.com/IEContentLoaded/
              document.documentElement.doScroll("left");

              if (document.body) {
                wrappedCallback();
              }
            } catch (error) {
              window.setTimeout(timer, 100);
            }
          };

          timer();
        }
      },

      /**
       * Registers a normalization function for the given event types. Listener
       * callbacks for these types will be called with the return value of the
       * normalization function instead of the regular event object.
       *
       * The normalizer will be called with two arguments: The original event
       * object and the element on which the event was triggered
       *
       * @attachStatic {qxWeb, $registerEventNormalization}
       * @param types {String[]} List of event types to be normalized. Use an
       * asterisk (<code>*</code>) to normalize all event types
       * @param normalizer {Function} Normalizer function
       */
      $registerEventNormalization: function $registerEventNormalization(types, normalizer) {
        if (!qx.lang.Type.isArray(types)) {
          types = [types];
        }

        var registry = qx.module.Event.__normalizations__P_135_0;

        for (var i = 0, l = types.length; i < l; i++) {
          var type = types[i];

          if (qx.lang.Type.isFunction(normalizer)) {
            if (!registry[type]) {
              registry[type] = [];
            }

            registry[type].push(normalizer);
          }
        }
      },

      /**
       * Unregisters a normalization function from the given event types.
       *
       * @attachStatic {qxWeb, $unregisterEventNormalization}
       * @param types {String[]} List of event types
       * @param normalizer {Function} Normalizer function
       */
      $unregisterEventNormalization: function $unregisterEventNormalization(types, normalizer) {
        if (!qx.lang.Type.isArray(types)) {
          types = [types];
        }

        var registry = qx.module.Event.__normalizations__P_135_0;

        for (var i = 0, l = types.length; i < l; i++) {
          var type = types[i];

          if (registry[type]) {
            qx.lang.Array.remove(registry[type], normalizer);
          }
        }
      },

      /**
       * Returns all registered event normalizers
       *
       * @attachStatic {qxWeb, $getEventNormalizationRegistry}
       * @return {Map} Map of event types/normalizer functions
       */
      $getEventNormalizationRegistry: function $getEventNormalizationRegistry() {
        return qx.module.Event.__normalizations__P_135_0;
      },

      /**
       * Registers an event hook for the given event types.
       *
       * @attachStatic {qxWeb, $registerEventHook}
       * @param types {String[]} List of event types
       * @param registerHook {Function} Hook function to be called on event registration
       * @param unregisterHook {Function?} Hook function to be called on event deregistration
       * @internal
       */
      $registerEventHook: function $registerEventHook(types, registerHook, unregisterHook) {
        if (!qx.lang.Type.isArray(types)) {
          types = [types];
        }

        var onHooks = qx.module.Event.__hooks__P_135_1.on;

        for (var i = 0, l = types.length; i < l; i++) {
          var type = types[i];

          if (qx.lang.Type.isFunction(registerHook)) {
            if (!onHooks[type]) {
              onHooks[type] = [];
            }

            onHooks[type].push(registerHook);
          }
        }

        if (!unregisterHook) {
          return;
        }

        var offHooks = qx.module.Event.__hooks__P_135_1.off;

        for (var i = 0, l = types.length; i < l; i++) {
          var type = types[i];

          if (qx.lang.Type.isFunction(unregisterHook)) {
            if (!offHooks[type]) {
              offHooks[type] = [];
            }

            offHooks[type].push(unregisterHook);
          }
        }
      },

      /**
       * Unregisters a hook from the given event types.
       *
       * @attachStatic {qxWeb, $unregisterEventHooks}
       * @param types {String[]} List of event types
       * @param registerHook {Function} Hook function to be called on event registration
       * @param unregisterHook {Function?} Hook function to be called on event deregistration
       * @internal
       */
      $unregisterEventHook: function $unregisterEventHook(types, registerHook, unregisterHook) {
        if (!qx.lang.Type.isArray(types)) {
          types = [types];
        }

        var onHooks = qx.module.Event.__hooks__P_135_1.on;

        for (var i = 0, l = types.length; i < l; i++) {
          var type = types[i];

          if (onHooks[type]) {
            qx.lang.Array.remove(onHooks[type], registerHook);
          }
        }

        if (!unregisterHook) {
          return;
        }

        var offHooks = qx.module.Event.__hooks__P_135_1.off;

        for (var i = 0, l = types.length; i < l; i++) {
          var type = types[i];

          if (offHooks[type]) {
            qx.lang.Array.remove(offHooks[type], unregisterHook);
          }
        }
      },

      /**
       * Returns all registered event hooks
       *
       * @attachStatic {qxWeb, $getEventHookRegistry}
       * @return {Map} Map of event types/registration hook functions
       * @internal
       */
      $getEventHookRegistry: function $getEventHookRegistry() {
        return qx.module.Event.__hooks__P_135_1;
      }
    },
    members: {
      /**
       * Registers a listener for the given event type on each item in the
       * collection. This can be either native or custom events.
       *
       * @attach {qxWeb}
       * @param type {String} Type of the event to listen for
       * @param listener {Function} Listener callback
       * @param context {Object?} Context the callback function will be executed in.
       * Default: The element on which the listener was registered
       * @param useCapture {Boolean?} Attach the listener to the capturing
       * phase if true
       * @return {qxWeb} The collection for chaining
       */
      on: function on(type, listener, context, useCapture) {
        for (var i = 0; i < this.length; i++) {
          var el = this[i];
          var ctx = context || qxWeb(el); // call hooks

          var hooks = qx.module.Event.__hooks__P_135_1.on; // generic

          var typeHooks = hooks["*"] || []; // type specific

          if (hooks[type]) {
            typeHooks = typeHooks.concat(hooks[type]);
          }

          for (var j = 0, m = typeHooks.length; j < m; j++) {
            typeHooks[j](el, type, listener, context);
          }

          var bound = function (el, event) {
            // apply normalizations
            var registry = qx.module.Event.__normalizations__P_135_0; // generic

            var normalizations = registry["*"] || []; // type specific

            if (registry[type]) {
              normalizations = normalizations.concat(registry[type]);
            }

            for (var x = 0, y = normalizations.length; x < y; x++) {
              event = normalizations[x](event, el, type);
            } // call original listener with normalized event


            listener.apply(this, [event]);
          }.bind(ctx, el);

          bound.original = listener; // add native listener

          qx.bom.Event.addNativeListener(el, type, bound, useCapture); // create an emitter if necessary

          if (!el.$$emitter) {
            el.$$emitter = new qx.event.Emitter();
          }

          el.$$lastlistenerId = el.$$emitter.on(type, bound, ctx); // save the useCapture for removing

          el.$$emitter.getEntryById(el.$$lastlistenerId).useCapture = !!useCapture;

          if (!el.__listener__P_135_3) {
            el.__listener__P_135_3 = {};
          }

          if (!el.__listener__P_135_3[type]) {
            el.__listener__P_135_3[type] = {};
          }

          el.__listener__P_135_3[type][el.$$lastlistenerId] = bound;

          if (!context) {
            // store a reference to the dynamically created context so we know
            // what to check for when removing the listener
            if (!el.__ctx__P_135_4) {
              el.__ctx__P_135_4 = {};
            }

            el.__ctx__P_135_4[el.$$lastlistenerId] = ctx;
          }
        }

        return this;
      },

      /**
       * Unregisters event listeners for the given type from each element in the
       * collection.
       *
       * @attach {qxWeb}
       * @param type {String} Type of the event
       * @param listener {Function} Listener callback
       * @param context {Object?} Listener callback context
       * @param useCapture {Boolean?} Attach the listener to the capturing
       * phase if true
       * @return {qxWeb} The collection for chaining
       */
      off: function off(type, listener, context, useCapture) {
        var removeAll = listener === null && context === null;

        for (var j = 0; j < this.length; j++) {
          var el = this[j]; // continue if no listeners are available

          if (!el.__listener__P_135_3) {
            continue;
          }

          var types = [];

          if (type !== null) {
            types.push(type);
          } else {
            // no type specified, remove all listeners
            for (var listenerType in el.__listener__P_135_3) {
              types.push(listenerType);
            }
          }

          for (var i = 0, l = types.length; i < l; i++) {
            for (var id in el.__listener__P_135_3[types[i]]) {
              var storedListener = el.__listener__P_135_3[types[i]][id];

              if (removeAll || storedListener == listener || storedListener.original == listener) {
                // get the stored context
                var hasStoredContext = typeof el.__ctx__P_135_4 !== "undefined" && el.__ctx__P_135_4[id];
                var storedContext;

                if (!context && hasStoredContext) {
                  storedContext = el.__ctx__P_135_4[id];
                } // remove the listener from the emitter


                var result = el.$$emitter.off(types[i], storedListener, storedContext || context); // check if it's a bound listener which means it was a native event

                if (removeAll || storedListener.original == listener) {
                  // remove the native listener
                  qx.bom.Event.removeNativeListener(el, types[i], storedListener, useCapture);
                } // BUG #9184
                // only if the emitter was successfully removed also delete the key in the data structure


                if (result !== null) {
                  delete el.__listener__P_135_3[types[i]][id];
                }

                if (hasStoredContext) {
                  delete el.__ctx__P_135_4[id];
                }
              }
            } // call hooks


            var hooks = qx.module.Event.__hooks__P_135_1.off; // generic

            var typeHooks = hooks["*"] || []; // type specific

            if (hooks[type]) {
              typeHooks = typeHooks.concat(hooks[type]);
            }

            for (var k = 0, m = typeHooks.length; k < m; k++) {
              typeHooks[k](el, type, listener, context);
            }
          }
        }

        return this;
      },

      /**
       * Removes all event listeners (or all listeners for a given type) from the
       * collection.
       *
       * @attach {qxWeb}
       * @param type {String?} Event type. All listeners will be removed if this is undefined.
       * @return {qxWeb} The collection for chaining
       */
      allOff: function allOff(type) {
        return this.off(type || null, null, null);
      },

      /**
       * Removes the listener with the given id.
       * @param id {Number} The id of the listener to remove
       * @return {qxWeb} The collection for chaining.
       */
      offById: function offById(id) {
        var entry = this[0].$$emitter.getEntryById(id);
        return this.off(entry.name, entry.listener.original, entry.ctx, entry.useCapture);
      },

      /**
       * Fire an event of the given type.
       *
       * @attach {qxWeb}
       * @param type {String} Event type
       * @param data {var?} Optional data that will be passed to the listener
       * callback function.
       * @return {qxWeb} The collection for chaining
       */
      emit: function emit(type, data) {
        for (var j = 0; j < this.length; j++) {
          var el = this[j];

          if (el.$$emitter) {
            el.$$emitter.emit(type, data);
          }
        }

        return this;
      },

      /**
       * Attaches a listener for the given event that will be executed only once.
       *
       * @attach {qxWeb}
       * @param type {String} Type of the event to listen for
       * @param listener {Function} Listener callback
       * @param context {Object?} Context the callback function will be executed in.
       * Default: The element on which the listener was registered
       * @return {qxWeb} The collection for chaining
       */
      once: function once(type, listener, context) {
        var self = this;

        var wrappedListener = function wrappedListener(data) {
          self.off(type, wrappedListener, context);
          listener.call(this, data);
        };

        this.on(type, wrappedListener, context);
        return this;
      },

      /**
       * Checks if one or more listeners for the given event type are attached to
       * the first element in the collection.
       *
       * *Important:* Make sure you are handing in the *identical* context object to get
       * the correct result. Especially when using a collection instance this is a common pitfall.
       *
       * @attach {qxWeb}
       * @param type {String} Event type, e.g. <code>mousedown</code>
       * @param listener {Function?} Event listener to check for.
       * @param context {Object?} Context object listener to check for.
       * @return {Boolean} <code>true</code> if one or more listeners are attached
       */
      hasListener: function hasListener(type, listener, context) {
        if (!this[0] || !this[0].$$emitter || !this[0].$$emitter.getListeners()[type]) {
          return false;
        }

        if (listener) {
          var attachedListeners = this[0].$$emitter.getListeners()[type];

          for (var i = 0; i < attachedListeners.length; i++) {
            var hasListener = false;

            if (attachedListeners[i].listener == listener) {
              hasListener = true;
            }

            if (attachedListeners[i].listener.original && attachedListeners[i].listener.original == listener) {
              hasListener = true;
            }

            if (hasListener) {
              if (context !== undefined) {
                if (attachedListeners[i].ctx === context) {
                  return true;
                }
              } else {
                return true;
              }
            }
          }

          return false;
        }

        return this[0].$$emitter.getListeners()[type].length > 0;
      },

      /**
       * Copies any event listeners that are attached to the elements in the
       * collection to the provided target element
       *
       * @internal
       * @param target {Element} Element to attach the copied listeners to
       */
      copyEventsTo: function copyEventsTo(target) {
        // Copy both arrays to make sure the original collections are not manipulated.
        // If e.g. the 'target' array contains a DOM node with child nodes we run into
        // problems because the 'target' array is flattened within this method.
        var source = this.concat();
        var targetCopy = target.concat(); // get all children of source and target

        for (var i = source.length - 1; i >= 0; i--) {
          var descendants = source[i].getElementsByTagName("*");

          for (var j = 0; j < descendants.length; j++) {
            source.push(descendants[j]);
          }
        }

        for (var i = targetCopy.length - 1; i >= 0; i--) {
          var descendants = targetCopy[i].getElementsByTagName("*");

          for (var j = 0; j < descendants.length; j++) {
            targetCopy.push(descendants[j]);
          }
        } // make sure no emitter object has been copied


        targetCopy.forEach(function (el) {
          el.$$emitter = null;
        });

        for (var i = 0; i < source.length; i++) {
          var el = source[i];

          if (!el.$$emitter) {
            continue;
          }

          var storage = el.$$emitter.getListeners();

          for (var name in storage) {
            for (var j = storage[name].length - 1; j >= 0; j--) {
              var listener = storage[name][j].listener;

              if (listener.original) {
                listener = listener.original;
              }

              qxWeb(targetCopy[i]).on(name, listener, storage[name][j].ctx);
            }
          }
        }
      },

      /**
       * Bind one or two callbacks to the collection.
       * If only the first callback is defined the collection
       * does react on 'pointerover' only.
       *
       * @attach {qxWeb}
       *
       * @param callbackIn {Function} callback when hovering over
       * @param callbackOut {Function?} callback when hovering out
       * @return {qxWeb} The collection for chaining
       */
      hover: function hover(callbackIn, callbackOut) {
        this.on("pointerover", callbackIn, this);

        if (qx.lang.Type.isFunction(callbackOut)) {
          this.on("pointerout", callbackOut, this);
        }

        return this;
      },

      /**
       * Adds a listener for the given type and checks if the target fulfills the selector check.
       * If the check is successful the callback is executed with the target and event as arguments.
       *
       * @attach{qxWeb}
       *
       * @param eventType {String} name of the event to watch out for (attached to the document object)
       * @param target {String|Element|Element[]|qxWeb} Selector expression, DOM element,
       * Array of DOM elements or collection
       * @param callback {Function} function to call if the selector matches.
       * The callback will get the target as qxWeb collection and the event as arguments
       * @param context {Object?} optional context object to call the callback
       * @return {qxWeb} The collection for chaining
       */
      onMatchTarget: function onMatchTarget(eventType, target, callback, context) {
        context = context !== undefined ? context : this;

        var listener = function listener(e) {
          var eventTarget = qxWeb(e.getTarget());

          if (eventTarget.is(target)) {
            callback.call(context, eventTarget, qxWeb.object.clone(e));
          } else {
            var targetToMatch = typeof target == "string" ? this.find(target) : qxWeb(target);

            for (var i = 0, l = targetToMatch.length; i < l; i++) {
              if (eventTarget.isChildOf(qxWeb(targetToMatch[i]))) {
                callback.call(context, eventTarget, qxWeb.object.clone(e));
                break;
              }
            }
          }
        }; // make sure to store the infos for 'offMatchTarget' at each element of the collection
        // to be able to remove the listener separately


        this.forEach(function (el) {
          var matchTarget = {
            type: eventType,
            listener: listener,
            callback: callback,
            context: context
          };

          if (!el.$$matchTargetInfo) {
            el.$$matchTargetInfo = [];
          }

          el.$$matchTargetInfo.push(matchTarget);
        });
        this.on(eventType, listener);
        return this;
      },

      /**
       * Removes a listener for the given type and selector check.
       *
       * @attach{qxWeb}
       *
       * @param eventType {String} name of the event to remove for
       * @param target {String|Element|Element[]|qxWeb} Selector expression, DOM element,
       * Array of DOM elements or collection
       * @param callback {Function} function to remove
       * @param context {Object?} optional context object to remove
       * @return {qxWeb} The collection for chaining
       */
      offMatchTarget: function offMatchTarget(eventType, target, callback, context) {
        context = context !== undefined ? context : this;
        this.forEach(function (el) {
          if (el.$$matchTargetInfo && qxWeb.type.get(el.$$matchTargetInfo) == "Array") {
            var infos = el.$$matchTargetInfo;

            for (var i = infos.length - 1; i >= 0; i--) {
              var entry = infos[i];

              if (entry.type == eventType && entry.callback == callback && entry.context == context) {
                this.off(eventType, entry.listener);
                infos.splice(i, 1);
              }
            }

            if (infos.length === 0) {
              el.$$matchTargetInfo = null;
            }
          }
        }, this);
        return this;
      }
    },
    defer: function defer(statics) {
      qxWeb.$attachAll(this); // manually attach internal $-methods as they are ignored by the previous method-call

      qxWeb.$attachStatic({
        $registerEventNormalization: statics.$registerEventNormalization,
        $unregisterEventNormalization: statics.$unregisterEventNormalization,
        $getEventNormalizationRegistry: statics.$getEventNormalizationRegistry,
        $registerEventHook: statics.$registerEventHook,
        $unregisterEventHook: statics.$unregisterEventHook,
        $getEventHookRegistry: statics.$getEventHookRegistry
      });
    }
  });
  qx.module.Event.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.module.Event": {
        "require": true,
        "defer": "runtime"
      },
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Event": {
        "require": true
      },
      "qx.event.Emitter": {},
      "qx.event.handler.PointerCore": {},
      "qxWeb": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "event.dispatchevent": {
          "className": "qx.bom.client.Event"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2014 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Daniel Wagner (danielwagner)
  
  ************************************************************************ */

  /**
   * TODOC
   *
   * @require(qx.module.Event)
   *
   * @group (Event_Normalization)
   */
  qx.Bootstrap.define("qx.module.event.PointerHandler", {
    statics: {
      /**
       * List of events that require a pointer handler
       */
      TYPES: ["pointermove", "pointerover", "pointerout", "pointerdown", "pointerup", "pointercancel", "gesturebegin", "gesturemove", "gesturefinish", "gesturecancel"],

      /**
       * Creates a pointer handler for the given element when a pointer event listener
       * is attached to it
       *
       * @param element {Element} DOM element
       * @param type {String} event type
       */
      register: function register(element, type) {
        if (!element.$$pointerHandler) {
          if (!qx.core.Environment.get("event.dispatchevent")) {
            if (!element.$$emitter) {
              element.$$emitter = new qx.event.Emitter();
            }
          }

          element.$$pointerHandler = new qx.event.handler.PointerCore(element, element.$$emitter);
        }
      },

      /**
       * Removes the pointer event handler from the element if there are no more
       * pointer event listeners attached to it
       * @param element {Element} DOM element
       */
      unregister: function unregister(element) {
        // check if there are any registered listeners left
        if (element.$$pointerHandler) {
          // in a standalone or in-line application the pointer handler of
          // document will be qx.event.handler.Pointer, do not dispose that handler.
          // see constructor of qx.event.handler.Pointer
          if (element.$$pointerHandler.classname === "qx.event.handler.Pointer") {
            return;
          }

          var listeners = element.$$emitter.getListeners();

          for (var type in listeners) {
            if (qx.module.event.PointerHandler.TYPES.indexOf(type) !== -1) {
              if (listeners[type].length > 0) {
                return;
              }
            }
          } // no more listeners, get rid of the handler


          element.$$pointerHandler.dispose();
          element.$$pointerHandler = undefined;
        }
      }
    },
    defer: function defer(statics) {
      qxWeb.$registerEventHook(statics.TYPES, statics.register, statics.unregister);
    }
  });
  qx.module.event.PointerHandler.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.module.Css": {
        "require": true,
        "defer": "runtime"
      },
      "qx.module.Event": {
        "require": true,
        "defer": "runtime"
      },
      "qx.module.Environment": {
        "require": true,
        "defer": "runtime"
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.element.Animation": {},
      "qxWeb": {
        "defer": "runtime"
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * Cross browser animation layer. It uses feature detection to check if CSS
   * animations are available and ready to use. If not, a JavaScript-based
   * fallback will be used.
   *
   * @require(qx.module.Css)
   * @require(qx.module.Event)
   * @require(qx.module.Environment)
   */
  qx.Bootstrap.define("qx.module.Animation", {
    events: {
      /** Fired when an animation starts. */
      animationStart: undefined,

      /** Fired when an animation has ended one iteration. */
      animationIteration: undefined,

      /** Fired when an animation has ended. */
      animationEnd: undefined
    },
    statics: {
      /**
       * Animation description used in {@link #fadeOut}.
       */
      _fadeOut: {
        duration: 700,
        timing: "ease-out",
        keep: 100,
        keyFrames: {
          0: {
            opacity: 1
          },
          100: {
            opacity: 0,
            display: "none"
          }
        }
      },

      /**
       * Animation description used in {@link #fadeIn}.
       */
      _fadeIn: {
        duration: 700,
        timing: "ease-in",
        keep: 100,
        keyFrames: {
          0: {
            opacity: 0
          },
          100: {
            opacity: 1
          }
        }
      },

      /**
       * Animation execute either regular or reversed direction.
       * @param desc {Map} The animation"s description.
       * @param duration {Number?} The duration in milliseconds of the animation,
       *   which will override the duration given in the description.
       * @param reverse {Boolean} <code>true</code>, if the animation should be reversed
       */
      _animate: function _animate(desc, duration, reverse) {
        this._forEachElement(function (el, i) {
          // stop all running animations
          if (el.$$animation) {
            el.$$animation.stop();
          }

          var handle;

          if (reverse) {
            handle = qx.bom.element.Animation.animateReverse(el, desc, duration);
          } else {
            handle = qx.bom.element.Animation.animate(el, desc, duration);
          }

          var self = this; // only register for the first element

          if (i == 0) {
            handle.on("start", function () {
              self.emit("animationStart");
            }, handle);
            handle.on("iteration", function () {
              self.emit("animationIteration");
            }, handle);
          }

          handle.on("end", function () {
            for (var i = 0; i < self.length; i++) {
              if (self[i].$$animation) {
                return;
              }
            }

            self.emit("animationEnd");
          }, el);
        });
      }
    },
    members: {
      /**
       * Returns the stored animation handles. The handles are only
       * available while an animation is running.
       *
       * @internal
       * @return {Array} An array of animation handles.
       */
      getAnimationHandles: function getAnimationHandles() {
        var animationHandles = [];

        for (var i = 0; i < this.length; i++) {
          animationHandles[i] = this[i].$$animation;
        }

        return animationHandles;
      },

      /**
       * Starts the animation with the given description.
       *
       * *duration* is the time in milliseconds one animation cycle should take.
       *
       * *keep* is the key frame to apply at the end of the animation. (optional)
       *
       * *keyFrames* is a map of separate frames. Each frame is defined by a
       *   number which is the percentage value of time in the animation. The value
       *   is a map itself which holds css properties or transforms
       *   (Transforms only for CSS Animations).
       *
       * *origin* maps to the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/transform-origin">transform origin</a>
       * (Only for CSS animations).
       *
       * *repeat* is the amount of time the animation should be run in
       *   sequence. You can also use "infinite".
       *
       * *timing* takes one of these predefined values:
       *   <code>ease</code> | <code>linear</code> | <code>ease-in</code>
       *   | <code>ease-out</code> | <code>ease-in-out</code> |
       *   <code>cubic-bezier(&lt;number&gt;, &lt;number&gt;, &lt;number&gt;, &lt;number&gt;)</code>
       *   (cubic-bezier only available for CSS animations)
       *
       * *alternate* defines if every other animation should be run in reverse order.
       *
       * *delay* is the time in milliseconds the animation should wait before start.
       *
       * @attach {qxWeb}
       * @param desc {Map} The animation"s description.
       * @param duration {Number?} The duration in milliseconds of the animation,
       *   which will override the duration given in the description.
       * @return {qxWeb} The collection for chaining.
       */
      animate: function animate(desc, duration) {
        qx.module.Animation._animate.bind(this)(desc, duration, false);

        return this;
      },

      /**
       * Starts an animation in reversed order. For further details, take a look at
       * the {@link #animate} method.
       * @attach {qxWeb}
       * @param desc {Map} The animation"s description.
       * @param duration {Number?} The duration in milliseconds of the animation,
       *   which will override the duration given in the description.
       * @return {qxWeb} The collection for chaining.
       */
      animateReverse: function animateReverse(desc, duration) {
        qx.module.Animation._animate.bind(this)(desc, duration, true);

        return this;
      },

      /**
       * Manipulates the play state of the animation.
       * This can be used to continue an animation when paused.
       * @attach {qxWeb}
       * @return {qxWeb} The collection for chaining.
       */
      play: function play() {
        for (var i = 0; i < this.length; i++) {
          var handle = this[i].$$animation;

          if (handle) {
            handle.play();
          }
        }

        return this;
      },

      /**
       * Manipulates the play state of the animation.
       * This can be used to pause an animation when running.
       * @attach {qxWeb}
       * @return {qxWeb} The collection for chaining.
       */
      pause: function pause() {
        for (var i = 0; i < this.length; i++) {
          var handle = this[i].$$animation;

          if (handle) {
            handle.pause();
          }
        }

        return this;
      },

      /**
       * Stops a running animation.
       * @attach {qxWeb}
       * @return {qxWeb} The collection for chaining.
       */
      stop: function stop() {
        for (var i = 0; i < this.length; i++) {
          var handle = this[i].$$animation;

          if (handle) {
            handle.stop();
          }
        }

        return this;
      },

      /**
       * Returns whether an animation is running or not.
       * @attach {qxWeb}
       * @return {Boolean} <code>true</code>, if an animation is running.
       */
      isPlaying: function isPlaying() {
        for (var i = 0; i < this.length; i++) {
          var handle = this[i].$$animation;

          if (handle && handle.isPlaying()) {
            return true;
          }
        }

        return false;
      },

      /**
       * Returns whether an animation has ended or not.
       * @attach {qxWeb}
       * @return {Boolean} <code>true</code>, if an animation has ended.
       */
      isEnded: function isEnded() {
        for (var i = 0; i < this.length; i++) {
          var handle = this[i].$$animation;

          if (handle && !handle.isEnded()) {
            return false;
          }
        }

        return true;
      },

      /**
       * Fades in all elements in the collection.
       * @attach {qxWeb}
       * @param duration {Number?} The duration in milliseconds.
       * @return {qxWeb} The collection for chaining.
       */
      fadeIn: function fadeIn(duration) {
        // remove "display: none" style
        this.setStyle("display", "");
        return this.animate(qx.module.Animation._fadeIn, duration);
      },

      /**
       * Fades out all elements in the collection.
       * @attach {qxWeb}
       * @param duration {Number?} The duration in milliseconds.
       * @return {qxWeb} The collection for chaining.
       */
      fadeOut: function fadeOut(duration) {
        return this.animate(qx.module.Animation._fadeOut, duration);
      }
    },
    defer: function defer(statics) {
      qxWeb.$attachAll(this);
      /**
       * End value for opacity style. This value is modified for all browsers which are
       * 'optimizing' this style value by not setting it (like IE9). This leads to a wrong
       * end state for the 'fadeIn' animation if a opacity value is set by CSS.
       */

      if (qxWeb.env.get("browser.name") === "ie" && qxWeb.env.get("browser.version") <= 9) {
        // has to be fixed using direct access since we cannot store the value as static member.
        // The 'fadeIn' description is evaluated during class definition
        statics._fadeIn.keyFrames[100].opacity = 0.99;
      }
    }
  });
  qx.module.Animation.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.module.Animation": {
        "require": true
      },
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.core.Assert": {},
      "qx.html.Factory": {},
      "qx.core.Id": {},
      "qx.lang.Array": {},
      "qx.html.Element": {},
      "qx.event.Registration": {},
      "qx.data.Array": {},
      "qx.lang.Type": {},
      "qx.lang.Function": {},
      "qx.log.Logger": {},
      "qx.event.Manager": {},
      "qx.core.ObjectRegistry": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "module.objectid": {}
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * John Spackman (https://github.com/johnspackman)
  
  ************************************************************************ */

  /**
   * High-performance, high-level DOM element creation and management.
   *
   * Mirrors the DOM structure of Node (see also Element and Text) so to provide
   * DOM insertion and modification with advanced logic to reduce the real transactions.
   *
   * Each child itself also has got some powerful methods to control its
   * position:
   * {@link #getParent}, {@link #free},
   * {@link #insertInto}, {@link #insertBefore}, {@link #insertAfter},
   * {@link #moveTo}, {@link #moveBefore}, {@link #moveAfter},
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   * @require(qx.module.Animation)
   */
  qx.Class.define("qx.html.Node", {
    extend: qx.core.Object,
    implement: [qx.core.IDisposable],

    /**
     * Creates a new Element
     *
     * @param nodeName {String} name of the node; will be a tag name for Elements, otherwise it's a reserved
     * name eg "#text"
     */
    construct: function construct(nodeName) {
      qx.core.Object.constructor.call(this);
      this._nodeName = nodeName;
    },

    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */
    statics: {
      /**
       * Finds the Widget for a given DOM element
       *
       * @param domElement {DOM} the DOM element
       * @return {qx.ui.core.Widget} the Widget that created the DOM element
       */
      fromDomNode: function fromDomNode(domNode) {
        {
          qx.core.Assert.assertTrue(!domNode.$$element && !domNode.$$elementObject || domNode.$$element === domNode.$$elementObject.toHashCode());
        }
        return domNode.$$elementObject;
      },

      /**
       * Converts a DOM node into a qx.html.Node, providing the existing instance if
       * there is one
       *
       * @param {Node} domNode
       * @returns {qx.html.Node}
       */
      toVirtualNode: function toVirtualNode(domNode) {
        if (domNode.$$elementObject) {
          return domNode.$$elementObject;
        }

        var html = qx.html.Factory.getInstance().createElement(domNode.nodeName, domNode.attributes);
        html.useNode(domNode);
        return html;
      }
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /**
       * Controls whether the element is visible which means that a previously applied
       * CSS style of display=none gets removed and the element will inserted into the DOM,
       * when this had not already happened before.
       *
       * If the element already exists in the DOM then it will kept in DOM, but configured
       * hidden using a CSS style of display=none.
       *
       * Please note: This does not control the visibility or parent inclusion recursively.
       *
       * @type {Boolean} Whether the element should be visible in the render result
       */
      visible: {
        init: true,
        nullable: true,
        check: "Boolean",
        apply: "_applyVisible",
        event: "changeVisible"
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      /*
      ---------------------------------------------------------------------------
        PROTECTED HELPERS/DATA
      ---------------------------------------------------------------------------
      */

      /** @type {String} the name of the node */
      _nodeName: null,

      /** @type {Node} DOM node of this object */
      _domNode: null,

      /** @type {qx.html.Element} parent element */
      _parent: null,

      /** @type {qx.core.Object} the Qooxdoo object this node is attached to */
      _qxObject: null,

      /** @type {Boolean} Whether the element should be included in the render result */
      _included: true,
      _children: null,
      _modifiedChildren: null,
      _propertyJobs: null,
      _properties: null,

      /** @type {Map} map of event handlers */
      __eventValues__P_114_0: null,

      /**
       * Connects a widget to this element, and to the DOM element in this Element.  They
       * remain associated until disposed or disconnectObject is called
       *
       * @param qxObject {qx.core.Object} the object to associate
       */
      connectObject: function connectObject(qxObject) {
        {
          qx.core.Assert.assertTrue(!this._qxObject || this._qxObject === qxObject);
        }
        this._qxObject = qxObject;

        if (this._domNode) {
          {
            qx.core.Assert.assertTrue(!this._domNode.$$qxObjectHash && !this._domNode.$$qxObject || this._domNode.$$qxObject === qxObject && this._domNode.$$qxObjectHash === qxObject.toHashCode());
          }
          this._domNode.$$qxObjectHash = qxObject.toHashCode();
          this._domNode.$$qxObject = qxObject;
        }

        if (qx.core.Environment.get("module.objectid")) {
          this.updateObjectId();
        }
      },

      /**
       * Disconnects a widget from this element and the DOM element.  The DOM element remains
       * untouched, except that it can no longer be used to find the Widget.
       *
       * @param qxObject {qx.core.Object} the Widget
       */
      disconnectObject: function disconnectObject(qxObject) {
        {
          qx.core.Assert.assertTrue(this._qxObject === qxObject);
        }
        delete this._qxObject;

        if (this._domNode) {
          {
            qx.core.Assert.assertTrue(!this._domNode.$$qxObjectHash && !this._domNode.$$qxObject || this._domNode.$$qxObject === qxObject && this._domNode.$$qxObjectHash === qxObject.toHashCode());
          }
          this._domNode.$$qxObjectHash = "";
          delete this._domNode.$$qxObject;
        }

        if (qx.core.Environment.get("module.objectid")) {
          this.updateObjectId();
        }
      },

      /**
       * Internal helper to generate the DOM element
       *
       * @return {Element} DOM element
       */
      _createDomElement: function _createDomElement() {
        throw new Error("No implementation for " + this.classname + "._createDomElement");
      },

      /**
       * Serializes the virtual DOM element to a writer; the `writer` function accepts
       *  an varargs, which can be joined with an empty string or streamed.
       *
       * If writer is null, the element will be serialised to a string which is returned;
       * note that if writer is not null, the return value will be null
       *
       * @param writer {Function?} the writer
       * @return {String?} the serialised version if writer is null
       */
      serialize: function serialize(writer) {
        var temporaryQxObjectId = !this.getQxObjectId();

        if (temporaryQxObjectId) {
          this.setQxObjectId(this.classname);
        }

        var id = qx.core.Id.getAbsoluteIdOf(this, true);
        var isIdRoot = !id;

        if (isIdRoot) {
          qx.core.Id.getInstance().register(this);
        }

        var result = undefined;

        if (writer) {
          this._serializeImpl(writer);
        } else {
          var buffer = [];

          this._serializeImpl(function () {
            var args = qx.lang.Array.fromArguments(arguments);
            qx.lang.Array.append(buffer, args);
          });

          result = buffer.join("");
        }

        if (isIdRoot) {
          qx.core.Id.getInstance().unregister(this);
        }

        if (temporaryQxObjectId) {
          this.setQxObjectId(null);
        }

        return result;
      },

      /**
       * Serializes the virtual DOM element to a writer; the `writer` function accepts
       *  an varargs, which can be joined with an empty string or streamed.
       *
       * @param writer {Function} the writer
       */
      _serializeImpl: function _serializeImpl(writer) {
        throw new Error("No implementation for " + this.classname + ".serializeImpl");
      },

      /**
       * Uses an existing element instead of creating one. This may be interesting
       * when the DOM element is directly needed to add content etc.
       *
       * @param domNode {Node} DOM Node to reuse
       */
      useNode: function useNode(domNode) {
        var id = domNode.getAttribute("data-qx-object-id");

        if (id) {
          this.setQxObjectId(id);
        }

        var temporaryQxObjectId = !this.getQxObjectId();

        if (temporaryQxObjectId) {
          this.setQxObjectId(this.classname);
        }

        var id = qx.core.Id.getAbsoluteIdOf(this, true);
        var isIdRoot = !id;

        if (isIdRoot) {
          qx.core.Id.getInstance().register(this);
        }
        /*
         * When merging children, we want to keep the original DOM nodes in
         * domNode no matter what - however, where the DOM nodes have a qxObjectId
         * we must reuse the original instances.
         *
         * The crucial thing is that the qxObjectId hierarchy and the DOM hierarchy
         * are not the same (although they are often similar, the DOM will often have
         * extra Nodes).
         *
         * However, because the objects in the qxObjectId space will typically already
         * exist (eg accessed via the constructor) we do not want to discard the original
         * instance of qx.html.Element because there are probably references to them in
         * code.
         *
         * In the code below, we map the DOM heirarchy into a temporary Javascript
         * hierarchy, where we can either use existing qx.html.Element instances (found
         * by looking up the qxObjectId) or fabricate new ones.
         *
         * Once the temporary hierarchy is ready, we go back and synchronise each
         * qx.html.Element with the DOM node and our new array of children.
         *
         * The only rule to this is that if you are going to call this `useNode`, then
         * you must not keep references to objects *unless* you also access them via
         * the qxObjectId mechanism.
         */


        var self = this;

        function convert(domNode) {
          var children = qx.lang.Array.fromCollection(domNode.childNodes);
          children = children.map(function (domChild) {
            var child = null;

            if (domChild.nodeType == window.Node.ELEMENT_NODE) {
              var id = domChild.getAttribute("data-qx-object-id");

              if (id) {
                var owningQxObjectId = null;
                var qxObjectId = null;
                var owningQxObject = null;
                var pos = id.lastIndexOf("/");

                if (pos > -1) {
                  owningQxObjectId = id.substring(0, pos);
                  qxObjectId = id.substring(pos + 1);
                  owningQxObject = qx.core.Id.getQxObject(owningQxObjectId);
                  child = owningQxObject.getQxObject(qxObjectId);
                } else {
                  qxObjectId = id;
                  owningQxObject = self;
                  child = self.getQxObject(id);
                }
              }
            }

            if (!child) {
              child = qx.html.Factory.getInstance().createElement(domChild.nodeName, domChild.attributes);
            }

            return {
              htmlNode: child,
              domNode: domChild,
              children: convert(domChild)
            };
          });
          return children;
        }

        function install(map) {
          var htmlChildren = map.children.map(function (mapEntry) {
            install(mapEntry);
            return mapEntry.htmlNode;
          });

          map.htmlNode._useNodeImpl(map.domNode, htmlChildren);
        }

        var rootMap = {
          htmlNode: this,
          domNode: domNode,
          children: convert(domNode)
        };
        install(rootMap);
        this.flush();

        this._insertChildren();

        if (isIdRoot) {
          qx.core.Id.getInstance().unregister(this);
        }

        if (temporaryQxObjectId) {
          this.setQxObjectId(null);
        }
      },

      /**
       * Called internally to complete the connection to an existing DOM node
       *
       * @param domNode {DOMNode} the node we're syncing to
       * @param newChildren {qx.html.Node[]} the new children
       */
      _useNodeImpl: function _useNodeImpl(domNode, newChildren) {
        if (this._domNode) {
          throw new Error("Could not overwrite existing element!");
        } // Use incoming element


        this._connectDomNode(domNode); // Copy currently existing data over to element


        this._copyData(true, true); // Add children


        var lookup = {};
        var oldChildren = this._children ? qx.lang.Array.clone(this._children) : null;
        newChildren.forEach(function (child) {
          lookup[child.toHashCode()] = child;
        });
        this._children = newChildren; // Make sure that unused children are disconnected

        if (oldChildren) {
          oldChildren.forEach(function (child) {
            if (!lookup[child.toHashCode()]) {
              if (child._domNode && child._domNode.parentElement) {
                child._domNode.parentElement.removeChild(child._domNode);
              }

              child._parent = null;
            }
          });
        }

        var self = this;

        this._children.forEach(function (child) {
          child._parent = self;

          if (child._domNode && child._domNode.parentElement !== self._domNode) {
            child._domNode.parentElement.removeChild(child._domNode);

            if (this._domNode) {
              this._domNode.appendChild(child._domNode);
            }
          }
        });

        if (this._domNode) {
          this._scheduleChildrenUpdate();
        }
      },

      /**
       * Connects a DOM element to this Node; if this Node is already connected to a Widget
       * then the Widget is also connected.
       *
       * @param domNode {DOM} the DOM Node to associate
       */
      _connectDomNode: function _connectDomNode(domNode) {
        {
          qx.core.Assert.assertTrue(!this._domNode || this._domNode === domNode);
          qx.core.Assert.assertTrue(domNode.$$elementObject === this && domNode.$$element === this.toHashCode() || !domNode.$$elementObject && !domNode.$$element);
        }
        this._domNode = domNode;
        domNode.$$elementObject = this;
        domNode.$$element = this.toHashCode();

        if (this._qxObject) {
          domNode.$$qxObjectHash = this._qxObject.toHashCode();
          domNode.$$qxObject = this._qxObject;
        }
      },

      /**
       * Detects whether the DOM node has been created and is in the document
       *
       * @return {Boolean}
       */
      isInDocument: function isInDocument() {
        if (document.body) {
          for (var domNode = this._domNode; domNode != null; domNode = domNode.parentElement) {
            if (domNode === document.body) {
              return true;
            }
          }
        }

        return false;
      },

      /**
       * Updates the Object ID on the element to match the QxObjectId
       */
      updateObjectId: function updateObjectId() {
        // Copy Object Id
        if (qx.core.Environment.get("module.objectid")) {
          var id = this.getQxObjectId();

          if (!id && this._qxObject) {
            id = this._qxObject.getQxObjectId();
          }

          this.setAttribute("data-qx-object-id", id, true);
        }
      },
      _cascadeQxObjectIdChanges: function _cascadeQxObjectIdChanges() {
        if (qx.core.Environment.get("module.objectid")) {
          this.updateObjectId();
        }

        qx.html.Node.superclass.prototype._cascadeQxObjectIdChanges.call(this);
      },

      /*
      ---------------------------------------------------------------------------
        FLUSH OBJECT
      ---------------------------------------------------------------------------
      */

      /**
       * Add the element to the global modification list.
       *
       */
      _scheduleChildrenUpdate: function _scheduleChildrenUpdate() {
        if (this._modifiedChildren) {
          return;
        }

        if (this._domNode) {
          this._modifiedChildren = true;
          qx.html.Element._modified[this.toHashCode()] = this;

          qx.html.Element._scheduleFlush("element");
        }
      },

      /**
       * Syncs data of an HtmlElement object to the DOM.
       *
       * This is just a public wrapper around `flush`, because the scope has changed
       *
       * @deprecated {6.0} Please use `.flush()` instead
       */
      _flush: function _flush() {
        this.flush();
      },

      /**
       * Syncs data of an HtmlElement object to the DOM.
       *
       */
      flush: function flush() {
        {
          if (this.DEBUG) {
            this.debug("Flush: " + this.getAttribute("id"));
          }
        }
        var length;
        var children = this._children;

        if (children) {
          length = children.length;
          var child;

          for (var i = 0; i < length; i++) {
            child = children[i];

            if (child.isVisible() && child._included && !child._domNode) {
              child.flush();
            }
          }
        }

        if (!this._domNode) {
          this._connectDomNode(this._createDomElement());

          this._copyData(false, false);

          if (children && length > 0) {
            this._insertChildren();
          }
        } else {
          this._syncData();

          if (this._modifiedChildren) {
            this._syncChildren();
          }
        }

        delete this._modifiedChildren;
      },

      /**
       * Returns this element's root flag
       *
       * @return {Boolean}
       */
      isRoot: function isRoot() {
        throw new Error("No implementation for " + this.classname + ".isRoot");
      },

      /**
       * Detects whether this element is inside a root element
       *
       * @return {Boolean}
       */
      isInRoot: function isInRoot() {
        var tmp = this;

        while (tmp) {
          if (tmp.isRoot()) {
            return true;
          }

          tmp = tmp._parent;
        }

        return false;
      },

      /**
       * Walk up the internal children hierarchy and
       * look if one of the children is marked as root.
       *
       * This method is quite performance hungry as it
       * really walks up recursively.
       * @return {Boolean} <code>true</code> if the element will be seeable
       */
      _willBeSeeable: function _willBeSeeable() {
        if (!qx.html.Element._hasRoots) {
          return false;
        }

        var pa = this; // Any chance to cache this information in the parents?

        while (pa) {
          if (pa.isRoot()) {
            return true;
          }

          if (!pa._included || !pa.isVisible()) {
            return false;
          }

          pa = pa._parent;
        }

        return false;
      },

      /*
      ---------------------------------------------------------------------------
        SUPPORT FOR CHILDREN FLUSH
      ---------------------------------------------------------------------------
      */

      /**
       * Append all child nodes to the DOM
       * element. This function is used when the element is initially
       * created. After this initial apply {@link #_syncChildren} is used
       * instead.
       *
       */
      _insertChildren: function _insertChildren() {
        var children = this._children;

        if (!children) {
          return;
        }

        var length = children.length;
        var child;

        if (length > 2) {
          var domElement = document.createDocumentFragment();

          for (var i = 0; i < length; i++) {
            child = children[i];

            if (child._domNode && child._included) {
              domElement.appendChild(child._domNode);
            }
          }

          this._domNode.appendChild(domElement);
        } else {
          var domElement = this._domNode;

          for (var i = 0; i < length; i++) {
            child = children[i];

            if (child._domNode && child._included) {
              domElement.appendChild(child._domNode);
            }
          }
        }
      },

      /**
       * Synchronize internal children hierarchy to the DOM. This is used
       * for further runtime updates after the element has been created
       * initially.
       *
       */
      _syncChildren: function _syncChildren() {
        var dataChildren = this._children || [];
        var dataLength = dataChildren.length;
        var dataChild;
        var dataEl;
        var domParent = this._domNode;
        var domChildren = domParent.childNodes;
        var domPos = 0;
        var domEl;
        {
          var domOperations = 0;
        } // Remove children from DOM which are excluded or remove first

        for (var i = domChildren.length - 1; i >= 0; i--) {
          domEl = domChildren[i];
          dataEl = qx.html.Node.fromDomNode(domEl);

          if (!dataEl || !dataEl._included || dataEl._parent !== this) {
            domParent.removeChild(domEl);
            {
              domOperations++;
            }
          }
        } // Start from beginning and bring DOM in sync
        // with the data structure


        for (var i = 0; i < dataLength; i++) {
          dataChild = dataChildren[i]; // Only process visible childs

          if (dataChild._included) {
            dataEl = dataChild._domNode;
            domEl = domChildren[domPos];

            if (!dataEl) {
              continue;
            } // Only do something when out of sync
            // If the data element is not there it may mean that it is still
            // marked as visible=false


            if (dataEl != domEl) {
              if (domEl) {
                domParent.insertBefore(dataEl, domEl);
              } else {
                domParent.appendChild(dataEl);
              }

              {
                domOperations++;
              }
            } // Increase counter


            domPos++;
          }
        } // User feedback


        {
          if (qx.html.Element.DEBUG) {
            this.debug("Synced DOM with " + domOperations + " operations");
          }
        }
      },

      /**
       * Copies data between the internal representation and the DOM. This
       * simply copies all the data and only works well directly after
       * element creation. After this the data must be synced using {@link #_syncData}
       *
       * @param fromMarkup {Boolean} Whether the copy should respect styles
       *   given from markup
       * @param propertiesFromDom {Boolean} whether the copy should respect the property
       *  values in the dom
       */
      _copyData: function _copyData(fromMarkup, propertiesFromDom) {
        var elem = this._domNode; // Attach events

        var data = this.__eventValues__P_114_0;

        if (data) {
          // Import listeners
          var domEvents = {};
          var manager = qx.event.Registration.getManager(elem);

          for (var id in data) {
            if (manager.findHandler(elem, data[id].type)) {
              domEvents[id] = data[id];
            }
          }

          qx.event.Registration.getManager(elem).importListeners(elem, domEvents); // Cleanup event map
          // Events are directly attached through event manager
          // after initial creation. This differs from the
          // handling of styles and attributes where queuing happens
          // through the complete runtime of the application.

          delete this.__eventValues__P_114_0;
        } // Copy properties


        if (this._properties) {
          for (var key in this._properties) {
            var prop = this._properties[key];

            if (propertiesFromDom) {
              if (prop.get) {
                prop.value = prop.get.call(this, key);
              }
            } else if (prop.value !== undefined) {
              prop.set.call(this, prop.value, key);
            }
          }
        }
      },

      /**
       * Synchronizes data between the internal representation and the DOM. This
       * is the counterpart of {@link #_copyData} and is used for further updates
       * after the element has been created.
       *
       */
      _syncData: function _syncData() {
        // Sync misc
        var jobs = this._propertyJobs;

        if (jobs && this._properties) {
          for (var key in jobs) {
            var prop = this._properties[key];

            if (prop.value !== undefined) {
              prop.set.call(this, prop.value, key);
            }
          }

          this._propertyJobs = null;
        }
      },

      /*
      ---------------------------------------------------------------------------
        PRIVATE HELPERS/DATA
      ---------------------------------------------------------------------------
      */

      /**
       * Internal helper for all children addition needs
       *
       * @param child {var} the element to add
       * @throws {Error} if the given element is already a child
       *     of this element
       */
      _addChildImpl: function _addChildImpl(child) {
        if (child._parent === this) {
          throw new Error("Child is already in: " + child);
        }

        if (child.__root__P_114_1) {
          throw new Error("Root elements could not be inserted into other ones.");
        } // Remove from previous parent


        if (child._parent) {
          child._parent.remove(child);
        } // Convert to child of this object


        child._parent = this; // Prepare array

        if (!this._children) {
          this._children = [];
        } // Schedule children update


        if (this._domNode) {
          this._scheduleChildrenUpdate();
        }
      },

      /**
       * Internal helper for all children removal needs
       *
       * @param child {qx.html.Element} the removed element
       * @throws {Error} if the given element is not a child
       *     of this element
       */
      _removeChildImpl: function _removeChildImpl(child) {
        if (child._parent !== this) {
          throw new Error("Has no child: " + child);
        } // Schedule children update


        if (this._domNode) {
          this._scheduleChildrenUpdate();
        } // Remove reference to old parent


        delete child._parent;
      },

      /**
       * Internal helper for all children move needs
       *
       * @param child {qx.html.Element} the moved element
       * @throws {Error} if the given element is not a child
       *     of this element
       */
      _moveChildImpl: function _moveChildImpl(child) {
        if (child._parent !== this) {
          throw new Error("Has no child: " + child);
        } // Schedule children update


        if (this._domNode) {
          this._scheduleChildrenUpdate();
        }
      },

      /*
      ---------------------------------------------------------------------------
        CHILDREN MANAGEMENT (EXECUTED ON THE PARENT)
      ---------------------------------------------------------------------------
      */

      /**
       * Returns a copy of the internal children structure.
       *
       * Please do not modify the array in place. If you need
       * to work with the data in such a way make yourself
       * a copy of the data first.
       *
       * @return {Array} the children list
       */
      getChildren: function getChildren() {
        return this._children || null;
      },

      /**
       * Get a child element at the given index
       *
       * @param index {Integer} child index
       * @return {qx.html.Element|null} The child element or <code>null</code> if
       *     no child is found at that index.
       */
      getChild: function getChild(index) {
        var children = this._children;
        return children && children[index] || null;
      },

      /**
       * Returns whether the element has any child nodes
       *
       * @return {Boolean} Whether the element has any child nodes
       */
      hasChildren: function hasChildren() {
        var children = this._children;
        return children && children[0] !== undefined;
      },

      /**
       * Find the position of the given child
       *
       * @param child {qx.html.Element} the child
       * @return {Integer} returns the position. If the element
       *     is not a child <code>-1</code> will be returned.
       */
      indexOf: function indexOf(child) {
        var children = this._children;
        return children ? children.indexOf(child) : -1;
      },

      /**
       * Whether the given element is a child of this element.
       *
       * @param child {qx.html.Element} the child
       * @return {Boolean} Returns <code>true</code> when the given
       *    element is a child of this element.
       */
      hasChild: function hasChild(child) {
        var children = this._children;
        return children && children.indexOf(child) !== -1;
      },

      /**
       * Append all given children at the end of this element.
       *
       * @param varargs {qx.html.Element} elements to insert
       * @return {qx.html.Element} this object (for chaining support)
       */
      add: function add(varargs) {
        var self = this;

        function addImpl(arr) {
          arr.forEach(function (child) {
            if (child instanceof qx.data.Array || qx.lang.Type.isArray(child)) {
              addImpl(child);
            } else {
              self._addChildImpl(child);

              self._children.push(child);
            }
          });
        }

        addImpl(qx.lang.Array.fromArguments(arguments)); // Chaining support

        return this;
      },

      /**
       * Inserts a new element into this element at the given position.
       *
       * @param child {qx.html.Element} the element to insert
       * @param index {Integer} the index (starts at 0 for the
       *     first child) to insert (the index of the following
       *     children will be increased by one)
       * @return {qx.html.Element} this object (for chaining support)
       */
      addAt: function addAt(child, index) {
        this._addChildImpl(child);

        qx.lang.Array.insertAt(this._children, child, index); // Chaining support

        return this;
      },

      /**
       * Removes all given children
       *
       * @param childs {qx.html.Element} children to remove
       * @return {qx.html.Element} this object (for chaining support)
       */
      remove: function remove(childs) {
        var children = this._children;

        if (!children) {
          return this;
        }

        var self = this;

        function removeImpl(arr) {
          arr.forEach(function (child) {
            if (child instanceof qx.data.Array || qx.lang.Type.isArray(child)) {
              removeImpl(child);
            } else {
              self._removeChildImpl(child);

              qx.lang.Array.remove(children, child);
            }
          });
        }

        removeImpl(qx.lang.Array.fromArguments(arguments)); // Chaining support

        return this;
      },

      /**
       * Removes the child at the given index
       *
       * @param index {Integer} the position of the
       *     child (starts at 0 for the first child)
       * @return {qx.html.Element} this object (for chaining support)
       */
      removeAt: function removeAt(index) {
        var children = this._children;

        if (!children) {
          throw new Error("Has no children!");
        }

        var child = children[index];

        if (!child) {
          throw new Error("Has no child at this position!");
        }

        this._removeChildImpl(child);

        qx.lang.Array.removeAt(this._children, index); // Chaining support

        return this;
      },

      /**
       * Remove all children from this element.
       *
       * @return {qx.html.Element} A reference to this.
       */
      removeAll: function removeAll() {
        var children = this._children;

        if (children) {
          for (var i = 0, l = children.length; i < l; i++) {
            this._removeChildImpl(children[i]);
          } // Clear array


          children.length = 0;
        } // Chaining support


        return this;
      },

      /*
      ---------------------------------------------------------------------------
        CHILDREN MANAGEMENT (EXECUTED ON THE CHILD)
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the parent of this element.
       *
       * @return {qx.html.Element|null} The parent of this element
       */
      getParent: function getParent() {
        return this._parent || null;
      },

      /**
       * Insert self into the given parent. Normally appends self to the end,
       * but optionally a position can be defined. With index <code>0</code> it
       * will be inserted at the begin.
       *
       * @param parent {qx.html.Element} The new parent of this element
       * @param index {Integer?null} Optional position
       * @return {qx.html.Element} this object (for chaining support)
       */
      insertInto: function insertInto(parent, index) {
        parent._addChildImpl(this);

        if (index == null) {
          parent._children.push(this);
        } else {
          qx.lang.Array.insertAt(this._children, this, index);
        }

        return this;
      },

      /**
       * Insert self before the given (related) element
       *
       * @param rel {qx.html.Element} the related element
       * @return {qx.html.Element} this object (for chaining support)
       */
      insertBefore: function insertBefore(rel) {
        var parent = rel._parent;

        parent._addChildImpl(this);

        qx.lang.Array.insertBefore(parent._children, this, rel);
        return this;
      },

      /**
       * Insert self after the given (related) element
       *
       * @param rel {qx.html.Element} the related element
       * @return {qx.html.Element} this object (for chaining support)
       */
      insertAfter: function insertAfter(rel) {
        var parent = rel._parent;

        parent._addChildImpl(this);

        qx.lang.Array.insertAfter(parent._children, this, rel);
        return this;
      },

      /**
       * Move self to the given index in the current parent.
       *
       * @param index {Integer} the index (starts at 0 for the first child)
       * @return {qx.html.Element} this object (for chaining support)
       * @throws {Error} when the given element is not child
       *      of this element.
       */
      moveTo: function moveTo(index) {
        var parent = this._parent;

        parent._moveChildImpl(this);

        var oldIndex = parent._children.indexOf(this);

        if (oldIndex === index) {
          throw new Error("Could not move to same index!");
        } else if (oldIndex < index) {
          index--;
        }

        qx.lang.Array.removeAt(parent._children, oldIndex);
        qx.lang.Array.insertAt(parent._children, this, index);
        return this;
      },

      /**
       * Move self before the given (related) child.
       *
       * @param rel {qx.html.Element} the related child
       * @return {qx.html.Element} this object (for chaining support)
       */
      moveBefore: function moveBefore(rel) {
        var parent = this._parent;
        return this.moveTo(parent._children.indexOf(rel));
      },

      /**
       * Move self after the given (related) child.
       *
       * @param rel {qx.html.Element} the related child
       * @return {qx.html.Element} this object (for chaining support)
       */
      moveAfter: function moveAfter(rel) {
        var parent = this._parent;
        return this.moveTo(parent._children.indexOf(rel) + 1);
      },

      /**
       * Remove self from the current parent.
       *
       * @return {qx.html.Element} this object (for chaining support)
       */
      free: function free() {
        var parent = this._parent;

        if (!parent) {
          throw new Error("Has no parent to remove from.");
        }

        if (!parent._children) {
          return this;
        }

        parent._removeChildImpl(this);

        qx.lang.Array.remove(parent._children, this);
        return this;
      },

      /*
      ---------------------------------------------------------------------------
        DOM ELEMENT ACCESS
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the DOM element (if created). Please use this with caution.
       * It is better to make all changes to the object itself using the public
       * API rather than to the underlying DOM element.
       *
       * @param create {Boolean?} if true, the DOM node will be created if it does
       * not exist
       * @return {Element|null} The DOM element node, if available.
       */
      getDomElement: function getDomElement(create) {
        if (create && !this._domNode) {
          this.flush();
        }

        return this._domNode || null;
      },

      /**
       * Returns the nodeName of the DOM element.
       *
       * @return {String} The node name
       */
      getNodeName: function getNodeName() {
        return this._nodeName;
      },

      /**
       * Sets the nodeName of the DOM element.
       *
       * @param name {String} The node name
       */
      setNodeName: function setNodeName(name) {
        if (this._domNode && name.toLowerCase() !== this._nodeName.toLowerCase()) {
          throw new Error("Cannot change the name of the node after the DOM node has been created");
        }

        this._nodeName = name;
      },

      /*
      ---------------------------------------------------------------------------
        EXCLUDE SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Marks the element as included which means it will be moved into
       * the DOM again and synced with the internal data representation.
       *
       * @return {Node} this object (for chaining support)
       */
      include: function include() {
        if (this._included) {
          return this;
        }

        delete this._included;

        if (this._parent) {
          this._parent._scheduleChildrenUpdate();
        }

        return this;
      },

      /**
       * Marks the element as excluded which means it will be removed
       * from the DOM and ignored for updates until it gets included again.
       *
       * @return {qx.html.Element} this object (for chaining support)
       */
      exclude: function exclude() {
        if (!this._included) {
          return this;
        }

        this._included = false;

        if (this._parent) {
          this._parent._scheduleChildrenUpdate();
        }

        return this;
      },

      /**
       * Whether the element is part of the DOM
       *
       * @return {Boolean} Whether the element is part of the DOM.
       */
      isIncluded: function isIncluded() {
        return this._included === true;
      },

      /**
       * Apply method for visible property
       */
      _applyVisible: function _applyVisible(value) {// Nothing - to be overridden
      },

      /*
      ---------------------------------------------------------------------------
        PROPERTY SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Registers a property and the implementations used to read the property value
       * from the DOM and to set the property value onto the DOM.  This allows the element
       * to have a simple `setProperty` method that knows how to read and write the value.
       *
       * You do not have to specify a getter or a setter - by default the setter will use
       * `_applyProperty` for backwards compatibility, and there is no getter implementation.
       *
       * The functions are called with `this` set to this Element.  The getter takes
       * the property name as a parameter and is expected to return a value, the setter takes
       * the property name and value as parameters, and returns nothing.
       *
       * @param key {String} the property name
       * @param getter {Function?} function to read from the DOM
       * @param setter {Function?} function to copy to the DOM
       * @param serialize {Function?} function to serialize the value to HTML
       */
      registerProperty: function registerProperty(key, get, set, serialize) {
        if (!this._properties) {
          this._properties = {};
        }

        if (this._properties[key]) {
          this.debug("Overridding property " + key + " in " + this + "[" + this.classname + "]");
        }

        if (!set) {
          set = qx.lang.Function.bind(function (value, key) {
            this._applyProperty(key, value);
          }, this);
          qx.log.Logger.deprecatedMethodWarning(this._applyProperty, "The method '_applyProperty' is deprecated.  Please use `registerProperty` instead (property '" + key + "' in " + this.classname + ")");
        }

        this._properties[key] = {
          get: get,
          set: set,
          serialize: serialize,
          value: undefined
        };
      },

      /**
       * Applies a special property with the given value.
       *
       * This property apply routine can be easily overwritten and
       * extended by sub classes to add new low level features which
       * are not easily possible using styles and attributes.
       *
       * Note that this implementation is for backwards compatibility and
       * implementations
       *
       * @param name {String} Unique property identifier
       * @param value {var} Any valid value (depends on the property)
       * @return {qx.html.Element} this object (for chaining support)
       * @abstract
       * @deprecated {6.0} please use `registerProperty` instead
       */
      _applyProperty: function _applyProperty(name, value) {// empty implementation
      },

      /**
       * Set up the given property.
       *
       * @param key {String} the name of the property
       * @param value {var} the value
       * @param direct {Boolean?false} Whether the value should be applied
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      _setProperty: function _setProperty(key, value, direct) {
        if (!this._properties || !this._properties[key]) {
          this.registerProperty(key, null, null);
        }

        if (this._properties[key].value == value) {
          return this;
        }

        this._properties[key].value = value; // Uncreated elements simply copy all data
        // on creation. We don't need to remember any
        // jobs. It is a simple full list copy.

        if (this._domNode) {
          // Omit queuing in direct mode
          if (direct) {
            this._properties[key].set.call(this, value, key);

            return this;
          } // Dynamically create if needed


          if (!this._propertyJobs) {
            this._propertyJobs = {};
          } // Store job info


          this._propertyJobs[key] = true; // Register modification

          qx.html.Element._modified[this.toHashCode()] = this;

          qx.html.Element._scheduleFlush("element");
        }

        return this;
      },

      /**
       * Removes the given misc
       *
       * @param key {String} the name of the misc
       * @param direct {Boolean?false} Whether the value should be removed
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      _removeProperty: function _removeProperty(key, direct) {
        return this._setProperty(key, null, direct);
      },

      /**
       * Get the value of the given misc.
       *
       * @param key {String} name of the misc
       * @param direct {Boolean?false} Whether the value should be obtained directly (without queuing)
       * @return {var} the value of the misc
       */
      _getProperty: function _getProperty(key, direct) {
        if (!this._properties || !this._properties[key]) {
          return null;
        }

        var value = this._properties[key].value;

        if (this._domNode) {
          if (direct || value === undefined) {
            var fn = this._properties[key].get;

            if (fn) {
              this._properties[key].value = value = fn.call(this, key);
            }
          }
        }

        return value === undefined || value == null ? null : value;
      },

      /*
      ---------------------------------------------------------------------------
        EVENT SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Adds an event listener to the element.
       *
       * @param type {String} Name of the event
       * @param listener {Function} Function to execute on event
       * @param self {Object ? null} Reference to the 'this' variable inside
       *         the event listener. When not given, the corresponding dispatcher
       *         usually falls back to a default, which is the target
       *         by convention. Note this is not a strict requirement, i.e.
       *         custom dispatchers can follow a different strategy.
       * @param capture {Boolean ? false} Whether capturing should be enabled
       * @return {var} An opaque id, which can be used to remove the event listener
       *         using the {@link #removeListenerById} method.
       */
      addListener: function addListener(type, listener, self, capture) {
        var _this = this;

        if (this.$$disposed) {
          return null;
        }

        {
          var msg = "Failed to add event listener for type '" + type + "'" + " to the target '" + this + "': ";
          this.assertString(type, msg + "Invalid event type.");
          this.assertFunction(listener, msg + "Invalid callback function");

          if (self !== undefined) {
            this.assertObject(self, "Invalid context for callback.");
          }

          if (capture !== undefined) {
            this.assertBoolean(capture, "Invalid capture flag.");
          }
        }

        var registerDomEvent = function registerDomEvent() {
          if (_this._domNode) {
            return qx.event.Registration.addListener(_this._domNode, type, listener, self, capture);
          }

          if (!_this.__eventValues__P_114_0) {
            _this.__eventValues__P_114_0 = {};
          }

          if (capture == null) {
            capture = false;
          }

          var unique = qx.event.Manager.getNextUniqueId();
          var id = type + (capture ? "|capture|" : "|bubble|") + unique;
          _this.__eventValues__P_114_0[id] = {
            type: type,
            listener: listener,
            self: self,
            capture: capture,
            unique: unique
          };
          return id;
        };

        if (qx.Class.supportsEvent(this, type)) {
          var id = qx.html.Node.superclass.prototype.addListener.call(this, type, listener, self, capture);
          id.domEventId = registerDomEvent();
          return id;
        }

        return registerDomEvent();
      },

      /**
       * Removes an event listener from the element.
       *
       * @param type {String} Name of the event
       * @param listener {Function} Function to execute on event
       * @param self {Object} Execution context of given function
       * @param capture {Boolean ? false} Whether capturing should be enabled
       * @return {qx.html.Element} this object (for chaining support)
       */
      removeListener: function removeListener(type, listener, self, capture) {
        if (this.$$disposed) {
          return null;
        }

        {
          var msg = "Failed to remove event listener for type '" + type + "'" + " from the target '" + this + "': ";
          this.assertString(type, msg + "Invalid event type.");
          this.assertFunction(listener, msg + "Invalid callback function");

          if (self !== undefined) {
            this.assertObject(self, "Invalid context for callback.");
          }

          if (capture !== undefined) {
            this.assertBoolean(capture, "Invalid capture flag.");
          }
        }

        if (qx.Class.supportsEvent(this, type)) {
          qx.html.Node.superclass.prototype.removeListener.call(this, type, listener, self, capture);
        }

        if (this._domNode) {
          if (listener.$$wrapped_callback && listener.$$wrapped_callback[type + this.toHashCode()]) {
            var callback = listener.$$wrapped_callback[type + this.toHashCode()];
            delete listener.$$wrapped_callback[type + this.toHashCode()];
            listener = callback;
          }

          qx.event.Registration.removeListener(this._domNode, type, listener, self, capture);
        } else {
          var values = this.__eventValues__P_114_0;
          var entry;

          if (capture == null) {
            capture = false;
          }

          for (var key in values) {
            entry = values[key]; // Optimized for performance: Testing references first

            if (entry.listener === listener && entry.self === self && entry.capture === capture && entry.type === type) {
              delete values[key];
              break;
            }
          }
        }

        return this;
      },

      /**
       * Removes an event listener from an event target by an id returned by
       * {@link #addListener}
       *
       * @param id {var} The id returned by {@link #addListener}
       * @return {qx.html.Element} this object (for chaining support)
       */
      removeListenerById: function removeListenerById(id) {
        if (this.$$disposed) {
          return null;
        }

        if (id.domEventId) {
          if (this._domNode) {
            qx.event.Registration.removeListenerById(this._domNode, id.domEventId);
          }

          delete id.domEventId;
          qx.html.Node.superclass.prototype.removeListenerById.call(this, id);
        } else {
          if (this._domNode) {
            qx.event.Registration.removeListenerById(this._domNode, id);
          } else {
            delete this.__eventValues__P_114_0[id];
          }
        }

        return this;
      },

      /**
       * Check if there are one or more listeners for an event type.
       *
       * @param type {String} name of the event type
       * @param capture {Boolean ? false} Whether to check for listeners of
       *         the bubbling or of the capturing phase.
       * @return {Boolean} Whether the object has a listener of the given type.
       */
      hasListener: function hasListener(type, capture) {
        if (this.$$disposed) {
          return false;
        }

        if (qx.Class.supportsEvent(this, type)) {
          var has = qx.html.Node.superclass.prototype.hasListener.call(this, type, capture);

          if (has) {
            return true;
          }
        }

        if (this._domNode) {
          if (qx.event.Registration.hasListener(this._domNode, type, capture)) {
            return true;
          }
        } else {
          var values = this.__eventValues__P_114_0;
          var entry;

          if (capture == null) {
            capture = false;
          }

          for (var key in values) {
            entry = values[key]; // Optimized for performance: Testing fast types first

            if (entry.capture === capture && entry.type === type) {
              return true;
            }
          }
        }

        return false;
      },

      /**
       * Serializes and returns all event listeners attached to this element
       * @return {Map[]} an Array containing a map for each listener. The maps
       * have the following keys:
       * <ul>
       *   <li><code>type</code> (String): Event name</li>
       *   <li><code>handler</code> (Function): Callback function</li>
       *   <li><code>self</code> (Object): The callback's context</li>
       *   <li><code>capture</code> (Boolean): If <code>true</code>, the listener is
       * attached to the capturing phase</li>
       * </ul>
       */
      getListeners: function getListeners() {
        if (this.$$disposed) {
          return null;
        }

        var listeners = [];
        qx.lang.Array.append(listeners, qx.event.Registration.serializeListeners(this) || []);

        if (this._domNode) {
          qx.lang.Array.append(listeners, qx.event.Registration.serializeListeners(this._domNode) || []);
        }

        for (var id in this.__eventValues__P_114_0) {
          var listenerData = this.__eventValues__P_114_0[id];
          listeners.push({
            type: listenerData.type,
            handler: listenerData.listener,
            self: listenerData.self,
            capture: listenerData.capture
          });
        }

        return listeners;
      }
    },

    /*
    *****************************************************************************
       DESTRUCT
    *****************************************************************************
    */
    destruct: function destruct() {
      var el = this._domNode;

      if (el) {
        qx.event.Registration.getManager(el).removeAllListeners(el);
        el.$$element = "";
        delete el.$$elementObject;
        el.$$qxObjectHash = "";
        delete el.$$qxObject;
      }

      if (!qx.core.ObjectRegistry.inShutDown) {
        var parent = this._parent;

        if (parent && !parent.$$disposed) {
          parent.remove(this);
        }
      }

      this._disposeArray("_children");

      this._properties = this._propertyJobs = this._domNode = this._parent = this.__eventValues__P_114_0 = null;
    }
  });
  qx.html.Node.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.bom.Style": {
        "require": true,
        "defer": "runtime"
      },
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Browser": {}
    },
    "environment": {
      "provided": ["css.textoverflow", "css.placeholder", "css.borderradius", "css.boxshadow", "css.gradient.linear", "css.gradient.radial", "css.gradient.legacywebkit", "css.boxmodel", "css.rgba", "css.borderimage", "css.borderimage.standardsyntax", "css.usermodify", "css.userselect", "css.userselect.none", "css.appearance", "css.float", "css.boxsizing", "css.inlineblock", "css.opacity", "css.textShadow", "css.alphaimageloaderneeded", "css.pointerevents", "css.flexboxSyntax"],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * The purpose of this class is to contain all checks about css.
   *
   * This class is used by {@link qx.core.Environment} and should not be used
   * directly. Please check its class comment for details how to use it.
   *
   * @internal
   * @ignore(WebKitCSSMatrix)
   * @require(qx.bom.Style)
   */
  qx.Bootstrap.define("qx.bom.client.Css", {
    statics: {
      __WEBKIT_LEGACY_GRADIENT__P_56_0: null,

      /**
       * Checks what box model is used in the current environment.
       * @return {String} It either returns "content" or "border".
       * @internal
       */
      getBoxModel: function getBoxModel() {
        var content = qx.bom.client.Engine.getName() !== "mshtml" || !qx.bom.client.Browser.getQuirksMode();
        return content ? "content" : "border";
      },

      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>textOverflow</code> style property.
       *
       * @return {String|null} textOverflow property name or <code>null</code> if
       * textOverflow is not supported.
       * @internal
       */
      getTextOverflow: function getTextOverflow() {
        return qx.bom.Style.getPropertyName("textOverflow");
      },

      /**
       * Checks if a placeholder could be used.
       * @return {Boolean} <code>true</code>, if it could be used.
       * @internal
       */
      getPlaceholder: function getPlaceholder() {
        if (qx.core.Environment.get("engine.name") === "mshtml") {
          return false;
        }

        var i = document.createElement("input");
        return "placeholder" in i;
      },

      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>appearance</code> style property.
       *
       * @return {String|null} appearance property name or <code>null</code> if
       * appearance is not supported.
       * @internal
       */
      getAppearance: function getAppearance() {
        return qx.bom.Style.getPropertyName("appearance");
      },

      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>borderRadius</code> style property.
       *
       * @return {String|null} borderRadius property name or <code>null</code> if
       * borderRadius is not supported.
       * @internal
       */
      getBorderRadius: function getBorderRadius() {
        return qx.bom.Style.getPropertyName("borderRadius");
      },

      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>boxShadow</code> style property.
       *
       * @return {String|null} boxShadow property name or <code>null</code> if
       * boxShadow is not supported.
       * @internal
       */
      getBoxShadow: function getBoxShadow() {
        return qx.bom.Style.getPropertyName("boxShadow");
      },

      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>borderImage</code> style property.
       *
       * @return {String|null} borderImage property name or <code>null</code> if
       * borderImage is not supported.
       * @internal
       */
      getBorderImage: function getBorderImage() {
        return qx.bom.Style.getPropertyName("borderImage");
      },

      /**
       * Returns the type of syntax this client supports for its CSS border-image
       * implementation. Some browsers do not support the "fill" keyword defined
       * in the W3C draft (http://www.w3.org/TR/css3-background/) and will not
       * show the border image if it's set. Others follow the standard closely and
       * will omit the center image if "fill" is not set.
       *
       * @return {Boolean|null} <code>true</code> if the standard syntax is supported.
       * <code>null</code> if the supported syntax could not be detected.
       * @internal
       */
      getBorderImageSyntax: function getBorderImageSyntax() {
        var styleName = qx.bom.client.Css.getBorderImage();

        if (!styleName) {
          return null;
        }

        var el = document.createElement("div");

        if (styleName === "borderImage") {
          // unprefixed implementation: check individual properties
          el.style[styleName] = 'url("foo.png") 4 4 4 4 fill stretch';

          if (el.style.borderImageSource.indexOf("foo.png") >= 0 && el.style.borderImageSlice.indexOf("4 fill") >= 0 && el.style.borderImageRepeat.indexOf("stretch") >= 0) {
            return true;
          }
        } else {
          // prefixed implementation, assume no support for "fill"
          el.style[styleName] = 'url("foo.png") 4 4 4 4 stretch'; // serialized value is unreliable, so just a simple check

          if (el.style[styleName].indexOf("foo.png") >= 0) {
            return false;
          }
        } // unable to determine syntax


        return null;
      },

      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>userSelect</code> style property.
       *
       * @return {String|null} userSelect property name or <code>null</code> if
       * userSelect is not supported.
       * @internal
       */
      getUserSelect: function getUserSelect() {
        return qx.bom.Style.getPropertyName("userSelect");
      },

      /**
       * Returns the (possibly vendor-prefixed) value for the
       * <code>userSelect</code> style property that disables selection. For Gecko,
       * "-moz-none" is returned since "none" only makes the target element appear
       * as if its text could not be selected
       *
       * @internal
       * @return {String|null} the userSelect property value that disables
       * selection or <code>null</code> if userSelect is not supported
       */
      getUserSelectNone: function getUserSelectNone() {
        var styleProperty = qx.bom.client.Css.getUserSelect();

        if (styleProperty) {
          var el = document.createElement("span");
          el.style[styleProperty] = "-moz-none";
          return el.style[styleProperty] === "-moz-none" ? "-moz-none" : "none";
        }

        return null;
      },

      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>userModify</code> style property.
       *
       * @return {String|null} userModify property name or <code>null</code> if
       * userModify is not supported.
       * @internal
       */
      getUserModify: function getUserModify() {
        return qx.bom.Style.getPropertyName("userModify");
      },

      /**
       * Returns the vendor-specific name of the <code>float</code> style property
       *
       * @return {String|null} <code>cssFloat</code> for standards-compliant
       * browsers, <code>styleFloat</code> for legacy IEs, <code>null</code> if
       * the client supports neither property.
       * @internal
       */
      getFloat: function getFloat() {
        var style = document.documentElement.style;
        return style.cssFloat !== undefined ? "cssFloat" : style.styleFloat !== undefined ? "styleFloat" : null;
      },

      /**
       * Returns the (possibly vendor-prefixed) name this client uses for
       * <code>linear-gradient</code>.
       * http://dev.w3.org/csswg/css3-images/#linear-gradients
       *
       * @return {String|null} Prefixed linear-gradient name or <code>null</code>
       * if linear gradients are not supported
       * @internal
       */
      getLinearGradient: function getLinearGradient() {
        qx.bom.client.Css.__WEBKIT_LEGACY_GRADIENT__P_56_0 = false;
        var value = "linear-gradient(0deg, #fff, #000)";
        var el = document.createElement("div");
        var style = qx.bom.Style.getAppliedStyle(el, "backgroundImage", value);

        if (!style) {
          //try old WebKit syntax (versions 528 - 534.16)
          value = "-webkit-gradient(linear,0% 0%,100% 100%,from(white), to(red))";
          var style = qx.bom.Style.getAppliedStyle(el, "backgroundImage", value, false);

          if (style) {
            qx.bom.client.Css.__WEBKIT_LEGACY_GRADIENT__P_56_0 = true;
          }
        } // not supported


        if (!style) {
          return null;
        }

        var match = /(.*?)\(/.exec(style);
        return match ? match[1] : null;
      },

      /**
       * Returns the (possibly vendor-prefixed) name this client uses for
       * <code>radial-gradient</code>.
       *
       * @return {String|null} Prefixed radial-gradient name or <code>null</code>
       * if radial gradients are not supported
       * @internal
       */
      getRadialGradient: function getRadialGradient() {
        var value = "radial-gradient(0px 0px, cover, red 50%, blue 100%)";
        var el = document.createElement("div");
        var style = qx.bom.Style.getAppliedStyle(el, "backgroundImage", value);

        if (!style) {
          return null;
        }

        var match = /(.*?)\(/.exec(style);
        return match ? match[1] : null;
      },

      /**
       * Checks if **only** the old WebKit (version < 534.16) syntax for
       * linear gradients is supported, e.g.
       * <code>linear-gradient(0deg, #fff, #000)</code>
       *
       * @return {Boolean} <code>true</code> if the legacy syntax must be used
       * @internal
       */
      getLegacyWebkitGradient: function getLegacyWebkitGradient() {
        if (qx.bom.client.Css.__WEBKIT_LEGACY_GRADIENT__P_56_0 === null) {
          qx.bom.client.Css.getLinearGradient();
        }

        return qx.bom.client.Css.__WEBKIT_LEGACY_GRADIENT__P_56_0;
      },

      /**
       * Checks if rgba colors can be used:
       * http://www.w3.org/TR/2010/PR-css3-color-20101028/#rgba-color
       *
       * @return {Boolean} <code>true</code>, if rgba colors are supported.
       * @internal
       */
      getRgba: function getRgba() {
        var el;

        try {
          el = document.createElement("div");
        } catch (ex) {
          el = document.createElement();
        } // try catch for IE


        try {
          el.style["color"] = "rgba(1, 2, 3, 0.5)";

          if (el.style["color"].indexOf("rgba") != -1) {
            return true;
          }
        } catch (ex) {}

        return false;
      },

      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>boxSizing</code> style property.
       *
       * @return {String|null} boxSizing property name or <code>null</code> if
       * boxSizing is not supported.
       * @internal
       */
      getBoxSizing: function getBoxSizing() {
        return qx.bom.Style.getPropertyName("boxSizing");
      },

      /**
       * Returns the browser-specific name used for the <code>display</code> style
       * property's <code>inline-block</code> value.
       *
       * @internal
       * @return {String|null}
       */
      getInlineBlock: function getInlineBlock() {
        var el = document.createElement("span");
        el.style.display = "inline-block";

        if (el.style.display == "inline-block") {
          return "inline-block";
        }

        el.style.display = "-moz-inline-box";

        if (el.style.display !== "-moz-inline-box") {
          return "-moz-inline-box";
        }

        return null;
      },

      /**
       * Checks if CSS opacity is supported
       *
       * @internal
       * @return {Boolean} <code>true</code> if opacity is supported
       */
      getOpacity: function getOpacity() {
        return typeof document.documentElement.style.opacity == "string";
      },

      /**
       * Checks if CSS texShadow is supported
       *
       * @internal
       * @return {Boolean} <code>true</code> if textShadow is supported
       */
      getTextShadow: function getTextShadow() {
        return !!qx.bom.Style.getPropertyName("textShadow");
      },

      /**
       * Checks if the Alpha Image Loader must be used to display transparent PNGs.
       *
       * @return {Boolean} <code>true</code> if the Alpha Image Loader is required
       */
      getAlphaImageLoaderNeeded: function getAlphaImageLoaderNeeded() {
        return qx.bom.client.Engine.getName() == "mshtml" && qx.bom.client.Browser.getDocumentMode() < 9;
      },

      /**
       * Checks if pointer events are available.
       *
       * @internal
       * @return {Boolean} <code>true</code> if pointer events are supported.
       */
      getPointerEvents: function getPointerEvents() {
        var el = document.documentElement; // Check if browser reports that pointerEvents is a known style property

        if ("pointerEvents" in el.style) {
          // The property is defined in Opera and IE9 but setting it has no effect
          var initial = el.style.pointerEvents;
          el.style.pointerEvents = "auto"; // don't assume support if a nonsensical value isn't ignored

          el.style.pointerEvents = "foo";
          var supported = el.style.pointerEvents == "auto";
          el.style.pointerEvents = initial;
          return supported;
        }

        return false;
      },

      /**
       * Returns which Flexbox syntax is supported by the browser.
       * <code>display: box;</code> old 2009 version of Flexbox.
       * <code>display: flexbox;</code> tweener phase in 2011.
       * <code>display: flex;</code> current specification.
       * @internal
       * @return {String} <code>flex</code>,<code>flexbox</code>,<code>box</code> or <code>null</code>
       */
      getFlexboxSyntax: function getFlexboxSyntax() {
        var detectedSyntax = null;
        var detector = document.createElement("detect");
        var flexSyntax = [{
          value: "flex",
          syntax: "flex"
        }, {
          value: "-ms-flexbox",
          syntax: "flexbox"
        }, {
          value: "-webkit-flex",
          syntax: "flex"
        }];

        for (var i = 0; i < flexSyntax.length; i++) {
          // old IEs will throw an "Invalid argument" exception here
          try {
            detector.style.display = flexSyntax[i].value;
          } catch (ex) {
            return null;
          }

          if (detector.style.display === flexSyntax[i].value) {
            detectedSyntax = flexSyntax[i].syntax;
            break;
          }
        }

        detector = null;
        return detectedSyntax;
      }
    },
    defer: function defer(statics) {
      qx.core.Environment.add("css.textoverflow", statics.getTextOverflow);
      qx.core.Environment.add("css.placeholder", statics.getPlaceholder);
      qx.core.Environment.add("css.borderradius", statics.getBorderRadius);
      qx.core.Environment.add("css.boxshadow", statics.getBoxShadow);
      qx.core.Environment.add("css.gradient.linear", statics.getLinearGradient);
      qx.core.Environment.add("css.gradient.radial", statics.getRadialGradient);
      qx.core.Environment.add("css.gradient.legacywebkit", statics.getLegacyWebkitGradient);
      qx.core.Environment.add("css.boxmodel", statics.getBoxModel);
      qx.core.Environment.add("css.rgba", statics.getRgba);
      qx.core.Environment.add("css.borderimage", statics.getBorderImage);
      qx.core.Environment.add("css.borderimage.standardsyntax", statics.getBorderImageSyntax);
      qx.core.Environment.add("css.usermodify", statics.getUserModify);
      qx.core.Environment.add("css.userselect", statics.getUserSelect);
      qx.core.Environment.add("css.userselect.none", statics.getUserSelectNone);
      qx.core.Environment.add("css.appearance", statics.getAppearance);
      qx.core.Environment.add("css.float", statics.getFloat);
      qx.core.Environment.add("css.boxsizing", statics.getBoxSizing);
      qx.core.Environment.add("css.inlineblock", statics.getInlineBlock);
      qx.core.Environment.add("css.opacity", statics.getOpacity);
      qx.core.Environment.add("css.textShadow", statics.getTextShadow);
      qx.core.Environment.add("css.alphaimageloaderneeded", statics.getAlphaImageLoaderNeeded);
      qx.core.Environment.add("css.pointerevents", statics.getPointerEvents);
      qx.core.Environment.add("css.flexboxSyntax", statics.getFlexboxSyntax);
    }
  });
  qx.bom.client.Css.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.module.Animation": {
        "require": true,
        "defer": "runtime"
      },
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.html.Node": {
        "construct": true,
        "require": true
      },
      "qx.log.Logger": {},
      "qx.bom.Element": {},
      "qx.dom.Hierarchy": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.element.Scroll": {},
      "qx.bom.Selection": {},
      "qx.event.handler.Appear": {},
      "qx.event.Registration": {},
      "qx.event.handler.Focus": {},
      "qx.event.dispatch.MouseCapture": {},
      "qx.dom.Element": {},
      "qx.bom.element.Attribute": {},
      "qx.lang.Object": {},
      "qx.bom.element.Style": {},
      "qx.lang.Array": {},
      "qx.core.Id": {},
      "qx.bom.client.Css": {
        "require": true
      },
      "qx.html.Text": {},
      "qx.bom.element.Location": {},
      "qx.bom.element.Dimension": {},
      "qx.util.DeferredCall": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine"
        },
        "css.userselect": {
          "className": "qx.bom.client.Css"
        },
        "css.userselect.none": {
          "className": "qx.bom.client.Css"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * High-performance, high-level DOM element creation and management.
   *
   * Includes support for HTML and style attributes. Elements also have
   * got a powerful children and visibility management.
   *
   * Processes DOM insertion and modification with advanced logic
   * to reduce the real transactions.
   *
   * From the view of the parent you can use the following children management
   * methods:
   * {@link #getChildren}, {@link #indexOf}, {@link #hasChild}, {@link #add},
   * {@link #addAt}, {@link #remove}, {@link #removeAt}, {@link #removeAll}
   *
   * Each child itself also has got some powerful methods to control its
   * position:
   * {@link #getParent}, {@link #free},
   * {@link #insertInto}, {@link #insertBefore}, {@link #insertAfter},
   * {@link #moveTo}, {@link #moveBefore}, {@link #moveAfter},
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   * @require(qx.module.Animation)
   */
  qx.Class.define("qx.html.Element", {
    extend: qx.html.Node,

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * Creates a new Element
     *
     * @param tagName {String?"div"} Tag name of the element to create
     * @param styles {Map?null} optional map of CSS styles, where the key is the name
     *    of the style and the value is the value to use.
     * @param attributes {Map?null} optional map of element attributes, where the
     *    key is the name of the attribute and the value is the value to use.
     */
    construct: function construct(tagName, styles, attributes) {
      qx.html.Node.constructor.call(this, tagName || "div");
      this.__styleValues__P_74_0 = styles || null;
      this.__attribValues__P_74_1 = attributes || null;

      if (attributes) {
        for (var key in attributes) {
          if (!key) {
            throw new Error("Invalid unnamed attribute in " + this.classname);
          }
        }
      }

      this.initCssClass();
      this.registerProperty("innerHtml", null, function (value) {
        if (this._domNode) {
          this._domNode.innerHTML = value;
        }
      }, function (writer, property, name) {
        if (property.value) {
          writer(property.value);
        }
      });
    },

    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */
    statics: {
      /*
      ---------------------------------------------------------------------------
        STATIC DATA
      ---------------------------------------------------------------------------
      */

      /** @type {Boolean} If debugging should be enabled */
      DEBUG: false,

      /** @type {Integer} number of roots */
      _hasRoots: 0,

      /** @type {Element} the default root to use */
      _defaultRoot: null,

      /** @type {Map} Contains the modified {@link qx.html.Element}s. The key is the hash code. */
      _modified: {},

      /** @type {Map} Contains the {@link qx.html.Element}s which should get hidden or visible at the next flush. The key is the hash code. */
      _visibility: {},

      /** @type {Map} Contains the {@link qx.html.Element}s which should scrolled at the next flush */
      _scroll: {},

      /** @type {Array} List of post actions for elements. The key is the action name. The value the {@link qx.html.Element}. */
      _actions: [],

      /**  @type {Map} List of all selections. */
      __selection__P_74_2: {},
      __focusHandler__P_74_3: null,
      __mouseCapture__P_74_4: null,
      __SELF_CLOSING_TAGS__P_74_5: null,

      /*
      ---------------------------------------------------------------------------
        PUBLIC ELEMENT FLUSH
      ---------------------------------------------------------------------------
      */

      /**
       * Schedule a deferred element queue flush. If the widget subsystem is used
       * this method gets overwritten by {@link qx.ui.core.queue.Manager}.
       *
       * @param job {String} The job descriptor. Should always be <code>"element"</code>.
       */
      _scheduleFlush: function _scheduleFlush(job) {
        qx.html.Element.__deferredCall__P_74_6.schedule();
      },

      /**
       * Flush the global modified list
       */
      flush: function flush() {
        var obj;
        {
          if (this.DEBUG) {
            qx.log.Logger.debug(this, "Flushing elements...");
          }
        }
        {
          // blur elements, which will be removed
          var focusHandler = this.__getFocusHandler__P_74_7();

          var focusedDomElement = focusHandler.getFocus();

          if (focusedDomElement && this.__willBecomeInvisible__P_74_8(focusedDomElement)) {
            focusHandler.blur(focusedDomElement);
          } // deactivate elements, which will be removed


          var activeDomElement = focusHandler.getActive();

          if (activeDomElement && this.__willBecomeInvisible__P_74_8(activeDomElement)) {
            qx.bom.Element.deactivate(activeDomElement);
          } // release capture for elements, which will be removed


          var captureDomElement = this.__getCaptureElement__P_74_9();

          if (captureDomElement && this.__willBecomeInvisible__P_74_8(captureDomElement)) {
            qx.bom.Element.releaseCapture(captureDomElement);
          }
        }
        var later = [];
        var modified = qx.html.Element._modified;

        for (var hc in modified) {
          obj = modified[hc]; // Ignore all hidden elements except iframes
          // but keep them until they get visible (again)

          if (obj._willBeSeeable() || obj.classname == "qx.html.Iframe") {
            // Separately queue rendered elements
            if (obj._domNode && qx.dom.Hierarchy.isRendered(obj._domNode)) {
              later.push(obj);
            } // Flush invisible elements first
            else {
              {
                if (this.DEBUG) {
                  obj.debug("Flush invisible element");
                }
              }
              obj.flush();
            } // Cleanup modification list


            delete modified[hc];
          }
        }

        for (var i = 0, l = later.length; i < l; i++) {
          obj = later[i];
          {
            if (this.DEBUG) {
              obj.debug("Flush rendered element");
            }
          }
          obj.flush();
        } // Process visibility list


        var visibility = this._visibility;

        for (var hc in visibility) {
          obj = visibility[hc];
          var element = obj._domNode;

          if (!element) {
            delete visibility[hc];
            continue;
          }

          {
            if (this.DEBUG) {
              qx.log.Logger.debug(this, "Switching visibility to: " + obj.isVisible());
            }
          } // hiding or showing an object and deleting it right after that may
          // cause an disposed object in the visibility queue [BUG #3607]

          if (!obj.$$disposed) {
            element.style.display = obj.isVisible() ? "" : "none"; // also hide the element (fixed some rendering problem in IE<8 & IE8 quirks)

            if (qx.core.Environment.get("engine.name") == "mshtml") {
              if (!(document.documentMode >= 8)) {
                element.style.visibility = obj.isVisible() ? "visible" : "hidden";
              }
            }
          }

          delete visibility[hc];
        }

        {
          // Process scroll list
          var scroll = this._scroll;

          for (var hc in scroll) {
            obj = scroll[hc];
            var elem = obj._domNode;

            if (elem && elem.offsetWidth) {
              var done = true; // ScrollToX

              if (obj.__lazyScrollX__P_74_10 != null) {
                obj._domNode.scrollLeft = obj.__lazyScrollX__P_74_10;
                delete obj.__lazyScrollX__P_74_10;
              } // ScrollToY


              if (obj.__lazyScrollY__P_74_11 != null) {
                obj._domNode.scrollTop = obj.__lazyScrollY__P_74_11;
                delete obj.__lazyScrollY__P_74_11;
              } // ScrollIntoViewX


              var intoViewX = obj.__lazyScrollIntoViewX__P_74_12;

              if (intoViewX != null) {
                var child = intoViewX.element.getDomElement();

                if (child && child.offsetWidth) {
                  qx.bom.element.Scroll.intoViewX(child, elem, intoViewX.align);
                  delete obj.__lazyScrollIntoViewX__P_74_12;
                } else {
                  done = false;
                }
              } // ScrollIntoViewY


              var intoViewY = obj.__lazyScrollIntoViewY__P_74_13;

              if (intoViewY != null) {
                var child = intoViewY.element.getDomElement();

                if (child && child.offsetWidth) {
                  qx.bom.element.Scroll.intoViewY(child, elem, intoViewY.align);
                  delete obj.__lazyScrollIntoViewY__P_74_13;
                } else {
                  done = false;
                }
              } // Clear flag if all things are done
              // Otherwise wait for the next flush


              if (done) {
                delete scroll[hc];
              }
            }
          }

          var activityEndActions = {
            releaseCapture: 1,
            blur: 1,
            deactivate: 1
          }; // Process action list

          for (var i = 0; i < this._actions.length; i++) {
            var action = this._actions[i];
            var element = action.element._domNode;

            if (!element || !activityEndActions[action.type] && !action.element._willBeSeeable()) {
              continue;
            }

            var args = action.args;
            args.unshift(element);
            qx.bom.Element[action.type].apply(qx.bom.Element, args);
          }

          this._actions = [];
        } // Process selection

        for (var hc in this.__selection__P_74_2) {
          var selection = this.__selection__P_74_2[hc];
          var elem = selection.element._domNode;

          if (elem) {
            qx.bom.Selection.set(elem, selection.start, selection.end);
            delete this.__selection__P_74_2[hc];
          }
        } // Fire appear/disappear events


        qx.event.handler.Appear.refresh();
      },

      /**
       * Get the focus handler
       *
       * @return {qx.event.handler.Focus} The focus handler
       */
      __getFocusHandler__P_74_7: function __getFocusHandler__P_74_7() {
        {
          if (!this.__focusHandler__P_74_3) {
            var eventManager = qx.event.Registration.getManager(window);
            this.__focusHandler__P_74_3 = eventManager.getHandler(qx.event.handler.Focus);
          }

          return this.__focusHandler__P_74_3;
        }
      },

      /**
       * Get the mouse capture element
       *
       * @return {Element} The mouse capture DOM element
       */
      __getCaptureElement__P_74_9: function __getCaptureElement__P_74_9() {
        {
          if (!this.__mouseCapture__P_74_4) {
            var eventManager = qx.event.Registration.getManager(window);
            this.__mouseCapture__P_74_4 = eventManager.getDispatcher(qx.event.dispatch.MouseCapture);
          }

          return this.__mouseCapture__P_74_4.getCaptureElement();
        }
      },

      /**
       * Whether the given DOM element will become invisible after the flush
       *
       * @param domElement {Element} The DOM element to check
       * @return {Boolean} Whether the element will become invisible
       */
      __willBecomeInvisible__P_74_8: function __willBecomeInvisible__P_74_8(domElement) {
        var element = this.fromDomElement(domElement);
        return element && !element._willBeSeeable();
      },

      /**
       * Finds the Widget for a given DOM element
       *
       * @param domElement {DOM} the DOM element
       * @return {qx.ui.core.Widget} the Widget that created the DOM element
       * @deprecated {6.1} see qx.html.Node.fromDomNode
       */
      fromDomElement: function fromDomElement(domElement) {
        return qx.html.Node.fromDomNode(domElement);
      },

      /**
       * Sets the default Root element
       *
       * @param root {Element} the new default root
       */
      setDefaultRoot: function setDefaultRoot(root) {
        {
          if (this._defaultRoot && root) {
            qx.log.Logger.warn(qx.html.Element, "Changing default root, from " + this._defaultRoot + " to " + root);
          }
        }
        this._defaultRoot = root;
      },

      /**
       * Returns the default root
       *
       * @return {Element} the default root
       */
      getDefaultRoot: function getDefaultRoot() {
        return this._defaultRoot;
      }
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /**
       * @type{String} The primary CSS class for this element
       *
       * The implementation will add and remove this class from the list of classes,
       * this property is provided as a means to easily set the primary class.  Because
       * SCSS supports inheritance, it's more useful to be able to allow the SCSS
       * definition to control the inheritance hierarchy of classes.
       *
       * For example, a dialog could be implemented in code as a Dialog class derived from
       * a Window class, but the presentation may be so different that the theme author
       * would choose to not use inheritance at all.
       */
      cssClass: {
        init: null,
        nullable: true,
        check: "String",
        apply: "_applyCssClass"
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      /*
      ---------------------------------------------------------------------------
        PROTECTED HELPERS/DATA
      ---------------------------------------------------------------------------
      */

      /** @type {Boolean} Marker for always visible root nodes (often the body node) */
      __root__P_74_14: false,
      __lazyScrollIntoViewX__P_74_12: null,
      __lazyScrollIntoViewY__P_74_13: null,
      __lazyScrollX__P_74_10: null,
      __lazyScrollY__P_74_11: null,
      __styleJobs__P_74_15: null,
      __attribJobs__P_74_16: null,
      __styleValues__P_74_0: null,
      __attribValues__P_74_1: null,

      /*
       * @Override
       */
      _createDomElement: function _createDomElement() {
        return qx.dom.Element.create(this._nodeName);
      },

      /*
       * @Override
       */
      serialize: function serialize(writer) {
        if (this.__childrenHaveChanged__P_74_17) {
          this.importQxObjectIds();
          this.__childrenHaveChanged__P_74_17 = false;
        }

        return qx.html.Element.superclass.prototype.serialize.call(this, writer);
      },

      /*
       * @Override
       */
      _serializeImpl: function _serializeImpl(writer) {
        writer("<", this._nodeName); // Copy attributes

        var data = this.__attribValues__P_74_1;

        if (data) {
          var Attribute = qx.bom.element.Attribute;

          for (var key in data) {
            writer(" ");
            Attribute.serialize(writer, key, data[key]);
          }
        } // Copy styles


        var data = this.__styleValues__P_74_0 || {};

        if (!this.isVisible()) {
          data = qx.lang.Object.clone(data);
          data.display = "none";
        }

        if (Object.keys(data).length) {
          var Style = qx.bom.element.Style;
          var css = Style.compile(data);

          if (css) {
            writer(' style="', css, '"');
          }
        } // Copy properties


        var data = this._properties;

        if (data) {
          for (var key in this._properties) {
            var property = this._properties[key];

            if (property.serialize) {
              writer(" ");
              property.serialize.call(this, writer, key, property);
            } else if (property.value !== undefined && property.value !== null) {
              writer(" ");
              var value = JSON.stringify(property.value);
              writer(key, "=", value);
            }
          }
        } // Children


        if (!this._children || !this._children.length) {
          if (qx.html.Element.__SELF_CLOSING_TAGS__P_74_5[this._nodeName]) {
            writer(">");
          } else {
            writer("></", this._nodeName, ">");
          }
        } else {
          writer(">");

          for (var i = 0; i < this._children.length; i++) {
            this._children[i]._serializeImpl(writer);
          }

          writer("</", this._nodeName, ">");
        }
      },

      /**
       * Connects a widget to this element, and to the DOM element in this Element.  They
       * remain associated until disposed or disconnectWidget is called
       *
       * @param widget {qx.ui.core.Widget} the widget to associate
       * @deprecated {6.1} see connectObject
       */
      connectWidget: function connectWidget(widget) {
        return this.connectObject(widget);
      },

      /**
       * Disconnects a widget from this element and the DOM element.  The DOM element remains
       * untouched, except that it can no longer be used to find the Widget.
       *
       * @param qxObject {qx.core.Object} the Widget
       * @deprecated {6.1} see disconnectObject
       */
      disconnectWidget: function disconnectWidget(widget) {
        return this.disconnectObject(widget);
      },

      /*
       * @Override
       */
      _addChildImpl: function _addChildImpl(child) {
        qx.html.Element.superclass.prototype._addChildImpl.call(this, child);

        this.__childrenHaveChanged__P_74_17 = true;
      },

      /*
       * @Override
       */
      _removeChildImpl: function _removeChildImpl(child) {
        qx.html.Element.superclass.prototype._removeChildImpl.call(this, child);

        this.__childrenHaveChanged__P_74_17 = true;
      },

      /*
       * @Override
       */
      getQxObject: function getQxObject(id) {
        if (this.__childrenHaveChanged__P_74_17) {
          this.importQxObjectIds();
          this.__childrenHaveChanged__P_74_17 = false;
        }

        return qx.html.Element.superclass.prototype.getQxObject.call(this, id);
      },

      /**
       * When a tree of virtual dom is loaded via JSX code, the paths in the `data-qx-object-id`
       * attribute are relative to the JSX, and these attribuite values need to be loaded into the
       * `qxObjectId` property - while resolving the parent parts of the path.
       *
       * EG
       *  <div data-qx-object-id="root">
       *    <div>
       *      <div data-qx-object-id="root/child">
       *
       * The root DIV has to take on the qxObjectId of "root", and the third DIV has to have the
       * ID "child" and be owned by the first DIV.
       *
       * This function imports and resolves those IDs
       */
      importQxObjectIds: function importQxObjectIds() {
        var _this = this;

        var thisId = this.getQxObjectId();
        var thisAttributeId = this.getAttribute("data-qx-object-id");

        if (thisId) {
          this.setAttribute("data-qx-object-id", thisId, true);
        } else if (thisAttributeId) {
          this.setQxObjectId(thisAttributeId);
        }

        var resolveImpl = function resolveImpl(node) {
          if (!(node instanceof qx.html.Element)) {
            return;
          }

          var id = node.getQxObjectId();
          var attributeId = node.getAttribute("data-qx-object-id");

          if (id) {
            if (attributeId && !attributeId.endsWith(id)) {
              _this.warn("Attribute ID ".concat(attributeId, " is not compatible with the qxObjectId ").concat(id, "; the qxObjectId will take prescedence"));
            }

            node.setAttribute("data-qx-object-id", id, true);
          } else if (attributeId) {
            var segs = attributeId ? attributeId.split("/") : []; // Only one segment is easy, add directly to the parent

            if (segs.length == 1) {
              var parentNode = _this;
              parentNode.addOwnedQxObject(node, attributeId); // Lots of segments
            } else if (segs.length > 1) {
              var _parentNode = null; // If the first segment is the outer parent

              if (segs[0] == thisAttributeId || segs[0] == thisId) {
                // Only two segments, means that the parent is the outer and the last segment
                //  is the ID of the node being examined
                if (segs.length == 2) {
                  _parentNode = _this; // Otherwise resolve it further
                } else {
                  // Extract the segments, exclude the first and last, and that leaves us with a relative ID path
                  var subId = qx.lang.Array.clone(segs);
                  subId.shift();
                  subId.pop();
                  subId = subId.join("/");
                  _parentNode = _this.getQxObject(subId);
                } // Not the outer node, then resolve as a global.

              } else {
                _parentNode = qx.core.Id.getQxObject(attributeId);
              }

              if (!_parentNode) {
                throw new Error("Cannot resolve object id ancestors, id=".concat(attributeId));
              }

              _parentNode.addOwnedQxObject(node, segs[segs.length - 1]);
            }
          }

          var children = node.getChildren();

          if (children) {
            children.forEach(resolveImpl);
          }
        };

        var children = this.getChildren();

        if (children) {
          children.forEach(resolveImpl);
        }
      },

      /*
      ---------------------------------------------------------------------------
        SUPPORT FOR ATTRIBUTE/STYLE/EVENT FLUSH
      ---------------------------------------------------------------------------
      */

      /**
       * Copies data between the internal representation and the DOM. This
       * simply copies all the data and only works well directly after
       * element creation. After this the data must be synced using {@link #_syncData}
       *
       * @param fromMarkup {Boolean} Whether the copy should respect styles
       *   given from markup
       */
      _copyData: function _copyData(fromMarkup, propertiesFromDom) {
        qx.html.Element.superclass.prototype._copyData.call(this, fromMarkup, propertiesFromDom);

        var elem = this._domNode; // Copy attributes

        var data = this.__attribValues__P_74_1;

        if (data) {
          var Attribute = qx.bom.element.Attribute;

          if (fromMarkup) {
            var str;
            var classes = {};
            str = this.getAttribute("class");
            (str ? str.split(" ") : []).forEach(function (name) {
              if (name.startsWith("qx-")) {
                classes[name] = true;
              }
            });
            str = Attribute.get(elem, "class");
            {
              if (str instanceof window.SVGAnimatedString) {
                str = str.baseVal;
              }
            }
            (str ? str.split(" ") : []).forEach(function (name) {
              return classes[name] = true;
            });
            classes = Object.keys(classes);
            var segs = classes;

            if (segs.length) {
              this.setCssClass(segs[0]);
              this.setAttribute("class", classes.join(" "));
            } else {
              this.setCssClass(null);
              this.setAttribute("class", null);
            }
          }

          for (var key in data) {
            Attribute.set(elem, key, data[key]);
          }
        } // Copy styles


        var data = this.__styleValues__P_74_0;

        if (data) {
          var Style = qx.bom.element.Style;

          if (fromMarkup) {
            Style.setStyles(elem, data);
          } else {
            // Set styles at once which is a lot faster in most browsers
            // compared to separate modifications of many single style properties.
            Style.setCss(elem, Style.compile(data));
          }
        } // Copy visibility


        if (!fromMarkup) {
          var display = elem.style.display || "";

          if (display == "" && !this.isVisible()) {
            elem.style.display = "none";
          } else if (display == "none" && this.isVisible()) {
            elem.style.display = "";
          }
        } else {
          var display = elem.style.display || "";
          this.setVisible(display != "none");
        }
      },

      /**
       * Synchronizes data between the internal representation and the DOM. This
       * is the counterpart of {@link #_copyData} and is used for further updates
       * after the element has been created.
       *
       */
      _syncData: function _syncData() {
        qx.html.Element.superclass.prototype._syncData.call(this);

        var elem = this._domNode;
        var Attribute = qx.bom.element.Attribute;
        var Style = qx.bom.element.Style; // Sync attributes

        var jobs = this.__attribJobs__P_74_16;

        if (jobs) {
          var data = this.__attribValues__P_74_1;

          if (data) {
            var value;

            for (var key in jobs) {
              value = data[key];

              if (value !== undefined) {
                Attribute.set(elem, key, value);
              } else {
                Attribute.reset(elem, key);
              }
            }
          }

          this.__attribJobs__P_74_16 = null;
        } // Sync styles


        var jobs = this.__styleJobs__P_74_15;

        if (jobs) {
          var data = this.__styleValues__P_74_0;

          if (data) {
            var styles = {};

            for (var key in jobs) {
              styles[key] = data[key];
            }

            Style.setStyles(elem, styles);
          }

          this.__styleJobs__P_74_15 = null;
        }
      },

      /*
      ---------------------------------------------------------------------------
        DOM ELEMENT ACCESS
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the element's root flag, which indicates
       * whether the element should be a root element or not.
       * @param root {Boolean} The root flag.
       */
      setRoot: function setRoot(root) {
        if (root && !this.__root__P_74_14) {
          qx.html.Element._hasRoots++;
        } else if (!root && this.__root__P_74_14) {
          qx.html.Element._hasRoots--;
        }

        this.__root__P_74_14 = root;
      },

      /*
       * @Override
       */
      isRoot: function isRoot() {
        return this.__root__P_74_14;
      },

      /**
       * Uses existing markup for this element. This is mainly used
       * to insert pre-built markup blocks into the element hierarchy.
       *
       * @param html {String} HTML markup with one root element
       *   which is used as the main element for this instance.
       * @return {Element} The created DOM element
       */
      useMarkup: function useMarkup(html) {
        if (this._domNode) {
          throw new Error("Could not overwrite existing element!");
        } // Prepare extraction
        // We have a IE specific issue with "Unknown error" messages
        // when we try to use the same DOM node again. I am not sure
        // why this happens. Would be a good performance improvement,
        // but does not seem to work.


        if (qx.core.Environment.get("engine.name") == "mshtml") {
          var helper = document.createElement("div");
        } else {
          var helper = qx.dom.Element.getHelperElement();
        } // Extract first element


        helper.innerHTML = html;
        this.useElement(helper.firstChild);
        return this._domNode;
      },

      /**
       * Uses an existing element instead of creating one. This may be interesting
       * when the DOM element is directly needed to add content etc.
       *
       * @param elem {Element} Element to reuse
       * @deprecated {6.1} see useNode
       */
      useElement: function useElement(elem) {
        this.useNode(elem);
      },

      /**
       * Whether the element is focusable (or will be when created)
       *
       * @return {Boolean} <code>true</code> when the element is focusable.
       */
      isFocusable: function isFocusable() {
        var tabIndex = this.getAttribute("tabIndex");

        if (tabIndex >= 1) {
          return true;
        }

        var focusable = qx.event.handler.Focus.FOCUSABLE_ELEMENTS;

        if (tabIndex >= 0 && focusable[this._nodeName]) {
          return true;
        }

        return false;
      },

      /**
       * Set whether the element is selectable. It uses the qooxdoo attribute
       * qxSelectable with the values 'on' or 'off'.
       * In webkit, a special css property will be used (-webkit-user-select).
       *
       * @param value {Boolean} True, if the element should be selectable.
       */
      setSelectable: function setSelectable(value) {
        this.setAttribute("qxSelectable", value ? "on" : "off");
        var userSelect = qx.core.Environment.get("css.userselect");

        if (userSelect) {
          this.setStyle(userSelect, value ? "text" : qx.core.Environment.get("css.userselect.none"));
        }
      },

      /**
       * Whether the element is natively focusable (or will be when created)
       *
       * This ignores the configured tabIndex.
       *
       * @return {Boolean} <code>true</code> when the element is focusable.
       */
      isNativelyFocusable: function isNativelyFocusable() {
        return !!qx.event.handler.Focus.FOCUSABLE_ELEMENTS[this._nodeName];
      },

      /*
      ---------------------------------------------------------------------------
        ANIMATION SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Fades in the element.
       * @param duration {Number} Time in ms.
       * @return {qx.bom.element.AnimationHandle} The animation handle to react for
       *   the fade animation.
       */
      fadeIn: function fadeIn(duration) {
        var col = qxWeb(this._domNode);

        if (col.isPlaying()) {
          col.stop();
        } // create the element right away


        if (!this._domNode) {
          this.flush();
          col.push(this._domNode);
        }

        if (this._domNode) {
          col.fadeIn(duration).once("animationEnd", function () {
            this.show();
            qx.html.Element.flush();
          }, this);
          return col.getAnimationHandles()[0];
        }
      },

      /**
       * Fades out the element.
       * @param duration {Number} Time in ms.
       * @return {qx.bom.element.AnimationHandle} The animation handle to react for
       *   the fade animation.
       */
      fadeOut: function fadeOut(duration) {
        var col = qxWeb(this._domNode);

        if (col.isPlaying()) {
          col.stop();
        }

        if (this._domNode) {
          col.fadeOut(duration).once("animationEnd", function () {
            this.hide();
            qx.html.Element.flush();
          }, this);
          return col.getAnimationHandles()[0];
        }
      },

      /*
      ---------------------------------------------------------------------------
        VISIBILITY SUPPORT
      ---------------------------------------------------------------------------
      */

      /*
       * @Override
       */
      _applyVisible: function _applyVisible(value, oldValue) {
        qx.html.Element.superclass.prototype._applyVisible.call(this, value, oldValue);

        if (value) {
          if (this._domNode) {
            qx.html.Element._visibility[this.toHashCode()] = this;

            qx.html.Element._scheduleFlush("element");
          } // Must be sure that the element gets included into the DOM.


          if (this._parent) {
            this._parent._scheduleChildrenUpdate();
          }
        } else {
          if (this._domNode) {
            qx.html.Element._visibility[this.toHashCode()] = this;

            qx.html.Element._scheduleFlush("element");
          }
        }
      },

      /**
       * Marks the element as visible which means that a previously applied
       * CSS style of display=none gets removed and the element will inserted
       * into the DOM, when this had not already happened before.
       *
       * @return {qx.html.Element} this object (for chaining support)
       */
      show: function show() {
        this.setVisible(true);
        return this;
      },

      /**
       * Marks the element as hidden which means it will kept in DOM (if it
       * is already there, but configured hidden using a CSS style of display=none).
       *
       * @return {qx.html.Element} this object (for chaining support)
       */
      hide: function hide() {
        this.setVisible(false);
        return this;
      },

      /*
      ---------------------------------------------------------------------------
        SCROLL SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Scrolls the given child element into view. Only scrolls children.
       * Do not influence elements on top of this element.
       *
       * If the element is currently invisible it gets scrolled automatically
       * at the next time it is visible again (queued).
       *
       * @param elem {qx.html.Element} The element to scroll into the viewport.
       * @param align {String?null} Alignment of the element. Allowed values:
       *   <code>left</code> or <code>right</code>. Could also be null.
       *   Without a given alignment the method tries to scroll the widget
       *   with the minimum effort needed.
       * @param direct {Boolean?true} Whether the execution should be made
       *   directly when possible
       */
      scrollChildIntoViewX: function scrollChildIntoViewX(elem, align, direct) {
        var thisEl = this._domNode;
        var childEl = elem.getDomElement();

        if (direct !== false && thisEl && thisEl.offsetWidth && childEl && childEl.offsetWidth) {
          qx.bom.element.Scroll.intoViewX(childEl, thisEl, align);
        } else {
          this.__lazyScrollIntoViewX__P_74_12 = {
            element: elem,
            align: align
          };
          qx.html.Element._scroll[this.toHashCode()] = this;

          qx.html.Element._scheduleFlush("element");
        }

        delete this.__lazyScrollX__P_74_10;
      },

      /**
       * Scrolls the given child element into view. Only scrolls children.
       * Do not influence elements on top of this element.
       *
       * If the element is currently invisible it gets scrolled automatically
       * at the next time it is visible again (queued).
       *
       * @param elem {qx.html.Element} The element to scroll into the viewport.
       * @param align {String?null} Alignment of the element. Allowed values:
       *   <code>top</code> or <code>bottom</code>. Could also be null.
       *   Without a given alignment the method tries to scroll the widget
       *   with the minimum effort needed.
       * @param direct {Boolean?true} Whether the execution should be made
       *   directly when possible
       */
      scrollChildIntoViewY: function scrollChildIntoViewY(elem, align, direct) {
        var thisEl = this._domNode;
        var childEl = elem.getDomElement();

        if (direct !== false && thisEl && thisEl.offsetWidth && childEl && childEl.offsetWidth) {
          qx.bom.element.Scroll.intoViewY(childEl, thisEl, align);
        } else {
          this.__lazyScrollIntoViewY__P_74_13 = {
            element: elem,
            align: align
          };
          qx.html.Element._scroll[this.toHashCode()] = this;

          qx.html.Element._scheduleFlush("element");
        }

        delete this.__lazyScrollY__P_74_11;
      },

      /**
       * Scrolls the element to the given left position.
       *
       * @param x {Integer} Horizontal scroll position
       * @param lazy {Boolean?false} Whether the scrolling should be performed
       *    during element flush.
       */
      scrollToX: function scrollToX(x, lazy) {
        var thisEl = this._domNode;

        if (lazy !== true && thisEl && thisEl.offsetWidth) {
          thisEl.scrollLeft = x;
          delete this.__lazyScrollX__P_74_10;
        } else {
          this.__lazyScrollX__P_74_10 = x;
          qx.html.Element._scroll[this.toHashCode()] = this;

          qx.html.Element._scheduleFlush("element");
        }

        delete this.__lazyScrollIntoViewX__P_74_12;
      },

      /**
       * Get the horizontal scroll position.
       *
       * @return {Integer} Horizontal scroll position
       */
      getScrollX: function getScrollX() {
        var thisEl = this._domNode;

        if (thisEl) {
          return thisEl.scrollLeft;
        }

        return this.__lazyScrollX__P_74_10 || 0;
      },

      /**
       * Scrolls the element to the given top position.
       *
       * @param y {Integer} Vertical scroll position
       * @param lazy {Boolean?false} Whether the scrolling should be performed
       *    during element flush.
       */
      scrollToY: function scrollToY(y, lazy) {
        var thisEl = this._domNode;

        if (lazy !== true && thisEl && thisEl.offsetWidth) {
          thisEl.scrollTop = y;
          delete this.__lazyScrollY__P_74_11;
        } else {
          this.__lazyScrollY__P_74_11 = y;
          qx.html.Element._scroll[this.toHashCode()] = this;

          qx.html.Element._scheduleFlush("element");
        }

        delete this.__lazyScrollIntoViewY__P_74_13;
      },

      /**
       * Get the vertical scroll position.
       *
       * @return {Integer} Vertical scroll position
       */
      getScrollY: function getScrollY() {
        var thisEl = this._domNode;

        if (thisEl) {
          return thisEl.scrollTop;
        }

        return this.__lazyScrollY__P_74_11 || 0;
      },

      /**
       * Disables browser-native scrolling
       */
      disableScrolling: function disableScrolling() {
        this.enableScrolling();
        this.scrollToX(0);
        this.scrollToY(0);
        this.addListener("scroll", this.__onScroll__P_74_18, this);
      },

      /**
       * Re-enables browser-native scrolling
       */
      enableScrolling: function enableScrolling() {
        this.removeListener("scroll", this.__onScroll__P_74_18, this);
      },
      __inScroll__P_74_19: null,

      /**
       * Handler for the scroll-event
       *
       * @param e {qx.event.type.Native} scroll-event
       */
      __onScroll__P_74_18: function __onScroll__P_74_18(e) {
        if (!this.__inScroll__P_74_19) {
          this.__inScroll__P_74_19 = true;
          this._domNode.scrollTop = 0;
          this._domNode.scrollLeft = 0;
          delete this.__inScroll__P_74_19;
        }
      },

      /*
      ---------------------------------------------------------------------------
        TEXT SUPPORT
      ---------------------------------------------------------------------------
      */

      /*
       * Sets the text value of this element; it will delete children first, except
       * for the first node which (if it is a Text node) will have it's value updated
       *
       * @param value {String} the text to set
       */
      setText: function setText(value) {
        var self = this;
        var children = this._children ? qx.lang.Array.clone(this._children) : [];

        if (children[0] instanceof qx.html.Text) {
          children[0].setText(value);
          children.shift();
          children.forEach(function (child) {
            self.remove(child);
          });
        } else {
          children.forEach(function (child) {
            self.remove(child);
          });
          this.add(new qx.html.Text(value));
        }
      },

      /**
       * Returns the text value, accumulated from all child nodes
       *
       * @return {String} the text value
       */
      getText: function getText() {
        var result = [];

        if (this._children) {
          this._children.forEach(function (child) {
            result.push(child.getText());
          });
        }

        return result.join("");
      },

      /**
       * Get the selection of the element.
       *
       * If the underlaying DOM element is not yet created, this methods returns
       * a null value.
       *
       * @return {String|null}
       */
      getTextSelection: function getTextSelection() {
        var el = this._domNode;

        if (el) {
          return qx.bom.Selection.get(el);
        }

        return null;
      },

      /**
       * Get the length of selection of the element.
       *
       * If the underlaying DOM element is not yet created, this methods returns
       * a null value.
       *
       * @return {Integer|null}
       */
      getTextSelectionLength: function getTextSelectionLength() {
        var el = this._domNode;

        if (el) {
          return qx.bom.Selection.getLength(el);
        }

        return null;
      },

      /**
       * Get the start of the selection of the element.
       *
       * If the underlaying DOM element is not yet created, this methods returns
       * a null value.
       *
       * @return {Integer|null}
       */
      getTextSelectionStart: function getTextSelectionStart() {
        var el = this._domNode;

        if (el) {
          return qx.bom.Selection.getStart(el);
        }

        return null;
      },

      /**
       * Get the end of the selection of the element.
       *
       * If the underlaying DOM element is not yet created, this methods returns
       * a null value.
       *
       * @return {Integer|null}
       */
      getTextSelectionEnd: function getTextSelectionEnd() {
        var el = this._domNode;

        if (el) {
          return qx.bom.Selection.getEnd(el);
        }

        return null;
      },

      /**
       * Set the selection of the element with the given start and end value.
       * If no end value is passed the selection will extend to the end.
       *
       * This method only works if the underlying DOM element is already created.
       *
       * @param start {Integer} start of the selection (zero based)
       * @param end {Integer} end of the selection
       */
      setTextSelection: function setTextSelection(start, end) {
        var el = this._domNode;

        if (el) {
          qx.bom.Selection.set(el, start, end);
          return;
        } // if element not created, save the selection for flushing


        qx.html.Element.__selection__P_74_2[this.toHashCode()] = {
          element: this,
          start: start,
          end: end
        };

        qx.html.Element._scheduleFlush("element");
      },

      /**
       * Clears the selection of the element.
       *
       * This method only works if the underlying DOM element is already created.
       *
       */
      clearTextSelection: function clearTextSelection() {
        var el = this._domNode;

        if (el) {
          qx.bom.Selection.clear(el);
        }

        delete qx.html.Element.__selection__P_74_2[this.toHashCode()];
      },

      /*
      ---------------------------------------------------------------------------
        FOCUS/ACTIVATE SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Takes the action to process as argument and queues this action if the
       * underlying DOM element is not yet created.
       *
       * Note that "actions" are functions in `qx.bom.Element` and only apply to
       * environments with a user interface.  This will throw an error if the user
       * interface is headless
       *
       * @param action {String} action to queue
       * @param args {Array} optional list of arguments for the action
       */
      __performAction__P_74_20: function __performAction__P_74_20(action, args) {
        {
          var actions = qx.html.Element._actions;
          actions.push({
            type: action,
            element: this,
            args: args || []
          });

          qx.html.Element._scheduleFlush("element");
        }
      },

      /**
       * Focus this element.
       *
       * If the underlaying DOM element is not yet created, the
       * focus is queued for processing after the element creation.
       *
       * Silently does nothing when in a headless environment
       */
      focus: function focus() {
        {
          this.__performAction__P_74_20("focus");
        }
      },

      /**
       * Mark this element to get blurred on the next flush of the queue
       *
       * Silently does nothing when in a headless environment
       *
       */
      blur: function blur() {
        {
          this.__performAction__P_74_20("blur");
        }
      },

      /**
       * Mark this element to get activated on the next flush of the queue
       *
       * Silently does nothing when in a headless environment
       *
       */
      activate: function activate() {
        {
          this.__performAction__P_74_20("activate");
        }
      },

      /**
       * Mark this element to get deactivated on the next flush of the queue
       *
       * Silently does nothing when in a headless environment
       *
       */
      deactivate: function deactivate() {
        {
          this.__performAction__P_74_20("deactivate");
        }
      },

      /**
       * Captures all mouse events to this element
       *
       * Silently does nothing when in a headless environment
       *
       * @param containerCapture {Boolean?true} If true all events originating in
       *   the container are captured. If false events originating in the container
       *   are not captured.
       */
      capture: function capture(containerCapture) {
        {
          this.__performAction__P_74_20("capture", [containerCapture !== false]);
        }
      },

      /**
       * Releases this element from a previous {@link #capture} call
       *
       * Silently does nothing when in a headless environment
       */
      releaseCapture: function releaseCapture() {
        {
          this.__performAction__P_74_20("releaseCapture");
        }
      },

      /*
      ---------------------------------------------------------------------------
        STYLE SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Set up the given style attribute
       *
       * @param key {String} the name of the style attribute
       * @param value {var} the value
       * @param direct {Boolean?false} Whether the value should be applied
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      setStyle: function setStyle(key, value, direct) {
        if (!this.__styleValues__P_74_0) {
          this.__styleValues__P_74_0 = {};
        }

        if (this.__styleValues__P_74_0[key] == value) {
          return this;
        }

        this._applyStyle(key, value, this.__styleValues__P_74_0[key]);

        if (value == null) {
          delete this.__styleValues__P_74_0[key];
        } else {
          this.__styleValues__P_74_0[key] = value;
        } // Uncreated elements simply copy all data
        // on creation. We don't need to remember any
        // jobs. It is a simple full list copy.


        if (this._domNode) {
          // Omit queuing in direct mode
          if (direct) {
            qx.bom.element.Style.set(this._domNode, key, value);
            return this;
          } // Dynamically create if needed


          if (!this.__styleJobs__P_74_15) {
            this.__styleJobs__P_74_15 = {};
          } // Store job info


          this.__styleJobs__P_74_15[key] = true; // Register modification

          qx.html.Element._modified[this.toHashCode()] = this;

          qx.html.Element._scheduleFlush("element");
        }

        return this;
      },

      /**
       * Called by setStyle when a value of a style changes; this is intended to be
       * overridden to allow the element to update properties etc according to the
       * style
       *
       * @param key {String} the style value
       * @param value {String?} the value to set
       * @param oldValue {String?} The previous value (not from DOM)
       */
      _applyStyle: function _applyStyle(key, value, oldValue) {// Nothing
      },

      /**
       * Convenience method to modify a set of styles at once.
       *
       * @param map {Map} a map where the key is the name of the property
       *    and the value is the value to use.
       * @param direct {Boolean?false} Whether the values should be applied
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      setStyles: function setStyles(map, direct) {
        // inline calls to "set" because this method is very
        // performance critical!
        var Style = qx.bom.element.Style;

        if (!this.__styleValues__P_74_0) {
          this.__styleValues__P_74_0 = {};
        }

        if (this._domNode) {
          // Dynamically create if needed
          if (!this.__styleJobs__P_74_15) {
            this.__styleJobs__P_74_15 = {};
          }

          for (var key in map) {
            var value = map[key];

            if (this.__styleValues__P_74_0[key] == value) {
              continue;
            }

            this._applyStyle(key, value, this.__styleValues__P_74_0[key]);

            if (value == null) {
              delete this.__styleValues__P_74_0[key];
            } else {
              this.__styleValues__P_74_0[key] = value;
            } // Omit queuing in direct mode


            if (direct) {
              Style.set(this._domNode, key, value);
              continue;
            } // Store job info


            this.__styleJobs__P_74_15[key] = true;
          } // Register modification


          qx.html.Element._modified[this.toHashCode()] = this;

          qx.html.Element._scheduleFlush("element");
        } else {
          for (var key in map) {
            var value = map[key];

            if (this.__styleValues__P_74_0[key] == value) {
              continue;
            }

            this._applyStyle(key, value, this.__styleValues__P_74_0[key]);

            if (value == null) {
              delete this.__styleValues__P_74_0[key];
            } else {
              this.__styleValues__P_74_0[key] = value;
            }
          }
        }

        return this;
      },

      /**
       * Removes the given style attribute
       *
       * @param key {String} the name of the style attribute
       * @param direct {Boolean?false} Whether the value should be removed
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      removeStyle: function removeStyle(key, direct) {
        this.setStyle(key, null, direct);
        return this;
      },

      /**
       * Get the value of the given style attribute.
       *
       * @param key {String} name of the style attribute
       * @return {var} the value of the style attribute
       */
      getStyle: function getStyle(key) {
        return this.__styleValues__P_74_0 ? this.__styleValues__P_74_0[key] : null;
      },

      /**
       * Returns a map of all styles. Do not modify the result map!
       *
       * @return {Map} All styles or <code>null</code> when none are configured.
       */
      getAllStyles: function getAllStyles() {
        return this.__styleValues__P_74_0 || null;
      },

      /*
      ---------------------------------------------------------------------------
        CSS CLASS SUPPORT
      ---------------------------------------------------------------------------
      */
      __breakClasses__P_74_21: function __breakClasses__P_74_21() {
        var map = {};
        (this.getAttribute("class") || "").split(" ").forEach(function (name) {
          if (name) {
            map[name.toLowerCase()] = name;
          }
        });
        return map;
      },
      __combineClasses__P_74_22: function __combineClasses__P_74_22(map) {
        var primaryClass = this.getCssClass();
        var arr = [];

        if (primaryClass) {
          arr.push(primaryClass);
          delete map[primaryClass.toLowerCase()];
        }

        qx.lang.Array.append(arr, Object.values(map));
        return arr.length ? arr.join(" ") : null;
      },

      /**
       * Adds a css class to the element.
       *
       * @param name {String} Name of the CSS class.
       * @return {Element} this, for chaining
       */
      addClass: function addClass(name) {
        var _this2 = this;

        var classes = this.__breakClasses__P_74_21();

        var primaryClass = (this.getCssClass() || "").toLowerCase();
        name.split(" ").forEach(function (name) {
          var nameLower = name.toLowerCase();

          if (nameLower == primaryClass) {
            _this2.setCssClass(null);
          }

          classes[nameLower] = name;
        });
        this.setAttribute("class", this.__combineClasses__P_74_22(classes));
        return this;
      },

      /**
       * Removes a CSS class from the current element.
       *
       * @param name {String} Name of the CSS class.
       * @return {Element} this, for chaining
       */
      removeClass: function removeClass(name) {
        var _this3 = this;

        var classes = this.__breakClasses__P_74_21();

        var primaryClass = (this.getCssClass() || "").toLowerCase();
        name.split(" ").forEach(function (name) {
          var nameLower = name.toLowerCase();

          if (nameLower == primaryClass) {
            _this3.setCssClass(null);
          }

          delete classes[nameLower];
        });
        this.setAttribute("class", this.__combineClasses__P_74_22(classes));
        return this;
      },

      /**
       * Removes all CSS classed from the current element.
       */
      removeAllClasses: function removeAllClasses() {
        this.setCssClass(null);
        this.setAttribute("class", "");
      },

      /**
       * Apply method for cssClass
       */
      _applyCssClass: function _applyCssClass(value, oldValue) {
        var classes = this.__breakClasses__P_74_21();

        if (oldValue) {
          oldValue.split(" ").forEach(function (name) {
            return delete classes[name.toLowerCase()];
          });
        }

        if (value) {
          value.split(" ").forEach(function (name) {
            return classes[name.toLowerCase()] = name;
          });
        }

        this.setAttribute("class", this.__combineClasses__P_74_22(classes));
      },

      /*
      ---------------------------------------------------------------------------
        SIZE AND POSITION SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the size and position of this element; this is just a helper method that wraps
       * the calls to qx.bom.*
       *
       * Supported modes:
       *
       * * <code>margin</code>: Calculate from the margin box of the element (bigger than the visual appearance: including margins of given element)
       * * <code>box</code>: Calculates the offset box of the element (default, uses the same size as visible)
       * * <code>border</code>: Calculate the border box (useful to align to border edges of two elements).
       * * <code>scroll</code>: Calculate the scroll box (relevant for absolute positioned content).
       * * <code>padding</code>: Calculate the padding box (relevant for static/relative positioned content).
       *
       * @param mode {String} the type of size required, see above
       * @return {Object} a map, containing:
       *  left, right, top, bottom - document co-ords
       *  content - Object, containing:
       *    width, height: maximum permissible content size
       */
      getDimensions: function getDimensions(mode) {
        if (!this._domNode) {
          return {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0,
            content: {
              width: 0,
              height: 0
            }
          };
        }

        var loc = qx.bom.element.Location.get(this._domNode, mode);
        loc.content = qx.bom.element.Dimension.getContentSize(this._domNode);
        loc.width = loc.right - loc.left;
        loc.height = loc.bottom - loc.top;
        return loc;
      },

      /**
       * Detects whether the DOM Node is visible
       */
      canBeSeen: function canBeSeen() {
        if (this._domNode && this.isVisible()) {
          var rect = this._domNode.getBoundingClientRect();

          if (rect.top > 0 || rect.left > 0 || rect.width > 0 || rect.height > 0) {
            return true;
          }
        }

        return false;
      },

      /*
      ---------------------------------------------------------------------------
        ATTRIBUTE SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Set up the given attribute
       *
       * @param key {String} the name of the attribute
       * @param value {var} the value
       * @param direct {Boolean?false} Whether the value should be applied
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      setAttribute: function setAttribute(key, value, direct) {
        if (!this.__attribValues__P_74_1) {
          this.__attribValues__P_74_1 = {};
        }

        if (this.__attribValues__P_74_1[key] == value) {
          return this;
        }

        if (value == null) {
          delete this.__attribValues__P_74_1[key];
        } else {
          this.__attribValues__P_74_1[key] = value;
        }

        if (key == "data-qx-object-id") {
          this.setQxObjectId(value);
        } // Uncreated elements simply copy all data
        // on creation. We don't need to remember any
        // jobs. It is a simple full list copy.


        if (this._domNode) {
          // Omit queuing in direct mode
          if (direct) {
            qx.bom.element.Attribute.set(this._domNode, key, value);
            return this;
          } // Dynamically create if needed


          if (!this.__attribJobs__P_74_16) {
            this.__attribJobs__P_74_16 = {};
          } // Store job info


          this.__attribJobs__P_74_16[key] = true; // Register modification

          qx.html.Element._modified[this.toHashCode()] = this;

          qx.html.Element._scheduleFlush("element");
        }

        return this;
      },

      /**
       * Convenience method to modify a set of attributes at once.
       *
       * @param map {Map} a map where the key is the name of the property
       *    and the value is the value to use.
       * @param direct {Boolean?false} Whether the values should be applied
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      setAttributes: function setAttributes(map, direct) {
        for (var key in map) {
          this.setAttribute(key, map[key], direct);
        }

        return this;
      },

      /**
       * Removes the given attribute
       *
       * @param key {String} the name of the attribute
       * @param direct {Boolean?false} Whether the value should be removed
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      removeAttribute: function removeAttribute(key, direct) {
        return this.setAttribute(key, null, direct);
      },

      /**
       * Get the value of the given attribute.
       *
       * @param key {String} name of the attribute
       * @return {var} the value of the attribute
       */
      getAttribute: function getAttribute(key) {
        return this.__attribValues__P_74_1 ? this.__attribValues__P_74_1[key] : null;
      }
    },

    /*
     *****************************************************************************
        DEFER
     *****************************************************************************
     */
    defer: function defer(statics) {
      statics.__deferredCall__P_74_6 = new qx.util.DeferredCall(statics.flush, statics);
      statics.__SELF_CLOSING_TAGS__P_74_5 = {};
      ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"].forEach(function (tagName) {
        statics.__SELF_CLOSING_TAGS__P_74_5[tagName] = true;
      });
    },

    /*
    *****************************************************************************
       DESTRUCT
    *****************************************************************************
    */
    destruct: function destruct() {
      var hash = this.toHashCode();

      if (hash) {
        delete qx.html.Element._modified[hash];
        delete qx.html.Element._scroll[hash];
      }

      this.setRoot(false);
      this.__attribValues__P_74_1 = this.__styleValues__P_74_0 = this.__attribJobs__P_74_16 = this.__styleJobs__P_74_15 = this.__lazyScrollIntoViewX__P_74_12 = this.__lazyScrollIntoViewY__P_74_13 = null;
    }
  });
  qx.html.Element.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.theme.manager.Meta": {
        "construct": true
      },
      "qx.util.PropertyUtil": {},
      "qx.ui.core.queue.Layout": {},
      "qx.core.Init": {},
      "qx.ui.core.queue.Visibility": {},
      "qx.lang.Object": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.dyntheme": {
          "load": true
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * The base class of all items, which should be laid out using a layout manager
   * {@link qx.ui.layout.Abstract}.
   */
  qx.Class.define("qx.ui.core.LayoutItem", {
    type: "abstract",
    extend: qx.core.Object,
    construct: function construct() {
      qx.core.Object.constructor.call(this); // dynamic theme switch

      {
        qx.theme.manager.Meta.getInstance().addListener("changeTheme", this._onChangeTheme, this);
      }
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /*
      ---------------------------------------------------------------------------
        DIMENSION
      ---------------------------------------------------------------------------
      */

      /**
       * The user provided minimal width.
       *
       * Also take a look at the related properties {@link #width} and {@link #maxWidth}.
       */
      minWidth: {
        check: "Integer",
        nullable: true,
        apply: "_applyDimension",
        init: null,
        themeable: true
      },

      /**
       * The <code>LayoutItem</code>'s preferred width.
       *
       * The computed width may differ from the given width due to
       * stretching. Also take a look at the related properties
       * {@link #minWidth} and {@link #maxWidth}.
       */
      width: {
        check: "Integer",
        event: "changeWidth",
        nullable: true,
        apply: "_applyDimension",
        init: null,
        themeable: true
      },

      /**
       * The user provided maximal width.
       *
       * Also take a look at the related properties {@link #width} and {@link #minWidth}.
       */
      maxWidth: {
        check: "Integer",
        nullable: true,
        apply: "_applyDimension",
        init: null,
        themeable: true
      },

      /**
       * The user provided minimal height.
       *
       * Also take a look at the related properties {@link #height} and {@link #maxHeight}.
       */
      minHeight: {
        check: "Integer",
        nullable: true,
        apply: "_applyDimension",
        init: null,
        themeable: true
      },

      /**
       * The item's preferred height.
       *
       * The computed height may differ from the given height due to
       * stretching. Also take a look at the related properties
       * {@link #minHeight} and {@link #maxHeight}.
       */
      height: {
        check: "Integer",
        event: "changeHeight",
        nullable: true,
        apply: "_applyDimension",
        init: null,
        themeable: true
      },

      /**
       * The user provided maximum height.
       *
       * Also take a look at the related properties {@link #height} and {@link #minHeight}.
       */
      maxHeight: {
        check: "Integer",
        nullable: true,
        apply: "_applyDimension",
        init: null,
        themeable: true
      },

      /*
      ---------------------------------------------------------------------------
        STRETCHING
      ---------------------------------------------------------------------------
      */

      /** Whether the item can grow horizontally. */
      allowGrowX: {
        check: "Boolean",
        apply: "_applyStretching",
        init: true,
        themeable: true
      },

      /** Whether the item can shrink horizontally. */
      allowShrinkX: {
        check: "Boolean",
        apply: "_applyStretching",
        init: true,
        themeable: true
      },

      /** Whether the item can grow vertically. */
      allowGrowY: {
        check: "Boolean",
        apply: "_applyStretching",
        init: true,
        themeable: true
      },

      /** Whether the item can shrink vertically. */
      allowShrinkY: {
        check: "Boolean",
        apply: "_applyStretching",
        init: true,
        themeable: true
      },

      /** Growing and shrinking in the horizontal direction */
      allowStretchX: {
        group: ["allowGrowX", "allowShrinkX"],
        mode: "shorthand",
        themeable: true
      },

      /** Growing and shrinking in the vertical direction */
      allowStretchY: {
        group: ["allowGrowY", "allowShrinkY"],
        mode: "shorthand",
        themeable: true
      },

      /*
      ---------------------------------------------------------------------------
        MARGIN
      ---------------------------------------------------------------------------
      */

      /** Margin of the widget (top) */
      marginTop: {
        check: "Integer",
        init: 0,
        apply: "_applyMargin",
        themeable: true
      },

      /** Margin of the widget (right) */
      marginRight: {
        check: "Integer",
        init: 0,
        apply: "_applyMargin",
        themeable: true
      },

      /** Margin of the widget (bottom) */
      marginBottom: {
        check: "Integer",
        init: 0,
        apply: "_applyMargin",
        themeable: true
      },

      /** Margin of the widget (left) */
      marginLeft: {
        check: "Integer",
        init: 0,
        apply: "_applyMargin",
        themeable: true
      },

      /**
       * The 'margin' property is a shorthand property for setting 'marginTop',
       * 'marginRight', 'marginBottom' and 'marginLeft' at the same time.
       *
       * If four values are specified they apply to top, right, bottom and left respectively.
       * If there is only one value, it applies to all sides, if there are two or three,
       * the missing values are taken from the opposite side.
       */
      margin: {
        group: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
        mode: "shorthand",
        themeable: true
      },

      /*
      ---------------------------------------------------------------------------
        ALIGN
      ---------------------------------------------------------------------------
      */

      /**
       * Horizontal alignment of the item in the parent layout.
       *
       * Note: Item alignment is only supported by {@link LayoutItem} layouts where
       * it would have a visual effect. Except for {@link Spacer}, which provides
       * blank space for layouts, all classes that inherit {@link LayoutItem} support alignment.
       */
      alignX: {
        check: ["left", "center", "right"],
        nullable: true,
        apply: "_applyAlign",
        themeable: true
      },

      /**
       * Vertical alignment of the item in the parent layout.
       *
       * Note: Item alignment is only supported by {@link LayoutItem} layouts where
       * it would have a visual effect. Except for {@link Spacer}, which provides
       * blank space for layouts, all classes that inherit {@link LayoutItem} support alignment.
       */
      alignY: {
        check: ["top", "middle", "bottom", "baseline"],
        nullable: true,
        apply: "_applyAlign",
        themeable: true
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    /* eslint-disable @qooxdoo/qx/no-refs-in-members */
    members: {
      /*
      ---------------------------------------------------------------------------
        DYNAMIC THEME SWITCH SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Handler for the dynamic theme change.
       * @signature function()
       */
      _onChangeTheme: qx.core.Environment.select("qx.dyntheme", {
        "true": function _true() {
          // reset all themeable properties
          var props = qx.util.PropertyUtil.getAllProperties(this.constructor);

          for (var name in props) {
            var desc = props[name]; // only themeable properties not having a user value

            if (desc.themeable) {
              var userValue = qx.util.PropertyUtil.getUserValue(this, name);

              if (userValue == null) {
                qx.util.PropertyUtil.resetThemed(this, name);
              }
            }
          }
        },
        "false": null
      }),

      /*
      ---------------------------------------------------------------------------
        LAYOUT PROCESS
      ---------------------------------------------------------------------------
      */

      /** @type {Integer} The computed height */
      __computedHeightForWidth__P_83_0: null,

      /** @type {Map} The computed size of the layout item */
      __computedLayout__P_83_1: null,

      /** @type {Boolean} Whether the current layout is valid */
      __hasInvalidLayout__P_83_2: null,

      /** @type {Map} Cached size hint */
      __sizeHint__P_83_3: null,

      /** @type {Boolean} Whether the margins have changed and must be updated */
      __updateMargin__P_83_4: null,

      /** @type {Map} user provided bounds of the widget, which override the layout manager */
      __userBounds__P_83_5: null,

      /** @type {Map} The item's layout properties */
      __layoutProperties__P_83_6: null,

      /**
       * Get the computed location and dimension as computed by
       * the layout manager.
       *
       * @return {Map|null} The location and dimensions in pixel
       *    (if the layout is valid). Contains the keys
       *    <code>width</code>, <code>height</code>, <code>left</code> and
       *    <code>top</code>.
       */
      getBounds: function getBounds() {
        return this.__userBounds__P_83_5 || this.__computedLayout__P_83_1 || null;
      },

      /**
       * Reconfigure number of separators
       */
      clearSeparators: function clearSeparators() {// empty template
      },

      /**
       * Renders a separator between two children
       *
       * @param separator {String|qx.ui.decoration.IDecorator} The separator to render
       * @param bounds {Map} Contains the left and top coordinate and the width and height
       *    of the separator to render.
       */
      renderSeparator: function renderSeparator(separator, bounds) {// empty template
      },

      /**
       * Used by the layout engine to apply coordinates and dimensions.
       *
       * @param left {Integer} Any integer value for the left position,
       *   always in pixels
       * @param top {Integer} Any integer value for the top position,
       *   always in pixels
       * @param width {Integer} Any positive integer value for the width,
       *   always in pixels
       * @param height {Integer} Any positive integer value for the height,
       *   always in pixels
       * @return {Map} A map of which layout sizes changed.
       */
      renderLayout: function renderLayout(left, top, width, height) {
        // do not render if the layout item is already disposed
        if (this.isDisposed()) {
          return null;
        }

        {
          var msg = "Something went wrong with the layout of " + this.toString() + "!";
          this.assertInteger(left, "Wrong 'left' argument. " + msg);
          this.assertInteger(top, "Wrong 'top' argument. " + msg);
          this.assertInteger(width, "Wrong 'width' argument. " + msg);
          this.assertInteger(height, "Wrong 'height' argument. " + msg); // this.assertInRange(width, this.getMinWidth() || -1, this.getMaxWidth() || 32000);
          // this.assertInRange(height, this.getMinHeight() || -1, this.getMaxHeight() || 32000);
        } // Detect size changes
        // Dynamically create data structure for computed layout

        var computed = this.__computedLayout__P_83_1;

        if (!computed) {
          computed = this.__computedLayout__P_83_1 = {};
        } // Detect changes


        var changes = {};

        if (left !== computed.left || top !== computed.top) {
          changes.position = true;
          computed.left = left;
          computed.top = top;
        }

        if (width !== computed.width || height !== computed.height) {
          changes.size = true;
          computed.width = width;
          computed.height = height;
        } // Clear invalidation marker


        if (this.__hasInvalidLayout__P_83_2) {
          changes.local = true;
          delete this.__hasInvalidLayout__P_83_2;
        }

        if (this.__updateMargin__P_83_4) {
          changes.margin = true;
          delete this.__updateMargin__P_83_4;
        }
        /*
         * Height for width support
         *
         * Results into a re-layout which means that width/height is applied in the next iteration.
         *
         * Note that it is important that this happens after the above first pass at calculating a
         * computed size because otherwise getBounds() will return null, and this will cause an
         * issue where the existing size is expected to have already been applied by the layout.
         * See https://github.com/qooxdoo/qooxdoo/issues/9553
         */


        if (this.getHeight() == null && this._hasHeightForWidth()) {
          var flowHeight = this._getHeightForWidth(width);

          if (flowHeight != null && flowHeight !== this.__computedHeightForWidth__P_83_0) {
            // This variable is used in the next computation of the size hint
            this.__computedHeightForWidth__P_83_0 = flowHeight; // Re-add to layout queue

            qx.ui.core.queue.Layout.add(this);
          }
        } // Returns changes, especially for deriving classes


        return changes;
      },

      /**
       * Whether the item should be excluded from the layout
       *
       * @return {Boolean} Should the item be excluded by the layout
       */
      isExcluded: function isExcluded() {
        return false;
      },

      /**
       * Whether the layout of this item (to layout the children)
       * is valid.
       *
       * @return {Boolean} Returns <code>true</code>
       */
      hasValidLayout: function hasValidLayout() {
        return !this.__hasInvalidLayout__P_83_2;
      },

      /**
       * Indicate that the item has layout changes and propagate this information
       * up the item hierarchy.
       *
       */
      scheduleLayoutUpdate: function scheduleLayoutUpdate() {
        qx.ui.core.queue.Layout.add(this);
      },

      /**
       * Called by the layout manager to mark this item's layout as invalid.
       * This function should clear all layout relevant caches.
       */
      invalidateLayoutCache: function invalidateLayoutCache() {
        // this.debug("Mark layout invalid!");
        this.__hasInvalidLayout__P_83_2 = true;
        this.__sizeHint__P_83_3 = null;
      },

      /**
       * A size hint computes the dimensions of a widget. It returns
       * the recommended dimensions as well as the min and max dimensions.
       * The min and max values already respect the stretching properties.
       *
       * <h3>Wording</h3>
       * <ul>
       * <li>User value: Value defined by the widget user, using the size properties</li>
       *
       * <li>Layout value: The value computed by {@link qx.ui.core.Widget#_getContentHint}</li>
       * </ul>
       *
       * <h3>Algorithm</h3>
       * <ul>
       * <li>minSize: If the user min size is not null, the user value is taken,
       *     otherwise the layout value is used.</li>
       *
       * <li>(preferred) size: If the user value is not null the user value is used,
       *     otherwise the layout value is used.</li>
       *
       * <li>max size: Same as the preferred size.</li>
       * </ul>
       *
       * @param compute {Boolean?true} Automatically compute size hint if currently not
       *   cached?
       * @return {Map} The map with the preferred width/height and the allowed
       *   minimum and maximum values in cases where shrinking or growing
       *   is required.
       */
      getSizeHint: function getSizeHint(compute) {
        var hint = this.__sizeHint__P_83_3;

        if (hint) {
          return hint;
        }

        if (compute === false) {
          return null;
        } // Compute as defined


        hint = this.__sizeHint__P_83_3 = this._computeSizeHint(); // Respect height for width

        if (this._hasHeightForWidth() && this.__computedHeightForWidth__P_83_0 && this.getHeight() == null) {
          hint.height = this.__computedHeightForWidth__P_83_0;
        } // normalize width


        if (hint.minWidth > hint.width) {
          hint.width = hint.minWidth;
        }

        if (hint.maxWidth < hint.width) {
          hint.width = hint.maxWidth;
        }

        if (!this.getAllowGrowX()) {
          hint.maxWidth = hint.width;
        }

        if (!this.getAllowShrinkX()) {
          hint.minWidth = hint.width;
        } // normalize height


        if (hint.minHeight > hint.height) {
          hint.height = hint.minHeight;
        }

        if (hint.maxHeight < hint.height) {
          hint.height = hint.maxHeight;
        }

        if (!this.getAllowGrowY()) {
          hint.maxHeight = hint.height;
        }

        if (!this.getAllowShrinkY()) {
          hint.minHeight = hint.height;
        } // Finally return


        return hint;
      },

      /**
       * Computes the size hint of the layout item.
       *
       * @return {Map} The map with the preferred width/height and the allowed
       *   minimum and maximum values.
       */
      _computeSizeHint: function _computeSizeHint() {
        var minWidth = this.getMinWidth() || 0;
        var minHeight = this.getMinHeight() || 0;
        var width = this.getWidth() || minWidth;
        var height = this.getHeight() || minHeight;
        var maxWidth = this.getMaxWidth() || Infinity;
        var maxHeight = this.getMaxHeight() || Infinity;
        return {
          minWidth: minWidth,
          width: width,
          maxWidth: maxWidth,
          minHeight: minHeight,
          height: height,
          maxHeight: maxHeight
        };
      },

      /**
       * Whether the item supports height for width.
       *
       * @return {Boolean} Whether the item supports height for width
       */
      _hasHeightForWidth: function _hasHeightForWidth() {
        var layout = this._getLayout();

        if (layout) {
          return layout.hasHeightForWidth();
        }

        return false;
      },

      /**
       * If an item wants to trade height for width it has to implement this
       * method and return the preferred height of the item if it is resized to
       * the given width. This function returns <code>null</code> if the item
       * do not support height for width.
       *
       * @param width {Integer} The computed width
       * @return {Integer} The desired height
       */
      _getHeightForWidth: function _getHeightForWidth(width) {
        var layout = this._getLayout();

        if (layout && layout.hasHeightForWidth()) {
          return layout.getHeightForWidth(width);
        }

        return null;
      },

      /**
       * Get the widget's layout manager.
       *
       * @return {qx.ui.layout.Abstract} The widget's layout manager
       */
      _getLayout: function _getLayout() {
        return null;
      },
      // property apply
      _applyMargin: function _applyMargin() {
        this.__updateMargin__P_83_4 = true;
        var parent = this.$$parent;

        if (parent) {
          parent.updateLayoutProperties();
        }
      },
      // property apply
      _applyAlign: function _applyAlign() {
        var parent = this.$$parent;

        if (parent) {
          parent.updateLayoutProperties();
        }
      },
      // property apply
      _applyDimension: function _applyDimension() {
        qx.ui.core.queue.Layout.add(this);
      },
      // property apply
      _applyStretching: function _applyStretching() {
        qx.ui.core.queue.Layout.add(this);
      },

      /*
      ---------------------------------------------------------------------------
        SUPPORT FOR USER BOUNDARIES
      ---------------------------------------------------------------------------
      */

      /**
       * Whether user bounds are set on this layout item
       *
       * @return {Boolean} Whether user bounds are set on this layout item
       */
      hasUserBounds: function hasUserBounds() {
        return !!this.__userBounds__P_83_5;
      },

      /**
       * Set user bounds of the widget. Widgets with user bounds are sized and
       * positioned manually and are ignored by any layout manager.
       *
       * @param left {Integer} left position (relative to the parent)
       * @param top {Integer} top position (relative to the parent)
       * @param width {Integer} width of the layout item
       * @param height {Integer} height of the layout item
       */
      setUserBounds: function setUserBounds(left, top, width, height) {
        if (!this.__userBounds__P_83_5) {
          var parent = this.$$parent;

          if (parent) {
            parent.updateLayoutProperties();
          }
        }

        this.__userBounds__P_83_5 = {
          left: left,
          top: top,
          width: width,
          height: height
        };
        qx.ui.core.queue.Layout.add(this);
      },

      /**
       * Clear the user bounds. After this call the layout item is laid out by
       * the layout manager again.
       *
       */
      resetUserBounds: function resetUserBounds() {
        if (this.__userBounds__P_83_5) {
          delete this.__userBounds__P_83_5;
          var parent = this.$$parent;

          if (parent) {
            parent.updateLayoutProperties();
          }

          qx.ui.core.queue.Layout.add(this);
        }
      },

      /*
      ---------------------------------------------------------------------------
        LAYOUT PROPERTIES
      ---------------------------------------------------------------------------
      */

      /**
       * @type {Map} Empty storage pool
       *
       * @lint ignoreReferenceField(__emptyProperties)
       */
      __emptyProperties__P_83_7: {},

      /**
       * Stores the given layout properties
       *
       * @param props {Map} Incoming layout property data
       */
      setLayoutProperties: function setLayoutProperties(props) {
        if (props == null) {
          return;
        }

        var storage = this.__layoutProperties__P_83_6;

        if (!storage) {
          storage = this.__layoutProperties__P_83_6 = {};
        } // Check values through parent


        var parent = this.getLayoutParent();

        if (parent) {
          parent.updateLayoutProperties(props);
        } // Copy over values


        for (var key in props) {
          if (props[key] == null) {
            delete storage[key];
          } else {
            storage[key] = props[key];
          }
        }
      },

      /**
       * Returns currently stored layout properties
       *
       * @return {Map} Returns a map of layout properties
       */
      getLayoutProperties: function getLayoutProperties() {
        return this.__layoutProperties__P_83_6 || this.__emptyProperties__P_83_7;
      },

      /**
       * Removes all stored layout properties.
       *
       */
      clearLayoutProperties: function clearLayoutProperties() {
        delete this.__layoutProperties__P_83_6;
      },

      /**
       * Should be executed on every change of layout properties.
       *
       * This also includes "virtual" layout properties like margin or align
       * when they have an effect on the parent and not on the widget itself.
       *
       * This method is always executed on the parent not on the
       * modified widget itself.
       *
       * @param props {Map?null} Optional map of known layout properties
       */
      updateLayoutProperties: function updateLayoutProperties(props) {
        var layout = this._getLayout();

        if (layout) {
          // Verify values through underlying layout
          {
            if (props) {
              for (var key in props) {
                if (props[key] !== null) {
                  layout.verifyLayoutProperty(this, key, props[key]);
                }
              }
            }
          } // Precomputed and cached children data need to be
          // rebuild on upcoming (re-)layout.

          layout.invalidateChildrenCache();
        }

        qx.ui.core.queue.Layout.add(this);
      },

      /*
      ---------------------------------------------------------------------------
        HIERARCHY SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the application root
       *
       * @return {qx.ui.root.Abstract} The currently used root
       */
      getApplicationRoot: function getApplicationRoot() {
        return qx.core.Init.getApplication().getRoot();
      },

      /**
       * Get the items parent. Even if the item has been added to a
       * layout, the parent is always a child of the containing item. The parent
       * item may be <code>null</code>.
       *
       * @return {qx.ui.core.Widget|null} The parent.
       */
      getLayoutParent: function getLayoutParent() {
        return this.$$parent || null;
      },

      /**
       * Set the parent
       *
       * @param parent {qx.ui.core.Widget|null} The new parent.
       */
      setLayoutParent: function setLayoutParent(parent) {
        if (this.$$parent === parent) {
          return;
        }

        this.$$parent = parent || null;
        qx.ui.core.queue.Visibility.add(this);
      },

      /**
       * Whether the item is a root item and directly connected to
       * the DOM.
       *
       * @return {Boolean} Whether the item a root item
       */
      isRootWidget: function isRootWidget() {
        return false;
      },

      /**
       * Returns the root item. The root item is the item which
       * is directly inserted into an existing DOM node at HTML level.
       * This is often the BODY element of a typical web page.
       *
       * @return {qx.ui.core.Widget} The root item (if available)
       */
      _getRoot: function _getRoot() {
        var parent = this;

        while (parent) {
          if (parent.isRootWidget()) {
            return parent;
          }

          parent = parent.$$parent;
        }

        return null;
      },

      /*
      ---------------------------------------------------------------------------
        CLONE SUPPORT
      ---------------------------------------------------------------------------
      */
      // overridden
      clone: function clone() {
        var clone = qx.ui.core.LayoutItem.superclass.prototype.clone.call(this);
        var props = this.__layoutProperties__P_83_6;

        if (props) {
          clone.__layoutProperties__P_83_6 = qx.lang.Object.clone(props);
        }

        return clone;
      }
    },

    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct: function destruct() {
      // remove dynamic theme listener
      {
        qx.theme.manager.Meta.getInstance().removeListener("changeTheme", this._onChangeTheme, this);
      }
      this.$$parent = this.$$subparent = this.__layoutProperties__P_83_6 = this.__computedLayout__P_83_1 = this.__userBounds__P_83_5 = this.__sizeHint__P_83_3 = null;
    }
  });
  qx.ui.core.LayoutItem.$$dbClassInfo = $$dbClassInfo;
})();

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.ui.core.EventHandler": {},
      "qx.event.handler.DragDrop": {},
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.LayoutItem": {
        "construct": true,
        "require": true
      },
      "qx.locale.MTranslation": {
        "require": true
      },
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.core.Assert": {},
      "qx.util.ObjectPool": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.layout.Abstract": {},
      "qx.ui.core.queue.Layout": {},
      "qx.ui.core.queue.Visibility": {},
      "qx.lang.Object": {},
      "qx.theme.manager.Decoration": {},
      "qx.ui.core.queue.Manager": {},
      "qx.html.Element": {},
      "qx.lang.Array": {},
      "qx.event.Registration": {},
      "qx.event.dispatch.MouseCapture": {},
      "qx.Bootstrap": {},
      "qx.locale.Manager": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.theme.manager.Color": {},
      "qx.lang.Type": {},
      "qx.ui.core.queue.Appearance": {},
      "qx.theme.manager.Appearance": {},
      "qx.core.Property": {},
      "qx.ui.core.DragDropCursor": {},
      "qx.bom.element.Location": {},
      "qx.ui.core.queue.Dispose": {},
      "qx.core.ObjectRegistry": {},
      "qx.ui.core.queue.Widget": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /* ************************************************************************
  
  
  
  ************************************************************************ */

  /**
   * This is the base class for all widgets.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#core/' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   * @use(qx.ui.core.EventHandler)
   * @use(qx.event.handler.DragDrop)
   * @asset(qx/static/blank.gif)
   *
   * @ignore(qx.ui.root.Inline)
   */
  qx.Class.define("qx.ui.core.Widget", {
    extend: qx.ui.core.LayoutItem,
    include: [qx.locale.MTranslation],
    implement: [qx.core.IDisposable],

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */
    construct: function construct() {
      qx.ui.core.LayoutItem.constructor.call(this); // Create basic element

      this.__contentElement__P_38_0 = this.__createContentElement__P_38_1(); // Initialize properties

      this.initFocusable();
      this.initSelectable();
      this.initNativeContextMenu();
    },

    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */
    events: {
      /**
       * Fired after the widget appears on the screen.
       */
      appear: "qx.event.type.Event",

      /**
       * Fired after the widget disappears from the screen.
       */
      disappear: "qx.event.type.Event",

      /**
       * Fired after the creation of a child control. The passed data is the
       * newly created child widget.
       */
      createChildControl: "qx.event.type.Data",

      /**
       * Fired on resize (after layout) of the widget.
       * The data property of the event contains the widget's computed location
       * and dimension as returned by {@link qx.ui.core.LayoutItem#getBounds}
       */
      resize: "qx.event.type.Data",

      /**
       * Fired on move (after layout) of the widget.
       * The data property of the event contains the widget's computed location
       * and dimension as returned by {@link qx.ui.core.LayoutItem#getBounds}
       */
      move: "qx.event.type.Data",

      /**
       * Fired after the appearance has been applied. This happens before the
       * widget becomes visible, on state and appearance changes. The data field
       * contains the state map. This can be used to react on state changes or to
       * read properties set by the appearance.
       */
      syncAppearance: "qx.event.type.Data",

      /** Fired if the mouse cursor moves over the widget.
       *  The data property of the event contains the widget's computed location
       *  and dimension as returned by {@link qx.ui.core.LayoutItem#getBounds}
       */
      mousemove: "qx.event.type.Mouse",

      /**
       * Fired if the mouse cursor enters the widget.
       *
       * Note: This event is also dispatched if the widget is disabled!
       */
      mouseover: "qx.event.type.Mouse",

      /**
       * Fired if the mouse cursor leaves widget.
       *
       * Note: This event is also dispatched if the widget is disabled!
       */
      mouseout: "qx.event.type.Mouse",

      /** Mouse button is pressed on the widget. */
      mousedown: "qx.event.type.Mouse",

      /** Mouse button is released on the widget. */
      mouseup: "qx.event.type.Mouse",

      /** Widget is clicked using left or middle button.
          {@link qx.event.type.Mouse#getButton} for more details.*/
      click: "qx.event.type.Mouse",

      /** Widget is clicked using a non primary button.
          {@link qx.event.type.Mouse#getButton} for more details.*/
      auxclick: "qx.event.type.Mouse",

      /** Widget is double clicked using left or middle button.
          {@link qx.event.type.Mouse#getButton} for more details.*/
      dblclick: "qx.event.type.Mouse",

      /** Widget is clicked using the right mouse button. */
      contextmenu: "qx.event.type.Mouse",

      /** Fired before the context menu is opened. */
      beforeContextmenuOpen: "qx.event.type.Data",

      /** Fired if the mouse wheel is used over the widget. */
      mousewheel: "qx.event.type.MouseWheel",

      /** Fired if a touch at the screen is started. */
      touchstart: "qx.event.type.Touch",

      /** Fired if a touch at the screen has ended. */
      touchend: "qx.event.type.Touch",

      /** Fired during a touch at the screen. */
      touchmove: "qx.event.type.Touch",

      /** Fired if a touch at the screen is canceled. */
      touchcancel: "qx.event.type.Touch",

      /** Fired when a pointer taps on the screen. */
      tap: "qx.event.type.Tap",

      /** Fired when a pointer holds on the screen. */
      longtap: "qx.event.type.Tap",

      /** Fired when a pointer taps twice on the screen. */
      dbltap: "qx.event.type.Tap",

      /** Fired when a pointer swipes over the screen. */
      swipe: "qx.event.type.Touch",

      /** Fired when two pointers performing a rotate gesture on the screen. */
      rotate: "qx.event.type.Rotate",

      /** Fired when two pointers performing a pinch in/out gesture on the screen. */
      pinch: "qx.event.type.Pinch",

      /** Fired when an active pointer moves on the screen (after pointerdown till pointerup). */
      track: "qx.event.type.Track",

      /** Fired when an active pointer moves on the screen or the mouse wheel is used. */
      roll: "qx.event.type.Roll",

      /** Fired if a pointer (mouse/touch/pen) moves or changes any of it's values. */
      pointermove: "qx.event.type.Pointer",

      /** Fired if a pointer (mouse/touch/pen) hovers the widget. */
      pointerover: "qx.event.type.Pointer",

      /** Fired if a pointer (mouse/touch/pen) leaves this widget. */
      pointerout: "qx.event.type.Pointer",

      /**
       * Fired if a pointer (mouse/touch/pen) button is pressed or
       * a finger touches the widget.
       */
      pointerdown: "qx.event.type.Pointer",

      /**
       * Fired if all pointer (mouse/touch/pen) buttons are released or
       * the finger is lifted from the widget.
       */
      pointerup: "qx.event.type.Pointer",

      /** Fired if a pointer (mouse/touch/pen) action is canceled. */
      pointercancel: "qx.event.type.Pointer",

      /** This event if fired if a keyboard key is released. */
      keyup: "qx.event.type.KeySequence",

      /**
       * This event if fired if a keyboard key is pressed down. This event is
       * only fired once if the user keeps the key pressed for a while.
       */
      keydown: "qx.event.type.KeySequence",

      /**
       * This event is fired any time a key is pressed. It will be repeated if
       * the user keeps the key pressed. The pressed key can be determined using
       * {@link qx.event.type.KeySequence#getKeyIdentifier}.
       */
      keypress: "qx.event.type.KeySequence",

      /**
       * This event is fired if the pressed key or keys result in a printable
       * character. Since the character is not necessarily associated with a
       * single physical key press, the event does not have a key identifier
       * getter. This event gets repeated if the user keeps pressing the key(s).
       *
       * The unicode code of the pressed key can be read using
       * {@link qx.event.type.KeyInput#getCharCode}.
       */
      keyinput: "qx.event.type.KeyInput",

      /**
       * The event is fired when the widget gets focused. Only widgets which are
       * {@link #focusable} receive this event.
       */
      focus: "qx.event.type.Focus",

      /**
       * The event is fired when the widget gets blurred. Only widgets which are
       * {@link #focusable} receive this event.
       */
      blur: "qx.event.type.Focus",

      /**
       * When the widget itself or any child of the widget receive the focus.
       */
      focusin: "qx.event.type.Focus",

      /**
       * When the widget itself or any child of the widget lost the focus.
       */
      focusout: "qx.event.type.Focus",

      /**
       * When the widget gets active (receives keyboard events etc.)
       */
      activate: "qx.event.type.Focus",

      /**
       * When the widget gets inactive
       */
      deactivate: "qx.event.type.Focus",

      /**
       * Fired if the widget becomes the capturing widget by a call to {@link #capture}.
       */
      capture: "qx.event.type.Event",

      /**
       * Fired if the widget looses the capturing mode by a call to
       * {@link #releaseCapture} or a mouse click.
       */
      losecapture: "qx.event.type.Event",

      /**
       * Fired on the drop target when the drag&drop action is finished
       * successfully. This event is normally used to transfer the data
       * from the drag to the drop target.
       *
       * Modeled after the WHATWG specification of Drag&Drop:
       * http://www.whatwg.org/specs/web-apps/current-work/#dnd
       */
      drop: "qx.event.type.Drag",

      /**
       * Fired on a potential drop target when leaving it.
       *
       * Modeled after the WHATWG specification of Drag&Drop:
       * http://www.whatwg.org/specs/web-apps/current-work/#dnd
       */
      dragleave: "qx.event.type.Drag",

      /**
       * Fired on a potential drop target when reaching it via the pointer.
       * This event can be canceled if none of the incoming data types
       * are supported.
       *
       * Modeled after the WHATWG specification of Drag&Drop:
       * http://www.whatwg.org/specs/web-apps/current-work/#dnd
       */
      dragover: "qx.event.type.Drag",

      /**
       * Fired during the drag. Contains the current pointer coordinates
       * using {@link qx.event.type.Drag#getDocumentLeft} and
       * {@link qx.event.type.Drag#getDocumentTop}
       *
       * Modeled after the WHATWG specification of Drag&Drop:
       * http://www.whatwg.org/specs/web-apps/current-work/#dnd
       */
      drag: "qx.event.type.Drag",

      /**
       * Initiate the drag-and-drop operation. This event is cancelable
       * when the drag operation is currently not allowed/possible.
       *
       * Modeled after the WHATWG specification of Drag&Drop:
       * http://www.whatwg.org/specs/web-apps/current-work/#dnd
       */
      dragstart: "qx.event.type.Drag",

      /**
       * Fired on the source (drag) target every time a drag session was ended.
       */
      dragend: "qx.event.type.Drag",

      /**
       * Fired when the drag configuration has been modified e.g. the user
       * pressed a key which changed the selected action. This event will be
       * fired on the draggable and the droppable element. In case of the
       * droppable element, you can cancel the event and prevent a drop based on
       * e.g. the current action.
       */
      dragchange: "qx.event.type.Drag",

      /**
       * Fired when the drop was successfully done and the target widget
       * is now asking for data. The listener should transfer the data,
       * respecting the selected action, to the event. This can be done using
       * the event's {@link qx.event.type.Drag#addData} method.
       */
      droprequest: "qx.event.type.Drag"
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /*
      ---------------------------------------------------------------------------
        PADDING
      ---------------------------------------------------------------------------
      */

      /** Padding of the widget (top) */
      paddingTop: {
        check: "Integer",
        init: 0,
        apply: "_applyPadding",
        themeable: true
      },

      /** Padding of the widget (right) */
      paddingRight: {
        check: "Integer",
        init: 0,
        apply: "_applyPadding",
        themeable: true
      },

      /** Padding of the widget (bottom) */
      paddingBottom: {
        check: "Integer",
        init: 0,
        apply: "_applyPadding",
        themeable: true
      },

      /** Padding of the widget (left) */
      paddingLeft: {
        check: "Integer",
        init: 0,
        apply: "_applyPadding",
        themeable: true
      },

      /**
       * The 'padding' property is a shorthand property for setting 'paddingTop',
       * 'paddingRight', 'paddingBottom' and 'paddingLeft' at the same time.
       *
       * If four values are specified they apply to top, right, bottom and left respectively.
       * If there is only one value, it applies to all sides, if there are two or three,
       * the missing values are taken from the opposite side.
       */
      padding: {
        group: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
        mode: "shorthand",
        themeable: true
      },

      /*
      ---------------------------------------------------------------------------
        STYLING PROPERTIES
      ---------------------------------------------------------------------------
      */

      /**
       * The z-index property sets the stack order of an element. An element with
       * greater stack order is always in front of another element with lower stack order.
       */
      zIndex: {
        nullable: true,
        init: 10,
        apply: "_applyZIndex",
        event: "changeZIndex",
        check: "Integer",
        themeable: true
      },

      /**
       * The decorator property points to an object, which is responsible
       * for drawing the widget's decoration, e.g. border, background or shadow.
       *
       * This can be a decorator object or a string pointing to a decorator
       * defined in the decoration theme.
       */
      decorator: {
        nullable: true,
        init: null,
        apply: "_applyDecorator",
        event: "changeDecorator",
        check: "Decorator",
        themeable: true
      },

      /**
       * The background color the rendered widget.
       */
      backgroundColor: {
        nullable: true,
        check: "Color",
        apply: "_applyBackgroundColor",
        event: "changeBackgroundColor",
        themeable: true
      },

      /**
       * The text color the rendered widget.
       */
      textColor: {
        nullable: true,
        check: "Color",
        apply: "_applyTextColor",
        event: "changeTextColor",
        themeable: true,
        inheritable: true
      },

      /**
       * The widget's font. The value is either a font name defined in the font
       * theme or an instance of {@link qx.bom.Font}.
       */
      font: {
        nullable: true,
        apply: "_applyFont",
        check: "Font",
        event: "changeFont",
        themeable: true,
        inheritable: true,
        dereference: true
      },

      /**
       * Mapping to native style property opacity.
       *
       * The uniform opacity setting to be applied across an entire object.
       * Behaves like the new CSS-3 Property.
       * Any values outside the range 0.0 (fully transparent) to 1.0
       * (fully opaque) will be clamped to this range.
       */
      opacity: {
        check: "Number",
        apply: "_applyOpacity",
        themeable: true,
        nullable: true,
        init: null
      },

      /**
       * Mapping to native style property cursor.
       *
       * The name of the cursor to show when the pointer is over the widget.
       * This is any valid CSS2 cursor name defined by W3C.
       *
       * The following values are possible crossbrowser:
       * <ul><li>default</li>
       * <li>crosshair</li>
       * <li>pointer</li>
       * <li>move</li>
       * <li>n-resize</li>
       * <li>ne-resize</li>
       * <li>e-resize</li>
       * <li>se-resize</li>
       * <li>s-resize</li>
       * <li>sw-resize</li>
       * <li>w-resize</li>
       * <li>nw-resize</li>
       * <li>nesw-resize</li>
       * <li>nwse-resize</li>
       * <li>text</li>
       * <li>wait</li>
       * <li>help </li>
       * </ul>
       */
      cursor: {
        check: "String",
        apply: "_applyCursor",
        themeable: true,
        inheritable: true,
        nullable: true,
        init: null
      },

      /**
       * Sets the tooltip instance to use for this widget. If only the tooltip
       * text and icon have to be set its better to use the {@link #toolTipText}
       * and {@link #toolTipIcon} properties since they use a shared tooltip
       * instance.
       *
       * If this property is set the {@link #toolTipText} and {@link #toolTipIcon}
       * properties are ignored.
       */
      toolTip: {
        check: "qx.ui.tooltip.ToolTip",
        nullable: true
      },

      /**
       * The text of the widget's tooltip. This text can contain HTML markup.
       * The text is displayed using a shared tooltip instance. If the tooltip
       * must be customized beyond the text and an icon {@link #toolTipIcon}, the
       * {@link #toolTip} property has to be used
       */
      toolTipText: {
        check: "String",
        nullable: true,
        event: "changeToolTipText",
        apply: "_applyToolTipText"
      },

      /**
       * The icon URI of the widget's tooltip. This icon is displayed using a shared
       * tooltip instance. If the tooltip must be customized beyond the tooltip text
       * {@link #toolTipText} and the icon, the {@link #toolTip} property has to be
       * used.
       */
      toolTipIcon: {
        check: "String",
        nullable: true,
        event: "changeToolTipText"
      },

      /**
       * Controls if a tooltip should shown or not.
       */
      blockToolTip: {
        check: "Boolean",
        init: false
      },

      /**
       * Forces to show tooltip when widget is disabled.
       */
      showToolTipWhenDisabled: {
        check: "Boolean",
        init: false
      },

      /*
      ---------------------------------------------------------------------------
        MANAGEMENT PROPERTIES
      ---------------------------------------------------------------------------
      */

      /**
       * Controls the visibility. Valid values are:
       *
       * <ul>
       *   <li><b>visible</b>: Render the widget</li>
       *   <li><b>hidden</b>: Hide the widget but don't relayout the widget's parent.</li>
       *   <li><b>excluded</b>: Hide the widget and relayout the parent as if the
       *     widget was not a child of its parent.</li>
       * </ul>
       */
      visibility: {
        check: ["visible", "hidden", "excluded"],
        init: "visible",
        apply: "_applyVisibility",
        event: "changeVisibility"
      },

      /**
       * Whether the widget is enabled. Disabled widgets are usually grayed out
       * and do not process user created events. While in the disabled state most
       * user input events are blocked. Only the {@link #pointerover} and
       * {@link #pointerout} events will be dispatched.
       */
      enabled: {
        init: true,
        check: "Boolean",
        inheritable: true,
        apply: "_applyEnabled",
        event: "changeEnabled"
      },

      /**
       * Whether the widget is anonymous.
       *
       * Anonymous widgets are ignored in the event hierarchy. This is useful
       * for combined widgets where the internal structure do not have a custom
       * appearance with a different styling from the element around. This is
       * especially true for widgets like checkboxes or buttons where the text
       * or icon are handled synchronously for state changes to the outer widget.
       */
      anonymous: {
        init: false,
        check: "Boolean",
        apply: "_applyAnonymous"
      },

      /**
       * Defines the tab index of an widget. If widgets with tab indexes are part
       * of the current focus root these elements are sorted in first priority. Afterwards
       * the sorting continues by rendered position, zIndex and other criteria.
       *
       * Please note: The value must be between 1 and 32000.
       */
      tabIndex: {
        check: "Integer",
        nullable: true,
        apply: "_applyTabIndex"
      },

      /**
       * Whether the widget is focusable e.g. rendering a focus border and visualize
       * as active element.
       *
       * See also {@link #isTabable} which allows runtime checks for
       * <code>isChecked</code> or other stuff to test whether the widget is
       * reachable via the TAB key.
       */
      focusable: {
        check: "Boolean",
        init: false,
        apply: "_applyFocusable"
      },

      /**
       * If this property is enabled, the widget and all of its child widgets
       * will never get focused. The focus keeps at the currently
       * focused widget.
       *
       * This only works for widgets which are not {@link #focusable}.
       *
       * This is mainly useful for widget authors. Please use with caution!
       */
      keepFocus: {
        check: "Boolean",
        init: false,
        apply: "_applyKeepFocus"
      },

      /**
       * If this property if enabled, the widget and all of its child widgets
       * will never get activated. The activation keeps at the currently
       * activated widget.
       *
       * This is mainly useful for widget authors. Please use with caution!
       */
      keepActive: {
        check: "Boolean",
        init: false,
        apply: "_applyKeepActive"
      },

      /** Whether the widget acts as a source for drag&drop operations */
      draggable: {
        check: "Boolean",
        init: false,
        apply: "_applyDraggable"
      },

      /** Whether the widget acts as a target for drag&drop operations */
      droppable: {
        check: "Boolean",
        init: false,
        apply: "_applyDroppable"
      },

      /**
       * Whether the widget contains content which may be selected by the user.
       *
       * If the value set to <code>true</code> the native browser selection can
       * be used for text selection. But it is normally useful for
       * forms fields, longer texts/documents, editors, etc.
       */
      selectable: {
        check: "Boolean",
        init: false,
        event: "changeSelectable",
        apply: "_applySelectable"
      },

      /**
       * Whether to show a context menu and which one
       */
      contextMenu: {
        check: "qx.ui.menu.Menu",
        apply: "_applyContextMenu",
        nullable: true,
        event: "changeContextMenu"
      },

      /**
       * Whether the native context menu should be enabled for this widget. To
       * globally enable the native context menu set the {@link #nativeContextMenu}
       * property of the root widget ({@link qx.ui.root.Abstract}) to
       * <code>true</code>.
       */
      nativeContextMenu: {
        check: "Boolean",
        init: false,
        themeable: true,
        event: "changeNativeContextMenu",
        apply: "_applyNativeContextMenu"
      },

      /**
       * The appearance ID. This ID is used to identify the appearance theme
       * entry to use for this widget. This controls the styling of the element.
       */
      appearance: {
        check: "String",
        init: "widget",
        apply: "_applyAppearance",
        event: "changeAppearance"
      }
    },

    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */
    statics: {
      /** Whether the widget should print out hints and debug messages */
      DEBUG: false,

      /** Whether to throw an error on focus/blur if the widget is unfocusable */
      UNFOCUSABLE_WIDGET_FOCUS_BLUR_ERROR: true,

      /**
       * Returns the widget, which contains the given DOM element.
       *
       * @param element {Element} The DOM element to search the widget for.
       * @param considerAnonymousState {Boolean?false} If true, anonymous widget
       *   will not be returned.
       * @return {qx.ui.core.Widget} The widget containing the element.
       */
      getWidgetByElement: function getWidgetByElement(element, considerAnonymousState) {
        while (element) {
          {
            qx.core.Assert.assertTrue(!element.$$qxObjectHash && !element.$$qxObject || element.$$qxObject && element.$$qxObjectHash && element.$$qxObject.toHashCode() === element.$$qxObjectHash);
          }
          var widget = element.$$qxObject; // check for anonymous widgets

          if (widget) {
            if (!considerAnonymousState || !widget.getAnonymous()) {
              return widget;
            }
          } // Fix for FF, which occasionally breaks (BUG#3525)


          try {
            element = element.parentNode;
          } catch (e) {
            return null;
          }
        }

        return null;
      },

      /**
       * Whether the "parent" widget contains the "child" widget.
       *
       * @param parent {qx.ui.core.Widget} The parent widget
       * @param child {qx.ui.core.Widget} The child widget
       * @return {Boolean} Whether one of the "child"'s parents is "parent"
       */
      contains: function contains(parent, child) {
        while (child) {
          child = child.getLayoutParent();

          if (parent == child) {
            return true;
          }
        }

        return false;
      },

      /** @type {Map} Contains all pooled separators for reuse */
      __separatorPool__P_38_2: new qx.util.ObjectPool()
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      __contentElement__P_38_0: null,
      __initialAppearanceApplied__P_38_3: null,
      __toolTipTextListenerId__P_38_4: null,

      /*
      ---------------------------------------------------------------------------
        LAYOUT INTERFACE
      ---------------------------------------------------------------------------
      */

      /**
       * @type {qx.ui.layout.Abstract} The connected layout manager
       */
      __layoutManager__P_38_5: null,
      // overridden
      _getLayout: function _getLayout() {
        return this.__layoutManager__P_38_5;
      },

      /**
       * Set a layout manager for the widget. A a layout manager can only be connected
       * with one widget. Reset the connection with a previous widget first, if you
       * like to use it in another widget instead.
       *
       * @param layout {qx.ui.layout.Abstract} The new layout or
       *     <code>null</code> to reset the layout.
       */
      _setLayout: function _setLayout(layout) {
        {
          if (layout) {
            this.assertInstance(layout, qx.ui.layout.Abstract);
          }
        }

        if (this.__layoutManager__P_38_5) {
          this.__layoutManager__P_38_5.connectToWidget(null);
        }

        if (layout) {
          layout.connectToWidget(this);
        }

        this.__layoutManager__P_38_5 = layout;
        qx.ui.core.queue.Layout.add(this);
      },
      // overridden
      setLayoutParent: function setLayoutParent(parent) {
        if (this.$$parent === parent) {
          return;
        }

        var content = this.getContentElement();

        if (this.$$parent && !this.$$parent.$$disposed) {
          this.$$parent.getContentElement().remove(content);
        }

        this.$$parent = parent || null;

        if (parent && !parent.$$disposed) {
          this.$$parent.getContentElement().add(content);
        } // Update inheritable properties


        this.$$refreshInheritables(); // Update visibility cache

        qx.ui.core.queue.Visibility.add(this);
      },

      /** @type {Boolean} Whether insets have changed and must be updated */
      _updateInsets: null,
      // overridden
      renderLayout: function renderLayout(left, top, width, height) {
        var changes = qx.ui.core.Widget.superclass.prototype.renderLayout.call(this, left, top, width, height); // Directly return if superclass has detected that no
        // changes needs to be applied

        if (!changes) {
          return null;
        }

        if (qx.lang.Object.isEmpty(changes) && !this._updateInsets) {
          return null;
        }

        var content = this.getContentElement();
        var inner = changes.size || this._updateInsets;
        var pixel = "px";
        var contentStyles = {}; // Move content to new position

        if (changes.position) {
          contentStyles.left = left + pixel;
          contentStyles.top = top + pixel;
        }

        if (inner || changes.margin) {
          contentStyles.width = width + pixel;
          contentStyles.height = height + pixel;
        }

        if (Object.keys(contentStyles).length > 0) {
          content.setStyles(contentStyles);
        }

        if (inner || changes.local || changes.margin) {
          if (this.__layoutManager__P_38_5 && this.hasLayoutChildren()) {
            var inset = this.getInsets();
            var innerWidth = width - inset.left - inset.right;
            var innerHeight = height - inset.top - inset.bottom;
            var decorator = this.getDecorator();
            var decoratorPadding = {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            };

            if (decorator) {
              decorator = qx.theme.manager.Decoration.getInstance().resolve(decorator);
              decoratorPadding = decorator.getPadding();
            }

            var padding = {
              top: this.getPaddingTop() + decoratorPadding.top,
              right: this.getPaddingRight() + decoratorPadding.right,
              bottom: this.getPaddingBottom() + decoratorPadding.bottom,
              left: this.getPaddingLeft() + decoratorPadding.left
            };

            this.__layoutManager__P_38_5.renderLayout(innerWidth, innerHeight, padding);
          } else if (this.hasLayoutChildren()) {
            throw new Error("At least one child in control " + this._findTopControl() + " requires a layout, but no one was defined!");
          }
        } // Fire events


        if (changes.position && this.hasListener("move")) {
          this.fireDataEvent("move", this.getBounds());
        }

        if (changes.size && this.hasListener("resize")) {
          this.fireDataEvent("resize", this.getBounds());
        } // Cleanup flags


        delete this._updateInsets;
        return changes;
      },

      /*
      ---------------------------------------------------------------------------
        SEPARATOR SUPPORT
      ---------------------------------------------------------------------------
      */
      __separators__P_38_6: null,
      // overridden
      clearSeparators: function clearSeparators() {
        var reg = this.__separators__P_38_6;

        if (!reg) {
          return;
        }

        var pool = qx.ui.core.Widget.__separatorPool__P_38_2;
        var content = this.getContentElement();
        var widget;

        for (var i = 0, l = reg.length; i < l; i++) {
          widget = reg[i];
          pool.poolObject(widget);
          content.remove(widget.getContentElement());
        } // Clear registry


        reg.length = 0;
      },
      // overridden
      renderSeparator: function renderSeparator(separator, bounds) {
        // Insert
        var widget = qx.ui.core.Widget.__separatorPool__P_38_2.getObject(qx.ui.core.Widget);

        widget.set({
          decorator: separator
        });
        var elem = widget.getContentElement();
        this.getContentElement().add(elem); // Move

        var domEl = elem.getDomElement(); // use the DOM element because the cache of the qx.html.Element could be
        // wrong due to changes made by the decorators which work on the DOM element too

        if (domEl) {
          domEl.style.top = bounds.top + "px";
          domEl.style.left = bounds.left + "px";
          domEl.style.width = bounds.width + "px";
          domEl.style.height = bounds.height + "px";
        } else {
          elem.setStyles({
            left: bounds.left + "px",
            top: bounds.top + "px",
            width: bounds.width + "px",
            height: bounds.height + "px"
          });
        } // Remember element


        if (!this.__separators__P_38_6) {
          this.__separators__P_38_6 = [];
        }

        this.__separators__P_38_6.push(widget);
      },

      /*
      ---------------------------------------------------------------------------
        SIZE HINTS
      ---------------------------------------------------------------------------
      */
      // overridden
      _computeSizeHint: function _computeSizeHint() {
        // Start with the user defined values
        var width = this.getWidth();
        var minWidth = this.getMinWidth();
        var maxWidth = this.getMaxWidth();
        var height = this.getHeight();
        var minHeight = this.getMinHeight();
        var maxHeight = this.getMaxHeight();
        {
          if (minWidth !== null && maxWidth !== null) {
            this.assert(minWidth <= maxWidth, "minWidth is larger than maxWidth!");
          }

          if (minHeight !== null && maxHeight !== null) {
            this.assert(minHeight <= maxHeight, "minHeight is larger than maxHeight!");
          }
        } // Ask content

        var contentHint = this._getContentHint();

        var insets = this.getInsets();
        var insetX = insets.left + insets.right;
        var insetY = insets.top + insets.bottom;

        if (width == null) {
          width = contentHint.width + insetX;
        }

        if (height == null) {
          height = contentHint.height + insetY;
        }

        if (minWidth == null) {
          minWidth = insetX;

          if (contentHint.minWidth != null) {
            minWidth += contentHint.minWidth; // do not apply bigger min width than max width [BUG #5008]

            if (minWidth > maxWidth && maxWidth != null) {
              minWidth = maxWidth;
            }
          }
        }

        if (minHeight == null) {
          minHeight = insetY;

          if (contentHint.minHeight != null) {
            minHeight += contentHint.minHeight; // do not apply bigger min height than max height [BUG #5008]

            if (minHeight > maxHeight && maxHeight != null) {
              minHeight = maxHeight;
            }
          }
        }

        if (maxWidth == null) {
          if (contentHint.maxWidth == null) {
            maxWidth = Infinity;
          } else {
            maxWidth = contentHint.maxWidth + insetX; // do not apply bigger min width than max width [BUG #5008]

            if (maxWidth < minWidth && minWidth != null) {
              maxWidth = minWidth;
            }
          }
        }

        if (maxHeight == null) {
          if (contentHint.maxHeight == null) {
            maxHeight = Infinity;
          } else {
            maxHeight = contentHint.maxHeight + insetY; // do not apply bigger min width than max width [BUG #5008]

            if (maxHeight < minHeight && minHeight != null) {
              maxHeight = minHeight;
            }
          }
        } // Build size hint and return


        return {
          width: width,
          minWidth: minWidth,
          maxWidth: maxWidth,
          height: height,
          minHeight: minHeight,
          maxHeight: maxHeight
        };
      },
      // overridden
      invalidateLayoutCache: function invalidateLayoutCache() {
        qx.ui.core.Widget.superclass.prototype.invalidateLayoutCache.call(this);

        if (this.__layoutManager__P_38_5) {
          this.__layoutManager__P_38_5.invalidateLayoutCache();
        }
      },

      /**
       * Returns the recommended/natural dimensions of the widget's content.
       *
       * For labels and images this may be their natural size when defined without
       * any dimensions. For containers this may be the recommended size of the
       * underlying layout manager.
       *
       * Developer note: This can be overwritten by the derived classes to allow
       * a custom handling here.
       *
       * @return {Map}
       */
      _getContentHint: function _getContentHint() {
        var layout = this.__layoutManager__P_38_5;

        if (layout) {
          if (this.hasLayoutChildren()) {
            var hint = layout.getSizeHint();
            {
              var msg = "The layout of the widget" + this.toString() + " returned an invalid size hint!";
              this.assertInteger(hint.width, "Wrong 'left' argument. " + msg);
              this.assertInteger(hint.height, "Wrong 'top' argument. " + msg);
            }
            return hint;
          } else {
            return {
              width: 0,
              height: 0
            };
          }
        } else {
          return {
            width: 100,
            height: 50
          };
        }
      },
      // overridden
      _getHeightForWidth: function _getHeightForWidth(width) {
        // Prepare insets
        var insets = this.getInsets();
        var insetX = insets.left + insets.right;
        var insetY = insets.top + insets.bottom; // Compute content width

        var contentWidth = width - insetX; // Compute height

        var contentHeight = 0;

        var layout = this._getLayout();

        if (layout && layout.hasHeightForWidth()) {
          contentHeight = layout.getHeightForWidth(contentWidth);
        } else {
          contentHeight = this._getContentHeightForWidth(contentWidth);
        } // Computed box height


        var height = contentHeight + insetY;
        return height;
      },

      /**
       * Returns the computed height for the given width.
       *
       * @abstract
       * @param width {Integer} Incoming width (as limitation)
       * @return {Integer} Computed height while respecting the given width.
       */
      _getContentHeightForWidth: function _getContentHeightForWidth(width) {
        throw new Error("Abstract method call: _getContentHeightForWidth()!");
      },

      /*
      ---------------------------------------------------------------------------
        INSET CALCULATION SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the sum of the widget's padding and border width.
       *
       * @return {Map} Contains the keys <code>top</code>, <code>right</code>,
       *   <code>bottom</code> and <code>left</code>. All values are integers.
       */
      getInsets: function getInsets() {
        var top = this.getPaddingTop();
        var right = this.getPaddingRight();
        var bottom = this.getPaddingBottom();
        var left = this.getPaddingLeft();

        if (this.getDecorator()) {
          var decorator = qx.theme.manager.Decoration.getInstance().resolve(this.getDecorator());
          var inset = decorator.getInsets();
          {
            this.assertNumber(inset.top, "Invalid top decorator inset detected: " + inset.top);
            this.assertNumber(inset.right, "Invalid right decorator inset detected: " + inset.right);
            this.assertNumber(inset.bottom, "Invalid bottom decorator inset detected: " + inset.bottom);
            this.assertNumber(inset.left, "Invalid left decorator inset detected: " + inset.left);
          }
          top += inset.top;
          right += inset.right;
          bottom += inset.bottom;
          left += inset.left;
        }

        return {
          top: top,
          right: right,
          bottom: bottom,
          left: left
        };
      },

      /*
      ---------------------------------------------------------------------------
        COMPUTED LAYOUT SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the widget's computed inner size as available
       * through the layout process.
       *
       * This function is guaranteed to return a correct value
       * during a {@link #resize} or {@link #move} event dispatch.
       *
       * @return {Map} The widget inner dimension in pixel (if the layout is
       *    valid). Contains the keys <code>width</code> and <code>height</code>.
       */
      getInnerSize: function getInnerSize() {
        var computed = this.getBounds();

        if (!computed) {
          return null;
        } // Return map data


        var insets = this.getInsets();
        return {
          width: computed.width - insets.left - insets.right,
          height: computed.height - insets.top - insets.bottom
        };
      },

      /*
      ---------------------------------------------------------------------------
        ANIMATION SUPPORT: USER API
      ---------------------------------------------------------------------------
      */

      /**
       * Fade out this widget.
       * @param duration {Number} Time in ms.
       * @return {qx.bom.element.AnimationHandle} The animation handle to react for
       *   the fade animation.
       */
      fadeOut: function fadeOut(duration) {
        return this.getContentElement().fadeOut(duration);
      },

      /**
       * Fade in the widget.
       * @param duration {Number} Time in ms.
       * @return {qx.bom.element.AnimationHandle} The animation handle to react for
       *   the fade animation.
       */
      fadeIn: function fadeIn(duration) {
        return this.getContentElement().fadeIn(duration);
      },

      /*
      ---------------------------------------------------------------------------
        VISIBILITY SUPPORT: USER API
      ---------------------------------------------------------------------------
      */
      // property apply
      _applyAnonymous: function _applyAnonymous(value) {
        if (value) {
          this.getContentElement().setAttribute("qxanonymous", "true");
        } else {
          this.getContentElement().removeAttribute("qxanonymous");
        }
      },

      /**
       * Make this widget visible.
       *
       */
      show: function show() {
        this.setVisibility("visible");
      },

      /**
       * Hide this widget.
       *
       */
      hide: function hide() {
        this.setVisibility("hidden");
      },

      /**
       * Hide this widget and exclude it from the underlying layout.
       *
       */
      exclude: function exclude() {
        this.setVisibility("excluded");
      },

      /**
       * Whether the widget is locally visible.
       *
       * Note: This method does not respect the hierarchy.
       *
       * @return {Boolean} Returns <code>true</code> when the widget is visible
       */
      isVisible: function isVisible() {
        return this.getVisibility() === "visible";
      },

      /**
       * Whether the widget is locally hidden.
       *
       * Note: This method does not respect the hierarchy.
       *
       * @return {Boolean} Returns <code>true</code> when the widget is hidden
       */
      isHidden: function isHidden() {
        return this.getVisibility() !== "visible";
      },

      /**
       * Whether the widget is locally excluded.
       *
       * Note: This method does not respect the hierarchy.
       *
       * @return {Boolean} Returns <code>true</code> when the widget is excluded
       */
      isExcluded: function isExcluded() {
        return this.getVisibility() === "excluded";
      },

      /**
       * Detects if the widget and all its parents are visible.
       *
       * WARNING: Please use this method with caution because it flushes the
       * internal queues which might be an expensive operation.
       *
       * @return {Boolean} true, if the widget is currently on the screen
       */
      isSeeable: function isSeeable() {
        // Flush the queues because to detect if the widget ins visible, the
        // queues need to be flushed (see bug #5254)
        qx.ui.core.queue.Manager.flush(); // if the element is already rendered, a check for the offsetWidth is enough

        var element = this.getContentElement().getDomElement();

        if (element) {
          // will also be 0 if the parents are not visible
          return element.offsetWidth > 0;
        } // if no element is available, it can not be visible


        return false;
      },

      /*
      ---------------------------------------------------------------------------
        CREATION OF HTML ELEMENTS
      ---------------------------------------------------------------------------
      */

      /**
       * Create the widget's content HTML element.
       *
       * @return {qx.html.Element} The content HTML element
       */
      __createContentElement__P_38_1: function __createContentElement__P_38_1() {
        var el = this._createContentElement();

        el.connectObject(this); // make sure to allow all pointer events

        el.setStyles({
          "touch-action": "none",
          "-ms-touch-action": "none"
        });
        {
          el.setAttribute("qxClass", this.classname);
        }
        var styles = {
          zIndex: 10,
          boxSizing: "border-box"
        };

        if (!qx.ui.root.Inline || !(this instanceof qx.ui.root.Inline)) {
          styles.position = "absolute";
        }

        el.setStyles(styles);
        return el;
      },

      /**
       * Creates the content element. The style properties
       * position and zIndex are modified from the Widget
       * core.
       *
       * This function may be overridden to customize a class
       * content.
       *
       * @return {qx.html.Element} The widget's content element
       */
      _createContentElement: function _createContentElement() {
        return new qx.html.Element("div", {
          overflowX: "hidden",
          overflowY: "hidden"
        });
      },

      /**
       * Returns the element wrapper of the widget's content element.
       * This method exposes widget internal and must be used with caution!
       *
       * @return {qx.html.Element} The widget's content element
       */
      getContentElement: function getContentElement() {
        return this.__contentElement__P_38_0;
      },

      /*
      ---------------------------------------------------------------------------
        CHILDREN HANDLING
      ---------------------------------------------------------------------------
      */

      /** @type {qx.ui.core.LayoutItem[]} List of all child widgets */
      __widgetChildren__P_38_7: null,

      /**
       * Returns all children, which are layout relevant. This excludes all widgets,
       * which have a {@link qx.ui.core.Widget#visibility} value of <code>exclude</code>.
       *
       * @internal
       * @return {qx.ui.core.Widget[]} All layout relevant children.
       */
      getLayoutChildren: function getLayoutChildren() {
        var children = this.__widgetChildren__P_38_7;

        if (!children) {
          return this.__emptyChildren__P_38_8;
        }

        var layoutChildren;

        for (var i = 0, l = children.length; i < l; i++) {
          var child = children[i];

          if (child.hasUserBounds() || child.isExcluded()) {
            if (layoutChildren == null) {
              layoutChildren = children.concat();
            }

            qx.lang.Array.remove(layoutChildren, child);
          }
        }

        return layoutChildren || children;
      },

      /**
       * Marks the layout of this widget as invalid and triggers a layout update.
       * This is a shortcut for <code>qx.ui.core.queue.Layout.add(this);</code>.
       */
      scheduleLayoutUpdate: function scheduleLayoutUpdate() {
        qx.ui.core.queue.Layout.add(this);
      },

      /**
       * Resets the cache for children which should be laid out.
       */
      invalidateLayoutChildren: function invalidateLayoutChildren() {
        var layout = this.__layoutManager__P_38_5;

        if (layout) {
          layout.invalidateChildrenCache();
        }

        qx.ui.core.queue.Layout.add(this);
      },

      /**
       * Returns whether the layout has children, which are layout relevant. This
       * excludes all widgets, which have a {@link qx.ui.core.Widget#visibility}
       * value of <code>exclude</code>.
       *
       * @return {Boolean} Whether the layout has layout relevant children
       */
      hasLayoutChildren: function hasLayoutChildren() {
        var children = this.__widgetChildren__P_38_7;

        if (!children) {
          return false;
        }

        var child;

        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];

          if (!child.hasUserBounds() && !child.isExcluded()) {
            return true;
          }
        }

        return false;
      },

      /**
       * Returns the widget which contains the children and
       * is relevant for laying them out. This is from the user point of
       * view and may not be identical to the technical structure.
       *
       * @return {qx.ui.core.Widget} Widget which contains the children.
       */
      getChildrenContainer: function getChildrenContainer() {
        return this;
      },

      /**
       * @type {Array} Placeholder for children list in empty widgets.
       *     Mainly to keep instance number low.
       *
       * @lint ignoreReferenceField(__emptyChildren)
       */
      __emptyChildren__P_38_8: [],

      /**
       * Returns the children list
       *
       * @return {qx.ui.core.LayoutItem[]} The children array (Arrays are
       *   reference types, so please do not modify it in-place).
       */
      _getChildren: function _getChildren() {
        return this.__widgetChildren__P_38_7 || this.__emptyChildren__P_38_8;
      },

      /**
       * Returns the index position of the given widget if it is
       * a child widget. Otherwise it returns <code>-1</code>.
       *
       * @param child {qx.ui.core.Widget} the widget to query for
       * @return {Integer} The index position or <code>-1</code> when
       *   the given widget is no child of this layout.
       */
      _indexOf: function _indexOf(child) {
        var children = this.__widgetChildren__P_38_7;

        if (!children) {
          return -1;
        }

        return children.indexOf(child);
      },

      /**
       * Whether the widget contains children.
       *
       * @return {Boolean} Returns <code>true</code> when the widget has children.
       */
      _hasChildren: function _hasChildren() {
        var children = this.__widgetChildren__P_38_7;
        return children != null && !!children[0];
      },

      /**
       * Recursively adds all children to the given queue
       *
       * @param queue {Array} The queue to add widgets to
       */
      addChildrenToQueue: function addChildrenToQueue(queue) {
        var children = this.__widgetChildren__P_38_7;

        if (!children) {
          return;
        }

        var child;

        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          queue.push(child);
          child.addChildrenToQueue(queue);
        }
      },

      /**
       * Adds a new child widget.
       *
       * The supported keys of the layout options map depend on the layout manager
       * used to position the widget. The options are documented in the class
       * documentation of each layout manager {@link qx.ui.layout}.
       *
       * @param child {qx.ui.core.LayoutItem} the widget to add.
       * @param options {Map?null} Optional layout data for widget.
       */
      _add: function _add(child, options) {
        {
          this.assertInstance(child, qx.ui.core.LayoutItem.constructor, "'Child' must be an instance of qx.ui.core.LayoutItem!");
        } // When moving in the same widget, remove widget first

        if (child.getLayoutParent() == this) {
          qx.lang.Array.remove(this.__widgetChildren__P_38_7, child);
        }

        if (this.__widgetChildren__P_38_7) {
          this.__widgetChildren__P_38_7.push(child);
        } else {
          this.__widgetChildren__P_38_7 = [child];
        }

        this.__addHelper__P_38_9(child, options);
      },

      /**
       * Add a child widget at the specified index
       *
       * @param child {qx.ui.core.LayoutItem} widget to add
       * @param index {Integer} Index, at which the widget will be inserted. If no
       *   widget exists at the given index, the new widget gets appended to the
       *   current list of children.
       * @param options {Map?null} Optional layout data for widget.
       */
      _addAt: function _addAt(child, index, options) {
        if (!this.__widgetChildren__P_38_7) {
          this.__widgetChildren__P_38_7 = [];
        } // When moving in the same widget, remove widget first


        if (child.getLayoutParent() == this) {
          qx.lang.Array.remove(this.__widgetChildren__P_38_7, child);
        }

        var ref = this.__widgetChildren__P_38_7[index];

        if (ref === child) {
          child.setLayoutProperties(options);
        }

        if (ref) {
          qx.lang.Array.insertBefore(this.__widgetChildren__P_38_7, child, ref);
        } else {
          this.__widgetChildren__P_38_7.push(child);
        }

        this.__addHelper__P_38_9(child, options);
      },

      /**
       * Add a widget before another already inserted widget
       *
       * @param child {qx.ui.core.LayoutItem} widget to add
       * @param before {qx.ui.core.LayoutItem} widget before the new widget will be inserted.
       * @param options {Map?null} Optional layout data for widget.
       */
      _addBefore: function _addBefore(child, before, options) {
        {
          this.assertInArray(before, this._getChildren(), "The 'before' widget is not a child of this widget!");
        }

        if (child == before) {
          return;
        }

        if (!this.__widgetChildren__P_38_7) {
          this.__widgetChildren__P_38_7 = [];
        } // When moving in the same widget, remove widget first


        if (child.getLayoutParent() == this) {
          qx.lang.Array.remove(this.__widgetChildren__P_38_7, child);
        }

        qx.lang.Array.insertBefore(this.__widgetChildren__P_38_7, child, before);

        this.__addHelper__P_38_9(child, options);
      },

      /**
       * Add a widget after another already inserted widget
       *
       * @param child {qx.ui.core.LayoutItem} widget to add
       * @param after {qx.ui.core.LayoutItem} widget, after which the new widget will
       *   be inserted
       * @param options {Map?null} Optional layout data for widget.
       */
      _addAfter: function _addAfter(child, after, options) {
        {
          this.assertInArray(after, this._getChildren(), "The 'after' widget is not a child of this widget!");
        }

        if (child == after) {
          return;
        }

        if (!this.__widgetChildren__P_38_7) {
          this.__widgetChildren__P_38_7 = [];
        } // When moving in the same widget, remove widget first


        if (child.getLayoutParent() == this) {
          qx.lang.Array.remove(this.__widgetChildren__P_38_7, child);
        }

        qx.lang.Array.insertAfter(this.__widgetChildren__P_38_7, child, after);

        this.__addHelper__P_38_9(child, options);
      },

      /**
       * Remove the given child widget.
       *
       * @param child {qx.ui.core.LayoutItem} the widget to remove
       */
      _remove: function _remove(child) {
        if (!this.__widgetChildren__P_38_7) {
          throw new Error("This widget has no children!");
        }

        qx.lang.Array.remove(this.__widgetChildren__P_38_7, child);

        this.__removeHelper__P_38_10(child);
      },

      /**
       * Remove the widget at the specified index.
       *
       * @param index {Integer} Index of the widget to remove.
       * @return {qx.ui.core.LayoutItem} The removed item.
       */
      _removeAt: function _removeAt(index) {
        if (!this.__widgetChildren__P_38_7) {
          throw new Error("This widget has no children!");
        }

        var child = this.__widgetChildren__P_38_7[index];
        qx.lang.Array.removeAt(this.__widgetChildren__P_38_7, index);

        this.__removeHelper__P_38_10(child);

        return child;
      },

      /**
       * Remove all children.
       *
       * @return {Array} An array containing the removed children.
       */
      _removeAll: function _removeAll() {
        if (!this.__widgetChildren__P_38_7) {
          return [];
        } // Working on a copy to make it possible to clear the
        // internal array before calling setLayoutParent()


        var children = this.__widgetChildren__P_38_7.concat();

        this.__widgetChildren__P_38_7.length = 0;

        for (var i = children.length - 1; i >= 0; i--) {
          this.__removeHelper__P_38_10(children[i]);
        }

        qx.ui.core.queue.Layout.add(this);
        return children;
      },

      /*
      ---------------------------------------------------------------------------
        CHILDREN HANDLING - TEMPLATE METHODS
      ---------------------------------------------------------------------------
      */

      /**
       * This method gets called each time after a child widget was added and can
       * be overridden to get notified about child adds.
       *
       * @signature function(child)
       * @param child {qx.ui.core.LayoutItem} The added child.
       */
      _afterAddChild: null,

      /**
       * This method gets called each time after a child widget was removed and
       * can be overridden to get notified about child removes.
       *
       * @signature function(child)
       * @param child {qx.ui.core.LayoutItem} The removed child.
       */
      _afterRemoveChild: null,

      /*
      ---------------------------------------------------------------------------
        CHILDREN HANDLING - IMPLEMENTATION
      ---------------------------------------------------------------------------
      */

      /**
       * Convenience function to add a child widget. It will insert the child to
       * the parent widget and schedule a layout update.
       *
       * @param child {qx.ui.core.LayoutItem} The child to add.
       * @param options {Map|null} Optional layout data for the widget.
       */
      __addHelper__P_38_9: function __addHelper__P_38_9(child, options) {
        {
          this.assertInstance(child, qx.ui.core.LayoutItem, "Invalid widget to add: " + child);
          this.assertNotIdentical(child, this, "Could not add widget to itself: " + child);

          if (options != null) {
            this.assertType(options, "object", "Invalid layout data: " + options);
          }
        } // Remove from old parent

        var parent = child.getLayoutParent();

        if (parent && parent != this) {
          parent._remove(child);
        } // Remember parent


        child.setLayoutParent(this); // Import options: This call will
        //  - clear the layout's children cache as well and
        //  - add its parent (this widget) to the layout queue

        if (options) {
          child.setLayoutProperties(options);
        } else {
          this.updateLayoutProperties();
        } // call the template method


        if (this._afterAddChild) {
          this._afterAddChild(child);
        }
      },

      /**
       * Convenience function to remove a child widget. It will remove it
       * from the parent widget and schedule a layout update.
       *
       * @param child {qx.ui.core.LayoutItem} The child to remove.
       */
      __removeHelper__P_38_10: function __removeHelper__P_38_10(child) {
        {
          this.assertNotUndefined(child);
        }

        if (child.getLayoutParent() !== this) {
          throw new Error("Remove Error: " + child + " is not a child of this widget!");
        } // Clear parent connection


        child.setLayoutParent(null); // clear the layout's children cache

        if (this.__layoutManager__P_38_5) {
          this.__layoutManager__P_38_5.invalidateChildrenCache();
        } // Add to layout queue


        qx.ui.core.queue.Layout.add(this); // call the template method

        if (this._afterRemoveChild) {
          this._afterRemoveChild(child);
        }
      },

      /*
      ---------------------------------------------------------------------------
        EVENTS
      ---------------------------------------------------------------------------
      */

      /**
       * Enables pointer event capturing. All pointer events will dispatched on this
       * widget until capturing is disabled using {@link #releaseCapture} or a
       * pointer button is clicked. If the widgets becomes the capturing widget the
       * {@link #capture} event is fired. Once it loses capture mode the
       * {@link #losecapture} event is fired.
       *
       * @param capture {Boolean?true} If true all events originating in
       *   the container are captured. If false events originating in the container
       *   are not captured.
       */
      capture: function capture(_capture) {
        this.getContentElement().capture(_capture);
      },

      /**
       * Disables pointer capture mode enabled by {@link #capture}.
       */
      releaseCapture: function releaseCapture() {
        this.getContentElement().releaseCapture();
      },

      /**
       * Checks if pointer event capturing is enabled for this widget.
       *
       * @return {Boolean} <code>true</code> if capturing is active
       */
      isCapturing: function isCapturing() {
        var el = this.getContentElement().getDomElement();

        if (!el) {
          return false;
        }

        var manager = qx.event.Registration.getManager(el);
        var dispatcher = manager.getDispatcher(qx.event.dispatch.MouseCapture);
        return el == dispatcher.getCaptureElement();
      },

      /*
      ---------------------------------------------------------------------------
        PADDING SUPPORT
      ---------------------------------------------------------------------------
      */
      // property apply
      _applyPadding: function _applyPadding(value, old, name) {
        this._updateInsets = true;
        qx.ui.core.queue.Layout.add(this);

        this.__updateContentPadding__P_38_11(name, value);
      },

      /**
       * Helper to updated the css padding of the content element considering the
       * padding of the decorator.
       * @param style {String} The name of the css padding property e.g. <code>paddingTop</code>
       * @param value {Number} The value to set.
       */
      __updateContentPadding__P_38_11: function __updateContentPadding__P_38_11(style, value) {
        var content = this.getContentElement();
        var decorator = this.getDecorator();
        decorator = qx.theme.manager.Decoration.getInstance().resolve(decorator);

        if (decorator) {
          var direction = qx.Bootstrap.firstLow(style.replace("padding", ""));
          value += decorator.getPadding()[direction] || 0;
        }

        content.setStyle(style, value + "px");
      },

      /*
      ---------------------------------------------------------------------------
        DECORATION SUPPORT
      ---------------------------------------------------------------------------
      */
      // property apply
      _applyDecorator: function _applyDecorator(value, old) {
        var content = this.getContentElement();

        if (old) {
          old = qx.theme.manager.Decoration.getInstance().getCssClassName(old);
          content.removeClass(old);
        }

        if (value) {
          value = qx.theme.manager.Decoration.getInstance().addCssClass(value);
          content.addClass(value);
        }

        if (value || old) {
          qx.ui.core.queue.Layout.add(this);
        }
      },

      /*
      ---------------------------------------------------------------------------
        OTHER PROPERTIES
      ---------------------------------------------------------------------------
      */
      // property apply
      _applyToolTipText: function _applyToolTipText(value, old) {
        {
          if (this.__toolTipTextListenerId__P_38_4) {
            return;
          }

          var manager = qx.locale.Manager.getInstance();
          this.__toolTipTextListenerId__P_38_4 = manager.addListener("changeLocale", function () {
            var toolTipText = this.getToolTipText();

            if (toolTipText && toolTipText.translate) {
              this.setToolTipText(toolTipText.translate());
            }
          }, this);
        }
      },
      // property apply
      _applyTextColor: function _applyTextColor(value, old) {// empty template
      },
      // property apply
      _applyZIndex: function _applyZIndex(value, old) {
        this.getContentElement().setStyle("zIndex", value == null ? 0 : value);
      },
      // property apply
      _applyVisibility: function _applyVisibility(value, old) {
        var content = this.getContentElement();

        if (value === "visible") {
          content.show();
        } else {
          content.hide();
        } // only force a layout update if visibility change from/to "exclude"


        var parent = this.$$parent;

        if (parent && (old == null || value == null || old === "excluded" || value === "excluded")) {
          parent.invalidateLayoutChildren();
        } // Update visibility cache


        qx.ui.core.queue.Visibility.add(this);
      },
      // property apply
      _applyOpacity: function _applyOpacity(value, old) {
        this.getContentElement().setStyle("opacity", value == 1 ? null : value);
      },
      // property apply
      _applyCursor: function _applyCursor(value, old) {
        if (value == null && !this.isSelectable()) {
          value = "default";
        } // In Opera the cursor must be set directly.
        // http://bugzilla.qooxdoo.org/show_bug.cgi?id=1729


        this.getContentElement().setStyle("cursor", value, qx.core.Environment.get("engine.name") == "opera");
      },
      // property apply
      _applyBackgroundColor: function _applyBackgroundColor(value, old) {
        var color = this.getBackgroundColor();
        var content = this.getContentElement();
        var resolved = qx.theme.manager.Color.getInstance().resolve(color);
        content.setStyle("backgroundColor", resolved);
      },
      // property apply
      _applyFont: function _applyFont(value, old) {// empty template
      },

      /*
      ---------------------------------------------------------------------------
        DYNAMIC THEME SWITCH SUPPORT
      ---------------------------------------------------------------------------
      */
      // overridden
      _onChangeTheme: function _onChangeTheme() {
        if (this.isDisposed()) {
          return;
        }

        qx.ui.core.Widget.superclass.prototype._onChangeTheme.call(this); // update the appearance


        this.updateAppearance(); // DECORATOR //

        var value = this.getDecorator();

        this._applyDecorator(null, value);

        this._applyDecorator(value); // FONT //


        value = this.getFont();

        if (qx.lang.Type.isString(value)) {
          this._applyFont(value, value);
        } // TEXT COLOR //


        value = this.getTextColor();

        if (qx.lang.Type.isString(value)) {
          this._applyTextColor(value, value);
        } // BACKGROUND COLOR //


        value = this.getBackgroundColor();

        if (qx.lang.Type.isString(value)) {
          this._applyBackgroundColor(value, value);
        }
      },

      /*
      ---------------------------------------------------------------------------
        STATE HANDLING
      ---------------------------------------------------------------------------
      */

      /** @type {Map} The current widget states */
      __states__P_38_12: null,

      /** @type {Boolean} Whether the widget has state changes which are not yet queued */
      $$stateChanges: null,

      /** @type {Map} Can be overridden to forward states to the child controls. */
      _forwardStates: null,

      /**
       * Returns whether a state is set.
       *
       * @param state {String} the state to check.
       * @return {Boolean} whether the state is set.
       */
      hasState: function hasState(state) {
        var states = this.__states__P_38_12;
        return !!states && !!states[state];
      },

      /**
       * Sets a state.
       *
       * @param state {String} The state to add
       */
      addState: function addState(state) {
        // Dynamically create state map
        var states = this.__states__P_38_12;

        if (!states) {
          states = this.__states__P_38_12 = {};
        }

        if (states[state]) {
          return;
        } // Add state and queue


        this.__states__P_38_12[state] = true; // Fast path for hovered state

        if (state === "hovered") {
          this.syncAppearance();
        } else if (!qx.ui.core.queue.Visibility.isVisible(this)) {
          this.$$stateChanges = true;
        } else {
          qx.ui.core.queue.Appearance.add(this);
        } // Forward state change to child controls


        var forward = this._forwardStates;
        var controls = this.__childControls__P_38_13;

        if (forward && forward[state] && controls) {
          var control;

          for (var id in controls) {
            control = controls[id];

            if (control instanceof qx.ui.core.Widget) {
              controls[id].addState(state);
            }
          }
        }
      },

      /**
       * Clears a state.
       *
       * @param state {String} the state to clear.
       */
      removeState: function removeState(state) {
        // Check for existing state
        var states = this.__states__P_38_12;

        if (!states || !states[state]) {
          return;
        } // Clear state and queue


        delete this.__states__P_38_12[state]; // Fast path for hovered state

        if (state === "hovered") {
          this.syncAppearance();
        } else if (!qx.ui.core.queue.Visibility.isVisible(this)) {
          this.$$stateChanges = true;
        } else {
          qx.ui.core.queue.Appearance.add(this);
        } // Forward state change to child controls


        var forward = this._forwardStates;
        var controls = this.__childControls__P_38_13;

        if (forward && forward[state] && controls) {
          for (var id in controls) {
            var control = controls[id];

            if (control instanceof qx.ui.core.Widget) {
              control.removeState(state);
            }
          }
        }
      },

      /**
       * Replaces the first state with the second one.
       *
       * This method is ideal for state transitions e.g. normal => selected.
       *
       * @param old {String} Previous state
       * @param value {String} New state
       */
      replaceState: function replaceState(old, value) {
        var states = this.__states__P_38_12;

        if (!states) {
          states = this.__states__P_38_12 = {};
        }

        if (!states[value]) {
          states[value] = true;
        }

        if (states[old]) {
          delete states[old];
        }

        if (!qx.ui.core.queue.Visibility.isVisible(this)) {
          this.$$stateChanges = true;
        } else {
          qx.ui.core.queue.Appearance.add(this);
        } // Forward state change to child controls


        var forward = this._forwardStates;
        var controls = this.__childControls__P_38_13;

        if (forward && forward[value] && controls) {
          for (var id in controls) {
            var control = controls[id];

            if (control instanceof qx.ui.core.Widget) {
              control.replaceState(old, value);
            }
          }
        }
      },

      /*
      ---------------------------------------------------------------------------
        APPEARANCE SUPPORT
      ---------------------------------------------------------------------------
      */

      /** @type {String} The currently compiled selector to lookup the matching appearance */
      __appearanceSelector__P_38_14: null,

      /** @type {Boolean} Whether the selectors needs to be recomputed before updating appearance */
      __updateSelector__P_38_15: null,

      /**
       * Renders the appearance using the current widget states.
       *
       * Used exclusively by {qx.ui.core.queue.Appearance}.
       */
      syncAppearance: function syncAppearance() {
        var states = this.__states__P_38_12;
        var selector = this.__appearanceSelector__P_38_14;
        var manager = qx.theme.manager.Appearance.getInstance(); // Cache deep accessor

        var styler = qx.core.Property.$$method.setThemed;
        var unstyler = qx.core.Property.$$method.resetThemed; // Check for requested selector update

        if (this.__updateSelector__P_38_15) {
          // Clear flag
          delete this.__updateSelector__P_38_15; // Check if the selector was created previously

          if (selector) {
            // Query old selector
            var oldData = manager.styleFrom(selector, states, null, this.getAppearance()); // Clear current selector (to force recompute)

            selector = null;
          }
        } // Build selector


        if (!selector) {
          var obj = this;
          var id = [];

          do {
            id.push(obj.$$subcontrol || obj.getAppearance());
          } while (obj = obj.$$subparent); // Combine parent control IDs, add top level appearance, filter result
          // to not include positioning information anymore (e.g. #3)


          selector = id.reverse().join("/").replace(/#[0-9]+/g, "");
          this.__appearanceSelector__P_38_14 = selector;
        } // Query current selector


        var newData = manager.styleFrom(selector, states, null, this.getAppearance());

        if (newData) {
          if (oldData) {
            for (var prop in oldData) {
              if (newData[prop] === undefined) {
                this[unstyler[prop]]();
              }
            }
          } // Check property availability of new data


          {
            for (var prop in newData) {
              if (!this[styler[prop]]) {
                throw new Error(this.classname + ' has no themeable property "' + prop + '" while styling ' + selector);
              }
            }
          } // Apply new data

          for (var prop in newData) {
            newData[prop] === undefined ? this[unstyler[prop]]() : this[styler[prop]](newData[prop]);
          }
        } else if (oldData) {
          // Clear old data
          for (var prop in oldData) {
            this[unstyler[prop]]();
          }
        }

        this.fireDataEvent("syncAppearance", this.__states__P_38_12);
      },
      // property apply
      _applyAppearance: function _applyAppearance(value, old) {
        this.updateAppearance();
      },

      /**
       * Helper method called from the visibility queue to detect outstanding changes
       * to the appearance.
       *
       * @internal
       */
      checkAppearanceNeeds: function checkAppearanceNeeds() {
        // CASE 1: Widget has never got an appearance already because it was never
        // visible before. Normally add it to the queue is the easiest way to update it.
        if (!this.__initialAppearanceApplied__P_38_3) {
          qx.ui.core.queue.Appearance.add(this);
          this.__initialAppearanceApplied__P_38_3 = true;
        } // CASE 2: Widget has got an appearance before, but was hidden for some time
        // which results into maybe omitted state changes have not been applied.
        // In this case the widget is already queued in the appearance. This is basically
        // what all addState/removeState do, but the queue itself may not have been registered
        // to be flushed
        else if (this.$$stateChanges) {
          qx.ui.core.queue.Appearance.add(this);
          delete this.$$stateChanges;
        }
      },

      /**
       * Refreshes the appearance of this widget and all
       * registered child controls.
       */
      updateAppearance: function updateAppearance() {
        // Clear selector
        this.__updateSelector__P_38_15 = true; // Add to appearance queue

        qx.ui.core.queue.Appearance.add(this); // Update child controls

        var controls = this.__childControls__P_38_13;

        if (controls) {
          var obj;

          for (var id in controls) {
            obj = controls[id];

            if (obj instanceof qx.ui.core.Widget) {
              obj.updateAppearance();
            }
          }
        }
      },

      /*
      ---------------------------------------------------------------------------
        WIDGET QUEUE
      ---------------------------------------------------------------------------
      */

      /**
       * This method is called during the flush of the
       * {@link qx.ui.core.queue.Widget widget queue}.
       *
       * @param jobs {Map} A map of jobs.
       */
      syncWidget: function syncWidget(jobs) {// empty implementation
      },

      /*
      ---------------------------------------------------------------------------
        EVENT SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the next event target in the parent chain. May
       * also return the widget itself if it is not anonymous.
       *
       * @return {qx.ui.core.Widget} A working event target of this widget.
       *    May be <code>null</code> as well.
       */
      getEventTarget: function getEventTarget() {
        var target = this;

        while (target.getAnonymous()) {
          target = target.getLayoutParent();

          if (!target) {
            return null;
          }
        }

        return target;
      },

      /**
       * Returns the next focus target in the parent chain. May
       * also return the widget itself if it is not anonymous and focusable.
       *
       * @return {qx.ui.core.Widget} A working focus target of this widget.
       *    May be <code>null</code> as well.
       */
      getFocusTarget: function getFocusTarget() {
        var target = this;

        if (!target.getEnabled()) {
          return null;
        }

        while (target.getAnonymous() || !target.getFocusable()) {
          target = target.getLayoutParent();

          if (!target || !target.getEnabled()) {
            return null;
          }
        }

        return target;
      },

      /**
       * Returns the element which should be focused.
       *
       * @return {qx.html.Element} The html element to focus.
       */
      getFocusElement: function getFocusElement() {
        return this.getContentElement();
      },

      /**
       * Whether the widget is reachable by pressing the TAB key.
       *
       * Normally tests for both, the focusable property and a positive or
       * undefined tabIndex property. The widget must have a DOM element
       * since only visible widgets are tabable.
       *
       * @return {Boolean} Whether the element is tabable.
       */
      isTabable: function isTabable() {
        return !!this.getContentElement().getDomElement() && this.isFocusable();
      },
      // property apply
      _applyFocusable: function _applyFocusable(value, old) {
        var target = this.getFocusElement(); // Apply native tabIndex attribute

        if (value) {
          var tabIndex = this.getTabIndex();

          if (tabIndex == null) {
            tabIndex = 1;
          }

          target.setAttribute("tabIndex", tabIndex); // Omit native dotted outline border

          target.setStyle("outline", "none");
        } else {
          if (target.isNativelyFocusable()) {
            target.setAttribute("tabIndex", -1);
          } else if (old) {
            target.setAttribute("tabIndex", null);
          }
        }
      },
      // property apply
      _applyKeepFocus: function _applyKeepFocus(value) {
        var target = this.getFocusElement();
        target.setAttribute("qxKeepFocus", value ? "on" : null);
      },
      // property apply
      _applyKeepActive: function _applyKeepActive(value) {
        var target = this.getContentElement();
        target.setAttribute("qxKeepActive", value ? "on" : null);
      },
      // property apply
      _applyTabIndex: function _applyTabIndex(value) {
        if (value == null) {
          value = 1;
        } else if (value < 1 || value > 32000) {
          throw new Error("TabIndex property must be between 1 and 32000");
        }

        if (this.getFocusable() && value != null) {
          this.getFocusElement().setAttribute("tabIndex", value);
        }
      },
      // property apply
      _applySelectable: function _applySelectable(value, old) {
        // Re-apply cursor if not in "initSelectable"
        if (old !== null) {
          this._applyCursor(this.getCursor());
        } // Apply qooxdoo attribute


        this.getContentElement().setSelectable(value);
      },
      // property apply
      _applyEnabled: function _applyEnabled(value, old) {
        if (value === false) {
          this.addState("disabled"); // hovered not configured in widget, but as this is a
          // standardized name in qooxdoo and we never want a hover
          // state for disabled widgets, remove this state every time

          this.removeState("hovered"); // Blur when focused

          if (this.isFocusable()) {
            // Remove focused state
            this.removeState("focused"); // Remove tabIndex

            this._applyFocusable(false, true);
          } // Remove draggable


          if (this.isDraggable()) {
            this._applyDraggable(false, true);
          } // Remove droppable


          if (this.isDroppable()) {
            this._applyDroppable(false, true);
          }
        } else {
          this.removeState("disabled"); // Re-add tabIndex

          if (this.isFocusable()) {
            this._applyFocusable(true, false);
          } // Re-add draggable


          if (this.isDraggable()) {
            this._applyDraggable(true, false);
          } // Re-add droppable


          if (this.isDroppable()) {
            this._applyDroppable(true, false);
          }
        }
      },

      /*
      ---------------------------------------------------------------------------
        CONTEXT MENU
      ---------------------------------------------------------------------------
      */
      // property apply
      _applyNativeContextMenu: function _applyNativeContextMenu(value, old, name) {// empty body to allow overriding
      },
      // property apply
      _applyContextMenu: function _applyContextMenu(value, old) {
        if (old) {
          old.removeState("contextmenu");

          if (old.getOpener() == this) {
            old.resetOpener();
          }

          if (!value) {
            this.removeListener("contextmenu", this._onContextMenuOpen);
            this.removeListener("longtap", this._onContextMenuOpen);
            old.removeListener("changeVisibility", this._onBeforeContextMenuOpen, this);
          }
        }

        if (value) {
          value.setOpener(this);
          value.addState("contextmenu");

          if (!old) {
            this.addListener("contextmenu", this._onContextMenuOpen);
            this.addListener("longtap", this._onContextMenuOpen);
            value.addListener("changeVisibility", this._onBeforeContextMenuOpen, this);
          }
        }
      },

      /**
       * Event listener for <code>contextmenu</code> event
       *
       * @param e {qx.event.type.Pointer} The event object
       */
      _onContextMenuOpen: function _onContextMenuOpen(e) {
        // only allow long tap context menu on touch interactions
        if (e.getType() == "longtap") {
          if (e.getPointerType() !== "touch") {
            return;
          }
        }

        this.getContextMenu().openAtPointer(e); // Do not show native menu
        // don't open any other contextmenus

        e.stop();
      },

      /**
       * Event listener for <code>beforeContextmenuOpen</code> event
       *
       * @param e {qx.event.type.Data} The data event
       */
      _onBeforeContextMenuOpen: function _onBeforeContextMenuOpen(e) {
        if (e.getData() == "visible" && this.hasListener("beforeContextmenuOpen")) {
          this.fireDataEvent("beforeContextmenuOpen", e);
        }
      },

      /*
      ---------------------------------------------------------------------------
        USEFUL COMMON EVENT LISTENERS
      ---------------------------------------------------------------------------
      */

      /**
       * Event listener which stops a bubbling event from
       * propagates further.
       *
       * @param e {qx.event.type.Event} Any bubbling event
       */
      _onStopEvent: function _onStopEvent(e) {
        e.stopPropagation();
      },

      /*
      ---------------------------------------------------------------------------
        DRAG & DROP SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Helper to return a instance of a {@link qx.ui.core.DragDropCursor}.
       * If you want to use your own DragDropCursor, override this method
       * and return your custom instance.
       * @return {qx.ui.core.DragDropCursor} A drag drop cursor implementation.
       */
      _getDragDropCursor: function _getDragDropCursor() {
        return qx.ui.core.DragDropCursor.getInstance();
      },
      // property apply
      _applyDraggable: function _applyDraggable(value, old) {
        if (!this.isEnabled() && value === true) {
          value = false;
        } // Force cursor creation


        this._getDragDropCursor(); // Process listeners


        if (value) {
          this.addListener("dragstart", this._onDragStart);
          this.addListener("drag", this._onDrag);
          this.addListener("dragend", this._onDragEnd);
          this.addListener("dragchange", this._onDragChange);
        } else {
          this.removeListener("dragstart", this._onDragStart);
          this.removeListener("drag", this._onDrag);
          this.removeListener("dragend", this._onDragEnd);
          this.removeListener("dragchange", this._onDragChange);
        } // Sync DOM attribute


        this.getContentElement().setAttribute("qxDraggable", value ? "on" : null);
      },
      // property apply
      _applyDroppable: function _applyDroppable(value, old) {
        if (!this.isEnabled() && value === true) {
          value = false;
        } // Sync DOM attribute


        this.getContentElement().setAttribute("qxDroppable", value ? "on" : null);
      },

      /**
       * Event listener for own <code>dragstart</code> event.
       *
       * @param e {qx.event.type.Drag} Drag event
       */
      _onDragStart: function _onDragStart(e) {
        this._getDragDropCursor().placeToPointer(e);

        this.getApplicationRoot().setGlobalCursor("default");
      },

      /**
       * Event listener for own <code>drag</code> event.
       *
       * @param e {qx.event.type.Drag} Drag event
       */
      _onDrag: function _onDrag(e) {
        this._getDragDropCursor().placeToPointer(e);
      },

      /**
       * Event listener for own <code>dragend</code> event.
       *
       * @param e {qx.event.type.Drag} Drag event
       */
      _onDragEnd: function _onDragEnd(e) {
        this._getDragDropCursor().moveTo(-1000, -1000);

        this.getApplicationRoot().resetGlobalCursor();
      },

      /**
       * Event listener for own <code>dragchange</code> event.
       *
       * @param e {qx.event.type.Drag} Drag event
       */
      _onDragChange: function _onDragChange(e) {
        var cursor = this._getDragDropCursor();

        var action = e.getCurrentAction();
        action ? cursor.setAction(action) : cursor.resetAction();
      },

      /*
      ---------------------------------------------------------------------------
        VISUALIZE FOCUS STATES
      ---------------------------------------------------------------------------
      */

      /**
       * Event handler which is executed when the widget receives the focus.
       *
       * This method is used by the {@link qx.ui.core.FocusHandler} to
       * apply states etc. to a focused widget.
       *
       * @internal
       */
      visualizeFocus: function visualizeFocus() {
        this.addState("focused");
      },

      /**
       * Event handler which is executed when the widget lost the focus.
       *
       * This method is used by the {@link qx.ui.core.FocusHandler} to
       * remove states etc. from a previously focused widget.
       *
       * @internal
       */
      visualizeBlur: function visualizeBlur() {
        this.removeState("focused");
      },

      /*
      ---------------------------------------------------------------------------
        SCROLL CHILD INTO VIEW
      ---------------------------------------------------------------------------
      */

      /**
       * The method scrolls the given item into view.
       *
       * @param child {qx.ui.core.Widget} Child to scroll into view
       * @param alignX {String?null} Alignment of the item. Allowed values:
       *   <code>left</code> or <code>right</code>. Could also be null.
       *   Without a given alignment the method tries to scroll the widget
       *   with the minimum effort needed.
       * @param alignY {String?null} Alignment of the item. Allowed values:
       *   <code>top</code> or <code>bottom</code>. Could also be null.
       *   Without a given alignment the method tries to scroll the widget
       *   with the minimum effort needed.
       * @param direct {Boolean?true} Whether the execution should be made
       *   directly when possible
       */
      scrollChildIntoView: function scrollChildIntoView(child, alignX, alignY, direct) {
        // Scroll directly on default
        direct = typeof direct == "undefined" ? true : direct; // Always lazy scroll when either
        // - the child
        // - its layout parent
        // - its siblings
        // have layout changes scheduled.
        //
        // This is to make sure that the scroll position is computed
        // after layout changes have been applied to the DOM. Note that changes
        // scheduled for the grand parent (and up) are not tracked and need to
        // be signaled manually.

        var Layout = qx.ui.core.queue.Layout;
        var parent; // Child

        if (direct) {
          direct = !Layout.isScheduled(child);
          parent = child.getLayoutParent(); // Parent

          if (direct && parent) {
            direct = !Layout.isScheduled(parent); // Siblings

            if (direct) {
              parent.getChildren().forEach(function (sibling) {
                direct = direct && !Layout.isScheduled(sibling);
              });
            }
          }
        }

        this.scrollChildIntoViewX(child, alignX, direct);
        this.scrollChildIntoViewY(child, alignY, direct);
      },

      /**
       * The method scrolls the given item into view (x-axis only).
       *
       * @param child {qx.ui.core.Widget} Child to scroll into view
       * @param align {String?null} Alignment of the item. Allowed values:
       *   <code>left</code> or <code>right</code>. Could also be null.
       *   Without a given alignment the method tries to scroll the widget
       *   with the minimum effort needed.
       * @param direct {Boolean?true} Whether the execution should be made
       *   directly when possible
       */
      scrollChildIntoViewX: function scrollChildIntoViewX(child, align, direct) {
        this.getContentElement().scrollChildIntoViewX(child.getContentElement(), align, direct);
      },

      /**
       * The method scrolls the given item into view (y-axis only).
       *
       * @param child {qx.ui.core.Widget} Child to scroll into view
       * @param align {String?null} Alignment of the element. Allowed values:
       *   <code>top</code> or <code>bottom</code>. Could also be null.
       *   Without a given alignment the method tries to scroll the widget
       *   with the minimum effort needed.
       * @param direct {Boolean?true} Whether the execution should be made
       *   directly when possible
       */
      scrollChildIntoViewY: function scrollChildIntoViewY(child, align, direct) {
        this.getContentElement().scrollChildIntoViewY(child.getContentElement(), align, direct);
      },

      /*
      ---------------------------------------------------------------------------
        FOCUS SYSTEM USER ACCESS
      ---------------------------------------------------------------------------
      */

      /**
       * Focus this widget.
       *
       */
      focus: function focus() {
        if (this.isFocusable()) {
          this.getFocusElement().focus();
        } else if (qx.ui.core.Widget.UNFOCUSABLE_WIDGET_FOCUS_BLUR_ERROR) {
          throw new Error("Widget is not focusable!");
        }
      },

      /**
       * Remove focus from this widget.
       *
       */
      blur: function blur() {
        if (this.isFocusable()) {
          this.getFocusElement().blur();
        } else if (qx.ui.core.Widget.UNFOCUSABLE_WIDGET_FOCUS_BLUR_ERROR) {
          throw new Error("Widget is not focusable!");
        }
      },

      /**
       * Activate this widget e.g. for keyboard events.
       *
       */
      activate: function activate() {
        this.getContentElement().activate();
      },

      /**
       * Deactivate this widget e.g. for keyboard events.
       *
       */
      deactivate: function deactivate() {
        this.getContentElement().deactivate();
      },

      /**
       * Focus this widget when using the keyboard. This is
       * mainly thought for the advanced qooxdoo keyboard handling
       * and should not be used by the application developer.
       *
       * @internal
       */
      tabFocus: function tabFocus() {
        this.getFocusElement().focus();
      },

      /*
      ---------------------------------------------------------------------------
        CHILD CONTROL SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Whether the given ID is assigned to a child control.
       *
       * @param id {String} ID of the child control
       * @return {Boolean} <code>true</code> when the child control is registered.
       */
      hasChildControl: function hasChildControl(id) {
        if (!this.__childControls__P_38_13) {
          return false;
        }

        return !!this.__childControls__P_38_13[id];
      },

      /** @type {Map} Map of instantiated child controls */
      __childControls__P_38_13: null,

      /**
       * Returns a map of all already created child controls
       *
       * @return {Map} mapping of child control id to the child widget.
       */
      _getCreatedChildControls: function _getCreatedChildControls() {
        return this.__childControls__P_38_13;
      },

      /**
       * Returns the child control from the given ID. Returns
       * <code>null</code> when the child control is unknown.
       *
       * It is designed for widget authors, who want to access child controls,
       * which are created by the widget itself.
       *
       * <b>Warning</b>: This method exposes widget internals and modifying the
       * returned sub widget may bring the widget into an inconsistent state.
       * Accessing child controls defined in a super class or in an foreign class
       * is not supported. Do not use it if the result can be achieved using public
       * API or theming.
       *
       * @param id {String} ID of the child control
       * @param notcreate {Boolean?false} Whether the child control
       *    should not be created dynamically if not yet available.
       * @return {qx.ui.core.Widget} Child control
       */
      getChildControl: function getChildControl(id, notcreate) {
        if (!this.__childControls__P_38_13) {
          if (notcreate) {
            return null;
          }

          this.__childControls__P_38_13 = {};
        }

        var control = this.__childControls__P_38_13[id];

        if (control) {
          return control;
        }

        if (notcreate === true) {
          return null;
        }

        return this._createChildControl(id);
      },

      /**
       * Shows the given child control by ID
       *
       * @param id {String} ID of the child control
       * @return {qx.ui.core.Widget} the child control
       */
      _showChildControl: function _showChildControl(id) {
        var control = this.getChildControl(id);
        control.show();
        return control;
      },

      /**
       * Excludes the given child control by ID
       *
       * @param id {String} ID of the child control
       */
      _excludeChildControl: function _excludeChildControl(id) {
        var control = this.getChildControl(id, true);

        if (control) {
          control.exclude();
        }
      },

      /**
       * Whether the given child control is visible.
       *
       * @param id {String} ID of the child control
       * @return {Boolean} <code>true</code> when the child control is visible.
       */
      _isChildControlVisible: function _isChildControlVisible(id) {
        var control = this.getChildControl(id, true);

        if (control) {
          return control.isVisible();
        }

        return false;
      },

      /**
       * Release the child control by ID and decouple the
       * child from the parent. This method does not dispose the child control.
       *
       * @param id {String} ID of the child control
       * @return {qx.ui.core.Widget} The released control
       */
      _releaseChildControl: function _releaseChildControl(id) {
        var control = this.getChildControl(id, false);

        if (!control) {
          throw new Error("Unsupported control: " + id);
        } // remove connection to parent


        delete control.$$subcontrol;
        delete control.$$subparent; // remove state forwarding

        var states = this.__states__P_38_12;
        var forward = this._forwardStates;

        if (states && forward && control instanceof qx.ui.core.Widget) {
          for (var state in states) {
            if (forward[state]) {
              control.removeState(state);
            }
          }
        }

        delete this.__childControls__P_38_13[id];
        return control;
      },

      /**
       * Force the creation of the given child control by ID.
       *
       * Do not override this method! Override {@link #_createChildControlImpl}
       * instead if you need to support new controls.
       *
       * @param id {String} ID of the child control
       * @return {qx.ui.core.Widget} The created control
       * @throws {Error} when the control was created before
       */
      _createChildControl: function _createChildControl(id) {
        if (!this.__childControls__P_38_13) {
          this.__childControls__P_38_13 = {};
        } else if (this.__childControls__P_38_13[id]) {
          throw new Error("Child control '" + id + "' already created!");
        }

        var pos = id.indexOf("#");

        try {
          if (pos == -1) {
            var control = this._createChildControlImpl(id);
          } else {
            var control = this._createChildControlImpl(id.substring(0, pos), id.substring(pos + 1, id.length));
          }
        } catch (exc) {
          exc.message = "Exception while creating child control '" + id + "' of widget " + this.toString() + ": " + exc.message;
          throw exc;
        }

        if (!control) {
          throw new Error("Unsupported control: " + id);
        } // Establish connection to parent


        control.$$subcontrol = id;
        control.$$subparent = this; // Support for state forwarding

        var states = this.__states__P_38_12;
        var forward = this._forwardStates;

        if (states && forward && control instanceof qx.ui.core.Widget) {
          for (var state in states) {
            if (forward[state]) {
              control.addState(state);
            }
          }
        } // If the appearance is already synced after the child control
        // we need to update the appearance now, because the selector
        // might be not correct in certain cases.


        if (control.$$resyncNeeded) {
          delete control.$$resyncNeeded;
          control.updateAppearance();
        }

        this.fireDataEvent("createChildControl", control); // Register control and return

        return this.__childControls__P_38_13[id] = control;
      },

      /**
       * Internal method to create child controls. This method
       * should be overwritten by classes which extends this one
       * to support new child control types.
       *
       * @param id {String} ID of the child control. If a # is used, the id is
       *   the part in front of the #.
       * @param hash {String?undefined} If a child control name contains a #,
       *   all text following the # will be the hash argument.
       * @return {qx.ui.core.Widget} The created control or <code>null</code>
       */
      _createChildControlImpl: function _createChildControlImpl(id, hash) {
        return null;
      },

      /**
       * Dispose all registered controls. This is automatically
       * executed by the widget.
       *
       */
      _disposeChildControls: function _disposeChildControls() {
        var controls = this.__childControls__P_38_13;

        if (!controls) {
          return;
        }

        var Widget = qx.ui.core.Widget;

        for (var id in controls) {
          var control = controls[id];

          if (!Widget.contains(this, control)) {
            control.destroy();
          } else {
            control.dispose();
          }
        }

        delete this.__childControls__P_38_13;
      },

      /**
       * Finds and returns the top level control. This is the first
       * widget which is not a child control of any other widget.
       *
       * @return {qx.ui.core.Widget} The top control
       */
      _findTopControl: function _findTopControl() {
        var obj = this;

        while (obj) {
          if (!obj.$$subparent) {
            return obj;
          }

          obj = obj.$$subparent;
        }

        return null;
      },

      /**
       * Return the ID (name) if this instance was a created as a child control of another widget.
       *
       * See the first parameter id in {@link qx.ui.core.Widget#_createChildControlImpl}
       *
       * @return {String|null} ID of the current widget or null if it was not created as a subcontrol
       */
      getSubcontrolId: function getSubcontrolId() {
        return this.$$subcontrol || null;
      },

      /*
      ---------------------------------------------------------------------------
        LOWER LEVEL ACCESS
      ---------------------------------------------------------------------------
      */

      /**
       * Computes the location of the content element in context of the document
       * dimensions.
       *
       * Supported modes:
       *
       * * <code>margin</code>: Calculate from the margin box of the element
       *   (bigger than the visual appearance: including margins of given element)
       * * <code>box</code>: Calculates the offset box of the element (default,
       *   uses the same size as visible)
       * * <code>border</code>: Calculate the border box (useful to align to
       *   border edges of two elements).
       * * <code>scroll</code>: Calculate the scroll box (relevant for absolute
       *   positioned content).
       * * <code>padding</code>: Calculate the padding box (relevant for
       *   static/relative positioned content).
       *
       * @param mode {String?box} A supported option. See comment above.
       * @return {Map} Returns a map with <code>left</code>, <code>top</code>,
       *   <code>right</code> and <code>bottom</code> which contains the distance
       *   of the element relative to the document.
       */
      getContentLocation: function getContentLocation(mode) {
        var domEl = this.getContentElement().getDomElement();
        return domEl ? qx.bom.element.Location.get(domEl, mode) : null;
      },

      /**
       * Directly modifies the relative left position in relation
       * to the parent element.
       *
       * Use with caution! This may be used for animations, drag&drop
       * or other cases where high performance location manipulation
       * is important. Otherwise please use {@link qx.ui.core.LayoutItem#setUserBounds} instead.
       *
       * @param value {Integer} Left position
       */
      setDomLeft: function setDomLeft(value) {
        var domEl = this.getContentElement().getDomElement();

        if (domEl) {
          domEl.style.left = value + "px";
        } else {
          throw new Error("DOM element is not yet created!");
        }
      },

      /**
       * Directly modifies the relative top position in relation
       * to the parent element.
       *
       * Use with caution! This may be used for animations, drag&drop
       * or other cases where high performance location manipulation
       * is important. Otherwise please use {@link qx.ui.core.LayoutItem#setUserBounds} instead.
       *
       * @param value {Integer} Top position
       */
      setDomTop: function setDomTop(value) {
        var domEl = this.getContentElement().getDomElement();

        if (domEl) {
          domEl.style.top = value + "px";
        } else {
          throw new Error("DOM element is not yet created!");
        }
      },

      /**
       * Directly modifies the relative left and top position in relation
       * to the parent element.
       *
       * Use with caution! This may be used for animations, drag&drop
       * or other cases where high performance location manipulation
       * is important. Otherwise please use {@link qx.ui.core.LayoutItem#setUserBounds} instead.
       *
       * @param left {Integer} Left position
       * @param top {Integer} Top position
       */
      setDomPosition: function setDomPosition(left, top) {
        var domEl = this.getContentElement().getDomElement();

        if (domEl) {
          domEl.style.left = left + "px";
          domEl.style.top = top + "px";
        } else {
          throw new Error("DOM element is not yet created!");
        }
      },

      /*
      ---------------------------------------------------------------------------
        ARIA attrs support
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the string which labels this widget. This will be read out by screenreaders. Needed if there is no
       * readable text/label in this widget which would automatically act as aria-label.
       * @param label {String} Labelling Text
       */
      setAriaLabel: function setAriaLabel(label) {
        this.getContentElement().setAttribute("aria-label", label);
      },

      /**
       * Marks that this widget gets labelled by another widget. This will be read out by screenreaders as first
       * information.
       * Similiar to aria-label, difference being that the labelling widget is an different widget and multiple
       * widgets can be added.
       * @param labelWidgets {qx.ui.core.Widget[]} Indefinite Number of labelling Widgets
       */
      addAriaLabelledBy: function addAriaLabelledBy() {
        for (var _len = arguments.length, labelWidgets = new Array(_len), _key = 0; _key < _len; _key++) {
          labelWidgets[_key] = arguments[_key];
        }

        this.__addAriaXBy__P_38_16(labelWidgets, "aria-labelledby");
      },

      /**
       * Marks that this widget gets described by another widget. This will be read out by screenreaders as last
       * information. Multiple Widgets possible.
       * @param describingWidgets {qx.ui.core.Widget[]} Indefinite Number of describing Widgets
       */
      addAriaDescribedBy: function addAriaDescribedBy() {
        for (var _len2 = arguments.length, describingWidgets = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          describingWidgets[_key2] = arguments[_key2];
        }

        this.__addAriaXBy__P_38_16(describingWidgets, "aria-describedby");
      },

      /**
       * Sets either aria-labelledby or aria-describedby
       * @param widgets {qx.ui.core.Widget[]} Indefinite Number of widgets
       * @param ariaAttr {String} aria-labelledby | aria-describedby
       */
      __addAriaXBy__P_38_16: function __addAriaXBy__P_38_16(widgets, ariaAttr) {
        if (!["aria-labelledby", "aria-describedby"].includes(ariaAttr)) {
          throw new Error("Only aria-labelledby or aria-describedby allowed!");
        }

        var idArr = [];

        var _iterator = _createForOfIteratorHelper(widgets),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var widget = _step.value;

            if (!(widget instanceof qx.ui.core.Widget)) {
              throw new Error("Given widget " + widget + " is not an instance of qx.ui.core.Widget!");
            }

            var _contentEl = widget.getContentElement();

            var widgetId = _contentEl.getAttribute("id");

            if (!widgetId) {
              widgetId = "label-".concat(widget.toHashCode());

              _contentEl.setAttribute("id", widgetId);
            }

            if (!idArr.includes(widgetId)) {
              idArr.push(widgetId);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        if (idArr.length === 0) {
          return;
        }

        var idStr = idArr.join(" ");
        var contentEl = this.getContentElement();
        var res = contentEl.getAttribute(ariaAttr);
        res = res ? "".concat(res, " ").concat(idStr) : idStr;
        contentEl.setAttribute(ariaAttr, res);
      },

      /*
      ---------------------------------------------------------------------------
        ENHANCED DISPOSE SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Removes this widget from its parent and disposes it.
       *
       * Please note that the widget is not disposed synchronously. The
       * real dispose happens after the next queue flush.
       *
       */
      destroy: function destroy() {
        if (this.$$disposed) {
          return;
        } // We may be deferring disposing, but we can at least prevent
        // listener handlers from being called. We don't know exactly
        // what listeners have already been disposed at this point.


        qx.event.Registration.removeAllListeners(this);
        var parent = this.$$parent;

        if (parent) {
          parent._remove(this);
        }

        qx.ui.core.queue.Dispose.add(this);
      },

      /*
      ---------------------------------------------------------------------------
        CLONE SUPPORT
      ---------------------------------------------------------------------------
      */
      // overridden
      clone: function clone() {
        var clone = qx.ui.core.Widget.superclass.prototype.clone.call(this);

        if (this.getChildren) {
          var children = this.getChildren();

          for (var i = 0, l = children.length; i < l; i++) {
            clone.add(children[i].clone());
          }
        }

        return clone;
      }
    },

    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct: function destruct() {
      // Some dispose stuff is not needed in global shutdown, otherwise
      // it just slows down things a bit, so do not do them.
      if (!qx.core.ObjectRegistry.inShutDown) {
        {
          if (this.__toolTipTextListenerId__P_38_4) {
            qx.locale.Manager.getInstance().removeListenerById(this.__toolTipTextListenerId__P_38_4);
          }
        } // Remove widget pointer from DOM

        var contentEl = this.getContentElement();

        if (contentEl) {
          contentEl.disconnectWidget(this);
        } // Clean up all child controls


        this._disposeChildControls(); // Remove from ui queues


        qx.ui.core.queue.Appearance.remove(this);
        qx.ui.core.queue.Layout.remove(this);
        qx.ui.core.queue.Visibility.remove(this);
        qx.ui.core.queue.Widget.remove(this);
      }

      if (this.getContextMenu()) {
        this.setContextMenu(null);
      } // pool decorators if not in global shutdown


      if (!qx.core.ObjectRegistry.inShutDown) {
        this.clearSeparators();
        this.__separators__P_38_6 = null;
      } else {
        this._disposeArray("__separators__P_38_6");
      } // Clear children array


      this._disposeArray("__widgetChildren__P_38_7"); // Cleanup map of appearance states


      this.__states__P_38_12 = this.__childControls__P_38_13 = null; // Dispose layout manager and HTML elements

      this._disposeObjects("__layoutManager__P_38_5", "__contentElement__P_38_0");
    }
  });
  qx.ui.core.Widget.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This mixin exposes all basic methods to manage widget children as public methods.
   * It can only be included into instances of {@link Widget}.
   *
   * To optimize the method calls the including widget should call the method
   * {@link #remap} in its defer function. This will map the protected
   * methods to the public ones and save one method call for each function.
   */
  qx.Mixin.define("qx.ui.core.MChildrenHandling", {
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      /**
       * Returns the children list
       *
       * @return {qx.ui.core.LayoutItem[]} The children array (Arrays are
       *   reference types, please do not modify them in-place)
       */
      getChildren: function getChildren() {
        return this._getChildren();
      },

      /**
       * Whether the widget contains children.
       *
       * @return {Boolean} Returns <code>true</code> when the widget has children.
       */
      hasChildren: function hasChildren() {
        return this._hasChildren();
      },

      /**
       * Returns the index position of the given widget if it is
       * a child widget. Otherwise it returns <code>-1</code>.
       *
       * This method works on the widget's children list. Some layout managers
       * (e.g. {@link qx.ui.layout.HBox}) use the children order as additional
       * layout information. Other layout manager (e.g. {@link qx.ui.layout.Grid})
       * ignore the children order for the layout process.
       *
       * @param child {qx.ui.core.Widget} the widget to query for
       * @return {Integer} The index position or <code>-1</code> when
       *   the given widget is no child of this layout.
       */
      indexOf: function indexOf(child) {
        return this._indexOf(child);
      },

      /**
       * Adds a new child widget.
       *
       * The supported keys of the layout options map depend on the layout manager
       * used to position the widget. The options are documented in the class
       * documentation of each layout manager {@link qx.ui.layout}.
       *
       * @param child {qx.ui.core.LayoutItem} the widget to add.
       * @param options {Map?null} Optional layout data for widget.
       */
      add: function add(child, options) {
        this._add(child, options);
      },

      /**
       * Add a child widget at the specified index
       *
       * This method works on the widget's children list. Some layout managers
       * (e.g. {@link qx.ui.layout.HBox}) use the children order as additional
       * layout information. Other layout manager (e.g. {@link qx.ui.layout.Grid})
       * ignore the children order for the layout process.
       *
       * @param child {qx.ui.core.LayoutItem} Widget to add
       * @param index {Integer} Index, at which the widget will be inserted
       * @param options {Map?null} Optional layout data for widget.
       */
      addAt: function addAt(child, index, options) {
        this._addAt(child, index, options);
      },

      /**
       * Add a widget before another already inserted widget
       *
       * This method works on the widget's children list. Some layout managers
       * (e.g. {@link qx.ui.layout.HBox}) use the children order as additional
       * layout information. Other layout manager (e.g. {@link qx.ui.layout.Grid})
       * ignore the children order for the layout process.
       *
       * @param child {qx.ui.core.LayoutItem} Widget to add
       * @param before {qx.ui.core.LayoutItem} Widget before the new widget will be inserted.
       * @param options {Map?null} Optional layout data for widget.
       */
      addBefore: function addBefore(child, before, options) {
        this._addBefore(child, before, options);
      },

      /**
       * Add a widget after another already inserted widget
       *
       * This method works on the widget's children list. Some layout managers
       * (e.g. {@link qx.ui.layout.HBox}) use the children order as additional
       * layout information. Other layout manager (e.g. {@link qx.ui.layout.Grid})
       * ignore the children order for the layout process.
       *
       * @param child {qx.ui.core.LayoutItem} Widget to add
       * @param after {qx.ui.core.LayoutItem} Widget, after which the new widget will be inserted
       * @param options {Map?null} Optional layout data for widget.
       */
      addAfter: function addAfter(child, after, options) {
        this._addAfter(child, after, options);
      },

      /**
       * Remove the given child widget.
       *
       * @param child {qx.ui.core.LayoutItem} the widget to remove
       */
      remove: function remove(child) {
        this._remove(child);
      },

      /**
       * Remove the widget at the specified index.
       *
       * This method works on the widget's children list. Some layout managers
       * (e.g. {@link qx.ui.layout.HBox}) use the children order as additional
       * layout information. Other layout manager (e.g. {@link qx.ui.layout.Grid})
       * ignore the children order for the layout process.
       *
       * @param index {Integer} Index of the widget to remove.
       * @return {qx.ui.core.LayoutItem} The child removed.
       */
      removeAt: function removeAt(index) {
        return this._removeAt(index);
      },

      /**
       * Remove all children.
       *
       * @return {Array} An array of the removed children.
       */
      removeAll: function removeAll() {
        return this._removeAll();
      }
    },

    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */
    statics: {
      /**
       * Mapping of protected methods to public.
       * This omits an additional function call when using these methods. Call
       * this methods in the defer block of the including class.
       *
       * @param members {Map} The including classes members map
       */
      remap: function remap(members) {
        members.getChildren = members._getChildren;
        members.hasChildren = members._hasChildren;
        members.indexOf = members._indexOf;
        members.add = members._add;
        members.addAt = members._addAt;
        members.addBefore = members._addBefore;
        members.addAfter = members._addAfter;
        members.remove = members._remove;
        members.removeAt = members._removeAt;
        members.removeAll = members._removeAll;
      }
    }
  });
  qx.ui.core.MChildrenHandling.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Blocker": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This mixin blocks events and can be included into all widgets.
   *
   * The {@link #block} and {@link #unblock} methods provided by this mixin can be used
   * to block any event from the widget. When blocked,
   * the blocker widget overlays the widget to block, including the padding area.
   *
   * The ({@link #blockContent} method can be used to block child widgets with a
   * zIndex below a certain value.
   */
  qx.Mixin.define("qx.ui.core.MBlocker", {
    properties: {
      /**
       * Color of the blocker
       */
      blockerColor: {
        check: "Color",
        init: null,
        nullable: true,
        apply: "_applyBlockerColor",
        themeable: true
      },

      /**
       * Opacity of the blocker
       */
      blockerOpacity: {
        check: "Number",
        init: 1,
        apply: "_applyBlockerOpacity",
        themeable: true
      }
    },
    members: {
      __blocker__P_76_0: null,

      /**
       * Template method for creating the blocker item.
       * @return {qx.ui.core.Blocker} The blocker to use.
       */
      _createBlocker: function _createBlocker() {
        return new qx.ui.core.Blocker(this);
      },
      // property apply
      _applyBlockerColor: function _applyBlockerColor(value, old) {
        this.getBlocker().setColor(value);
      },
      // property apply
      _applyBlockerOpacity: function _applyBlockerOpacity(value, old) {
        this.getBlocker().setOpacity(value);
      },

      /**
       * Block all events from this widget by placing a transparent overlay widget,
       * which receives all events, exactly over the widget.
       */
      block: function block() {
        this.getBlocker().block();
      },

      /**
       * Returns whether the widget is blocked.
       *
       * @return {Boolean} Whether the widget is blocked.
       */
      isBlocked: function isBlocked() {
        return this.__blocker__P_76_0 && this.__blocker__P_76_0.isBlocked();
      },

      /**
       * Unblock the widget blocked by {@link #block}, but it takes care of
       * the amount of {@link #block} calls. The blocker is only removed if
       * the number of {@link #unblock} calls is identical to {@link #block} calls.
       */
      unblock: function unblock() {
        if (this.__blocker__P_76_0) {
          this.__blocker__P_76_0.unblock();
        }
      },

      /**
       * Unblock the widget blocked by {@link #block}, but it doesn't take care of
       * the amount of {@link #block} calls. The blocker is directly removed.
       */
      forceUnblock: function forceUnblock() {
        if (this.__blocker__P_76_0) {
          this.__blocker__P_76_0.forceUnblock();
        }
      },

      /**
       * Block direct child widgets with a zIndex below <code>zIndex</code>
       *
       * @param zIndex {Integer} All child widgets with a zIndex below this value
       *     will be blocked
       */
      blockContent: function blockContent(zIndex) {
        this.getBlocker().blockContent(zIndex);
      },

      /**
       * Get the blocker
       *
       * @return {qx.ui.core.Blocker} The blocker
       */
      getBlocker: function getBlocker() {
        if (!this.__blocker__P_76_0) {
          this.__blocker__P_76_0 = this._createBlocker();
        }

        return this.__blocker__P_76_0;
      }
    },
    destruct: function destruct() {
      this._disposeObjects("__blocker__P_76_0");
    }
  });
  qx.ui.core.MBlocker.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {},
      "qx.lang.Array": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This mixin implements the key methods of the {@link qx.ui.window.IDesktop}.
   *
   * @ignore(qx.ui.window.Window)
   * @ignore(qx.ui.window.Window.*)
   */
  qx.Mixin.define("qx.ui.window.MDesktop", {
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /**
       * The currently active window
       */
      activeWindow: {
        check: "qx.ui.window.Window",
        apply: "_applyActiveWindow",
        event: "changeActiveWindow",
        init: null,
        nullable: true
      }
    },
    events: {
      /**
       * Fired when a window was added.
       */
      windowAdded: "qx.event.type.Data",

      /**
       * Fired when a window was removed.
       */
      windowRemoved: "qx.event.type.Data"
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      __windows__P_77_0: null,
      __manager__P_77_1: null,

      /**
       * Get the desktop's window manager. Each desktop must have a window manager.
       * If none is configured the default window manager {@link qx.ui.window.Window#DEFAULT_MANAGER_CLASS}
       * is used.
       *
       * @return {qx.ui.window.IWindowManager} The desktop's window manager
       */
      getWindowManager: function getWindowManager() {
        if (!this.__manager__P_77_1) {
          this.setWindowManager(new qx.ui.window.Window.DEFAULT_MANAGER_CLASS());
        }

        return this.__manager__P_77_1;
      },

      /**
       * Whether the configured layout supports a maximized window
       * e.g. is a Canvas.
       *
       * @return {Boolean} Whether the layout supports maximized windows
       */
      supportsMaximize: function supportsMaximize() {
        return true;
      },

      /**
       * Sets the desktop's window manager
       *
       * @param manager {qx.ui.window.IWindowManager} The window manager
       */
      setWindowManager: function setWindowManager(manager) {
        if (this.__manager__P_77_1) {
          this.__manager__P_77_1.setDesktop(null);
        }

        manager.setDesktop(this);
        this.__manager__P_77_1 = manager;
      },

      /**
       * Event handler. Called if one of the managed windows changes its active
       * state.
       *
       * @param e {qx.event.type.Event} the event object.
       */
      _onChangeActive: function _onChangeActive(e) {
        if (e.getData()) {
          this.setActiveWindow(e.getTarget());
        } else if (this.getActiveWindow() == e.getTarget()) {
          this.setActiveWindow(null);
        }
      },
      // property apply
      _applyActiveWindow: function _applyActiveWindow(value, old) {
        this.getWindowManager().changeActiveWindow(value, old);
        this.getWindowManager().updateStack();
      },

      /**
       * Event handler. Called if one of the managed windows changes its modality
       *
       * @param e {qx.event.type.Event} the event object.
       */
      _onChangeModal: function _onChangeModal(e) {
        this.getWindowManager().updateStack();
      },

      /**
       * Event handler. Called if one of the managed windows changes its visibility
       * state.
       */
      _onChangeVisibility: function _onChangeVisibility() {
        this.getWindowManager().updateStack();
      },

      /**
       * Overrides the method {@link qx.ui.core.Widget#_afterAddChild}
       *
       * @param win {qx.ui.core.Widget} added widget
       */
      _afterAddChild: function _afterAddChild(win) {
        if (qx.Class.isDefined("qx.ui.window.Window") && win instanceof qx.ui.window.Window) {
          this._addWindow(win);
        }
      },

      /**
       * Handles the case, when a window is added to the desktop.
       *
       * @param win {qx.ui.window.Window} Window, which has been added
       */
      _addWindow: function _addWindow(win) {
        if (!this.getWindows().includes(win)) {
          this.getWindows().push(win);
          this.fireDataEvent("windowAdded", win);
          win.addListener("changeActive", this._onChangeActive, this);
          win.addListener("changeModal", this._onChangeModal, this);
          win.addListener("changeVisibility", this._onChangeVisibility, this);
        }

        if (win.getActive()) {
          this.setActiveWindow(win);
        }

        this.getWindowManager().updateStack();
      },

      /**
       * Overrides the method {@link qx.ui.core.Widget#_afterRemoveChild}
       *
       * @param win {qx.ui.core.Widget} removed widget
       */
      _afterRemoveChild: function _afterRemoveChild(win) {
        if (qx.Class.isDefined("qx.ui.window.Window") && win instanceof qx.ui.window.Window) {
          this._removeWindow(win);
        }
      },

      /**
       * Handles the case, when a window is removed from the desktop.
       *
       * @param win {qx.ui.window.Window} Window, which has been removed
       */
      _removeWindow: function _removeWindow(win) {
        if (this.getWindows().includes(win)) {
          qx.lang.Array.remove(this.getWindows(), win);
          this.fireDataEvent("windowRemoved", win);
          win.removeListener("changeActive", this._onChangeActive, this);
          win.removeListener("changeModal", this._onChangeModal, this);
          win.removeListener("changeVisibility", this._onChangeVisibility, this);
          this.getWindowManager().updateStack();
        }
      },

      /**
       * Get a list of all windows added to the desktop (including hidden windows)
       *
       * @return {qx.ui.window.Window[]} Array of managed windows
       */
      getWindows: function getWindows() {
        if (!this.__windows__P_77_0) {
          this.__windows__P_77_0 = [];
        }

        return this.__windows__P_77_0;
      }
    },

    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct: function destruct() {
      this._disposeArray("__windows__P_77_0");

      this._disposeObjects("__manager__P_77_1");
    }
  });
  qx.ui.window.MDesktop.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.MChildrenHandling": {
        "defer": "runtime",
        "require": true
      },
      "qx.ui.core.MBlocker": {
        "require": true
      },
      "qx.ui.window.MDesktop": {
        "require": true
      },
      "qx.ui.core.FocusHandler": {
        "construct": true
      },
      "qx.ui.core.queue.Visibility": {
        "construct": true
      },
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.Stylesheet": {},
      "qx.bom.element.Cursor": {},
      "qx.dom.Node": {},
      "qx.bom.client.Event": {
        "require": true
      },
      "qx.bom.Event": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "load": true,
          "className": "qx.bom.client.Engine"
        },
        "event.help": {
          "className": "qx.bom.client.Event"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Shared implementation for all root widgets.
   */
  qx.Class.define("qx.ui.root.Abstract", {
    type: "abstract",
    extend: qx.ui.core.Widget,
    include: [qx.ui.core.MChildrenHandling, qx.ui.core.MBlocker, qx.ui.window.MDesktop],

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */
    construct: function construct() {
      qx.ui.core.Widget.constructor.call(this); // Register as root for the focus handler

      qx.ui.core.FocusHandler.getInstance().addRoot(this); // Directly add to visibility queue

      qx.ui.core.queue.Visibility.add(this);
      this.initNativeHelp();
      this.addListener("keypress", this.__preventScrollWhenFocused__P_34_0, this);
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "root"
      },
      // overridden
      enabled: {
        refine: true,
        init: true
      },
      // overridden
      focusable: {
        refine: true,
        init: true
      },

      /**
       *  Sets the global cursor style
       *
       *  The name of the cursor to show when the mouse pointer is over the widget.
       *  This is any valid CSS2 cursor name defined by W3C.
       *
       *  The following values are possible:
       *  <ul><li>default</li>
       *  <li>crosshair</li>
       *  <li>pointer (hand is the ie name and will mapped to pointer in non-ie).</li>
       *  <li>move</li>
       *  <li>n-resize</li>
       *  <li>ne-resize</li>
       *  <li>e-resize</li>
       *  <li>se-resize</li>
       *  <li>s-resize</li>
       *  <li>sw-resize</li>
       *  <li>w-resize</li>
       *  <li>nw-resize</li>
       *  <li>text</li>
       *  <li>wait</li>
       *  <li>help </li>
       *  <li>url([file]) = self defined cursor, file should be an ANI- or CUR-type</li>
       *  </ul>
       *
       * Please note that in the current implementation this has no effect in IE.
       */
      globalCursor: {
        check: "String",
        nullable: true,
        themeable: true,
        apply: "_applyGlobalCursor",
        event: "changeGlobalCursor"
      },

      /**
       * Whether the native context menu should be globally enabled. Setting this
       * property to <code>true</code> will allow native context menus in all
       * child widgets of this root.
       */
      nativeContextMenu: {
        refine: true,
        init: false
      },

      /**
       * If the user presses F1 in IE by default the onhelp event is fired and
       * IE’s help window is opened. Setting this property to <code>false</code>
       * prevents this behavior.
       */
      nativeHelp: {
        check: "Boolean",
        init: false,
        apply: "_applyNativeHelp"
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      __globalCursorStyleSheet__P_34_1: null,
      // overridden
      isRootWidget: function isRootWidget() {
        return true;
      },

      /**
       * Get the widget's layout manager.
       *
       * @return {qx.ui.layout.Abstract} The widget's layout manager
       */
      getLayout: function getLayout() {
        return this._getLayout();
      },
      // property apply
      _applyGlobalCursor: qx.core.Environment.select("engine.name", {
        mshtml: function mshtml(value, old) {// empty implementation
        },
        // This would be the optimal solution.
        // For performance reasons this is impractical in IE
        "default": function _default(value, old) {
          var Stylesheet = qx.bom.Stylesheet;
          var sheet = this.__globalCursorStyleSheet__P_34_1;

          if (!sheet) {
            this.__globalCursorStyleSheet__P_34_1 = sheet = Stylesheet.createElement();
          }

          Stylesheet.removeAllRules(sheet);

          if (value) {
            Stylesheet.addRule(sheet, "*", qx.bom.element.Cursor.compile(value).replace(";", "") + " !important");
          }
        }
      }),
      // property apply
      _applyNativeContextMenu: function _applyNativeContextMenu(value, old) {
        if (value) {
          this.removeListener("contextmenu", this._onNativeContextMenu, this, true);
        } else {
          this.addListener("contextmenu", this._onNativeContextMenu, this, true);
        }
      },

      /**
       * Stops the <code>contextmenu</code> event from showing the native context menu
       *
       * @param e {qx.event.type.Mouse} The event object
       */
      _onNativeContextMenu: function _onNativeContextMenu(e) {
        if (e.getTarget().getNativeContextMenu()) {
          return;
        }

        e.preventDefault();
      },

      /**
       * Fix unexpected scrolling when pressing "Space" while a widget is focused.
       *
       * @param e {qx.event.type.KeySequence} The KeySequence event
       */
      __preventScrollWhenFocused__P_34_0: function __preventScrollWhenFocused__P_34_0(e) {
        // Require space pressed
        if (e.getKeyIdentifier() !== "Space") {
          return;
        }

        var target = e.getTarget(); // Require focused. Allow scroll when container or root widget.

        var focusHandler = qx.ui.core.FocusHandler.getInstance();

        if (!focusHandler.isFocused(target)) {
          return;
        } // Require that widget does not accept text input


        var el = target.getContentElement();
        var nodeName = el.getNodeName();
        var domEl = el.getDomElement();

        if (nodeName === "input" || nodeName === "textarea" || domEl && domEl.contentEditable === "true") {
          return;
        } // do not prevent "space" key for natively focusable elements


        nodeName = qx.dom.Node.getName(e.getOriginalTarget());

        if (nodeName && ["input", "textarea", "select", "a"].indexOf(nodeName) > -1) {
          return;
        } // Ultimately, prevent default


        e.preventDefault();
      },
      // property apply
      _applyNativeHelp: function _applyNativeHelp(value, old) {
        if (qx.core.Environment.get("event.help")) {
          if (old === false) {
            qx.bom.Event.removeNativeListener(document, "help", function () {
              return false;
            });
          }

          if (value === false) {
            qx.bom.Event.addNativeListener(document, "help", function () {
              return false;
            });
          }
        }
      }
    },

    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct: function destruct() {
      this.__globalCursorStyleSheet__P_34_1 = null;
    },

    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */
    defer: function defer(statics, members) {
      qx.ui.core.MChildrenHandling.remap(members);
    }
  });
  qx.ui.root.Abstract.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.bom.element.Location": {},
      "qx.ui.core.Widget": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
  
  ************************************************************************ */

  /**
   * Each focus root delegates the focus handling to instances of the FocusHandler.
   */
  qx.Class.define("qx.ui.core.FocusHandler", {
    extend: qx.core.Object,
    type: "singleton",

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */
    construct: function construct() {
      qx.core.Object.constructor.call(this); // Create data structure

      this.__roots__P_36_0 = {};
    },

    /*
    ***********************************************
      PROPERTIES
    ***********************************************
    */
    properties: {
      /**
       * Activate changing focus with the tab key (default: true)
       */
      useTabNavigation: {
        check: "Boolean",
        init: true
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      __roots__P_36_0: null,
      __activeChild__P_36_1: null,
      __focusedChild__P_36_2: null,
      __currentRoot__P_36_3: null,

      /**
       * Connects to a top-level root element (which initially receives
       * all events of the root). This are normally all page and application
       * roots, but no inline roots (they are typically sitting inside
       * another root).
       *
       * @param root {qx.ui.root.Abstract} Any root
       */
      connectTo: function connectTo(root) {
        // this.debug("Connect to: " + root);
        root.addListener("keypress", this.__onKeyPress__P_36_4, this);
        root.addListener("focusin", this._onFocusIn, this, true);
        root.addListener("focusout", this._onFocusOut, this, true);
        root.addListener("activate", this._onActivate, this, true);
        root.addListener("deactivate", this._onDeactivate, this, true);
      },

      /**
       * Registers a widget as a focus root. A focus root comes
       * with an separate tab sequence handling.
       *
       * @param widget {qx.ui.core.Widget} The widget to register
       */
      addRoot: function addRoot(widget) {
        // this.debug("Add focusRoot: " + widget);
        this.__roots__P_36_0[widget.toHashCode()] = widget;
      },

      /**
       * Deregisters a previous added widget.
       *
       * @param widget {qx.ui.core.Widget} The widget to deregister
       */
      removeRoot: function removeRoot(widget) {
        // this.debug("Remove focusRoot: " + widget);
        delete this.__roots__P_36_0[widget.toHashCode()];
      },

      /**
       * Get the active widget
       *
       * @return {qx.ui.core.Widget|null} The active widget or <code>null</code>
       *    if no widget is active
       */
      getActiveWidget: function getActiveWidget() {
        return this.__activeChild__P_36_1;
      },

      /**
       * Whether the given widget is the active one
       *
       * @param widget {qx.ui.core.Widget} The widget to check
       * @return {Boolean} <code>true</code> if the given widget is active
       */
      isActive: function isActive(widget) {
        return this.__activeChild__P_36_1 == widget;
      },

      /**
       * Get the focused widget
       *
       * @return {qx.ui.core.Widget|null} The focused widget or <code>null</code>
       *    if no widget has the focus
       */
      getFocusedWidget: function getFocusedWidget() {
        return this.__focusedChild__P_36_2;
      },

      /**
       * Whether the given widget is the focused one.
       *
       * @param widget {qx.ui.core.Widget} The widget to check
       * @return {Boolean} <code>true</code> if the given widget is focused
       */
      isFocused: function isFocused(widget) {
        return this.__focusedChild__P_36_2 == widget;
      },

      /**
       * Whether the given widgets acts as a focus root.
       *
       * @param widget {qx.ui.core.Widget} The widget to check
       * @return {Boolean} <code>true</code> if the given widget is a focus root
       */
      isFocusRoot: function isFocusRoot(widget) {
        return !!this.__roots__P_36_0[widget.toHashCode()];
      },

      /*
      ---------------------------------------------------------------------------
        EVENT HANDLER
      ---------------------------------------------------------------------------
      */

      /**
       * Internal event handler for activate event.
       *
       * @param e {qx.event.type.Focus} Focus event
       */
      _onActivate: function _onActivate(e) {
        var target = e.getTarget();
        this.__activeChild__P_36_1 = target; //this.debug("active: " + target);

        var root = this.__findFocusRoot__P_36_5(target);

        if (root != this.__currentRoot__P_36_3) {
          this.__currentRoot__P_36_3 = root;
        }
      },

      /**
       * Internal event handler for deactivate event.
       *
       * @param e {qx.event.type.Focus} Focus event
       */
      _onDeactivate: function _onDeactivate(e) {
        var target = e.getTarget();

        if (this.__activeChild__P_36_1 == target) {
          this.__activeChild__P_36_1 = null;
        }
      },

      /**
       * Internal event handler for focusin event.
       *
       * @param e {qx.event.type.Focus} Focus event
       */
      _onFocusIn: function _onFocusIn(e) {
        var target = e.getTarget();

        if (target != this.__focusedChild__P_36_2) {
          this.__focusedChild__P_36_2 = target;
          target.visualizeFocus();
        }
      },

      /**
       * Internal event handler for focusout event.
       *
       * @param e {qx.event.type.Focus} Focus event
       */
      _onFocusOut: function _onFocusOut(e) {
        var target = e.getTarget();

        if (target == this.__focusedChild__P_36_2) {
          this.__focusedChild__P_36_2 = null;
          target.visualizeBlur();
        }
      },

      /**
       * Internal event handler for TAB key.
       *
       * @param e {qx.event.type.KeySequence} Key event
       */
      __onKeyPress__P_36_4: function __onKeyPress__P_36_4(e) {
        if (e.getKeyIdentifier() != "Tab" || !this.isUseTabNavigation()) {
          return;
        }

        if (!this.__currentRoot__P_36_3) {
          return;
        } // Stop all key-events with a TAB keycode


        e.stopPropagation();
        e.preventDefault(); // Support shift key to reverse widget detection order

        var current = this.__focusedChild__P_36_2;

        if (!e.isShiftPressed()) {
          var next = current ? this.__getWidgetAfter__P_36_6(current) : this.__getFirstWidget__P_36_7();
        } else {
          var next = current ? this.__getWidgetBefore__P_36_8(current) : this.__getLastWidget__P_36_9();
        } // If there was a widget found, focus it


        if (next) {
          next.tabFocus();
        }
      },

      /*
      ---------------------------------------------------------------------------
        UTILS
      ---------------------------------------------------------------------------
      */

      /**
       * Finds the next focus root, starting with the given widget.
       *
       * @param widget {qx.ui.core.Widget} The widget to find a focus root for.
       * @return {qx.ui.core.Widget|null} The focus root for the given widget or
       * <code>true</code> if no focus root could be found
       */
      __findFocusRoot__P_36_5: function __findFocusRoot__P_36_5(widget) {
        var roots = this.__roots__P_36_0;

        while (widget) {
          if (roots[widget.toHashCode()]) {
            return widget;
          }

          widget = widget.getLayoutParent();
        }

        return null;
      },

      /*
      ---------------------------------------------------------------------------
        TAB SUPPORT IMPLEMENTATION
      ---------------------------------------------------------------------------
      */

      /**
       * Compares the order of two widgets
       *
       * @param widget1 {qx.ui.core.Widget} Widget A
       * @param widget2 {qx.ui.core.Widget} Widget B
       * @return {Integer} A sort() compatible integer with values
       *   small than 0, exactly 0 or bigger than 0.
       */
      __compareTabOrder__P_36_10: function __compareTabOrder__P_36_10(widget1, widget2) {
        if (widget1 === widget2) {
          return 0;
        } // Sort-Check #1: Tab-Index


        var tab1 = widget1.getTabIndex() || 0;
        var tab2 = widget2.getTabIndex() || 0;

        if (tab1 != tab2) {
          return tab1 - tab2;
        } // Computing location


        var el1 = widget1.getContentElement().getDomElement();
        var el2 = widget2.getContentElement().getDomElement();
        var Location = qx.bom.element.Location;
        var loc1 = Location.get(el1);
        var loc2 = Location.get(el2); // Sort-Check #2: Top-Position

        if (loc1.top != loc2.top) {
          return loc1.top - loc2.top;
        } // Sort-Check #3: Left-Position


        if (loc1.left != loc2.left) {
          return loc1.left - loc2.left;
        } // Sort-Check #4: zIndex


        var z1 = widget1.getZIndex();
        var z2 = widget2.getZIndex();

        if (z1 != z2) {
          return z1 - z2;
        }

        return 0;
      },

      /**
       * Returns the first widget.
       *
       * @return {qx.ui.core.Widget} Returns the first (positioned) widget from
       *    the current root.
       */
      __getFirstWidget__P_36_7: function __getFirstWidget__P_36_7() {
        return this.__getFirst__P_36_11(this.__currentRoot__P_36_3, null);
      },

      /**
       * Returns the last widget.
       *
       * @return {qx.ui.core.Widget} Returns the last (positioned) widget from
       *    the current root.
       */
      __getLastWidget__P_36_9: function __getLastWidget__P_36_9() {
        return this.__getLast__P_36_12(this.__currentRoot__P_36_3, null);
      },

      /**
       * Returns the widget after the given one.
       *
       * @param widget {qx.ui.core.Widget} Widget to start with
       * @return {qx.ui.core.Widget} The found widget.
       */
      __getWidgetAfter__P_36_6: function __getWidgetAfter__P_36_6(widget) {
        var root = this.__currentRoot__P_36_3;

        if (root == widget) {
          return this.__getFirstWidget__P_36_7();
        }

        while (widget && widget.getAnonymous()) {
          widget = widget.getLayoutParent();
        }

        if (widget == null) {
          return [];
        }

        var result = [];

        this.__collectAllAfter__P_36_13(root, widget, result);

        result.sort(this.__compareTabOrder__P_36_10);
        var len = result.length;
        return len > 0 ? result[0] : this.__getFirstWidget__P_36_7();
      },

      /**
       * Returns the widget before the given one.
       *
       * @param widget {qx.ui.core.Widget} Widget to start with
       * @return {qx.ui.core.Widget} The found widget.
       */
      __getWidgetBefore__P_36_8: function __getWidgetBefore__P_36_8(widget) {
        var root = this.__currentRoot__P_36_3;

        if (root == widget) {
          return this.__getLastWidget__P_36_9();
        }

        while (widget && widget.getAnonymous()) {
          widget = widget.getLayoutParent();
        }

        if (widget == null) {
          return [];
        }

        var result = [];

        this.__collectAllBefore__P_36_14(root, widget, result);

        result.sort(this.__compareTabOrder__P_36_10);
        var len = result.length;
        return len > 0 ? result[len - 1] : this.__getLastWidget__P_36_9();
      },

      /*
      ---------------------------------------------------------------------------
        INTERNAL API USED BY METHODS ABOVE
      ---------------------------------------------------------------------------
      */

      /**
       * Collects all widgets which are after the given widget in
       * the given parent widget. Append all found children to the
       * <code>list</code>.
       *
       * @param parent {qx.ui.core.Widget} Parent widget
       * @param widget {qx.ui.core.Widget} Child widget to start with
       * @param result {Array} Result list
       */
      __collectAllAfter__P_36_13: function __collectAllAfter__P_36_13(parent, widget, result) {
        var children = parent.getLayoutChildren();
        var child;

        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i]; // Filter spacers etc.

          if (!(child instanceof qx.ui.core.Widget)) {
            continue;
          }

          if (!this.isFocusRoot(child) && child.isEnabled() && child.isVisible()) {
            if (child.isTabable() && this.__compareTabOrder__P_36_10(widget, child) < 0) {
              result.push(child);
            }

            this.__collectAllAfter__P_36_13(child, widget, result);
          }
        }
      },

      /**
       * Collects all widgets which are before the given widget in
       * the given parent widget. Append all found children to the
       * <code>list</code>.
       *
       * @param parent {qx.ui.core.Widget} Parent widget
       * @param widget {qx.ui.core.Widget} Child widget to start with
       * @param result {Array} Result list
       */
      __collectAllBefore__P_36_14: function __collectAllBefore__P_36_14(parent, widget, result) {
        var children = parent.getLayoutChildren();
        var child;

        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i]; // Filter spacers etc.

          if (!(child instanceof qx.ui.core.Widget)) {
            continue;
          }

          if (!this.isFocusRoot(child) && child.isEnabled() && child.isVisible()) {
            if (child.isTabable() && this.__compareTabOrder__P_36_10(widget, child) > 0) {
              result.push(child);
            }

            this.__collectAllBefore__P_36_14(child, widget, result);
          }
        }
      },

      /**
       * Find first (positioned) widget. (Sorted by coordinates, zIndex, etc.)
       *
       * @param parent {qx.ui.core.Widget} Parent widget
       * @param firstWidget {qx.ui.core.Widget?null} Current first widget
       * @return {qx.ui.core.Widget} The first (positioned) widget
       */
      __getFirst__P_36_11: function __getFirst__P_36_11(parent, firstWidget) {
        var children = parent.getLayoutChildren();
        var child;

        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i]; // Filter spacers etc.

          if (!(child instanceof qx.ui.core.Widget)) {
            continue;
          } // Ignore focus roots completely


          if (!this.isFocusRoot(child) && child.isEnabled() && child.isVisible()) {
            if (child.isTabable()) {
              if (firstWidget == null || this.__compareTabOrder__P_36_10(child, firstWidget) < 0) {
                firstWidget = child;
              }
            } // Deep iteration into children hierarchy


            firstWidget = this.__getFirst__P_36_11(child, firstWidget);
          }
        }

        return firstWidget;
      },

      /**
       * Find last (positioned) widget. (Sorted by coordinates, zIndex, etc.)
       *
       * @param parent {qx.ui.core.Widget} Parent widget
       * @param lastWidget {qx.ui.core.Widget?null} Current last widget
       * @return {qx.ui.core.Widget} The last (positioned) widget
       */
      __getLast__P_36_12: function __getLast__P_36_12(parent, lastWidget) {
        var children = parent.getLayoutChildren();
        var child;

        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i]; // Filter spacers etc.

          if (!(child instanceof qx.ui.core.Widget)) {
            continue;
          } // Ignore focus roots completely


          if (!this.isFocusRoot(child) && child.isEnabled() && child.isVisible()) {
            if (child.isTabable()) {
              if (lastWidget == null || this.__compareTabOrder__P_36_10(child, lastWidget) > 0) {
                lastWidget = child;
              }
            } // Deep iteration into children hierarchy


            lastWidget = this.__getLast__P_36_12(child, lastWidget);
          }
        }

        return lastWidget;
      }
    },

    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct: function destruct() {
      this._disposeMap("__roots__P_36_0");

      this.__focusedChild__P_36_2 = this.__activeChild__P_36_1 = this.__currentRoot__P_36_3 = null;
    }
  });
  qx.ui.core.FocusHandler.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.lang.Array": {},
      "qx.ui.core.queue.Manager": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * Keeps data about the visibility of all widgets. Updates the internal
   * tree when widgets are added, removed or modify their visibility.
   */
  qx.Class.define("qx.ui.core.queue.Visibility", {
    statics: {
      /** @type {Array} This contains all the queued widgets for the next flush. */
      __queue__P_72_0: [],

      /** @type {Map} map of widgets by hash code which are in the queue */
      __lookup__P_72_1: {},

      /** @type {Map} Maps hash codes to visibility */
      __data__P_72_2: {},

      /**
       * Clears the cached data of the given widget. Normally only used
       * during interims disposes of one or a few widgets.
       *
       * @param widget {qx.ui.core.Widget} The widget to clear
       */
      remove: function remove(widget) {
        if (this.__lookup__P_72_1[widget.toHashCode()]) {
          delete this.__lookup__P_72_1[widget.toHashCode()];
          qx.lang.Array.remove(this.__queue__P_72_0, widget);
        }

        delete this.__data__P_72_2[widget.toHashCode()];
      },

      /**
       * Whether the given widget is visible.
       *
       * Please note that the information given by this method is queued and may not be accurate
       * until the next queue flush happens.
       *
       * @param widget {qx.ui.core.Widget} The widget to query
       * @return {Boolean} Whether the widget is visible
       */
      isVisible: function isVisible(widget) {
        return this.__data__P_72_2[widget.toHashCode()] || false;
      },

      /**
       * Computes the visibility for the given widget
       *
       * @param widget {qx.ui.core.Widget} The widget to update
       * @return {Boolean} Whether the widget is visible
       */
      __computeVisible__P_72_3: function __computeVisible__P_72_3(widget) {
        var data = this.__data__P_72_2;
        var hash = widget.toHashCode();
        var visible; // Respect local value

        if (widget.isExcluded()) {
          visible = false;
        } else {
          // Parent hierarchy
          var parent = widget.$$parent;

          if (parent) {
            visible = this.__computeVisible__P_72_3(parent);
          } else {
            visible = widget.isRootWidget();
          }
        }

        return data[hash] = visible;
      },

      /**
       * Adds a widget to the queue.
       *
       * Should only be used by {@link qx.ui.core.Widget}.
       *
       * @param widget {qx.ui.core.Widget} The widget to add.
       */
      add: function add(widget) {
        if (this.__lookup__P_72_1[widget.toHashCode()]) {
          return;
        }

        this.__queue__P_72_0.unshift(widget);

        this.__lookup__P_72_1[widget.toHashCode()] = widget;
        qx.ui.core.queue.Manager.scheduleFlush("visibility");
      },

      /**
       * Flushes the visibility queue.
       *
       * This is used exclusively by the {@link qx.ui.core.queue.Manager}.
       */
      flush: function flush() {
        // Dispose all registered objects
        var queue = this.__queue__P_72_0;
        var data = this.__data__P_72_2; // Dynamically add children to queue
        // Only respect already known widgets because otherwise the children
        // are also already in the queue (added on their own)

        for (var i = queue.length - 1; i >= 0; i--) {
          var hash = queue[i].toHashCode();

          if (data[hash] != null) {
            // recursive method call which adds widgets to the queue so be
            // careful with that one (performance critical)
            queue[i].addChildrenToQueue(queue);
          }
        } // Cache old data, clear current data
        // Do this before starting with recomputation because
        // new data may also be added by related widgets and not
        // only the widget itself.


        var oldData = {};

        for (var i = queue.length - 1; i >= 0; i--) {
          var hash = queue[i].toHashCode();
          oldData[hash] = data[hash];
          data[hash] = null;
        } // Finally recompute


        for (var i = queue.length - 1; i >= 0; i--) {
          var widget = queue[i];
          var hash = widget.toHashCode();
          queue.splice(i, 1); // Only update when not already updated by another widget

          if (data[hash] == null) {
            this.__computeVisible__P_72_3(widget);
          } // Check for updates required to the appearance.
          // Hint: Invisible widgets are ignored inside appearance flush


          if (data[hash] && data[hash] != oldData[hash]) {
            widget.checkAppearanceNeeds();
          }
        } // Recreate the array is cheaper compared to keep a sparse array over time


        this.__queue__P_72_0 = [];
        this.__lookup__P_72_1 = {};
      }
    }
  });
  qx.ui.core.queue.Visibility.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.event.handler.Window": {
        "require": true
      },
      "qx.core.Environment": {
        "defer": "load",
        "construct": true,
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.root.Abstract": {
        "construct": true,
        "require": true
      },
      "qx.dom.Node": {
        "construct": true
      },
      "qx.event.Registration": {
        "construct": true
      },
      "qx.ui.layout.Canvas": {
        "construct": true
      },
      "qx.ui.core.queue.Layout": {
        "construct": true
      },
      "qx.ui.core.FocusHandler": {
        "construct": true
      },
      "qx.bom.client.OperatingSystem": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.Widget": {
        "construct": true
      },
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.html.Root": {},
      "qx.bom.Viewport": {},
      "qx.bom.element.Style": {},
      "qx.dom.Element": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "os.name": {
          "construct": true,
          "className": "qx.bom.client.OperatingSystem"
        },
        "engine.name": {
          "className": "qx.bom.client.Engine"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This is the root widget for qooxdoo applications with an
   * "application" like behaviour. The widget will span the whole viewport
   * and the document body will have no scrollbars.
   *
   * The root widget does not support paddings and decorators with insets.
   *
   * If you want to enhance HTML pages with qooxdoo widgets please use
   * {@link qx.ui.root.Page} eventually in combination with
   * {@link qx.ui.root.Inline} widgets.
   *
   * This class uses a {@link qx.ui.layout.Canvas} as fixed layout. The layout
   * cannot be changed.
   *
   * @require(qx.event.handler.Window)
   * @ignore(qx.ui.popup)
   * @ignore(qx.ui.popup.Manager.*)
   * @ignore(qx.ui.menu)
   * @ignore(qx.ui.menu.Manager.*)
   * @ignore(qx.ui)
   */
  qx.Class.define("qx.ui.root.Application", {
    extend: qx.ui.root.Abstract,

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param doc {Document} Document to use
     */
    construct: function construct(doc) {
      // Symbolic links
      this.__window__P_12_0 = qx.dom.Node.getWindow(doc);
      this.__doc__P_12_1 = doc; // Base call

      qx.ui.root.Abstract.constructor.call(this); // Resize handling

      qx.event.Registration.addListener(this.__window__P_12_0, "resize", this._onResize, this); // Use a hard-coded canvas layout

      this._setLayout(new qx.ui.layout.Canvas()); // Directly schedule layout for root element


      qx.ui.core.queue.Layout.add(this); // Register as root

      qx.ui.core.FocusHandler.getInstance().connectTo(this);
      this.getContentElement().disableScrolling(); // quick fix for [BUG #7680]

      this.getContentElement().setStyle("-webkit-backface-visibility", "hidden"); // prevent scrolling on touch devices

      this.addListener("touchmove", this.__stopScrolling__P_12_2, this); // handle focus for iOS which seems to deny any focus action

      if (qx.core.Environment.get("os.name") == "ios") {
        this.getContentElement().addListener("tap", function (e) {
          var widget = qx.ui.core.Widget.getWidgetByElement(e.getTarget());

          while (widget && !widget.isFocusable()) {
            widget = widget.getLayoutParent();
          }

          if (widget && widget.isFocusable()) {
            widget.getContentElement().focus();
          }
        }, this, true);
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      __window__P_12_0: null,
      __doc__P_12_1: null,
      // overridden

      /**
       * Create the widget's container HTML element.
       *
       * @lint ignoreDeprecated(alert)
       * @return {qx.html.Element} The container HTML element
       */
      _createContentElement: function _createContentElement() {
        var doc = this.__doc__P_12_1;

        if (qx.core.Environment.get("engine.name") == "webkit") {
          // In the "DOMContentLoaded" event of WebKit (Safari, Chrome) no body
          // element seems to be available in the DOM, if the HTML file did not
          // contain a body tag explicitly. Unfortunately, it cannot be added
          // here dynamically.
          if (!doc.body) {
            /* eslint-disable-next-line no-alert */
            window.alert("The application could not be started due to a missing body tag in the HTML file!");
          }
        } // Apply application layout


        var hstyle = doc.documentElement.style;
        var bstyle = doc.body.style;
        hstyle.overflow = bstyle.overflow = "hidden";
        hstyle.padding = hstyle.margin = bstyle.padding = bstyle.margin = "0px";
        hstyle.width = hstyle.height = bstyle.width = bstyle.height = "100%";
        var elem = doc.createElement("div");
        doc.body.appendChild(elem);
        var root = new qx.html.Root(elem);
        root.setStyles({
          position: "absolute",
          overflowX: "hidden",
          overflowY: "hidden"
        }); // Store reference to the widget in the DOM element.

        root.connectObject(this);
        return root;
      },

      /**
       * Listener for window's resize event
       *
       * @param e {qx.event.type.Event} Event object
       */
      _onResize: function _onResize(e) {
        qx.ui.core.queue.Layout.add(this); // close all popups

        if (qx.ui.popup && qx.ui.popup.Manager) {
          qx.ui.popup.Manager.getInstance().hideAll();
        } // close all menus


        if (qx.ui.menu && qx.ui.menu.Manager) {
          qx.ui.menu.Manager.getInstance().hideAll();
        }
      },
      // overridden
      _computeSizeHint: function _computeSizeHint() {
        var width = qx.bom.Viewport.getWidth(this.__window__P_12_0);
        var height = qx.bom.Viewport.getHeight(this.__window__P_12_0);
        return {
          minWidth: width,
          width: width,
          maxWidth: width,
          minHeight: height,
          height: height,
          maxHeight: height
        };
      },
      // overridden
      _applyPadding: function _applyPadding(value, old, name) {
        if (value && (name == "paddingTop" || name == "paddingLeft")) {
          throw new Error("The root widget does not support 'left', or 'top' paddings!");
        }

        qx.ui.root.Application.superclass.prototype._applyPadding.call(this, value, old, name);
      },

      /**
       * Handler for the native 'touchstart' on the window which prevents
       * the native page scrolling.
       * @param e {qx.event.type.Touch} The qooxdoo touch event.
       */
      __stopScrolling__P_12_2: function __stopScrolling__P_12_2(e) {
        var node = e.getOriginalTarget();

        while (node && node.style) {
          var touchAction = qx.bom.element.Style.get(node, "touch-action") !== "none" && qx.bom.element.Style.get(node, "touch-action") !== "";
          var webkitOverflowScrolling = qx.bom.element.Style.get(node, "-webkit-overflow-scrolling") === "touch";
          var overflowX = qx.bom.element.Style.get(node, "overflowX") != "hidden";
          var overflowY = qx.bom.element.Style.get(node, "overflowY") != "hidden";

          if (touchAction || webkitOverflowScrolling || overflowY || overflowX) {
            return;
          }

          node = node.parentNode;
        }

        e.preventDefault();
      },
      // overridden
      destroy: function destroy() {
        if (this.$$disposed) {
          return;
        }

        qx.dom.Element.remove(this.getContentElement().getDomElement());
        qx.ui.root.Application.superclass.prototype.destroy.call(this);
      }
    },

    /*
    *****************************************************************************
       DESTRUCT
    *****************************************************************************
    */
    destruct: function destruct() {
      this.__window__P_12_0 = this.__doc__P_12_1 = null;
    }
  });
  qx.ui.root.Application.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.DragDropScrolling": {
        "construct": true
      },
      "qx.Class": {},
      "qx.ui.core.scroll.MScrollBarFactory": {},
      "qx.ui.core.Widget": {},
      "qx.event.Timer": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2013 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Richard Sternagel (rsternagel)
  
  ************************************************************************ */

  /**
   * Provides scrolling ability during drag session to the widget.
   */
  qx.Mixin.define("qx.ui.core.MDragDropScrolling", {
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */
    construct: function construct() {
      var widget = this;

      if (this instanceof qx.ui.core.DragDropScrolling) {
        widget = this._getWidget();
      }

      widget.addListener("drag", this.__onDrag__P_169_0, this);
      widget.addListener("dragend", this.__onDragend__P_169_1, this);
      this.__xDirs__P_169_2 = ["left", "right"];
      this.__yDirs__P_169_3 = ["top", "bottom"];
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /** The threshold for the x-axis (in pixel) to activate scrolling at the edges. */
      dragScrollThresholdX: {
        check: "Integer",
        init: 30
      },

      /** The threshold for the y-axis (in pixel) to activate scrolling at the edges. */
      dragScrollThresholdY: {
        check: "Integer",
        init: 30
      },

      /** The factor for slowing down the scrolling. */
      dragScrollSlowDownFactor: {
        check: "Float",
        init: 0.1
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      __dragScrollTimer__P_169_4: null,
      __xDirs__P_169_2: null,
      __yDirs__P_169_3: null,

      /**
       * Finds the first scrollable parent (in the parent chain).
       *
       * @param widget {qx.ui.core.LayoutItem} The widget to start from.
       * @return {qx.ui.core.Widget} A scrollable widget.
       */
      _findScrollableParent: function _findScrollableParent(widget) {
        var cur = widget;

        if (cur === null) {
          return null;
        }

        while (cur.getLayoutParent()) {
          cur = cur.getLayoutParent();

          if (this._isScrollable(cur)) {
            return cur;
          }
        }

        return null;
      },

      /**
       * Whether the widget is scrollable.
       *
       * @param widget {qx.ui.core.Widget} The widget to check.
       * @return {Boolean} Whether the widget is scrollable.
       */
      _isScrollable: function _isScrollable(widget) {
        return qx.Class.hasMixin(widget.constructor, qx.ui.core.scroll.MScrollBarFactory);
      },

      /**
       * Gets the bounds of the given scrollable.
       *
       * @param scrollable {qx.ui.core.Widget} Scrollable which has scrollbar child controls.
       * @return {Map} A map with all four bounds (e.g. {"left":0, "top":20, "right":0, "bottom":80}).
       */
      _getBounds: function _getBounds(scrollable) {
        var bounds = scrollable.getContentLocation(); // the scrollable may dictate a nested widget for more precise bounds

        if (scrollable.getScrollAreaContainer) {
          bounds = scrollable.getScrollAreaContainer().getContentLocation();
        }

        return bounds;
      },

      /**
       * Gets the edge type or null if the pointer isn't within one of the thresholds.
       *
       * @param diff {Map} Difference map with all for edgeTypes.
       * @param thresholdX {Number} x-axis threshold.
       * @param thresholdY {Number} y-axis threshold.
       * @return {String} One of the four edgeTypes ('left', 'right', 'top', 'bottom').
       */
      _getEdgeType: function _getEdgeType(diff, thresholdX, thresholdY) {
        if (diff.left * -1 <= thresholdX && diff.left < 0) {
          return "left";
        } else if (diff.top * -1 <= thresholdY && diff.top < 0) {
          return "top";
        } else if (diff.right <= thresholdX && diff.right > 0) {
          return "right";
        } else if (diff.bottom <= thresholdY && diff.bottom > 0) {
          return "bottom";
        } else {
          return null;
        }
      },

      /**
       * Gets the axis ('x' or 'y') by the edge type.
       *
       * @param edgeType {String} One of the four edgeTypes ('left', 'right', 'top', 'bottom').
       * @throws {Error} If edgeType is not one of the distinct four ones.
       * @return {String} Returns 'y' or 'x'.
       */
      _getAxis: function _getAxis(edgeType) {
        if (this.__xDirs__P_169_2.indexOf(edgeType) !== -1) {
          return "x";
        } else if (this.__yDirs__P_169_3.indexOf(edgeType) !== -1) {
          return "y";
        } else {
          throw new Error("Invalid edge type given (" + edgeType + "). Must be: 'left', 'right', 'top' or 'bottom'");
        }
      },

      /**
       * Gets the threshold amount by edge type.
       *
       * @param edgeType {String} One of the four edgeTypes ('left', 'right', 'top', 'bottom').
       * @return {Number} The threshold of the x or y axis.
       */
      _getThresholdByEdgeType: function _getThresholdByEdgeType(edgeType) {
        if (this.__xDirs__P_169_2.indexOf(edgeType) !== -1) {
          return this.getDragScrollThresholdX();
        } else if (this.__yDirs__P_169_3.indexOf(edgeType) !== -1) {
          return this.getDragScrollThresholdY();
        }
      },

      /**
       * Whether the scrollbar is visible.
       *
       * @param scrollable {qx.ui.core.Widget} Scrollable which has scrollbar child controls.
       * @param axis {String} Can be 'y' or 'x'.
       * @return {Boolean} Whether the scrollbar is visible.
       */
      _isScrollbarVisible: function _isScrollbarVisible(scrollable, axis) {
        if (scrollable && scrollable._isChildControlVisible) {
          return scrollable._isChildControlVisible("scrollbar-" + axis);
        } else {
          return false;
        }
      },

      /**
       * Whether the scrollbar is exceeding it's maximum position.
       *
       * @param scrollbar {qx.ui.core.scroll.IScrollBar} Scrollbar to check.
       * @param axis {String} Can be 'y' or 'x'.
       * @param amount {Number} Amount to scroll which may be negative.
       * @return {Boolean} Whether the amount will exceed the scrollbar max position.
       */
      _isScrollbarExceedingMaxPos: function _isScrollbarExceedingMaxPos(scrollbar, axis, amount) {
        var newPos = 0;

        if (!scrollbar) {
          return true;
        }

        newPos = scrollbar.getPosition() + amount;
        return newPos > scrollbar.getMaximum() || newPos < 0;
      },

      /**
       * Calculates the threshold exceedance (which may be negative).
       *
       * @param diff {Number} Difference value of one edgeType.
       * @param threshold {Number} x-axis or y-axis threshold.
       * @return {Number} Threshold exceedance amount (positive or negative).
       */
      _calculateThresholdExceedance: function _calculateThresholdExceedance(diff, threshold) {
        var amount = threshold - Math.abs(diff);
        return diff < 0 ? amount * -1 : amount;
      },

      /**
       * Calculates the scroll amount (which may be negative).
       * The amount is influenced by the scrollbar size (bigger = faster)
       * the exceedanceAmount (bigger = faster) and the slowDownFactor.
       *
       * @param scrollbarSize {Number} Size of the scrollbar.
       * @param exceedanceAmount {Number} Threshold exceedance amount (positive or negative).
       * @return {Number} Scroll amount (positive or negative).
       */
      _calculateScrollAmount: function _calculateScrollAmount(scrollbarSize, exceedanceAmount) {
        return Math.floor(scrollbarSize / 100 * exceedanceAmount * this.getDragScrollSlowDownFactor());
      },

      /**
       * Scrolls the given scrollable on the given axis for the given amount.
       *
       * @param scrollable {qx.ui.core.Widget} Scrollable which has scrollbar child controls.
       * @param axis {String} Can be 'y' or 'x'.
       * @param exceedanceAmount {Number} Threshold exceedance amount (positive or negative).
       */
      _scrollBy: function _scrollBy(scrollable, axis, exceedanceAmount) {
        var scrollbar = scrollable.getChildControl("scrollbar-" + axis, true);

        if (!scrollbar) {
          return;
        }

        var bounds = scrollbar.getBounds(),
            scrollbarSize = axis === "x" ? bounds.width : bounds.height,
            amount = this._calculateScrollAmount(scrollbarSize, exceedanceAmount);

        if (this._isScrollbarExceedingMaxPos(scrollbar, axis, amount)) {
          this.__dragScrollTimer__P_169_4.stop();
        }

        scrollbar.scrollBy(amount);
      },

      /*
      ---------------------------------------------------------------------------
      EVENT HANDLERS
      ---------------------------------------------------------------------------
      */

      /**
       * Event handler for the drag event.
       *
       * @param e {qx.event.type.Drag} The drag event instance.
       */
      __onDrag__P_169_0: function __onDrag__P_169_0(e) {
        if (this.__dragScrollTimer__P_169_4) {
          // stop last scroll action
          this.__dragScrollTimer__P_169_4.stop();
        }

        var target;

        if (e.getOriginalTarget() instanceof qx.ui.core.Widget) {
          target = e.getOriginalTarget();
        } else {
          target = qx.ui.core.Widget.getWidgetByElement(e.getOriginalTarget());
        }

        if (!target) {
          return;
        }

        var scrollable;

        if (this._isScrollable(target)) {
          scrollable = target;
        } else {
          scrollable = this._findScrollableParent(target);
        }

        while (scrollable) {
          var bounds = this._getBounds(scrollable),
              xPos = e.getDocumentLeft(),
              yPos = e.getDocumentTop(),
              diff = {
            left: bounds.left - xPos,
            right: bounds.right - xPos,
            top: bounds.top - yPos,
            bottom: bounds.bottom - yPos
          },
              edgeType = null,
              axis = "",
              exceedanceAmount = 0;

          edgeType = this._getEdgeType(diff, this.getDragScrollThresholdX(), this.getDragScrollThresholdY());

          if (!edgeType) {
            scrollable = this._findScrollableParent(scrollable);
            continue;
          }

          axis = this._getAxis(edgeType);

          if (this._isScrollbarVisible(scrollable, axis)) {
            exceedanceAmount = this._calculateThresholdExceedance(diff[edgeType], this._getThresholdByEdgeType(edgeType));

            if (this.__dragScrollTimer__P_169_4) {
              this.__dragScrollTimer__P_169_4.dispose();
            }

            this.__dragScrollTimer__P_169_4 = new qx.event.Timer(50);

            this.__dragScrollTimer__P_169_4.addListener("interval", function (scrollable, axis, amount) {
              this._scrollBy(scrollable, axis, amount);
            }.bind(this, scrollable, axis, exceedanceAmount));

            this.__dragScrollTimer__P_169_4.start();

            e.stopPropagation();
            return;
          } else {
            scrollable = this._findScrollableParent(scrollable);
          }
        }
      },

      /**
       * Event handler for the dragend event.
       *
       * @param e {qx.event.type.Drag} The drag event instance.
       */
      __onDragend__P_169_1: function __onDragend__P_169_1(e) {
        if (this.__dragScrollTimer__P_169_4) {
          this.__dragScrollTimer__P_169_4.stop();
        }
      }
    },
    destruct: function destruct() {
      if (this.__dragScrollTimer__P_169_4) {
        this.__dragScrollTimer__P_169_4.dispose();
      }
    }
  });
  qx.ui.core.MDragDropScrolling.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.MDragDropScrolling": {
        "require": true
      },
      "qx.core.Init": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2014 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Mustafa Sak (msak)
  
  ************************************************************************ */

  /**
   * Provides scrolling ability during drag session to the widget.
   */
  qx.Class.define("qx.ui.core.DragDropScrolling", {
    extend: qx.core.Object,
    include: [qx.ui.core.MDragDropScrolling],
    construct: function construct(widget) {
      qx.core.Object.constructor.call(this);
      this._widget = widget;
    },
    members: {
      _widget: null,

      /**
       * Returns the root widget whose children will have scroll on drag session
       * behavior. Widget was set on constructor or will be application root by
       * default.
       *
       * @return {qx.ui.core.Widget} The root widget whose children will have
       * scroll on drag session
       */
      _getWidget: function _getWidget() {
        return this._widget || qx.core.Init.getApplication().getRoot();
      }
    }
  });
  qx.ui.core.DragDropScrolling.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.MDragDropScrolling": {
        "require": true
      },
      "qx.ui.layout.VBox": {
        "construct": true
      },
      "qx.ui.container.Composite": {
        "construct": true
      },
      "qx.ui.layout.HBox": {
        "construct": true
      },
      "qx.ui.table.rowrenderer.Default": {
        "construct": true
      },
      "qx.locale.Manager": {
        "construct": true
      },
      "qx.ui.table.columnmenu.Button": {},
      "qx.ui.table.selection.Manager": {},
      "qx.ui.table.selection.Model": {},
      "qx.ui.table.columnmodel.Basic": {},
      "qx.ui.table.pane.Pane": {},
      "qx.ui.table.pane.Header": {},
      "qx.ui.table.pane.Scroller": {},
      "qx.ui.table.pane.Model": {},
      "qx.ui.basic.Label": {},
      "qx.ui.table.model.Simple": {},
      "qx.event.Registration": {},
      "qx.log.Logger": {},
      "qx.ui.table.pane.FocusIndicator": {},
      "qx.lang.Number": {},
      "qx.event.Timer": {},
      "qx.core.Assert": {},
      "qx.ui.table.IColumnMenuItem": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2006 STZ-IDA, Germany, http://www.stz-ida.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Til Schneider (til132)
       * Fabian Jakobs (fjakobs)
       * Jonathan Weiß (jonathan_rass)
  
  ************************************************************************ */

  /**
   * Table
   *
   * A detailed description can be found in the package description
   * {@link qx.ui.table}.
   *
   * @childControl statusbar {qx.ui.basic.Label} label to show the status of the table
   * @childControl column-button {qx.ui.table.columnmenu.Button} button to open the column menu
   */
  qx.Class.define("qx.ui.table.Table", {
    extend: qx.ui.core.Widget,
    include: qx.ui.core.MDragDropScrolling,

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param tableModel {qx.ui.table.ITableModel ? null}
     *   The table model to read the data from.
     *
     * @param custom {Map ? null}
     *   A map provided to override the various supplemental classes allocated
     *   within this constructor.  Each property must be a function which
     *   returns an object instance, as indicated by shown the defaults listed
     *   here:
     *
     *   <dl>
     *     <dt>initiallyHiddenColumns</dt>
     *       <dd>
     *         {Array?}
     *         A list of column numbers that should be initially invisible. Any
     *         column not mentioned will be initially visible, and if no array
     *         is provided, all columns will be initially visible.
     *       </dd>
     *     <dt>selectionManager</dt>
     *       <dd><pre class='javascript'>
     *         function(obj)
     *         {
     *           return new qx.ui.table.selection.Manager(obj);
     *         }
     *       </pre></dd>
     *     <dt>selectionModel</dt>
     *       <dd><pre class='javascript'>
     *         function(obj)
     *         {
     *           return new qx.ui.table.selection.Model(obj);
     *         }
     *       </pre></dd>
     *     <dt>tableColumnModel</dt>
     *       <dd><pre class='javascript'>
     *         function(obj)
     *         {
     *           return new qx.ui.table.columnmodel.Basic(obj);
     *         }
     *       </pre></dd>
     *     <dt>tablePaneModel</dt>
     *       <dd><pre class='javascript'>
     *         function(obj)
     *         {
     *           return new qx.ui.table.pane.Model(obj);
     *         }
     *       </pre></dd>
     *     <dt>tablePane</dt>
     *       <dd><pre class='javascript'>
     *         function(obj)
     *         {
     *           return new qx.ui.table.pane.Pane(obj);
     *         }
     *       </pre></dd>
     *     <dt>tablePaneHeader</dt>
     *       <dd><pre class='javascript'>
     *         function(obj)
     *         {
     *           return new qx.ui.table.pane.Header(obj);
     *         }
     *       </pre></dd>
     *     <dt>tablePaneScroller</dt>
     *       <dd><pre class='javascript'>
     *         function(obj)
     *         {
     *           return new qx.ui.table.pane.Scroller(obj);
     *         }
     *       </pre></dd>
     *     <dt>tablePaneModel</dt>
     *       <dd><pre class='javascript'>
     *         function(obj)
     *         {
     *           return new qx.ui.table.pane.Model(obj);
     *         }
     *       </pre></dd>
     *     <dt>columnMenu</dt>
     *       <dd><pre class='javascript'>
     *         function()
     *         {
     *           return new qx.ui.table.columnmenu.Button();
     *         }
     *       </pre></dd>
     *   </dl>
     */
    construct: function construct(tableModel, custom) {
      qx.ui.core.Widget.constructor.call(this); //
      // Use default objects if custom objects are not specified
      //

      if (!custom) {
        custom = {};
      }

      if (custom.initiallyHiddenColumns) {
        this.setInitiallyHiddenColumns(custom.initiallyHiddenColumns);
      }

      if (custom.selectionManager) {
        this.setNewSelectionManager(custom.selectionManager);
      }

      if (custom.selectionModel) {
        this.setNewSelectionModel(custom.selectionModel);
      }

      if (custom.tableColumnModel) {
        this.setNewTableColumnModel(custom.tableColumnModel);
      }

      if (custom.tablePane) {
        this.setNewTablePane(custom.tablePane);
      }

      if (custom.tablePaneHeader) {
        this.setNewTablePaneHeader(custom.tablePaneHeader);
      }

      if (custom.tablePaneScroller) {
        this.setNewTablePaneScroller(custom.tablePaneScroller);
      }

      if (custom.tablePaneModel) {
        this.setNewTablePaneModel(custom.tablePaneModel);
      }

      if (custom.columnMenu) {
        this.setNewColumnMenu(custom.columnMenu);
      }

      this._setLayout(new qx.ui.layout.VBox()); // Create the child widgets


      this.__scrollerParent__P_164_0 = new qx.ui.container.Composite(new qx.ui.layout.HBox());

      this._add(this.__scrollerParent__P_164_0, {
        flex: 1
      }); // Allocate a default data row renderer


      this.setDataRowRenderer(new qx.ui.table.rowrenderer.Default(this)); // Create the models

      this.__selectionManager__P_164_1 = this.getNewSelectionManager()(this);
      this.setSelectionModel(this.getNewSelectionModel()(this));
      this.setTableModel(tableModel || this.getEmptyTableModel()); // create the main meta column

      this.setMetaColumnCounts([-1]); // Make focusable

      this.setTabIndex(1);
      this.addListener("keydown", this._onKeyDown);
      this.addListener("focus", this._onFocusChanged);
      this.addListener("blur", this._onFocusChanged); // attach the resize listener to the last child of the layout. This
      // ensures that all other children are laid out before

      var spacer = new qx.ui.core.Widget().set({
        height: 0
      });

      this._add(spacer);

      spacer.addListener("resize", this._onResize, this);
      this.__focusedCol__P_164_2 = null;
      this.__focusedRow__P_164_3 = null; // add an event listener which updates the table content on locale change

      {
        qx.locale.Manager.getInstance().addListener("changeLocale", this._onChangeLocale, this);
      }
      this.initStatusBarVisible(); // If the table model has an init() method...

      tableModel = this.getTableModel();

      if (tableModel.init && typeof tableModel.init == "function") {
        // ... then call it now to allow the table model to affect table
        // properties.
        tableModel.init(this);
      } // ARIA attrs


      this.getContentElement().setAttribute("role", "grid");
    },

    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */
    events: {
      /**
       * Dispatched before adding the column list to the column visibility menu.
       * The event data is a map with two properties: table and menu.  Listeners
       * may add additional items to the menu, which appear at the top of the
       * menu.
       */
      columnVisibilityMenuCreateStart: "qx.event.type.Data",

      /**
       * Dispatched after adding the column list to the column visibility menu.
       * The event data is a map with two properties: table and menu.  Listeners
       * may add additional items to the menu, which appear at the bottom of the
       * menu.
       */
      columnVisibilityMenuCreateEnd: "qx.event.type.Data",

      /**
       * Dispatched when the width of the table has changed.
       */
      tableWidthChanged: "qx.event.type.Event",

      /**
       * Dispatched when updating scrollbars discovers that a vertical scrollbar
       * is needed when it previously was not, or vice versa.  The data is a
       * boolean indicating whether a vertical scrollbar is now being used.
       */
      verticalScrollBarChanged: "qx.event.type.Data",

      /**
       * Dispatched when a data cell has been tapped.
       */
      cellTap: "qx.ui.table.pane.CellEvent",

      /**
       * Dispatched when a data cell has been tapped.
       */
      cellDbltap: "qx.ui.table.pane.CellEvent",

      /**
       * Dispatched when the context menu is needed in a data cell
       */
      cellContextmenu: "qx.ui.table.pane.CellEvent",

      /**
       * Dispatched after a cell editor is flushed.
       *
       * The data is a map containing this properties:
       * <ul>
       *   <li>row</li>
       *   <li>col</li>
       *   <li>value</li>
       *   <li>oldValue</li>
       * </ul>
       */
      dataEdited: "qx.event.type.Data"
    },

    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */
    statics: {
      /** Events that must be redirected to the scrollers. */
      __redirectEvents__P_164_4: {
        cellTap: 1,
        cellDbltap: 1,
        cellContextmenu: 1
      }
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      appearance: {
        refine: true,
        init: "table"
      },
      focusable: {
        refine: true,
        init: true
      },
      minWidth: {
        refine: true,
        init: 50
      },

      /**
       * The list of columns that are initially hidden. This property is set by
       * the constructor, from the value received in
       * custom.initiallyHiddenColumns, and is only used when a column model is
       * initialized. It can be of great benefit in tables with numerous columns
       * where most are not initially visible. The process of creating the
       * headers for all of the columns, only to have those columns discarded
       * shortly thereafter when setColumnVisibility(false) is called, is a
       * waste of (significant, in some browsers) time. Specifying the
       * non-visible columns at constructor time can therefore avoid the initial
       * creation of all of those superfluous widgets.
       */
      initiallyHiddenColumns: {
        init: null
      },

      /**
       * Whether the widget contains content which may be selected by the user.
       *
       * If the value set to <code>true</code> the native browser selection can
       * be used for text selection. But it is normally useful for
       * forms fields, longer texts/documents, editors, etc.
       *
       * Note: This has no effect on Table!
       */
      selectable: {
        refine: true,
        init: false
      },

      /** The selection model. */
      selectionModel: {
        check: "qx.ui.table.selection.Model",
        apply: "_applySelectionModel",
        event: "changeSelectionModel"
      },

      /** The table model. */
      tableModel: {
        check: "qx.ui.table.ITableModel",
        apply: "_applyTableModel",
        event: "changeTableModel"
      },

      /** The height of the table rows. */
      rowHeight: {
        check: "Number",
        init: 20,
        apply: "_applyRowHeight",
        event: "changeRowHeight",
        themeable: true
      },

      /**
       * Force line height to match row height.  May be disabled if cell
       * renderers being used wish to render multiple lines of data within a
       * cell.  (With the default setting, all but the first of multiple lines
       * of data will not be visible.)
       */
      forceLineHeight: {
        check: "Boolean",
        init: true
      },

      /**
       *  Whether the header cells are visible. When setting this to false,
       *  you'll likely also want to set the {#columnVisibilityButtonVisible}
       *  property to false as well, to entirely remove the header row.
       */
      headerCellsVisible: {
        check: "Boolean",
        init: true,
        apply: "_applyHeaderCellsVisible",
        themeable: true
      },

      /** The height of the header cells. */
      headerCellHeight: {
        check: "Integer",
        init: 16,
        apply: "_applyHeaderCellHeight",
        event: "changeHeaderCellHeight",
        nullable: true,
        themeable: true
      },

      /** Whether to show the status bar */
      statusBarVisible: {
        check: "Boolean",
        init: true,
        apply: "_applyStatusBarVisible"
      },

      /** The Statusbartext, set it, if you want some more Information */
      additionalStatusBarText: {
        nullable: true,
        init: null,
        apply: "_applyAdditionalStatusBarText"
      },

      /** Whether to show the column visibility button */
      columnVisibilityButtonVisible: {
        check: "Boolean",
        init: true,
        apply: "_applyColumnVisibilityButtonVisible",
        themeable: true
      },

      /**
       * @type {Integer[]} The number of columns per meta column. If the last array entry is -1,
       * this meta column will get the remaining columns.
       */
      metaColumnCounts: {
        check: "Object",
        apply: "_applyMetaColumnCounts"
      },

      /**
       * Whether the focus should moved when the pointer is moved over a cell. If false
       * the focus is only moved on pointer taps.
       */
      focusCellOnPointerMove: {
        check: "Boolean",
        init: false,
        apply: "_applyFocusCellOnPointerMove"
      },

      /**
       * Whether row focus change by keyboard also modifies selection
       */
      rowFocusChangeModifiesSelection: {
        check: "Boolean",
        init: true
      },

      /**
       * Whether the cell focus indicator should be shown
       */
      showCellFocusIndicator: {
        check: "Boolean",
        init: true,
        apply: "_applyShowCellFocusIndicator"
      },

      /**
       * By default, the "cellContextmenu" event is fired only when a data cell
       * is right-clicked. It is not fired when a right-click occurs in the
       * empty area of the table below the last data row. By turning on this
       * property, "cellContextMenu" events will also be generated when a
       * right-click occurs in that empty area. In such a case, row identifier
       * in the event data will be null, so event handlers can check (row ===
       * null) to handle this case.
       */
      contextMenuFromDataCellsOnly: {
        check: "Boolean",
        init: true,
        apply: "_applyContextMenuFromDataCellsOnly"
      },

      /**
       * Whether the table should keep the first visible row complete. If set to false,
       * the first row may be rendered partial, depending on the vertical scroll value.
       */
      keepFirstVisibleRowComplete: {
        check: "Boolean",
        init: true,
        apply: "_applyKeepFirstVisibleRowComplete"
      },

      /**
       * Whether the table cells should be updated when only the selection or the
       * focus changed. This slows down the table update but allows to react on a
       * changed selection or a changed focus in a cell renderer.
       */
      alwaysUpdateCells: {
        check: "Boolean",
        init: false
      },

      /**
       * Whether to reset the selection when a header cell is tapped. Since
       * most data models do not have provisions to retain a selection after
       * sorting, the default is to reset the selection in this case. Some data
       * models, however, do have the capability to retain the selection, so
       * when using those, this property should be set to false.
       */
      resetSelectionOnHeaderTap: {
        check: "Boolean",
        init: true,
        apply: "_applyResetSelectionOnHeaderTap"
      },

      /**
       * Whether to reset the selection when the unpopulated table area is tapped.
       * The default is false which keeps the behaviour as before
       */
      resetSelectionOnTapBelowRows: {
        check: "Boolean",
        init: false,
        apply: "_applyResetSelectionOnTapBelowRows"
      },

      /**
       * If set then defines the minimum height of the focus indicator when editing
       */
      minCellEditHeight: {
        check: "Integer",
        nullable: true,
        init: null,
        apply: "_applyMinCellEditHeight"
      },

      /** The renderer to use for styling the rows. */
      dataRowRenderer: {
        check: "qx.ui.table.IRowRenderer",
        init: null,
        nullable: true,
        event: "changeDataRowRenderer"
      },

      /**
       * A function to call when before modal cell editor is opened.
       *
       * @signature function(cellEditor, cellInfo)
       *
       * @param cellEditor {qx.ui.window.Window}
       *   The modal window which has been created for this cell editor
       *
       * @param cellInfo {Map}
       *   Information about the cell for which this cell editor was created.
       *   It contains the following properties:
       *       col, row, xPos, value
       *
       */
      modalCellEditorPreOpenFunction: {
        check: "Function",
        init: null,
        nullable: true
      },

      /**
       * By default, all Scrollers' (meta-columns') horizontal scrollbars are
       * shown if any one is required. Allow not showing any that are not
       * required.
       */
      excludeScrollerScrollbarsIfNotNeeded: {
        check: "Boolean",
        init: false,
        nullable: false
      },

      /**
       * A function to instantiate a new column menu button.
       */
      newColumnMenu: {
        check: "Function",
        init: function init() {
          return new qx.ui.table.columnmenu.Button();
        }
      },

      /**
       * A function to instantiate a selection manager.  this allows subclasses of
       * Table to subclass this internal class.  To take effect, this property must
       * be set before calling the Table constructor.
       */
      newSelectionManager: {
        check: "Function",
        init: function init(obj) {
          return new qx.ui.table.selection.Manager(obj);
        }
      },

      /**
       * A function to instantiate a selection model.  this allows subclasses of
       * Table to subclass this internal class.  To take effect, this property must
       * be set before calling the Table constructor.
       */
      newSelectionModel: {
        check: "Function",
        init: function init(obj) {
          return new qx.ui.table.selection.Model(obj);
        }
      },

      /**
       * A function to instantiate a table column model.  This allows subclasses
       * of Table to subclass this internal class.  To take effect, this
       * property must be set before calling the Table constructor.
       */
      newTableColumnModel: {
        check: "Function",
        init: function init(table) {
          return new qx.ui.table.columnmodel.Basic(table);
        }
      },

      /**
       * A function to instantiate a table pane.  this allows subclasses of
       * Table to subclass this internal class.  To take effect, this property
       * must be set before calling the Table constructor.
       */
      newTablePane: {
        check: "Function",
        init: function init(obj) {
          return new qx.ui.table.pane.Pane(obj);
        }
      },

      /**
       * A function to instantiate a table pane.  this allows subclasses of
       * Table to subclass this internal class.  To take effect, this property
       * must be set before calling the Table constructor.
       */
      newTablePaneHeader: {
        check: "Function",
        init: function init(obj) {
          return new qx.ui.table.pane.Header(obj);
        }
      },

      /**
       * A function to instantiate a table pane scroller.  this allows
       * subclasses of Table to subclass this internal class.  To take effect,
       * this property must be set before calling the Table constructor.
       */
      newTablePaneScroller: {
        check: "Function",
        init: function init(obj) {
          return new qx.ui.table.pane.Scroller(obj);
        }
      },

      /**
       * A function to instantiate a table pane model.  this allows subclasses
       * of Table to subclass this internal class.  To take effect, this
       * property must be set before calling the Table constructor.
       */
      newTablePaneModel: {
        check: "Function",
        init: function init(columnModel) {
          return new qx.ui.table.pane.Model(columnModel);
        }
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      __focusedCol__P_164_2: null,
      __focusedRow__P_164_3: null,
      __scrollerParent__P_164_0: null,
      __selectionManager__P_164_1: null,
      __additionalStatusBarText__P_164_5: null,
      __lastRowCount__P_164_6: null,
      __lastColCount__P_164_7: null,
      __internalChange__P_164_8: null,
      __columnMenuButtons__P_164_9: null,
      __columnModel__P_164_10: null,
      __emptyTableModel__P_164_11: null,
      __hadVerticalScrollBar__P_164_12: null,
      __timer__P_164_13: null,
      // overridden
      _createChildControlImpl: function _createChildControlImpl(id, hash) {
        var control;

        switch (id) {
          case "statusbar":
            control = new qx.ui.basic.Label();
            control.set({
              allowGrowX: true
            });

            this._add(control);

            break;

          case "column-button":
            control = this.getNewColumnMenu()();
            control.set({
              focusable: false
            }); // Create the initial menu too

            var menu = control.factory("menu", {
              table: this
            }); // Add a listener to initialize the column menu when it becomes visible

            menu.addListener("appear", this._initColumnMenu, this);
            break;
        }

        return control || qx.ui.table.Table.superclass.prototype._createChildControlImpl.call(this, id);
      },
      // property modifier
      _applySelectionModel: function _applySelectionModel(value, old) {
        this.__selectionManager__P_164_1.setSelectionModel(value);

        if (old != null) {
          old.removeListener("changeSelection", this._onSelectionChanged, this);
        }

        value.addListener("changeSelection", this._onSelectionChanged, this);
      },
      // property modifier
      _applyRowHeight: function _applyRowHeight(value, old) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].updateVerScrollBarMaximum();
        }
      },
      // property modifier
      _applyHeaderCellsVisible: function _applyHeaderCellsVisible(value, old) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          if (value) {
            scrollerArr[i]._showChildControl("header");
          } else {
            scrollerArr[i]._excludeChildControl("header");
          }
        } // also hide the column visibility button


        if (this.getColumnVisibilityButtonVisible()) {
          this._applyColumnVisibilityButtonVisible(value);
        }
      },
      // property modifier
      _applyHeaderCellHeight: function _applyHeaderCellHeight(value, old) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].getHeader().setHeight(value);
        }
      },
      // property modifier
      _applyMinCellEditHeight: function _applyMinCellEditHeight(value) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].setMinCellEditHeight(value);
        }
      },

      /**
       * Get an empty table model instance to use for this table. Use this table
       * to configure the table with no table model.
       *
       * @return {qx.ui.table.ITableModel} The empty table model
       */
      getEmptyTableModel: function getEmptyTableModel() {
        if (!this.__emptyTableModel__P_164_11) {
          this.__emptyTableModel__P_164_11 = new qx.ui.table.model.Simple();

          this.__emptyTableModel__P_164_11.setColumns([]);

          this.__emptyTableModel__P_164_11.setData([]);
        }

        return this.__emptyTableModel__P_164_11;
      },
      // property modifier
      _applyTableModel: function _applyTableModel(value, old) {
        this.getTableColumnModel().init(value.getColumnCount(), this);

        if (old != null) {
          old.removeListener("metaDataChanged", this._onTableModelMetaDataChanged, this);
          old.removeListener("dataChanged", this._onTableModelDataChanged, this);
        }

        value.addListener("metaDataChanged", this._onTableModelMetaDataChanged, this);
        value.addListener("dataChanged", this._onTableModelDataChanged, this); // Update the status bar

        this._updateStatusBar();

        this._updateTableData(0, value.getRowCount(), 0, value.getColumnCount());

        this._onTableModelMetaDataChanged(); // If the table model has an init() method, call it. We don't, however,
        // call it if this is the initial setting of the table model, as the
        // scrollers are not yet initialized. In that case, the init method is
        // called explicitly by the Table constructor.


        if (old && value.init && typeof value.init == "function") {
          value.init(this);
        }
      },

      /**
       * Get the The table column model.
       *
       * @return {qx.ui.table.columnmodel.Basic} The table's column model
       */
      getTableColumnModel: function getTableColumnModel() {
        if (!this.__columnModel__P_164_10) {
          var columnModel = this.__columnModel__P_164_10 = this.getNewTableColumnModel()(this);
          columnModel.addListener("visibilityChanged", this._onColVisibilityChanged, this);
          columnModel.addListener("widthChanged", this._onColWidthChanged, this);
          columnModel.addListener("orderChanged", this._onColOrderChanged, this); // Get the current table model

          var tableModel = this.getTableModel();
          columnModel.init(tableModel.getColumnCount(), this); // Reset the table column model in each table pane model

          var scrollerArr = this._getPaneScrollerArr();

          for (var i = 0; i < scrollerArr.length; i++) {
            var paneScroller = scrollerArr[i];
            var paneModel = paneScroller.getTablePaneModel();
            paneModel.setTableColumnModel(columnModel);
          }
        }

        return this.__columnModel__P_164_10;
      },
      // property modifier
      _applyStatusBarVisible: function _applyStatusBarVisible(value, old) {
        if (value) {
          this._showChildControl("statusbar");
        } else {
          this._excludeChildControl("statusbar");
        }

        if (value) {
          this._updateStatusBar();
        }
      },
      // property modifier
      _applyAdditionalStatusBarText: function _applyAdditionalStatusBarText(value, old) {
        this.__additionalStatusBarText__P_164_5 = value;

        this._updateStatusBar();
      },
      // property modifier
      _applyColumnVisibilityButtonVisible: function _applyColumnVisibilityButtonVisible(value, old) {
        if (value) {
          this._showChildControl("column-button");
        } else {
          this._excludeChildControl("column-button");
        }
      },
      // property modifier
      _applyMetaColumnCounts: function _applyMetaColumnCounts(value, old) {
        var metaColumnCounts = value;

        var scrollerArr = this._getPaneScrollerArr();

        var handlers = {};

        if (value > old) {
          // Save event listeners on the redirected events so we can re-apply
          // them to new scrollers.
          var manager = qx.event.Registration.getManager(scrollerArr[0]);

          for (var evName in qx.ui.table.Table.__redirectEvents__P_164_4) {
            handlers[evName] = {};
            handlers[evName].capture = manager.getListeners(scrollerArr[0], evName, true);
            handlers[evName].bubble = manager.getListeners(scrollerArr[0], evName, false);
          }
        } // Remove the panes not needed any more


        this._cleanUpMetaColumns(metaColumnCounts.length); // Update the old panes


        var leftX = 0;

        for (var i = 0; i < scrollerArr.length; i++) {
          var paneScroller = scrollerArr[i];
          var paneModel = paneScroller.getTablePaneModel();
          paneModel.setFirstColumnX(leftX);
          paneModel.setMaxColumnCount(metaColumnCounts[i]);
          leftX += metaColumnCounts[i];
        } // Add the new panes


        if (metaColumnCounts.length > scrollerArr.length) {
          var columnModel = this.getTableColumnModel();

          for (var i = scrollerArr.length; i < metaColumnCounts.length; i++) {
            var paneModel = this.getNewTablePaneModel()(columnModel);
            paneModel.setFirstColumnX(leftX);
            paneModel.setMaxColumnCount(metaColumnCounts[i]);
            leftX += metaColumnCounts[i];
            var paneScroller = this.getNewTablePaneScroller()(this);
            paneScroller.setTablePaneModel(paneModel); // Register event listener for vertical scrolling

            paneScroller.addListener("changeScrollY", this._onScrollY, this); // Apply redirected events to this new scroller

            for (evName in qx.ui.table.Table.__redirectEvents__P_164_4) {
              // On first setting of meta columns (constructing phase), there
              // are no handlers to deal with yet.
              if (!handlers[evName]) {
                break;
              }

              if (handlers[evName].capture && handlers[evName].capture.length > 0) {
                var capture = handlers[evName].capture;

                for (var j = 0; j < capture.length; j++) {
                  // Determine what context to use.  If the context does not
                  // exist, we assume that the context is this table.  If it
                  // does exist and it equals the first pane scroller (from
                  // which we retrieved the listeners) then set the context
                  // to be this new pane scroller.  Otherwise leave the context
                  // as it was set.
                  var context = capture[j].context;

                  if (!context) {
                    context = this;
                  } else if (context == scrollerArr[0]) {
                    context = paneScroller;
                  }

                  paneScroller.addListener(evName, capture[j].handler, context, true);
                }
              }

              if (handlers[evName].bubble && handlers[evName].bubble.length > 0) {
                var bubble = handlers[evName].bubble;

                for (var j = 0; j < bubble.length; j++) {
                  // Determine what context to use.  If the context does not
                  // exist, we assume that the context is this table.  If it
                  // does exist and it equals the first pane scroller (from
                  // which we retrieved the listeners) then set the context
                  // to be this new pane scroller.  Otherwise leave the context
                  // as it was set.
                  var context = bubble[j].context;

                  if (!context) {
                    context = this;
                  } else if (context == scrollerArr[0]) {
                    context = paneScroller;
                  }

                  paneScroller.addListener(evName, bubble[j].handler, context, false);
                }
              }
            } // last meta column is flexible


            var flex = i == metaColumnCounts.length - 1 ? 1 : 0;

            this.__scrollerParent__P_164_0.add(paneScroller, {
              flex: flex
            });

            scrollerArr = this._getPaneScrollerArr();
          }
        } // Update all meta columns


        for (var i = 0; i < scrollerArr.length; i++) {
          var paneScroller = scrollerArr[i];
          var isLast = i == scrollerArr.length - 1; // Set the right header height

          paneScroller.getHeader().setHeight(this.getHeaderCellHeight()); // Put the column visibility button in the top right corner of the last meta column

          paneScroller.setTopRightWidget(isLast ? this.getChildControl("column-button") : null);
        }

        if (!this.isColumnVisibilityButtonVisible()) {
          this._excludeChildControl("column-button");
        }

        this._updateScrollerWidths();

        this._updateScrollBarVisibility();
      },
      // property modifier
      _applyFocusCellOnPointerMove: function _applyFocusCellOnPointerMove(value, old) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].setFocusCellOnPointerMove(value);
        }
      },
      // property modifier
      _applyShowCellFocusIndicator: function _applyShowCellFocusIndicator(value, old) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].setShowCellFocusIndicator(value);
        }
      },
      // property modifier
      _applyContextMenuFromDataCellsOnly: function _applyContextMenuFromDataCellsOnly(value, old) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].setContextMenuFromDataCellsOnly(value);
        }
      },
      // property modifier
      _applyKeepFirstVisibleRowComplete: function _applyKeepFirstVisibleRowComplete(value, old) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].onKeepFirstVisibleRowCompleteChanged();
        }
      },
      // property modifier
      _applyResetSelectionOnHeaderTap: function _applyResetSelectionOnHeaderTap(value, old) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].setResetSelectionOnHeaderTap(value);
        }
      },
      // property modifier
      _applyResetSelectionOnTapBelowRows: function _applyResetSelectionOnTapBelowRows(value, old) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].setResetSelectionOnTapBelowRows(value);
        }
      },

      /**
       * Returns the selection manager.
       *
       * @return {qx.ui.table.selection.Manager} the selection manager.
       */
      getSelectionManager: function getSelectionManager() {
        return this.__selectionManager__P_164_1;
      },

      /**
       * Returns an array containing all TablePaneScrollers in this table.
       *
       * @return {qx.ui.table.pane.Scroller[]} all TablePaneScrollers in this table.
       */
      _getPaneScrollerArr: function _getPaneScrollerArr() {
        return this.__scrollerParent__P_164_0.getChildren();
      },

      /**
       * Returns a TablePaneScroller of this table.
       *
       * @param metaColumn {Integer} the meta column to get the TablePaneScroller for.
       * @return {qx.ui.table.pane.Scroller} the qx.ui.table.pane.Scroller.
       */
      getPaneScroller: function getPaneScroller(metaColumn) {
        return this._getPaneScrollerArr()[metaColumn];
      },

      /**
       * Cleans up the meta columns.
       *
       * @param fromMetaColumn {Integer} the first meta column to clean up. All following
       *      meta columns will be cleaned up, too. All previous meta columns will
       *      stay unchanged. If 0 all meta columns will be cleaned up.
       */
      _cleanUpMetaColumns: function _cleanUpMetaColumns(fromMetaColumn) {
        var scrollerArr = this._getPaneScrollerArr();

        if (scrollerArr != null) {
          for (var i = scrollerArr.length - 1; i >= fromMetaColumn; i--) {
            scrollerArr[i].destroy();
          }
        }
      },

      /**
       * Event handler. Called when the locale has changed.
       *
       * @param evt {Event} the event.
       */
      _onChangeLocale: function _onChangeLocale(evt) {
        this.updateContent();

        this._updateStatusBar();
      },
      // overridden
      _onChangeTheme: function _onChangeTheme() {
        qx.ui.table.Table.superclass.prototype._onChangeTheme.call(this);

        this.getDataRowRenderer().initThemeValues();
        this.updateContent();

        this._updateStatusBar();
      },

      /**
       * Event handler. Called when the selection has changed.
       *
       * @param evt {Map} the event.
       */
      _onSelectionChanged: function _onSelectionChanged(evt) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].onSelectionChanged();
        }

        this._updateStatusBar();
      },

      /**
       * Event handler. Called when the table model meta data has changed.
       *
       * @param evt {Map} the event.
       */
      _onTableModelMetaDataChanged: function _onTableModelMetaDataChanged(evt) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].onTableModelMetaDataChanged();
        }

        this._updateStatusBar();
      },

      /**
       * Event handler. Called when the table model data has changed.
       *
       * @param evt {Map} the event.
       */
      _onTableModelDataChanged: function _onTableModelDataChanged(evt) {
        var data = evt.getData();

        this._updateTableData(data.firstRow, data.lastRow, data.firstColumn, data.lastColumn, data.removeStart, data.removeCount);
      },
      // overridden
      _onContextMenuOpen: function _onContextMenuOpen(e) {// This is Widget's context menu handler which typically retrieves
        // and displays the menu as soon as it receives a "contextmenu" event.
        // We want to allow the cellContextmenu handler to create the menu,
        // so we'll override this method with a null one, and do the menu
        // placement and display handling in our _onContextMenu method.
      },

      /**
       * To update the table if the table model has changed and remove selection.
       *
       * @param firstRow {Integer} The index of the first row that has changed.
       * @param lastRow {Integer} The index of the last row that has changed.
       * @param firstColumn {Integer} The model index of the first column that has changed.
       * @param lastColumn {Integer} The model index of the last column that has changed.
       * @param removeStart {Integer ? null} The first index of the interval (including), to remove selection.
       * @param removeCount {Integer ? null} The count of the interval, to remove selection.
       */
      _updateTableData: function _updateTableData(firstRow, lastRow, firstColumn, lastColumn, removeStart, removeCount) {
        var scrollerArr = this._getPaneScrollerArr(); // update selection if rows were removed


        if (removeCount) {
          this.getSelectionModel().removeSelectionInterval(removeStart, removeStart + removeCount - 1, true); // remove focus if the focused row has been removed

          if (this.__focusedRow__P_164_3 >= removeStart && this.__focusedRow__P_164_3 < removeStart + removeCount) {
            this.setFocusedCell();
          }
        }

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].onTableModelDataChanged(firstRow, lastRow, firstColumn, lastColumn);
        }

        var rowCount = this.getTableModel().getRowCount();

        if (rowCount != this.__lastRowCount__P_164_6) {
          this.__lastRowCount__P_164_6 = rowCount;

          this._updateScrollBarVisibility();

          this._updateStatusBar(); // ARIA attrs


          this.getContentElement().setAttribute("aria-rowcount", rowCount);
        }

        var colCount = this.getTableModel().getColumnCount();

        if (colCount != this.__lastColCount__P_164_7) {
          this.__lastColCount__P_164_7 = colCount; // ARIA attrs

          this.getContentElement().setAttribute("aria-colcount", colCount);
        }
      },

      /**
       * Event handler. Called when a TablePaneScroller has been scrolled vertically.
       *
       * @param evt {Map} the event.
       */
      _onScrollY: function _onScrollY(evt) {
        if (!this.__internalChange__P_164_8) {
          this.__internalChange__P_164_8 = true; // Set the same scroll position to all meta columns

          var scrollerArr = this._getPaneScrollerArr();

          for (var i = 0; i < scrollerArr.length; i++) {
            scrollerArr[i].setScrollY(evt.getData());
          }

          this.__internalChange__P_164_8 = false;
        }
      },

      /**
       * Event handler. Called when a key was pressed.
       *
       * @param evt {qx.event.type.KeySequence} the event.
       * @deprecated {6.0} please use _onKeyDown instead!
       */
      _onKeyPress: function _onKeyPress(evt) {
        qx.log.Logger.deprecatedMethodWarning(this._onKeyPress, "The method '_onKeyPress()' is deprecated. Please use '_onKeyDown()' instead.");
        qx.log.Logger.deprecateMethodOverriding(this, qx.ui.table.Table, "_onKeyPress", "The method '_onKeyPress()' is deprecated. Please use '_onKeyDown()' instead.");

        this._onKeyDown(evt);
      },

      /**
       * Event handler. Called when on key down event
       *
       * @param evt {qx.event.type.KeySequence} the event.
       */
      _onKeyDown: function _onKeyDown(evt) {
        if (!this.getEnabled()) {
          return;
        } // No editing mode


        var oldFocusedRow = this.__focusedRow__P_164_3;
        var consumed = false; // Handle keys that are independent from the modifiers

        var identifier = evt.getKeyIdentifier();

        if (this.isEditing()) {
          // Editing mode
          if (evt.getModifiers() == 0) {
            switch (identifier) {
              case "Enter":
                this.stopEditing();
                var oldFocusedRow = this.__focusedRow__P_164_3;
                this.moveFocusedCell(0, 1);

                if (this.__focusedRow__P_164_3 != oldFocusedRow) {
                  consumed = this.startEditing();
                }

                break;

              case "Escape":
                this.cancelEditing();
                this.focus();
                break;

              default:
                consumed = false;
                break;
            }
          }
        } else {
          consumed = true; // No editing mode

          if (evt.isCtrlPressed()) {
            // Handle keys that depend on modifiers
            switch (identifier) {
              case "A":
                // Ctrl + A
                var rowCount = this.getTableModel().getRowCount();

                if (rowCount > 0) {
                  this.getSelectionModel().setSelectionInterval(0, rowCount - 1);
                }

                break;

              default:
                consumed = false;
                break;
            }
          } else {
            // Handle keys that are independent from the modifiers
            switch (identifier) {
              case "Space":
                this.__selectionManager__P_164_1.handleSelectKeyDown(this.__focusedRow__P_164_3, evt);

                break;

              case "F2":
              case "Enter":
                this.startEditing();
                consumed = true;
                break;

              case "Home":
                this.setFocusedCell(this.__focusedCol__P_164_2, 0, true);
                break;

              case "End":
                var rowCount = this.getTableModel().getRowCount();
                this.setFocusedCell(this.__focusedCol__P_164_2, rowCount - 1, true);
                break;

              case "Left":
                this.moveFocusedCell(-1, 0);
                break;

              case "Right":
                this.moveFocusedCell(1, 0);
                break;

              case "Up":
                this.moveFocusedCell(0, -1);
                break;

              case "Down":
                this.moveFocusedCell(0, 1);
                break;

              case "PageUp":
              case "PageDown":
                var scroller = this.getPaneScroller(0);
                var pane = scroller.getTablePane();
                var rowHeight = this.getRowHeight();
                var direction = identifier == "PageUp" ? -1 : 1;
                rowCount = pane.getVisibleRowCount() - 1;
                scroller.setScrollY(scroller.getScrollY() + direction * rowCount * rowHeight);
                this.moveFocusedCell(0, direction * rowCount);
                break;

              default:
                consumed = false;
            }
          }
        }

        if (oldFocusedRow != this.__focusedRow__P_164_3 && this.getRowFocusChangeModifiesSelection()) {
          // The focus moved -> Let the selection manager handle this event
          this.__selectionManager__P_164_1.handleMoveKeyDown(this.__focusedRow__P_164_3, evt);
        }

        if (consumed) {
          evt.preventDefault();
          evt.stopPropagation();
        }
      },

      /**
       * Event handler. Called when the table gets the focus.
       *
       * @param evt {Map} the event.
       */
      _onFocusChanged: function _onFocusChanged(evt) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].onFocusChanged();
        }
      },

      /**
       * Event handler. Called when the visibility of a column has changed.
       *
       * @param evt {Map} the event.
       */
      _onColVisibilityChanged: function _onColVisibilityChanged(evt) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].onColVisibilityChanged();
        }

        var data = evt.getData();

        if (this.__columnMenuButtons__P_164_9 != null && data.col != null && data.visible != null) {
          this.__columnMenuButtons__P_164_9[data.col].setColumnVisible(data.visible);
        }

        this._updateScrollerWidths();

        this._updateScrollBarVisibility();
      },

      /**
       * Event handler. Called when the width of a column has changed.
       *
       * @param evt {Map} the event.
       */
      _onColWidthChanged: function _onColWidthChanged(evt) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          var data = evt.getData();
          scrollerArr[i].setColumnWidth(data.col, data.newWidth);
        }

        this._updateScrollerWidths();

        this._updateScrollBarVisibility();
      },

      /**
       * Event handler. Called when the column order has changed.
       *
       * @param evt {Map} the event.
       */
      _onColOrderChanged: function _onColOrderChanged(evt) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].onColOrderChanged();
        } // A column may have been moved between meta columns


        this._updateScrollerWidths();

        this._updateScrollBarVisibility();
      },

      /**
       * Gets the TablePaneScroller at a certain x position in the page. If there is
       * no TablePaneScroller at this position, null is returned.
       *
       * @param pageX {Integer} the position in the page to check (in pixels).
       * @return {qx.ui.table.pane.Scroller} the TablePaneScroller or null.
       */
      getTablePaneScrollerAtPageX: function getTablePaneScrollerAtPageX(pageX) {
        var metaCol = this._getMetaColumnAtPageX(pageX);

        return metaCol != -1 ? this.getPaneScroller(metaCol) : null;
      },

      /**
       * Sets the currently focused cell. A value of <code>null</code> hides the
       * focus cell.
       *
       * @param col {Integer?null} the model index of the focused cell's column.
       * @param row {Integer?null} the model index of the focused cell's row.
       * @param scrollVisible {Boolean ? false} whether to scroll the new focused cell
       *          visible.
       */
      setFocusedCell: function setFocusedCell(col, row, scrollVisible) {
        if (!this.isEditing() && (col != this.__focusedCol__P_164_2 || row != this.__focusedRow__P_164_3)) {
          if (col === null) {
            col = 0;
          }

          this.__focusedCol__P_164_2 = col;
          this.__focusedRow__P_164_3 = row;

          var scrollerArr = this._getPaneScrollerArr();

          for (var i = 0; i < scrollerArr.length; i++) {
            scrollerArr[i].setFocusedCell(col, row);
          }

          if (col != null && scrollVisible) {
            this.scrollCellVisible(col, row);
          } // ARIA attrs


          var cellId = "qooxdoo-table-cell-" + this.toHashCode() + "-" + row + "-" + col;
          this.getContentElement().setAttribute("aria-activedescendant", cellId);
        }
      },

      /**
       * Resets (clears) the current selection
       */
      resetSelection: function resetSelection() {
        this.getSelectionModel().resetSelection();
      },

      /**
       * Resets the focused cell.
       */
      resetCellFocus: function resetCellFocus() {
        this.setFocusedCell(null, null, false);
      },

      /**
       * Returns the column of the currently focused cell.
       *
       * @return {Integer} the model index of the focused cell's column.
       */
      getFocusedColumn: function getFocusedColumn() {
        return this.__focusedCol__P_164_2;
      },

      /**
       * Returns the row of the currently focused cell.
       *
       * @return {Integer} the model index of the focused cell's column.
       */
      getFocusedRow: function getFocusedRow() {
        return this.__focusedRow__P_164_3;
      },

      /**
       * Select whether the focused row is highlighted
       *
       * @param bHighlight {Boolean}
       *   Flag indicating whether the focused row should be highlighted.
       *
       */
      highlightFocusedRow: function highlightFocusedRow(bHighlight) {
        this.getDataRowRenderer().setHighlightFocusRow(bHighlight);
      },

      /**
       * Remove the highlighting of the current focus row.
       *
       * This is used to temporarily remove the highlighting of the currently
       * focused row, and is expected to be used most typically by adding a
       * listener on the "pointerout" event, so that the focus highlighting is
       * suspended when the pointer leaves the table:
       *
       *     table.addListener("pointerout", table.clearFocusedRowHighlight);
       *
       * @param evt {qx.event.type.Pointer} Incoming pointer event
       */
      clearFocusedRowHighlight: function clearFocusedRowHighlight(evt) {
        if (evt) {
          var relatedTarget = evt.getRelatedTarget();

          if (relatedTarget instanceof qx.ui.table.pane.Pane || relatedTarget instanceof qx.ui.table.pane.FocusIndicator) {
            return;
          }
        } // Remove focus from any cell that has it


        this.resetCellFocus(); // Now, for each pane scroller...

        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          // ... repaint without focus.
          scrollerArr[i].onFocusChanged();
        }
      },

      /**
       * Moves the focus.
       *
       * @param deltaX {Integer} The delta by which the focus should be moved on the x axis.
       * @param deltaY {Integer} The delta by which the focus should be moved on the y axis.
       */
      moveFocusedCell: function moveFocusedCell(deltaX, deltaY) {
        var col = this.__focusedCol__P_164_2;
        var row = this.__focusedRow__P_164_3; // could also be undefined [BUG #4676]. In that case default to first cell focus

        if (col === null || col === undefined || row === null || row === undefined) {
          this.setFocusedCell(0, 0, true);
          return;
        }

        if (deltaX != 0) {
          var columnModel = this.getTableColumnModel();
          var x = columnModel.getVisibleX(col);
          var colCount = columnModel.getVisibleColumnCount();
          x = qx.lang.Number.limit(x + deltaX, 0, colCount - 1);
          col = columnModel.getVisibleColumnAtX(x);
        }

        if (deltaY != 0) {
          var tableModel = this.getTableModel();
          row = qx.lang.Number.limit(row + deltaY, 0, tableModel.getRowCount() - 1);
        }

        this.setFocusedCell(col, row, true);
      },

      /**
       * Scrolls a cell visible.
       *
       * @param col {Integer} the model index of the column the cell belongs to.
       * @param row {Integer} the model index of the row the cell belongs to.
       */
      scrollCellVisible: function scrollCellVisible(col, row) {
        // get the dom element
        var elem = this.getContentElement().getDomElement(); // if the dom element is not available, the table hasn't been rendered

        if (!elem) {
          // postpone the scroll until the table has appeared
          this.addListenerOnce("appear", function () {
            this.scrollCellVisible(col, row);
          }, this);
        }

        var columnModel = this.getTableColumnModel();
        var x = columnModel.getVisibleX(col);

        var metaColumn = this._getMetaColumnAtColumnX(x);

        if (metaColumn != -1) {
          this.getPaneScroller(metaColumn).scrollCellVisible(col, row);
        }
      },

      /**
       * Returns whether currently a cell is editing.
       *
       * @return {var} whether currently a cell is editing.
       */
      isEditing: function isEditing() {
        if (this.__focusedCol__P_164_2 != null) {
          var x = this.getTableColumnModel().getVisibleX(this.__focusedCol__P_164_2);

          var metaColumn = this._getMetaColumnAtColumnX(x);

          return this.getPaneScroller(metaColumn).isEditing();
        }

        return false;
      },

      /**
       * Starts editing the currently focused cell. Does nothing if already editing
       * or if the column is not editable.
       *
       * @return {Boolean} whether editing was started
       */
      startEditing: function startEditing() {
        if (this.__focusedCol__P_164_2 != null) {
          var x = this.getTableColumnModel().getVisibleX(this.__focusedCol__P_164_2);

          var metaColumn = this._getMetaColumnAtColumnX(x);

          var started = this.getPaneScroller(metaColumn).startEditing();
          return started;
        }

        return false;
      },

      /**
       * Stops editing and writes the editor's value to the model.
       */
      stopEditing: function stopEditing() {
        if (this.__focusedCol__P_164_2 != null) {
          var x = this.getTableColumnModel().getVisibleX(this.__focusedCol__P_164_2);

          var metaColumn = this._getMetaColumnAtColumnX(x);

          this.getPaneScroller(metaColumn).stopEditing();
        }
      },

      /**
       * Stops editing without writing the editor's value to the model.
       */
      cancelEditing: function cancelEditing() {
        if (this.__focusedCol__P_164_2 != null) {
          var x = this.getTableColumnModel().getVisibleX(this.__focusedCol__P_164_2);

          var metaColumn = this._getMetaColumnAtColumnX(x);

          this.getPaneScroller(metaColumn).cancelEditing();
        }
      },

      /**
       * Update the table content of every attached table pane.
       */
      updateContent: function updateContent() {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].getTablePane().updateContent(true);
        }
      },

      /**
       * Activates the blocker widgets on all column headers and the
       * column button
       */
      blockHeaderElements: function blockHeaderElements() {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].getHeader().getBlocker().blockContent(20);
        }

        this.getChildControl("column-button").getBlocker().blockContent(20);
      },

      /**
       * Deactivates the blocker widgets on all column headers and the
       * column button
       */
      unblockHeaderElements: function unblockHeaderElements() {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          scrollerArr[i].getHeader().getBlocker().unblock();
        }

        this.getChildControl("column-button").getBlocker().unblock();
      },

      /**
       * Gets the meta column at a certain x position in the page. If there is no
       * meta column at this position, -1 is returned.
       *
       * @param pageX {Integer} the position in the page to check (in pixels).
       * @return {Integer} the index of the meta column or -1.
       */
      _getMetaColumnAtPageX: function _getMetaColumnAtPageX(pageX) {
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          var pos = scrollerArr[i].getContentLocation();

          if (pageX >= pos.left && pageX <= pos.right) {
            return i;
          }
        }

        return -1;
      },

      /**
       * Returns the meta column a column is shown in. If the column is not shown at
       * all, -1 is returned.
       *
       * @param visXPos {Integer} the visible x position of the column.
       * @return {Integer} the meta column the column is shown in.
       */
      _getMetaColumnAtColumnX: function _getMetaColumnAtColumnX(visXPos) {
        var metaColumnCounts = this.getMetaColumnCounts();
        var rightXPos = 0;

        for (var i = 0; i < metaColumnCounts.length; i++) {
          var counts = metaColumnCounts[i];
          rightXPos += counts;

          if (counts == -1 || visXPos < rightXPos) {
            return i;
          }
        }

        return -1;
      },

      /**
       * Updates the text shown in the status bar.
       */
      _updateStatusBar: function _updateStatusBar() {
        var tableModel = this.getTableModel();

        if (this.getStatusBarVisible()) {
          var selectedRowCount = this.getSelectionModel().getSelectedCount();
          var rowCount = tableModel.getRowCount();
          var text;

          if (rowCount >= 0) {
            if (selectedRowCount == 0) {
              text = this.trn("one row", "%1 rows", rowCount, rowCount);
            } else {
              text = this.trn("one of one row", "%1 of %2 rows", rowCount, selectedRowCount, rowCount);
            }
          }

          if (this.__additionalStatusBarText__P_164_5) {
            if (text) {
              text += this.__additionalStatusBarText__P_164_5;
            } else {
              text = this.__additionalStatusBarText__P_164_5;
            }
          }

          if (text) {
            this.getChildControl("statusbar").setValue(text);
          }
        }
      },

      /**
       * Updates the widths of all scrollers.
       */
      _updateScrollerWidths: function _updateScrollerWidths() {
        // Give all scrollers except for the last one the wanted width
        // (The last one has a flex with)
        var scrollerArr = this._getPaneScrollerArr();

        for (var i = 0; i < scrollerArr.length; i++) {
          var isLast = i == scrollerArr.length - 1;
          var width = scrollerArr[i].getTablePaneModel().getTotalWidth();
          scrollerArr[i].setPaneWidth(width);
          var flex = isLast ? 1 : 0;
          scrollerArr[i].setLayoutProperties({
            flex: flex
          });
        }
      },

      /**
       * Updates the visibility of the scrollbars in the meta columns.
       */
      _updateScrollBarVisibility: function _updateScrollBarVisibility() {
        if (!this.getBounds()) {
          return;
        }

        var horBar = qx.ui.table.pane.Scroller.HORIZONTAL_SCROLLBAR;
        var verBar = qx.ui.table.pane.Scroller.VERTICAL_SCROLLBAR;

        var scrollerArr = this._getPaneScrollerArr(); // Check which scroll bars are needed


        var horNeeded = false;
        var verNeeded = false;
        var excludeScrollerScrollbarsIfNotNeeded; // Determine whether we need to render horizontal scrollbars for meta
        // columns that don't themselves actually require it

        excludeScrollerScrollbarsIfNotNeeded = this.getExcludeScrollerScrollbarsIfNotNeeded();

        if (!excludeScrollerScrollbarsIfNotNeeded) {
          for (var i = 0; i < scrollerArr.length; i++) {
            var isLast = i == scrollerArr.length - 1; // Only show the last vertical scrollbar

            var bars = scrollerArr[i].getNeededScrollBars(horNeeded, !isLast);

            if (bars & horBar) {
              horNeeded = true;
            }

            if (isLast && bars & verBar) {
              verNeeded = true;
            }
          }
        } // Set the needed scrollbars


        for (var i = 0; i < scrollerArr.length; i++) {
          isLast = i == scrollerArr.length - 1; // If we don't want to include scrollbars for meta columns that don't
          // require it, find out whether this meta column requires it.

          if (excludeScrollerScrollbarsIfNotNeeded) {
            horNeeded = !!(scrollerArr[i].getNeededScrollBars(false, !isLast) & horBar); // Show the horizontal scrollbar if needed. Specify null to indicate
            // that the scrollbar should be hidden rather than excluded.

            scrollerArr[i].setHorizontalScrollBarVisible(horNeeded || null);
          } else {
            // Show the horizontal scrollbar if needed.
            scrollerArr[i].setHorizontalScrollBarVisible(horNeeded);
          } // If this is the last meta-column...


          if (isLast) {
            // ... then get the current (old) use of vertical scroll bar
            verNeeded = !!(scrollerArr[i].getNeededScrollBars(false, false) & verBar);

            if (this.__hadVerticalScrollBar__P_164_12 == null) {
              this.__hadVerticalScrollBar__P_164_12 = scrollerArr[i].getVerticalScrollBarVisible();
              this.__timer__P_164_13 = qx.event.Timer.once(function () {
                // reset the last visible state of the vertical scroll bar
                // in a timeout to prevent infinite loops.
                this.__hadVerticalScrollBar__P_164_12 = null;
                this.__timer__P_164_13 = null;
              }, this, 0);
            }
          }

          scrollerArr[i].setVerticalScrollBarVisible(isLast && verNeeded); // If this is the last meta-column and the use of a vertical scroll bar
          // has changed...

          if (isLast && verNeeded != this.__hadVerticalScrollBar__P_164_12) {
            // ... then dispatch an event to any awaiting listeners
            this.fireDataEvent("verticalScrollBarChanged", verNeeded);
          }
        }
      },

      /**
       * Initialize the column menu
       */
      _initColumnMenu: function _initColumnMenu() {
        var tableModel = this.getTableModel();
        var columnModel = this.getTableColumnModel();
        var columnButton = this.getChildControl("column-button"); // Remove all items from the menu. We'll rebuild it here.

        columnButton.empty(); // Inform listeners who may want to insert menu items at the beginning

        var menu = columnButton.getMenu();
        var data = {
          table: this,
          menu: menu,
          columnButton: columnButton
        };
        this.fireDataEvent("columnVisibilityMenuCreateStart", data);
        this.__columnMenuButtons__P_164_9 = {};

        for (var iCol = 0, l = tableModel.getColumnCount(); iCol < l; iCol++) {
          var col = columnModel.getOverallColumnAtX(iCol);
          var menuButton = columnButton.factory("menu-button", {
            text: tableModel.getColumnName(col),
            column: col,
            bVisible: columnModel.isColumnVisible(col)
          });
          qx.core.Assert.assertInterface(menuButton, qx.ui.table.IColumnMenuItem);
          menuButton.addListener("changeColumnVisible", this._createColumnVisibilityCheckBoxHandler(col), this);
          this.__columnMenuButtons__P_164_9[col] = menuButton;
        } // Inform listeners who may want to insert menu items at the end


        data = {
          table: this,
          menu: menu,
          columnButton: columnButton
        };
        this.fireDataEvent("columnVisibilityMenuCreateEnd", data);
      },

      /**
       * Creates a handler for a check box of the column visibility menu.
       *
       * @param col {Integer} the model index of column to create the handler for.
       * @return {Function} The created event handler.
       */
      _createColumnVisibilityCheckBoxHandler: function _createColumnVisibilityCheckBoxHandler(col) {
        return function (evt) {
          var columnModel = this.getTableColumnModel();
          columnModel.setColumnVisible(col, evt.getData());
        };
      },

      /**
       * Sets the width of a column.
       *
       * @param col {Integer} the model index of column.
       * @param width {Integer} the new width in pixels.
       */
      setColumnWidth: function setColumnWidth(col, width) {
        this.getTableColumnModel().setColumnWidth(col, width);
      },

      /**
       * Resize event handler
       */
      _onResize: function _onResize() {
        this.fireEvent("tableWidthChanged");

        this._updateScrollerWidths();

        this._updateScrollBarVisibility();
      },
      // overridden
      addListener: function addListener(type, listener, self, capture) {
        if (qx.ui.table.Table.__redirectEvents__P_164_4[type]) {
          // start the id with the type (needed for removing)
          var id = [type];

          for (var i = 0, arr = this._getPaneScrollerArr(); i < arr.length; i++) {
            id.push(arr[i].addListener.apply(arr[i], arguments));
          } // join the id's of every event with "


          return id.join('"');
        } else {
          return qx.ui.table.Table.superclass.prototype.addListener.call(this, type, listener, self, capture);
        }
      },
      // overridden
      removeListener: function removeListener(type, listener, self, capture) {
        if (qx.ui.table.Table.__redirectEvents__P_164_4[type]) {
          for (var i = 0, arr = this._getPaneScrollerArr(); i < arr.length; i++) {
            arr[i].removeListener.apply(arr[i], arguments);
          }
        } else {
          qx.ui.table.Table.superclass.prototype.removeListener.call(this, type, listener, self, capture);
        }
      },
      // overridden
      removeListenerById: function removeListenerById(id) {
        var ids = id.split('"'); // type is the first entry of the connected id

        var type = ids.shift();

        if (qx.ui.table.Table.__redirectEvents__P_164_4[type]) {
          var removed = true;

          for (var i = 0, arr = this._getPaneScrollerArr(); i < arr.length; i++) {
            removed = arr[i].removeListenerById.call(arr[i], ids[i]) && removed;
          }

          return removed;
        } else {
          return qx.ui.table.Table.superclass.prototype.removeListenerById.call(this, id);
        }
      },
      destroy: function destroy() {
        this.getChildControl("column-button").getMenu().destroy();
        qx.ui.table.Table.superclass.prototype.destroy.call(this);
      }
    },

    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct: function destruct() {
      // remove the event listener which handled the locale change
      {
        qx.locale.Manager.getInstance().removeListener("changeLocale", this._onChangeLocale, this);
      } // we allocated these objects on init so we have to clean them up.

      var selectionModel = this.getSelectionModel();

      if (selectionModel) {
        selectionModel.dispose();
      }

      var dataRowRenderer = this.getDataRowRenderer();

      if (dataRowRenderer) {
        dataRowRenderer.dispose();
      }

      if (this.getTableModel() != null) {
        this.getTableModel().removeListener("metaDataChanged", this._onTableModelMetaDataChanged, this);
        this.getTableModel().removeListener("dataChanged", this._onTableModelDataChanged, this);
      }

      this.getTableColumnModel().dispose();

      this._disposeObjects("__selectionManager__P_164_1", "__scrollerParent__P_164_0", "__emptyTableModel__P_164_11", "__emptyTableModel__P_164_11", "__columnModel__P_164_10", "__timer__P_164_13");

      this._disposeMap("__columnMenuButtons__P_164_9");
    }
  });
  qx.ui.table.Table.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2006 STZ-IDA, Germany, http://www.stz-ida.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Til Schneider (til132)
       * David Perez Carmona (david-perez)
  
  ************************************************************************ */

  /**
   * A selection model.
   */
  qx.Class.define("qx.ui.table.selection.Model", {
    extend: qx.core.Object,

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */
    construct: function construct() {
      qx.core.Object.constructor.call(this);
      this.__selectedRangeArr__P_165_0 = [];
      this.__anchorSelectionIndex__P_165_1 = -1;
      this.__leadSelectionIndex__P_165_2 = -1;
      this.hasBatchModeRefCount = 0;
      this.__hadChangeEventInBatchMode__P_165_3 = false;
    },

    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */
    events: {
      /** Fired when the selection has changed. */
      changeSelection: "qx.event.type.Event"
    },

    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */
    statics: {
      /** @type {int} The selection mode "none". Nothing can ever be selected. */
      NO_SELECTION: 1,

      /** @type {int} The selection mode "single". This mode only allows one selected item. */
      SINGLE_SELECTION: 2,

      /**
       * @type {int} The selection mode "single interval". This mode only allows one
       * continuous interval of selected items.
       */
      SINGLE_INTERVAL_SELECTION: 3,

      /**
       * @type {int} The selection mode "multiple interval". This mode only allows any
       * selection.
       */
      MULTIPLE_INTERVAL_SELECTION: 4,

      /**
       * @type {int} The selection mode "multiple interval". This mode only allows any
       * selection. The difference with the previous one, is that multiple
       * selection is eased. A tap on an item, toggles its selection state.
       * On the other hand, MULTIPLE_INTERVAL_SELECTION does this behavior only
       * when Ctrl-tapping an item.
       */
      MULTIPLE_INTERVAL_SELECTION_TOGGLE: 5
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /**
       * Set the selection mode. Valid values are {@link #NO_SELECTION},
       * {@link #SINGLE_SELECTION}, {@link #SINGLE_INTERVAL_SELECTION},
       * {@link #MULTIPLE_INTERVAL_SELECTION} and
       * {@link #MULTIPLE_INTERVAL_SELECTION_TOGGLE}.
       */
      selectionMode: {
        init: 2,
        //SINGLE_SELECTION,
        check: [1, 2, 3, 4, 5],
        //[ NO_SELECTION, SINGLE_SELECTION, SINGLE_INTERVAL_SELECTION, MULTIPLE_INTERVAL_SELECTION, MULTIPLE_INTERVAL_SELECTION_TOGGLE ],
        apply: "_applySelectionMode"
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      __hadChangeEventInBatchMode__P_165_3: null,
      __anchorSelectionIndex__P_165_1: null,
      __leadSelectionIndex__P_165_2: null,
      __selectedRangeArr__P_165_0: null,
      // selectionMode property modifier
      _applySelectionMode: function _applySelectionMode(selectionMode) {
        this.resetSelection();
      },

      /**
       *
       * Activates / Deactivates batch mode. In batch mode, no change events will be thrown but
       * will be collected instead. When batch mode is turned off again and any events have
       * been collected, one event is thrown to inform the listeners.
       *
       * This method supports nested calling, i. e. batch mode can be turned more than once.
       * In this case, batch mode will not end until it has been turned off once for each
       * turning on.
       *
       * @param batchMode {Boolean} true to activate batch mode, false to deactivate
       * @return {Boolean} true if batch mode is active, false otherwise
       * @throws {Error} if batch mode is turned off once more than it has been turned on
       */
      setBatchMode: function setBatchMode(batchMode) {
        if (batchMode) {
          this.hasBatchModeRefCount += 1;
        } else {
          if (this.hasBatchModeRefCount == 0) {
            throw new Error("Try to turn off batch mode althoug it was not turned on.");
          }

          this.hasBatchModeRefCount -= 1;

          if (this.__hadChangeEventInBatchMode__P_165_3) {
            this.__hadChangeEventInBatchMode__P_165_3 = false;

            this._fireChangeSelection();
          }
        }

        return this.hasBatchMode();
      },

      /**
       *
       * Returns whether batch mode is active. See setter for a description of batch mode.
       *
       * @return {Boolean} true if batch mode is active, false otherwise
       */
      hasBatchMode: function hasBatchMode() {
        return this.hasBatchModeRefCount > 0;
      },

      /**
       * Returns the first argument of the last call to {@link #setSelectionInterval()},
       * {@link #addSelectionInterval()} or {@link #removeSelectionInterval()}.
       *
       * @return {Integer} the anchor selection index.
       */
      getAnchorSelectionIndex: function getAnchorSelectionIndex() {
        return this.__anchorSelectionIndex__P_165_1;
      },

      /**
       * Sets the anchor selection index. Only use this function, if you want manipulate
       * the selection manually.
       *
       * @param index {Integer} the index to set.
       */
      _setAnchorSelectionIndex: function _setAnchorSelectionIndex(index) {
        this.__anchorSelectionIndex__P_165_1 = index;
      },

      /**
       * Returns the second argument of the last call to {@link #setSelectionInterval()},
       * {@link #addSelectionInterval()} or {@link #removeSelectionInterval()}.
       *
       * @return {Integer} the lead selection index.
       */
      getLeadSelectionIndex: function getLeadSelectionIndex() {
        return this.__leadSelectionIndex__P_165_2;
      },

      /**
       * Sets the lead selection index. Only use this function, if you want manipulate
       * the selection manually.
       *
       * @param index {Integer} the index to set.
       */
      _setLeadSelectionIndex: function _setLeadSelectionIndex(index) {
        this.__leadSelectionIndex__P_165_2 = index;
      },

      /**
       * Returns an array that holds all the selected ranges of the table. Each
       * entry is a map holding information about the "minIndex" and "maxIndex" of the
       * selection range.
       *
       * @return {Map[]} array with all the selected ranges.
       */
      _getSelectedRangeArr: function _getSelectedRangeArr() {
        return this.__selectedRangeArr__P_165_0;
      },

      /**
       * Resets (clears) the selection.
       */
      resetSelection: function resetSelection() {
        if (!this.isSelectionEmpty()) {
          this._resetSelection();

          this._fireChangeSelection();
        }
      },

      /**
       * Returns whether the selection is empty.
       *
       * @return {Boolean} whether the selection is empty.
       */
      isSelectionEmpty: function isSelectionEmpty() {
        return this.__selectedRangeArr__P_165_0.length == 0;
      },

      /**
       * Returns the number of selected items.
       *
       * @return {Integer} the number of selected items.
       */
      getSelectedCount: function getSelectedCount() {
        var selectedCount = 0;

        for (var i = 0; i < this.__selectedRangeArr__P_165_0.length; i++) {
          var range = this.__selectedRangeArr__P_165_0[i];
          selectedCount += range.maxIndex - range.minIndex + 1;
        }

        return selectedCount;
      },

      /**
       * Returns whether an index is selected.
       *
       * @param index {Integer} the index to check.
       * @return {Boolean} whether the index is selected.
       */
      isSelectedIndex: function isSelectedIndex(index) {
        for (var i = 0; i < this.__selectedRangeArr__P_165_0.length; i++) {
          var range = this.__selectedRangeArr__P_165_0[i];

          if (index >= range.minIndex && index <= range.maxIndex) {
            return true;
          }
        }

        return false;
      },

      /**
       * Returns the selected ranges as an array. Each array element has a
       * <code>minIndex</code> and a <code>maxIndex</code> property.
       *
       * @return {Map[]} the selected ranges.
       */
      getSelectedRanges: function getSelectedRanges() {
        // clone the selection array and the individual elements - this prevents the
        // caller from messing with the internal model
        var retVal = [];

        for (var i = 0; i < this.__selectedRangeArr__P_165_0.length; i++) {
          retVal.push({
            minIndex: this.__selectedRangeArr__P_165_0[i].minIndex,
            maxIndex: this.__selectedRangeArr__P_165_0[i].maxIndex
          });
        }

        return retVal;
      },

      /**
       * Calls an iterator function for each selected index.
       *
       * Usage Example:
       * <pre class='javascript'>
       * var selectedRowData = [];
       * mySelectionModel.iterateSelection(function(index) {
       *   selectedRowData.push(myTableModel.getRowData(index));
       * });
       * </pre>
       *
       * @param iterator {Function} the function to call for each selected index.
       *          Gets the current index as parameter.
       * @param object {var ? null} the object to use when calling the handler.
       *          (this object will be available via "this" in the iterator)
       */
      iterateSelection: function iterateSelection(iterator, object) {
        for (var i = 0; i < this.__selectedRangeArr__P_165_0.length; i++) {
          for (var j = this.__selectedRangeArr__P_165_0[i].minIndex; j <= this.__selectedRangeArr__P_165_0[i].maxIndex; j++) {
            iterator.call(object, j);
          }
        }
      },

      /**
       * Sets the selected interval. This will clear the former selection.
       *
       * @param fromIndex {Integer} the first index of the selection (including).
       * @param toIndex {Integer} the last index of the selection (including).
       */
      setSelectionInterval: function setSelectionInterval(fromIndex, toIndex) {
        var me = qx.ui.table.selection.Model;

        switch (this.getSelectionMode()) {
          case me.NO_SELECTION:
            return;

          case me.SINGLE_SELECTION:
            // Ensure there is actually a change of selection
            if (this.isSelectedIndex(toIndex)) {
              return;
            }

            fromIndex = toIndex;
            break;

          case me.MULTIPLE_INTERVAL_SELECTION_TOGGLE:
            this.setBatchMode(true);

            try {
              for (var i = fromIndex; i <= toIndex; i++) {
                if (!this.isSelectedIndex(i)) {
                  this._addSelectionInterval(i, i);
                } else {
                  this.removeSelectionInterval(i, i);
                }
              }
            } catch (e) {
              throw e;
            } finally {
              this.setBatchMode(false);
            }

            this._fireChangeSelection();

            return;
        }

        this._resetSelection();

        this._addSelectionInterval(fromIndex, toIndex);

        this._fireChangeSelection();
      },

      /**
       * Adds a selection interval to the current selection.
       *
       * @param fromIndex {Integer} the first index of the selection (including).
       * @param toIndex {Integer} the last index of the selection (including).
       */
      addSelectionInterval: function addSelectionInterval(fromIndex, toIndex) {
        var SelectionModel = qx.ui.table.selection.Model;

        switch (this.getSelectionMode()) {
          case SelectionModel.NO_SELECTION:
            return;

          case SelectionModel.MULTIPLE_INTERVAL_SELECTION:
          case SelectionModel.MULTIPLE_INTERVAL_SELECTION_TOGGLE:
            this._addSelectionInterval(fromIndex, toIndex);

            this._fireChangeSelection();

            break;

          default:
            this.setSelectionInterval(fromIndex, toIndex);
            break;
        }
      },

      /**
       * Removes an interval from the current selection.
       *
       * @param fromIndex {Integer} the first index of the interval (including).
       * @param toIndex {Integer} the last index of the interval (including).
       * @param rowsRemoved {Boolean?} rows were removed that caused this selection to change.
       *   If rows were removed, move the selections over so the same rows are selected as before.
       */
      removeSelectionInterval: function removeSelectionInterval(fromIndex, toIndex, rowsRemoved) {
        this.__anchorSelectionIndex__P_165_1 = fromIndex;
        this.__leadSelectionIndex__P_165_2 = toIndex;
        var minIndex = Math.min(fromIndex, toIndex);
        var maxIndex = Math.max(fromIndex, toIndex);
        var removeCount = maxIndex + 1 - minIndex; // Crop the affected ranges

        var newRanges = [];
        var extraRange = null;

        for (var i = 0; i < this.__selectedRangeArr__P_165_0.length; i++) {
          var range = this.__selectedRangeArr__P_165_0[i];

          if (range.minIndex > maxIndex) {
            if (rowsRemoved) {
              // Move whole selection up.
              range.minIndex -= removeCount;
              range.maxIndex -= removeCount;
            }
          } else if (range.maxIndex >= minIndex) {
            // This range is affected
            var minIsIn = range.minIndex >= minIndex;
            var maxIsIn = range.maxIndex >= minIndex && range.maxIndex <= maxIndex;

            if (minIsIn && maxIsIn) {
              // This range is removed completely
              range = null;
            } else if (minIsIn) {
              if (rowsRemoved) {
                range.minIndex = minIndex;
                range.maxIndex -= removeCount;
              } else {
                // The range is cropped from the left
                range.minIndex = maxIndex + 1;
              }
            } else if (maxIsIn) {
              // The range is cropped from the right
              range.maxIndex = minIndex - 1;
            } else {
              if (rowsRemoved) {
                range.maxIndex -= removeCount;
              } else {
                // The range is split
                extraRange = {
                  minIndex: maxIndex + 1,
                  maxIndex: range.maxIndex
                };
                range.maxIndex = minIndex - 1;
              }
            }
          }

          if (range) {
            newRanges.push(range);
            range = null;
          }

          if (extraRange) {
            newRanges.push(extraRange);
            extraRange = null;
          }
        }

        this.__selectedRangeArr__P_165_0 = newRanges;

        this._fireChangeSelection();
      },

      /**
       * Resets (clears) the selection, but doesn't inform the listeners.
       */
      _resetSelection: function _resetSelection() {
        this.__selectedRangeArr__P_165_0 = [];
        this.__anchorSelectionIndex__P_165_1 = -1;
        this.__leadSelectionIndex__P_165_2 = -1;
      },

      /**
       * Adds a selection interval to the current selection, but doesn't inform
       * the listeners.
       *
       * @param fromIndex {Integer} the first index of the selection (including).
       * @param toIndex {Integer} the last index of the selection (including).
       */
      _addSelectionInterval: function _addSelectionInterval(fromIndex, toIndex) {
        this.__anchorSelectionIndex__P_165_1 = fromIndex;
        this.__leadSelectionIndex__P_165_2 = toIndex;
        var minIndex = Math.min(fromIndex, toIndex);
        var maxIndex = Math.max(fromIndex, toIndex); // Find the index where the new range should be inserted

        var newRangeIndex = 0;

        for (; newRangeIndex < this.__selectedRangeArr__P_165_0.length; newRangeIndex++) {
          var range = this.__selectedRangeArr__P_165_0[newRangeIndex];

          if (range.minIndex > minIndex) {
            break;
          }
        } // Add the new range


        this.__selectedRangeArr__P_165_0.splice(newRangeIndex, 0, {
          minIndex: minIndex,
          maxIndex: maxIndex
        }); // Merge overlapping ranges


        var lastRange = this.__selectedRangeArr__P_165_0[0];

        for (var i = 1; i < this.__selectedRangeArr__P_165_0.length; i++) {
          var range = this.__selectedRangeArr__P_165_0[i];

          if (lastRange.maxIndex + 1 >= range.minIndex) {
            // The ranges are overlapping -> merge them
            lastRange.maxIndex = Math.max(lastRange.maxIndex, range.maxIndex); // Remove the current range

            this.__selectedRangeArr__P_165_0.splice(i, 1); // Check this index another time


            i--;
          } else {
            lastRange = range;
          }
        }
      },
      // this._dumpRanges();

      /**
       * Logs the current ranges for debug purposes.
       *
       */
      _dumpRanges: function _dumpRanges() {
        var text = "Ranges:";

        for (var i = 0; i < this.__selectedRangeArr__P_165_0.length; i++) {
          var range = this.__selectedRangeArr__P_165_0[i];
          text += " [" + range.minIndex + ".." + range.maxIndex + "]";
        }

        this.debug(text);
      },

      /**
       * Fires the "changeSelection" event to all registered listeners. If the selection model
       * currently is in batch mode, only one event will be thrown when batch mode is ended.
       *
       */
      _fireChangeSelection: function _fireChangeSelection() {
        if (this.hasBatchMode()) {
          // In batch mode, remember event but do not throw (yet)
          this.__hadChangeEventInBatchMode__P_165_3 = true;
        } else {
          // If not in batch mode, throw event
          this.fireEvent("changeSelection");
        }
      }
    },

    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct: function destruct() {
      this.__selectedRangeArr__P_165_0 = null;
    }
  });
  qx.ui.table.selection.Model.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "require": true
      },
      "qx.ui.core.LayoutItem": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.debug": {
          "load": true
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Base class for all layout managers.
   *
   * Custom layout manager must derive from
   * this class and implement the methods {@link #invalidateLayoutCache},
   * {@link #renderLayout} and {@link #getSizeHint}.
   */
  qx.Class.define("qx.ui.layout.Abstract", {
    type: "abstract",
    extend: qx.core.Object,

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      /** @type {Map} The cached size hint */
      __sizeHint__P_79_0: null,

      /** @type {Boolean} Whether the children cache is valid. This field is protected
       *    because sub classes must be able to access it quickly.
       */
      _invalidChildrenCache: null,

      /** @type {qx.ui.core.Widget} The connected widget */
      __widget__P_79_1: null,

      /*
      ---------------------------------------------------------------------------
        LAYOUT INTERFACE
      ---------------------------------------------------------------------------
      */

      /**
       * Invalidate all layout relevant caches. Automatically deletes the size hint.
       *
       * @abstract
       */
      invalidateLayoutCache: function invalidateLayoutCache() {
        this.__sizeHint__P_79_0 = null;
      },

      /**
       * Applies the children layout.
       *
       * @abstract
       * @param availWidth {Integer} Final width available for the content (in pixel)
       * @param availHeight {Integer} Final height available for the content (in pixel)
       * @param padding {Map} Map containing the padding values. Keys:
       * <code>top</code>, <code>bottom</code>, <code>left</code>, <code>right</code>
       */
      renderLayout: function renderLayout(availWidth, availHeight, padding) {
        this.warn("Missing renderLayout() implementation!");
      },

      /**
       * Computes the layout dimensions and possible ranges of these.
       *
       * @return {Map|null} The map with the preferred width/height and the allowed
       *   minimum and maximum values in cases where shrinking or growing
       *   is required. Can also return <code>null</code> when this detection
       *   is not supported by the layout.
       */
      getSizeHint: function getSizeHint() {
        if (this.__sizeHint__P_79_0) {
          return this.__sizeHint__P_79_0;
        }

        return this.__sizeHint__P_79_0 = this._computeSizeHint();
      },

      /**
       * Whether the layout manager supports height for width.
       *
       * @return {Boolean} Whether the layout manager supports height for width
       */
      hasHeightForWidth: function hasHeightForWidth() {
        return false;
      },

      /**
       * If layout wants to trade height for width it has to implement this
       * method and return the preferred height if it is resized to
       * the given width. This function returns <code>null</code> if the item
       * do not support height for width.
       *
       * @param width {Integer} The computed width
       * @return {Integer} The desired height
       */
      getHeightForWidth: function getHeightForWidth(width) {
        this.warn("Missing getHeightForWidth() implementation!");
        return null;
      },

      /**
       * This computes the size hint of the layout and returns it.
       *
       * @abstract
       * @return {Map} The size hint.
       */
      _computeSizeHint: function _computeSizeHint() {
        return null;
      },

      /**
       * This method is called, on each child "add" and "remove" action and
       * whenever the layout data of a child is changed. The method should be used
       * to clear any children relevant cached data.
       *
       */
      invalidateChildrenCache: function invalidateChildrenCache() {
        this._invalidChildrenCache = true;
      },

      /**
       * Verifies the value of a layout property.
       *
       * Note: This method is only available in the debug builds.
       *
       * @signature function(item, name, value)
       * @param item {Object} The affected layout item
       * @param name {Object} Name of the layout property
       * @param value {Object} Value of the layout property
       */
      verifyLayoutProperty: qx.core.Environment.select("qx.debug", {
        "true": function _true(item, name, value) {// empty implementation
        },
        "false": null
      }),

      /**
       * Remove all currently visible separators
       */
      _clearSeparators: function _clearSeparators() {
        // It may be that the widget do not implement clearSeparators which is especially true
        // when it do not inherit from LayoutItem.
        var widget = this.__widget__P_79_1;

        if (widget instanceof qx.ui.core.LayoutItem) {
          widget.clearSeparators();
        }
      },

      /**
       * Renders a separator between two children
       *
       * @param separator {String|qx.ui.decoration.IDecorator} The separator to render
       * @param bounds {Map} Contains the left and top coordinate and the width and height
       *    of the separator to render.
       */
      _renderSeparator: function _renderSeparator(separator, bounds) {
        this.__widget__P_79_1.renderSeparator(separator, bounds);
      },

      /**
       * This method is called by the widget to connect the widget with the layout.
       *
       * @param widget {qx.ui.core.Widget} The widget to connect to.
       */
      connectToWidget: function connectToWidget(widget) {
        if (widget && this.__widget__P_79_1) {
          throw new Error("It is not possible to manually set the connected widget.");
        }

        this.__widget__P_79_1 = widget; // Invalidate cache

        this.invalidateChildrenCache();
      },

      /**
       * Return the widget that is this layout is responsible for.
       *
       * @return {qx.ui.core.Widget} The widget connected to this layout.
       */
      _getWidget: function _getWidget() {
        return this.__widget__P_79_1;
      },

      /**
       * Indicate that the layout has layout changed and propagate this information
       * up the widget hierarchy.
       *
       * Also a generic property apply method for all layout relevant properties.
       */
      _applyLayoutChange: function _applyLayoutChange() {
        if (this.__widget__P_79_1) {
          this.__widget__P_79_1.scheduleLayoutUpdate();
        }
      },

      /**
       * Returns the list of all layout relevant children.
       *
       * @return {Array} List of layout relevant children.
       */
      _getLayoutChildren: function _getLayoutChildren() {
        return this.__widget__P_79_1.getLayoutChildren();
      }
    },

    /*
    *****************************************************************************
       DESTRUCT
    *****************************************************************************
    */
    destruct: function destruct() {
      this.__widget__P_79_1 = this.__sizeHint__P_79_0 = null;
    }
  });
  qx.ui.layout.Abstract.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.layout.Abstract": {
        "construct": true,
        "require": true
      },
      "qx.ui.layout.Util": {},
      "qx.theme.manager.Decoration": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.debug": {
          "load": true
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * A vertical box layout.
   *
   * The vertical box layout lays out widgets in a vertical column, from top
   * to bottom.
   *
   * *Features*
   *
   * * Minimum and maximum dimensions
   * * Prioritized growing/shrinking (flex)
   * * Margins (with vertical collapsing)
   * * Auto sizing (ignoring percent values)
   * * Percent heights (not relevant for size hint)
   * * Alignment (child property {@link qx.ui.core.LayoutItem#alignY} is ignored)
   * * Vertical spacing (collapsed with margins)
   * * Reversed children layout (from last to first)
   * * Horizontal children stretching (respecting size hints)
   *
   * *Item Properties*
   *
   * <ul>
   * <li><strong>flex</strong> <em>(Integer)</em>: The flexibility of a layout item determines how the container
   *   distributes remaining empty space among its children. If items are made
   *   flexible, they can grow or shrink accordingly. Their relative flex values
   *   determine how the items are being resized, i.e. the larger the flex ratio
   *   of two items, the larger the resizing of the first item compared to the
   *   second.
   *
   *   If there is only one flex item in a layout container, its actual flex
   *   value is not relevant. To disallow items to become flexible, set the
   *   flex value to zero.
   * </li>
   * <li><strong>height</strong> <em>(String)</em>: Allows to define a percent
   *   height for the item. The height in percent, if specified, is used instead
   *   of the height defined by the size hint. The minimum and maximum height still
   *   takes care of the element's limits. It has no influence on the layout's
   *   size hint. Percent values are mostly useful for widgets which are sized by
   *   the outer hierarchy.
   * </li>
   * </ul>
   *
   * *Example*
   *
   * Here is a little example of how to use the vertical box layout.
   *
   * <pre class="javascript">
   * var layout = new qx.ui.layout.VBox();
   * layout.setSpacing(4); // apply spacing
   *
   * var container = new qx.ui.container.Composite(layout);
   *
   * container.add(new qx.ui.core.Widget());
   * container.add(new qx.ui.core.Widget());
   * container.add(new qx.ui.core.Widget());
   * </pre>
   *
   * *External Documentation*
   *
   * See <a href='https://qooxdoo.org/documentation/#/desktop/layout/box.md'>extended documentation</a>
   * and links to demos for this layout.
   *
   */
  qx.Class.define("qx.ui.layout.VBox", {
    extend: qx.ui.layout.Abstract,

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param spacing {Integer?0} The spacing between child widgets {@link #spacing}.
     * @param alignY {String?"top"} Vertical alignment of the whole children
     *     block {@link #alignY}.
     * @param separator {String|qx.ui.decoration.IDecorator?} A separator to be rendered between the items
     */
    construct: function construct(spacing, alignY, separator) {
      qx.ui.layout.Abstract.constructor.call(this);

      if (spacing) {
        this.setSpacing(spacing);
      }

      if (alignY) {
        this.setAlignY(alignY);
      }

      if (separator) {
        this.setSeparator(separator);
      }
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /**
       * Vertical alignment of the whole children block. The vertical
       * alignment of the child is completely ignored in VBoxes (
       * {@link qx.ui.core.LayoutItem#alignY}).
       */
      alignY: {
        check: ["top", "middle", "bottom"],
        init: "top",
        apply: "_applyLayoutChange"
      },

      /**
       * Horizontal alignment of each child. Can be overridden through
       * {@link qx.ui.core.LayoutItem#alignX}.
       */
      alignX: {
        check: ["left", "center", "right"],
        init: "left",
        apply: "_applyLayoutChange"
      },

      /** Vertical spacing between two children */
      spacing: {
        check: "Integer",
        init: 0,
        apply: "_applyLayoutChange"
      },

      /** Separator lines to use between the objects */
      separator: {
        check: "Decorator",
        nullable: true,
        apply: "_applyLayoutChange"
      },

      /** Whether the actual children list should be laid out in reversed order. */
      reversed: {
        check: "Boolean",
        init: false,
        apply: "_applyReversed"
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      __heights__P_170_0: null,
      __flexs__P_170_1: null,
      __enableFlex__P_170_2: null,
      __children__P_170_3: null,

      /*
      ---------------------------------------------------------------------------
        HELPER METHODS
      ---------------------------------------------------------------------------
      */
      // property apply
      _applyReversed: function _applyReversed() {
        // easiest way is to invalidate the cache
        this._invalidChildrenCache = true; // call normal layout change

        this._applyLayoutChange();
      },

      /**
       * Rebuilds caches for flex and percent layout properties
       */
      __rebuildCache__P_170_4: function __rebuildCache__P_170_4() {
        var children = this._getLayoutChildren();

        var length = children.length;
        var enableFlex = false;
        var reuse = this.__heights__P_170_0 && this.__heights__P_170_0.length != length && this.__flexs__P_170_1 && this.__heights__P_170_0;
        var props; // Sparse array (keep old one if lengths has not been modified)

        var heights = reuse ? this.__heights__P_170_0 : new Array(length);
        var flexs = reuse ? this.__flexs__P_170_1 : new Array(length); // Reverse support

        if (this.getReversed()) {
          children = children.concat().reverse();
        } // Loop through children to preparse values


        for (var i = 0; i < length; i++) {
          props = children[i].getLayoutProperties();

          if (props.height != null) {
            heights[i] = parseFloat(props.height) / 100;
          }

          if (props.flex != null) {
            flexs[i] = props.flex;
            enableFlex = true;
          } else {
            // reset (in case the index of the children changed: BUG #3131)
            flexs[i] = 0;
          }
        } // Store data


        if (!reuse) {
          this.__heights__P_170_0 = heights;
          this.__flexs__P_170_1 = flexs;
        }

        this.__enableFlex__P_170_2 = enableFlex;
        this.__children__P_170_3 = children; // Clear invalidation marker

        delete this._invalidChildrenCache;
      },

      /*
      ---------------------------------------------------------------------------
        LAYOUT INTERFACE
      ---------------------------------------------------------------------------
      */
      // overridden
      verifyLayoutProperty: qx.core.Environment.select("qx.debug", {
        "true": function _true(item, name, value) {
          if (name == "height") {
            this.assertMatch(value, qx.ui.layout.Util.PERCENT_VALUE);
          } else if (name == "flex") {
            // flex
            this.assertNumber(value);
            this.assert(value >= 0);
          } else if (name == "flexShrink") {
            this.assertBoolean(value);
          } else {
            this.assert(false, "The property '" + name + "' is not supported by the VBox layout!");
          }
        },
        "false": null
      }),
      // overridden
      renderLayout: function renderLayout(availWidth, availHeight, padding) {
        // Rebuild flex/height caches
        if (this._invalidChildrenCache) {
          this.__rebuildCache__P_170_4();
        } // Cache children


        var children = this.__children__P_170_3;
        var length = children.length;
        var util = qx.ui.layout.Util; // Compute gaps

        var spacing = this.getSpacing();
        var separator = this.getSeparator();
        var gaps;

        if (separator) {
          gaps = util.computeVerticalSeparatorGaps(children, spacing, separator);
        } else {
          gaps = util.computeVerticalGaps(children, spacing, true);
        } // First run to cache children data and compute allocated height


        var i, child, height, percent;
        var heights = [],
            hint;
        var allocatedHeight = gaps;

        for (i = 0; i < length; i += 1) {
          percent = this.__heights__P_170_0[i];
          hint = children[i].getSizeHint();
          height = percent != null ? Math.floor((availHeight - gaps) * percent) : hint.height; // Limit computed value

          if (height < hint.minHeight) {
            height = hint.minHeight;
          } else if (height > hint.maxHeight) {
            height = hint.maxHeight;
          }

          heights.push(height);
          allocatedHeight += height;
        } // Flex support (growing/shrinking)


        if (this.__enableFlex__P_170_2 && allocatedHeight != availHeight) {
          var flexibles = {};
          var flex, offset;
          var notEnoughSpace = allocatedHeight > availHeight;

          for (i = 0; i < length; i += 1) {
            flex = this.__flexs__P_170_1[i];

            if (flex > 0) {
              hint = children[i].getSizeHint();
              flexibles[i] = {
                min: hint.minHeight,
                value: heights[i],
                max: hint.maxHeight,
                flex: flex
              };

              if (notEnoughSpace) {
                var props = children[i].getLayoutProperties();

                if (props && props.flexShrink) {
                  flexibles[i].min = 0;
                }
              }
            }
          }

          var result = util.computeFlexOffsets(flexibles, availHeight, allocatedHeight);

          for (i in result) {
            offset = result[i].offset;
            heights[i] += offset;
            allocatedHeight += offset;
          }
        } // Start with top coordinate


        var top = children[0].getMarginTop(); // Alignment support

        if (allocatedHeight < availHeight && this.getAlignY() != "top") {
          top = availHeight - allocatedHeight;

          if (this.getAlignY() === "middle") {
            top = Math.round(top / 2);
          }
        } // Layouting children


        var hint, left, width, height, marginBottom, marginLeft, marginRight; // Pre configure separators

        this._clearSeparators(); // Compute separator height


        if (separator) {
          var separatorInsets = qx.theme.manager.Decoration.getInstance().resolve(separator).getInsets();
          var separatorHeight = separatorInsets.top + separatorInsets.bottom;
        } // Render children and separators


        for (i = 0; i < length; i += 1) {
          child = children[i];
          height = heights[i];
          hint = child.getSizeHint();
          marginLeft = child.getMarginLeft();
          marginRight = child.getMarginRight(); // Find usable width

          width = Math.max(hint.minWidth, Math.min(availWidth - marginLeft - marginRight, hint.maxWidth)); // Respect horizontal alignment

          left = util.computeHorizontalAlignOffset(child.getAlignX() || this.getAlignX(), width, availWidth, marginLeft, marginRight); // Add collapsed margin

          if (i > 0) {
            // Whether a separator has been configured
            if (separator) {
              // add margin of last child and spacing
              top += marginBottom + spacing; // then render the separator at this position

              this._renderSeparator(separator, {
                top: top + padding.top,
                left: padding.left,
                height: separatorHeight,
                width: availWidth
              }); // and finally add the size of the separator, the spacing (again) and the top margin


              top += separatorHeight + spacing + child.getMarginTop();
            } else {
              // Support margin collapsing when no separator is defined
              top += util.collapseMargins(spacing, marginBottom, child.getMarginTop());
            }
          } // Layout child


          child.renderLayout(left + padding.left, top + padding.top, width, height); // Add height

          top += height; // Remember bottom margin (for collapsing)

          marginBottom = child.getMarginBottom();
        }
      },
      // overridden
      _computeSizeHint: function _computeSizeHint() {
        // Rebuild flex/height caches
        if (this._invalidChildrenCache) {
          this.__rebuildCache__P_170_4();
        }

        var util = qx.ui.layout.Util;
        var children = this.__children__P_170_3; // Initialize

        var minHeight = 0,
            height = 0,
            percentMinHeight = 0;
        var minWidth = 0,
            width = 0;
        var child, hint, margin; // Iterate over children

        for (var i = 0, l = children.length; i < l; i += 1) {
          child = children[i];
          hint = child.getSizeHint(); // Sum up heights

          height += hint.height; // Detect if child is shrinkable or has percent height and update minHeight

          var flex = this.__flexs__P_170_1[i];
          var percent = this.__heights__P_170_0[i];

          if (flex) {
            minHeight += hint.minHeight;
          } else if (percent) {
            percentMinHeight = Math.max(percentMinHeight, Math.round(hint.minHeight / percent));
          } else {
            minHeight += hint.height;
          } // Build horizontal margin sum


          margin = child.getMarginLeft() + child.getMarginRight(); // Find biggest width

          if (hint.width + margin > width) {
            width = hint.width + margin;
          } // Find biggest minWidth


          if (hint.minWidth + margin > minWidth) {
            minWidth = hint.minWidth + margin;
          }
        }

        minHeight += percentMinHeight; // Respect gaps

        var spacing = this.getSpacing();
        var separator = this.getSeparator();
        var gaps;

        if (separator) {
          gaps = util.computeVerticalSeparatorGaps(children, spacing, separator);
        } else {
          gaps = util.computeVerticalGaps(children, spacing, true);
        } // Return hint


        return {
          minHeight: minHeight + gaps,
          height: height + gaps,
          minWidth: minWidth,
          width: width
        };
      }
    },

    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct: function destruct() {
      this.__heights__P_170_0 = this.__flexs__P_170_1 = this.__children__P_170_3 = null;
    }
  });
  qx.ui.layout.VBox.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This mixin exposes all methods to manage the layout manager of a widget.
   * It can only be included into instances of {@link qx.ui.core.Widget}.
   *
   * To optimize the method calls the including widget should call the method
   * {@link #remap} in its defer function. This will map the protected
   * methods to the public ones and save one method call for each function.
   */
  qx.Mixin.define("qx.ui.core.MLayoutHandling", {
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      /**
       * Set a layout manager for the widget. A a layout manager can only be connected
       * with one widget. Reset the connection with a previous widget first, if you
       * like to use it in another widget instead.
       *
       * @param layout {qx.ui.layout.Abstract} The new layout or
       *     <code>null</code> to reset the layout.
       */
      setLayout: function setLayout(layout) {
        this._setLayout(layout);
      },

      /**
       * Get the widget's layout manager.
       *
       * @return {qx.ui.layout.Abstract} The widget's layout manager
       */
      getLayout: function getLayout() {
        return this._getLayout();
      }
    },

    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */
    statics: {
      /**
       * Mapping of protected methods to public.
       * This omits an additional function call when using these methods. Call
       * this methods in the defer block of the including class.
       *
       * @param members {Map} The including classes members map
       */
      remap: function remap(members) {
        members.getLayout = members._getLayout;
        members.setLayout = members._setLayout;
      }
    }
  });
  qx.ui.core.MLayoutHandling.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.MChildrenHandling": {
        "defer": "runtime",
        "require": true
      },
      "qx.ui.core.MLayoutHandling": {
        "defer": "runtime",
        "require": true
      },
      "qx.event.type.Data": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * The Composite is a generic container widget.
   *
   * It exposes all methods to set layouts and to manage child widgets
   * as public methods. You must configure this widget with a layout manager to
   * define the way the widget's children are positioned.
   *
   * *Example*
   *
   * Here is a little example of how to use the widget.
   *
   * <pre class='javascript'>
   *   // create the composite
   *   var composite = new qx.ui.container.Composite()
   *
   *   // configure it with a horizontal box layout with a spacing of '5'
   *   composite.setLayout(new qx.ui.layout.HBox(5));
   *
   *   // add some children
   *   composite.add(new qx.ui.basic.Label("Name: "));
   *   composite.add(new qx.ui.form.TextField());
   *
   *   this.getRoot().add(composite);
   * </pre>
   *
   * This example horizontally groups a label and text field by using a
   * Composite configured with a horizontal box layout as a container.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/composite.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   */
  qx.Class.define("qx.ui.container.Composite", {
    extend: qx.ui.core.Widget,
    include: [qx.ui.core.MChildrenHandling, qx.ui.core.MLayoutHandling],

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param layout {qx.ui.layout.Abstract} A layout instance to use to
     *   place widgets on the screen.
     */
    construct: function construct(layout) {
      qx.ui.core.Widget.constructor.call(this);

      if (layout != null) {
        this._setLayout(layout);
      }
    },

    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */
    events: {
      /**
       * This event is fired after a child widget was added to this widget. The
       * {@link qx.event.type.Data#getData} method of the event returns the
       * added child.
       */
      addChildWidget: "qx.event.type.Data",

      /**
       * This event is fired after a child widget has been removed from this widget.
       * The {@link qx.event.type.Data#getData} method of the event returns the
       * removed child.
       */
      removeChildWidget: "qx.event.type.Data"
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      // overridden
      _afterAddChild: function _afterAddChild(child) {
        this.fireNonBubblingEvent("addChildWidget", qx.event.type.Data, [child]);
      },
      // overridden
      _afterRemoveChild: function _afterRemoveChild(child) {
        this.fireNonBubblingEvent("removeChildWidget", qx.event.type.Data, [child]);
      }
    },

    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */
    defer: function defer(statics, members) {
      qx.ui.core.MChildrenHandling.remap(members);
      qx.ui.core.MLayoutHandling.remap(members);
    }
  });
  qx.ui.container.Composite.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.layout.Abstract": {
        "construct": true,
        "require": true
      },
      "qx.ui.layout.Util": {},
      "qx.theme.manager.Decoration": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.debug": {
          "load": true
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * A horizontal box layout.
   *
   * The horizontal box layout lays out widgets in a horizontal row, from left
   * to right.
   *
   * *Features*
   *
   * * Minimum and maximum dimensions
   * * Prioritized growing/shrinking (flex)
   * * Margins (with horizontal collapsing)
   * * Auto sizing (ignoring percent values)
   * * Percent widths (not relevant for size hint)
   * * Alignment (child property {@link qx.ui.core.LayoutItem#alignX} is ignored)
   * * Horizontal spacing (collapsed with margins)
   * * Reversed children layout (from last to first)
   * * Vertical children stretching (respecting size hints)
   *
   * *Item Properties*
   *
   * <ul>
   * <li><strong>flex</strong> <em>(Integer)</em>: The flexibility of a layout item determines how the container
   *   distributes remaining empty space among its children. If items are made
   *   flexible, they can grow or shrink accordingly. Their relative flex values
   *   determine how the items are being resized, i.e. the larger the flex ratio
   *   of two items, the larger the resizing of the first item compared to the
   *   second.
   *
   *   If there is only one flex item in a layout container, its actual flex
   *   value is not relevant. To disallow items to become flexible, set the
   *   flex value to zero.
   * </li>
   * <li><strong>flexShrink</strong> <em>(Boolean)</em>: Only valid if `flex` is
   *    set to a non-zero value, `flexShrink` tells the layout to force the child
   *    widget to shink if there is not enough space available for all of the children.
   *    This is used in scenarios such as when the child insists that it has a `minWidth`
   *    but there simply is not enough space to support that minimum width, so the
   *    overflow has to be cut off.  This setting allows the container to pick
   *    which children are able to have their `minWidth` sacrificed.  Without this
   *    setting, one oversized child can force later children out of view, regardless
   *    of `flex` settings
   * </li>
   * <li><strong>width</strong> <em>(String)</em>: Allows to define a percent
   *   width for the item. The width in percent, if specified, is used instead
   *   of the width defined by the size hint. The minimum and maximum width still
   *   takes care of the element's limits. It has no influence on the layout's
   *   size hint. Percent values are mostly useful for widgets which are sized by
   *   the outer hierarchy.
   * </li>
   * </ul>
   *
   * *Example*
   *
   * Here is a little example of how to use the HBox layout.
   *
   * <pre class="javascript">
   * var layout = new qx.ui.layout.HBox();
   * layout.setSpacing(4); // apply spacing
   *
   * var container = new qx.ui.container.Composite(layout);
   *
   * container.add(new qx.ui.core.Widget());
   * container.add(new qx.ui.core.Widget());
   * container.add(new qx.ui.core.Widget());
   * </pre>
   *
   * *External Documentation*
   *
   * See <a href='https://qooxdoo.org/documentation/#/desktop/layout/box.md'>extended documentation</a>
   * and links to demos for this layout.
   *
   */
  qx.Class.define("qx.ui.layout.HBox", {
    extend: qx.ui.layout.Abstract,

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param spacing {Integer?0} The spacing between child widgets {@link #spacing}.
     * @param alignX {String?"left"} Horizontal alignment of the whole children
     *     block {@link #alignX}.
     * @param separator {String|qx.ui.decoration.IDecorator?} A separator to render between the items
     */
    construct: function construct(spacing, alignX, separator) {
      qx.ui.layout.Abstract.constructor.call(this);

      if (spacing) {
        this.setSpacing(spacing);
      }

      if (alignX) {
        this.setAlignX(alignX);
      }

      if (separator) {
        this.setSeparator(separator);
      }
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /**
       * Horizontal alignment of the whole children block. The horizontal
       * alignment of the child is completely ignored in HBoxes (
       * {@link qx.ui.core.LayoutItem#alignX}).
       */
      alignX: {
        check: ["left", "center", "right"],
        init: "left",
        apply: "_applyLayoutChange"
      },

      /**
       * Vertical alignment of each child. Can be overridden through
       * {@link qx.ui.core.LayoutItem#alignY}.
       */
      alignY: {
        check: ["top", "middle", "bottom"],
        init: "top",
        apply: "_applyLayoutChange"
      },

      /** Horizontal spacing between two children */
      spacing: {
        check: "Integer",
        init: 0,
        apply: "_applyLayoutChange"
      },

      /** Separator lines to use between the objects */
      separator: {
        check: "Decorator",
        nullable: true,
        apply: "_applyLayoutChange"
      },

      /** Whether the actual children list should be laid out in reversed order. */
      reversed: {
        check: "Boolean",
        init: false,
        apply: "_applyReversed"
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      __widths__P_112_0: null,
      __flexs__P_112_1: null,
      __enableFlex__P_112_2: null,
      __children__P_112_3: null,

      /*
      ---------------------------------------------------------------------------
        HELPER METHODS
      ---------------------------------------------------------------------------
      */
      // property apply
      _applyReversed: function _applyReversed() {
        // easiest way is to invalidate the cache
        this._invalidChildrenCache = true; // call normal layout change

        this._applyLayoutChange();
      },

      /**
       * Rebuilds caches for flex and percent layout properties
       */
      __rebuildCache__P_112_4: function __rebuildCache__P_112_4() {
        var children = this._getLayoutChildren();

        var length = children.length;
        var enableFlex = false;
        var reuse = this.__widths__P_112_0 && this.__widths__P_112_0.length != length && this.__flexs__P_112_1 && this.__widths__P_112_0;
        var props; // Sparse array (keep old one if lengths has not been modified)

        var widths = reuse ? this.__widths__P_112_0 : new Array(length);
        var flexs = reuse ? this.__flexs__P_112_1 : new Array(length); // Reverse support

        if (this.getReversed()) {
          children = children.concat().reverse();
        } // Loop through children to preparse values


        for (var i = 0; i < length; i++) {
          props = children[i].getLayoutProperties();

          if (props.width != null) {
            widths[i] = parseFloat(props.width) / 100;
          }

          if (props.flex != null) {
            flexs[i] = props.flex;
            enableFlex = true;
          } else {
            // reset (in case the index of the children changed: BUG #3131)
            flexs[i] = 0;
          }
        } // Store data


        if (!reuse) {
          this.__widths__P_112_0 = widths;
          this.__flexs__P_112_1 = flexs;
        }

        this.__enableFlex__P_112_2 = enableFlex;
        this.__children__P_112_3 = children; // Clear invalidation marker

        delete this._invalidChildrenCache;
      },

      /*
      ---------------------------------------------------------------------------
        LAYOUT INTERFACE
      ---------------------------------------------------------------------------
      */
      // overridden
      verifyLayoutProperty: qx.core.Environment.select("qx.debug", {
        "true": function _true(item, name, value) {
          if (name === "width") {
            this.assertMatch(value, qx.ui.layout.Util.PERCENT_VALUE);
          } else if (name === "flex") {
            this.assertNumber(value);
            this.assert(value >= 0);
          } else if (name === "flexShrink") {
            this.assertBoolean(value);
          } else {
            this.assert(false, "The property '" + name + "' is not supported by the HBox layout!");
          }
        },
        "false": null
      }),
      // overridden
      renderLayout: function renderLayout(availWidth, availHeight, padding) {
        // Rebuild flex/width caches
        if (this._invalidChildrenCache) {
          this.__rebuildCache__P_112_4();
        } // Cache children


        var children = this.__children__P_112_3;
        var length = children.length;
        var util = qx.ui.layout.Util; // Compute gaps

        var spacing = this.getSpacing();
        var separator = this.getSeparator();
        var gaps;

        if (separator) {
          gaps = util.computeHorizontalSeparatorGaps(children, spacing, separator);
        } else {
          gaps = util.computeHorizontalGaps(children, spacing, true);
        } // First run to cache children data and compute allocated width


        var i, child, width, percent;
        var widths = [],
            hint;
        var allocatedWidth = gaps;

        for (i = 0; i < length; i += 1) {
          percent = this.__widths__P_112_0[i];
          hint = children[i].getSizeHint();
          width = percent != null ? Math.floor((availWidth - gaps) * percent) : hint.width; // Limit computed value

          if (width < hint.minWidth) {
            width = hint.minWidth;
          } else if (width > hint.maxWidth) {
            width = hint.maxWidth;
          }

          widths.push(width);
          allocatedWidth += width;
        } // Flex support (growing/shrinking)


        if (this.__enableFlex__P_112_2 && allocatedWidth != availWidth) {
          var flexibles = {};
          var flex, offset;
          var notEnoughSpace = allocatedWidth > availWidth;

          for (i = 0; i < length; i += 1) {
            flex = this.__flexs__P_112_1[i];

            if (flex > 0) {
              hint = children[i].getSizeHint();
              flexibles[i] = {
                min: hint.minWidth,
                value: widths[i],
                max: hint.maxWidth,
                flex: flex
              };

              if (notEnoughSpace) {
                var props = children[i].getLayoutProperties();

                if (props && props.flexShrink) {
                  flexibles[i].min = 0;
                }
              }
            }
          }

          var result = util.computeFlexOffsets(flexibles, availWidth, allocatedWidth);

          for (i in result) {
            offset = result[i].offset;
            widths[i] += offset;
            allocatedWidth += offset;
          }
        } // Start with left coordinate


        var left = children[0].getMarginLeft(); // Alignment support

        if (allocatedWidth < availWidth && this.getAlignX() != "left") {
          left = availWidth - allocatedWidth;

          if (this.getAlignX() === "center") {
            left = Math.round(left / 2);
          }
        } // Layouting children


        var hint, top, height, width, marginRight, marginTop, marginBottom;
        var spacing = this.getSpacing(); // Pre configure separators

        this._clearSeparators(); // Compute separator width


        if (separator) {
          var separatorInsets = qx.theme.manager.Decoration.getInstance().resolve(separator).getInsets();
          var separatorWidth = separatorInsets.left + separatorInsets.right;
        } // Render children and separators


        for (i = 0; i < length; i += 1) {
          child = children[i];
          width = widths[i];
          hint = child.getSizeHint();
          marginTop = child.getMarginTop();
          marginBottom = child.getMarginBottom(); // Find usable height

          height = Math.max(hint.minHeight, Math.min(availHeight - marginTop - marginBottom, hint.maxHeight)); // Respect vertical alignment

          top = util.computeVerticalAlignOffset(child.getAlignY() || this.getAlignY(), height, availHeight, marginTop, marginBottom); // Add collapsed margin

          if (i > 0) {
            // Whether a separator has been configured
            if (separator) {
              // add margin of last child and spacing
              left += marginRight + spacing; // then render the separator at this position

              this._renderSeparator(separator, {
                left: left + padding.left,
                top: padding.top,
                width: separatorWidth,
                height: availHeight
              }); // and finally add the size of the separator, the spacing (again) and the left margin


              left += separatorWidth + spacing + child.getMarginLeft();
            } else {
              // Support margin collapsing when no separator is defined
              left += util.collapseMargins(spacing, marginRight, child.getMarginLeft());
            }
          } // Layout child


          child.renderLayout(left + padding.left, top + padding.top, width, height); // Add width

          left += width; // Remember right margin (for collapsing)

          marginRight = child.getMarginRight();
        }
      },
      // overridden
      _computeSizeHint: function _computeSizeHint() {
        // Rebuild flex/width caches
        if (this._invalidChildrenCache) {
          this.__rebuildCache__P_112_4();
        }

        var util = qx.ui.layout.Util;
        var children = this.__children__P_112_3; // Initialize

        var minWidth = 0,
            width = 0,
            percentMinWidth = 0;
        var minHeight = 0,
            height = 0;
        var child, hint, margin; // Iterate over children

        for (var i = 0, l = children.length; i < l; i += 1) {
          child = children[i];
          hint = child.getSizeHint(); // Sum up widths

          width += hint.width; // Detect if child is shrinkable or has percent width and update minWidth

          var flex = this.__flexs__P_112_1[i];
          var percent = this.__widths__P_112_0[i];

          if (flex) {
            minWidth += hint.minWidth;
          } else if (percent) {
            percentMinWidth = Math.max(percentMinWidth, Math.round(hint.minWidth / percent));
          } else {
            minWidth += hint.width;
          } // Build vertical margin sum


          margin = child.getMarginTop() + child.getMarginBottom(); // Find biggest height

          if (hint.height + margin > height) {
            height = hint.height + margin;
          } // Find biggest minHeight


          if (hint.minHeight + margin > minHeight) {
            minHeight = hint.minHeight + margin;
          }
        }

        minWidth += percentMinWidth; // Respect gaps

        var spacing = this.getSpacing();
        var separator = this.getSeparator();
        var gaps;

        if (separator) {
          gaps = util.computeHorizontalSeparatorGaps(children, spacing, separator);
        } else {
          gaps = util.computeHorizontalGaps(children, spacing, true);
        } // Return hint


        return {
          minWidth: minWidth + gaps,
          width: width + gaps,
          minHeight: minHeight,
          height: height
        };
      }
    },

    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct: function destruct() {
      this.__widths__P_112_0 = this.__flexs__P_112_1 = this.__children__P_112_3 = null;
    }
  });
  qx.ui.layout.HBox.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Interface": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2006 STZ-IDA, Germany, http://www.stz-ida.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Til Schneider (til132)
  
  ************************************************************************ */

  /**
   * Interface for a row renderer.
   */
  qx.Interface.define("qx.ui.table.IRowRenderer", {
    members: {
      /**
       * Updates a data row.
       *
       * The rowInfo map contains the following properties:
       * <ul>
       * <li>rowData (var): contains the row data for the row.
       *   The kind of this object depends on the table model, see
       *   {@link ITableModel#getRowData()}</li>
       * <li>row (int): the model index of the row.</li>
       * <li>selected (boolean): whether a cell in this row is selected.</li>
       * <li>focusedRow (boolean): whether the focused cell is in this row.</li>
       * <li>table (qx.ui.table.Table): the table the row belongs to.</li>
       * </ul>
       *
       * @abstract
       * @param rowInfo {Map} A map containing the information about the row to
       *      update.
       * @param rowElement {Element} the DOM element that renders the data row.
       */
      updateDataRowElement: function updateDataRowElement(rowInfo, rowElement) {},

      /**
       * Get the row's height CSS style taking the box model into account
       *
       * @param height {Integer} The row's (border-box) height in pixel
       */
      getRowHeightStyle: function getRowHeightStyle(height) {},

      /**
       * Create a style string, which will be set as the style property of the row.
       *
       * @param rowInfo {Map} A map containing the information about the row to
       *      update. See {@link #updateDataRowElement} for more information.
       */
      createRowStyle: function createRowStyle(rowInfo) {},

      /**
       * Create a HTML class string, which will be set as the class property of the row.
       *
       * @param rowInfo {Map} A map containing the information about the row to
       *      update. See {@link #updateDataRowElement} for more information.
       */
      getRowClass: function getRowClass(rowInfo) {}
    }
  });
  qx.ui.table.IRowRenderer.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.ui.table.IRowRenderer": {
        "require": true
      },
      "qx.theme.manager.Meta": {
        "construct": true
      },
      "qx.theme.manager.Font": {},
      "qx.theme.manager.Color": {},
      "qx.bom.element.Style": {},
      "qx.bom.Font": {},
      "qx.bom.client.Css": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "css.boxmodel": {
          "className": "qx.bom.client.Css"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2006 STZ-IDA, Germany, http://www.stz-ida.de
       2007 Visionet GmbH, http://www.visionet.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Til Schneider (til132) STZ-IDA
       * Dietrich Streifert (level420) Visionet
  
  ************************************************************************ */

  /**
   * The default data row renderer.
   */
  qx.Class.define("qx.ui.table.rowrenderer.Default", {
    extend: qx.core.Object,
    implement: qx.ui.table.IRowRenderer,

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */
    construct: function construct() {
      qx.core.Object.constructor.call(this);
      this.initThemeValues(); // dynamic theme switch

      {
        qx.theme.manager.Meta.getInstance().addListener("changeTheme", this.initThemeValues, this);
      }
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /** Whether the focused row should be highlighted. */
      highlightFocusRow: {
        check: "Boolean",
        init: true
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      _colors: null,
      _fontStyle: null,
      _fontStyleString: null,

      /**
       * Initializes the colors from the color theme.
       * @internal
       */
      initThemeValues: function initThemeValues() {
        this._fontStyleString = "";
        this._fontStyle = {};
        this._colors = {}; // link to font theme

        this._renderFont(qx.theme.manager.Font.getInstance().resolve("default")); // link to color theme


        var colorMgr = qx.theme.manager.Color.getInstance();
        this._colors.bgcolFocusedSelected = colorMgr.resolve("table-row-background-focused-selected");
        this._colors.bgcolFocused = colorMgr.resolve("table-row-background-focused");
        this._colors.bgcolSelected = colorMgr.resolve("table-row-background-selected");
        this._colors.bgcolEven = colorMgr.resolve("table-row-background-even");
        this._colors.bgcolOdd = colorMgr.resolve("table-row-background-odd");
        this._colors.colSelected = colorMgr.resolve("table-row-selected");
        this._colors.colNormal = colorMgr.resolve("table-row");
        this._colors.horLine = colorMgr.resolve("table-row-line");
      },

      /**
       * the sum of the vertical insets. This is needed to compute the box model
       * independent size
       */
      _insetY: 1,
      // borderBottom

      /**
       * Render the new font and update the table pane content
       * to reflect the font change.
       *
       * @param font {qx.bom.Font} The font to use for the table row
       */
      _renderFont: function _renderFont(font) {
        if (font) {
          this._fontStyle = font.getStyles();
          this._fontStyleString = qx.bom.element.Style.compile(this._fontStyle);
          this._fontStyleString = this._fontStyleString.replace(/"/g, "'");
        } else {
          this._fontStyleString = "";
          this._fontStyle = qx.bom.Font.getDefaultStyles();
        }
      },
      // interface implementation
      updateDataRowElement: function updateDataRowElement(rowInfo, rowElem) {
        var fontStyle = this._fontStyle;
        var style = rowElem.style; // set font styles

        qx.bom.element.Style.setStyles(rowElem, fontStyle);

        if (rowInfo.focusedRow && this.getHighlightFocusRow()) {
          style.backgroundColor = rowInfo.selected ? this._colors.bgcolFocusedSelected : this._colors.bgcolFocused;
        } else {
          if (rowInfo.selected) {
            style.backgroundColor = this._colors.bgcolSelected;
          } else {
            style.backgroundColor = rowInfo.row % 2 == 0 ? this._colors.bgcolEven : this._colors.bgcolOdd;
          }
        }

        style.color = rowInfo.selected ? this._colors.colSelected : this._colors.colNormal;
        style.borderBottom = "1px solid " + this._colors.horLine;
      },

      /**
       * Get the row's height CSS style taking the box model into account
       *
       * @param height {Integer} The row's (border-box) height in pixel
       * @return {String} CSS rule for the row height
       */
      getRowHeightStyle: function getRowHeightStyle(height) {
        if (qx.core.Environment.get("css.boxmodel") == "content") {
          height -= this._insetY;
        }

        return "height:" + height + "px;";
      },
      // interface implementation
      createRowStyle: function createRowStyle(rowInfo) {
        var rowStyle = [];
        rowStyle.push(";");
        rowStyle.push(this._fontStyleString);
        rowStyle.push("background-color:");

        if (rowInfo.focusedRow && this.getHighlightFocusRow()) {
          rowStyle.push(rowInfo.selected ? this._colors.bgcolFocusedSelected : this._colors.bgcolFocused);
        } else {
          if (rowInfo.selected) {
            rowStyle.push(this._colors.bgcolSelected);
          } else {
            rowStyle.push(rowInfo.row % 2 == 0 ? this._colors.bgcolEven : this._colors.bgcolOdd);
          }
        }

        rowStyle.push(";color:");
        rowStyle.push(rowInfo.selected ? this._colors.colSelected : this._colors.colNormal);
        rowStyle.push(";border-bottom: 1px solid ", this._colors.horLine);
        return rowStyle.join("");
      },
      getRowClass: function getRowClass(rowInfo) {
        return "";
      },

      /**
       * Add extra attributes to each row.
       *
       * @param rowInfo {Object}
       *   The following members are available in rowInfo:
       *   <dl>
       *     <dt>table {qx.ui.table.Table}</dt>
       *     <dd>The table object</dd>
       *
       *     <dt>styleHeight {Integer}</dt>
       *     <dd>The height of this (and every) row</dd>
       *
       *     <dt>row {Integer}</dt>
       *     <dd>The number of the row being added</dd>
       *
       *     <dt>selected {Boolean}</dt>
       *     <dd>Whether the row being added is currently selected</dd>
       *
       *     <dt>focusedRow {Boolean}</dt>
       *     <dd>Whether the row being added is currently focused</dd>
       *
       *     <dt>rowData {Array}</dt>
       *     <dd>The array row from the data model of the row being added</dd>
       *   </dl>
       *
       * @return {String}
       *   Any additional attributes and their values that should be added to the
       *   div tag for the row.
       */
      getRowAttributes: function getRowAttributes(rowInfo) {
        return "role=row "; // Space important!
      }
    },

    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct: function destruct() {
      this._colors = this._fontStyle = this._fontStyleString = null; // remove dynamic theme listener

      {
        qx.theme.manager.Meta.getInstance().removeListener("changeTheme", this.initThemeValues, this);
      }
    }
  });
  qx.ui.table.rowrenderer.Default.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "defer": "runtime",
        "require": true
      },
      "qx.core.ObjectRegistry": {},
      "qx.core.Object": {},
      "qx.core.MAssert": {
        "defer": "runtime"
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Jonathan Weiß (jonathan_rass)
  
     ======================================================================
  
       This class uses documentation of the native String methods from the MDC
       documentation of Mozilla.
  
       License:
         CC Attribution-Sharealike License:
         http://creativecommons.org/licenses/by-sa/2.5/
  
  ************************************************************************ */

  /**
   * This class emulates the built-in JavaScript String class. It can be used as
   * base class for classes, which need to derive from String.
   *
   * Instances of this class can be used in any place a JavaScript string can.
   */
  qx.Class.define("qx.type.BaseString", {
    extend: Object,

    /**
     * @param txt {String?""} Initialize with this string
     */
    construct: function construct(txt) {
      var txt = txt || ""; // no base call needed

      this.__txt__P_145_0 = txt;
      this.length = txt.length;
    },
    members: {
      $$isString: true,
      length: 0,
      __txt__P_145_0: null,

      /**
       * Returns a string representing the specified object.
       *
       * The valueOf method of String returns the primitive value of a String
       * object as a string data type.
       * This method is usually called internally by JavaScript and not
       * explicitly in code.
       *
       * @return {String} A new string containing the string value.
       */
      toString: function toString() {
        return this.__txt__P_145_0;
      },

      /**
       *  Returns the specified character from a string.
       *
       * Characters in a string are indexed from left to right. The index of the
       * first character is 0, and the index of the last character in a string
       * called stringName is stringName.length - 1. If the index you supply is
       * out of range, JavaScript returns an empty string.
       *
       * @signature function(index)
       * @param index {Integer} An integer between 0 and 1 less than the length
       *   of the string.
       * @return {String} The character.
       */
      charAt: null,

      /**
       * Returns the primitive value of a String object.
       *
       * The valueOf method of String returns the primitive value of a String
       * object as a string data type.
       * This method is usually called internally by JavaScript and not
       * explicitly in code.
       *
       * @signature function()
       * @return {String} A new string containing the primitive value.
       */
      valueOf: null,

      /**
       * Returns a number indicating the Unicode value of the character at the given index.
       *
       * @signature function(index)
       * @param index {Integer} An integer greater than 0 and less than the length
       *   of the string; if it is not a number, it defaults to 0.
       * @return {Integer} The number.
       */
      charCodeAt: null,

      /**
       * Combines the text of two or more strings and returns a new string.
       * Changes to the text in one string do not affect the other string.
       *
       * @signature function(stringN)
       * @param stringN {String} One or more strings to be combined.
       * @return {String} The combined string.
       */
      concat: null,

      /**
       * Returns the index within the calling String object of the first
       * occurrence of the specified value, starting the search at fromIndex,
       * returns -1 if the value is not found.
       *
       * @signature function(index, offset)
       * @param index {String} A string representing the value to search for.
       * @param offset {Integer?0} The location within the calling string to start
       *   the search from. It can be any integer between 0 and the length of the
       *   string. The default value is 0.
       * @return {Integer} The index or -1.
       */
      indexOf: null,

      /**
       * Returns the index within the calling String object of the last occurrence
       * of the specified value, or -1 if not found. The calling string is
       * searched backward, starting at fromIndex.
       *
       * @signature function(index, offset)
       * @param index {String} A string representing the value to search for.
       * @param offset {Integer?0} The location within the calling string to start
       *   the search from, indexed from left to right. It can be any integer
       *   between 0 and the length of the string. The default value is the length
       *    of the string.
       * @return {Integer} The index or -1.
       */
      lastIndexOf: null,

      /**
       * Used to retrieve the matches when matching a string against a regular
       * expression.
       *
       * If the regular expression does not include the g flag, returns the same
       * result as regexp.exec(string). If the regular expression includes the g
       * flag, the method returns an Array containing all matches.
       *
       * @signature function(regexp)
       * @param regexp {Object} A regular expression object. If a non-RegExp object
       *  obj is passed, it is implicitly converted to a RegExp by using
       *   new RegExp(obj).
       * @return {Object} The matching RegExp object or an array containing all
       *   matches.
       */
      match: null,

      /**
       * Finds a match between a regular expression and a string, and replaces the
       * matched substring with a new substring.
       *
       * @signature function(regexp, aFunction)
       * @param regexp {Object} A RegExp object. The match is replaced by the
       *   return value of parameter #2. Or a String that is to be replaced by
       *   newSubStr.
       * @param aFunction {Function} A function to be invoked to create the new
       *   substring (to put in place of the substring received from parameter
       *   #1).
       * @return {String} The new substring.
       */
      replace: null,

      /**
       * Executes the search for a match between a regular expression and this
       * String object.
       *
       * If successful, search returns the index of the regular expression inside
       * the string. Otherwise, it returns -1.
       *
       * @signature function(regexp)
       * @param regexp {Object} A regular expression object. If a non-RegExp object
       *  obj is passed, it is implicitly converted to a RegExp by using
       *   new RegExp(obj).
       * @return {Object} The matching RegExp object or -1.
       *   matches.
       */
      search: null,

      /**
       * Extracts a section of a string and returns a new string.
       *
       * Slice extracts the text from one string and returns a new string. Changes
       * to the text in one string do not affect the other string.
       * As a negative index, endSlice indicates an offset from the end of the
       * string.
       *
       * @signature function(beginslice, endSlice)
       * @param beginslice {Integer} The zero-based index at which to begin
       *   extraction.
       * @param endSlice {Integer?null} The zero-based index at which to end
       *   extraction. If omitted, slice extracts to the end of the string.
       * @return {String} The extracted string.
       */
      slice: null,

      /**
       * Splits a String object into an array of strings by separating the string
       * into substrings.
       *
       * When found, separator is removed from the string and the substrings are
       * returned in an array. If separator is omitted, the array contains one
       * element consisting of the entire string.
       *
       * If separator is a regular expression that contains capturing parentheses,
       * then each time separator is matched the results (including any undefined
       * results) of the capturing parentheses are spliced into the output array.
       * However, not all browsers support this capability.
       *
       * Note: When the string is empty, split returns an array containing one
       *
       * @signature function(separator, limit)
       * @param separator {String?null} Specifies the character to use for
       *   separating the string. The separator is treated as a string or a regular
       *   expression. If separator is omitted, the array returned contains one
       *   element consisting of the entire string.
       * @param limit {Integer?null} Integer specifying a limit on the number of
       *   splits to be found.
       * @return {Array} The Array containing substrings.
       */
      split: null,

      /**
       * Returns the characters in a string beginning at the specified location
       * through the specified number of characters.
       *
       * Start is a character index. The index of the first character is 0, and the
       * index of the last character is 1 less than the length of the string. substr
       *  begins extracting characters at start and collects length characters
       * (unless it reaches the end of the string first, in which case it will
       * return fewer).
       * If start is positive and is greater than or equal to the length of the
       * string, substr returns an empty string.
       *
       * @signature function(start, length)
       * @param start {Integer} Location at which to begin extracting characters
       *   (an integer between 0 and one less than the length of the string).
       * @param length {Integer?null} The number of characters to extract.
       * @return {String} The substring.
       */
      substr: null,

      /**
       * Returns a subset of a String object.
       *
       * substring extracts characters from indexA up to but not including indexB.
       * In particular:
       * If indexA equals indexB, substring returns an empty string.
       * If indexB is omitted, substring extracts characters to the end of the
       * string.
       * If either argument is less than 0 or is NaN, it is treated as if it were
       * 0.
       * If either argument is greater than stringName.length, it is treated as if
       * it were stringName.length.
       * If indexA is larger than indexB, then the effect of substring is as if
       * the two arguments were swapped; for example, str.substring(1, 0) == str.substring(0, 1).
       *
       * @signature function(indexA, indexB)
       * @param indexA {Integer} An integer between 0 and one less than the
       *   length of the string.
       * @param indexB {Integer?null} (optional) An integer between 0 and the
       *   length of the string.
       * @return {String} The subset.
       */
      substring: null,

      /**
       * Returns the calling string value converted to lowercase.
       * The toLowerCase method returns the value of the string converted to
       * lowercase. toLowerCase does not affect the value of the string itself.
       *
       * @signature function()
       * @return {String} The new string.
       */
      toLowerCase: null,

      /**
       * Returns the calling string value converted to uppercase.
       * The toUpperCase method returns the value of the string converted to
       * uppercase. toUpperCase does not affect the value of the string itself.
       *
       * @signature function()
       * @return {String} The new string.
       */
      toUpperCase: null,

      /**
       * Return unique hash code of object
       *
       * @return {Integer} unique hash code of the object
       */
      toHashCode: function toHashCode() {
        return qx.core.ObjectRegistry.toHashCode(this);
      },

      /**
       * The characters within a string are converted to lower case while
       * respecting the current locale.
       *
       * The toLowerCase method returns the value of the string converted to
       * lowercase. toLowerCase does not affect the value of the string itself.
       *
       * @signature function()
       * @return {String} The new string.
       */
      toLocaleLowerCase: null,

      /**
       * The characters within a string are converted to upper case while
       * respecting the current locale.
       * The toUpperCase method returns the value of the string converted to
       * uppercase. toUpperCase does not affect the value of the string itself.
       *
       * @signature function()
       * @return {String} The new string.
       */
      toLocaleUpperCase: null,

      /**
       * Call the same method of the super class.
       *
       * @param args {arguments} the arguments variable of the calling method
       * @param varags {var} variable number of arguments passed to the overwritten function
       * @return {var} the return value of the method of the base class.
       */
      base: function base(args, varags) {
        return qx.core.Object.prototype.base.apply(this, arguments);
      }
    },

    /*
     *****************************************************************************
        DEFER
     *****************************************************************************
     */
    defer: function defer(statics, members) {
      // add asserts into each debug build
      {
        qx.Class.include(statics, qx.core.MAssert);
      }
      var mappedFunctions = ["charAt", "charCodeAt", "concat", "indexOf", "lastIndexOf", "match", "replace", "search", "slice", "split", "substr", "substring", "toLowerCase", "toUpperCase", "toLocaleLowerCase", "toLocaleUpperCase", "trim", "codePointAt"]; // feature/bug detection:
      // Some older Firefox version (<2) break if valueOf is overridden

      members.valueOf = members.toString;

      if (new statics("").valueOf() == null) {
        delete members.valueOf;
      }

      for (var i = 0, l = mappedFunctions.length; i < l; i++) {
        members[mappedFunctions[i]] = String.prototype[mappedFunctions[i]];
      }
    }
  });
  qx.type.BaseString.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.type.BaseString": {
        "construct": true,
        "require": true
      },
      "qx.locale.Manager": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This class contains the translation of a message and all information
   * to translate it again into a different language.
   */
  qx.Class.define("qx.locale.LocalizedString", {
    extend: qx.type.BaseString,

    /**
     * @param translation {String} The translated message
     * @param messageId {String} The messageId to translate
     * @param args {Array} list of arguments passed used as values for format strings
     * @param localized {Boolean} True if the string uses localize instead of translate
     */
    construct: function construct(translation, messageId, args, localized) {
      qx.type.BaseString.constructor.call(this, translation);
      this.__messageId__P_122_0 = messageId;
      this.__localized__P_122_1 = !!localized;
      this.__args__P_122_2 = args;
    },
    members: {
      __localized__P_122_1: null,
      __messageId__P_122_0: null,
      __args__P_122_2: null,

      /**
       * Get a translation of the string using the current locale.
       *
       * @return {qx.locale.LocalizedString|String} This string translated using the current
       *    locale.
       */
      translate: function translate() {
        if (this.__localized__P_122_1) {
          return qx.locale.Manager.getInstance().localize(this.__messageId__P_122_0, this.__args__P_122_2);
        }

        return qx.locale.Manager.getInstance().translate(this.__messageId__P_122_0, this.__args__P_122_2);
      },

      /**
       * Returns the messageId.
       *
       * @return {String} The messageId of this localized String
       */
      getMessageId: function getMessageId() {
        return this.__messageId__P_122_0;
      }
    }
  });
  qx.locale.LocalizedString.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.bom.client.OperatingSystem": {
        "require": true,
        "defer": "runtime"
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.lang.Type": {},
      "qx.core.Environment": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": ["locale", "locale.variant", "locale.default"],
      "required": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * This class comes with all relevant information regarding
   * the client's selected locale.
   *
   * This class is used by {@link qx.core.Environment} and should not be used
   * directly. Please check its class comment for details how to use it.
   *
   * @internal
   * @require(qx.bom.client.OperatingSystem)
   */
  qx.Bootstrap.define("qx.bom.client.Locale", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */
    statics: {
      /**
       * The name of the system locale e.g. "de" when the full locale is "de_AT"
       * @return {String} The current locale
       * @internal
       */
      getLocale: function getLocale() {
        var locale = qx.bom.client.Locale.__getNavigatorLocale__P_123_0();

        var index = locale.indexOf("-");

        if (index != -1) {
          locale = locale.substr(0, index);
        }

        return locale;
      },

      /**
       * The name of the variant for the system locale e.g. "at" when the
       * full locale is "de_AT"
       *
       * @return {String} The locales variant.
       * @internal
       */
      getVariant: function getVariant() {
        var locale = qx.bom.client.Locale.__getNavigatorLocale__P_123_0();

        var variant = "";
        var index = locale.indexOf("-");

        if (index != -1) {
          variant = locale.substr(index + 1);
        }

        return variant;
      },

      /**
       * Internal helper for accessing the navigators language.
       *
       * @return {String} The language set by the navigator.
       */
      __getNavigatorLocale__P_123_0: function __getNavigatorLocale__P_123_0() {
        var locale = navigator.userLanguage || navigator.language || ""; // Android Bug: Android does not return the system language from the
        // navigator language before version 4.4.x. Try to parse the language
        // from the userAgent.
        // See http://code.google.com/p/android/issues/detail?id=4641

        if (qx.bom.client.OperatingSystem.getName() == "android") {
          var version = /^(\d+)\.(\d+)(\..+)?/i.exec(qx.bom.client.OperatingSystem.getVersion());

          if (qx.lang.Type.isArray(version) && version.length >= 3) {
            if (parseInt(version[1]) < 4 || parseInt(version[1]) === 4 && parseInt(version[2]) < 4) {
              var match = /(\w{2})-(\w{2})/i.exec(navigator.userAgent);

              if (match) {
                locale = match[0];
              }
            }
          }
        }

        return locale.toLowerCase();
      }
    },
    defer: function defer(statics) {
      qx.core.Environment.add("locale", statics.getLocale);
      qx.core.Environment.add("locale.variant", statics.getVariant);
      qx.core.Environment.add("locale.default", "C");
    }
  });
  qx.bom.client.Locale.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.event.dispatch.Direct": {
        "require": true
      },
      "qx.locale.LocalizedString": {
        "require": true
      },
      "qx.bom.client.Locale": {
        "require": true
      },
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.lang.Array": {},
      "qx.log.Logger": {},
      "qx.lang.String": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "locale": {
          "className": "qx.bom.client.Locale"
        },
        "locale.default": {
          "className": "qx.bom.client.Locale",
          "load": true
        },
        "locale.variant": {
          "className": "qx.bom.client.Locale"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * The qx.locale.Manager provides static translation methods (like tr()) and
   * general locale information.
   *
   * @require(qx.event.dispatch.Direct)
   * @require(qx.locale.LocalizedString)
   * @require(qx.bom.client.Locale)
   *
   * Note: "translating" the empty string, e.g. tr("") will return the header
   * of the respective .po file. See also https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html#PO-Files
   *
   * @cldr()
   */
  qx.Class.define("qx.locale.Manager", {
    type: "singleton",
    extend: qx.core.Object,

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */
    construct: function construct() {
      qx.core.Object.constructor.call(this);
      this.__translations__P_87_0 = qx.$$translations || {};
      this.__locales__P_87_1 = qx.$$locales || {};
      this.initLocale();
      this.__clientLocale__P_87_2 = this.getLocale();
    },

    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */
    statics: {
      /**
       * Translate a message
       *
       * @param messageId {String} message id (may contain format strings)
       * @param varargs {Object} variable number of arguments applied to the format string
       * @return {String | LocalizedString} The translated message or localized string
       * @see qx.lang.String.format
       */
      tr: function tr(messageId, varargs) {
        var args = qx.lang.Array.fromArguments(arguments, 1);
        return qx.locale.Manager.getInstance().translate(messageId, args);
      },

      /**
       * Translate a plural message
       *
       * Depending on the third argument the plural or the singular form is chosen.
       *
       * @param singularMessageId {String} message id of the singular form (may contain format strings)
       * @param pluralMessageId {String} message id of the plural form (may contain format strings)
       * @param count {Integer} singular form if equals 1, otherwise plural
       * @param varargs {Object} variable number of arguments applied to the format string
       * @return {String | LocalizedString} The translated message or localized string
       * @see qx.lang.String.format
       */
      trn: function trn(singularMessageId, pluralMessageId, count, varargs) {
        var args = qx.lang.Array.fromArguments(arguments);
        args.splice(0, 3); // assumes "Two forms, singular used for one only" (seems to be the most common form)
        // (http://www.gnu.org/software/gettext/manual/html_node/gettext_150.html#Plural-forms)
        // closely related with bug #745

        if (count != 1) {
          return qx.locale.Manager.getInstance().translate(pluralMessageId, args);
        } else {
          return qx.locale.Manager.getInstance().translate(singularMessageId, args);
        }
      },

      /**
       * Translate a message with translation hint (from developer addressed to translator).
       *
       * @param hint {String} hint for the translator of the message. Will be included in the .po file.
       * @param messageId {String} message id (may contain format strings)
       * @param varargs {Object} variable number of arguments applied to the format string
       * @return {String | LocalizedString} The translated message or localized string
       * @see qx.lang.String.format
       */
      trc: function trc(hint, messageId, varargs) {
        var args = qx.lang.Array.fromArguments(arguments);
        args.splice(0, 2);
        return qx.locale.Manager.getInstance().translate(messageId, args);
      },

      /**
       * Translate a plural message with translation hint (from developer addressed to translator).
       *
       * Depending on the third argument the plural or the singular form is chosen.
       *
       * @param hint {String} hint for the translator of the message. Will be included in the .po file.
       * @param singularMessageId {String} message id of the singular form (may contain format strings)
       * @param pluralMessageId {String} message id of the plural form (may contain format strings)
       * @param count {Integer} singular form if equals 1, otherwise plural
       * @param varargs {Object} variable number of arguments applied to the format string
       * @return {String | LocalizedString} The translated message or localized string
       * @see qx.lang.String.format
       */
      trnc: function trnc(hint, singularMessageId, pluralMessageId, count, varargs) {
        var args = qx.lang.Array.fromArguments(arguments);
        args.splice(0, 4); // see trn()

        if (count != 1) {
          return qx.locale.Manager.getInstance().translate(pluralMessageId, args);
        } else {
          return qx.locale.Manager.getInstance().translate(singularMessageId, args);
        }
      },

      /**
       * Mark the message for translation but return the original message.
       *
       * @param messageId {String} the message ID
       * @return {String} messageId
       */
      marktr: function marktr(messageId) {
        return messageId;
      }
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /** current locale. locale is an language code like de, de_AT, en, en_GB, fr, ... */
      locale: {
        check: "String",
        apply: "_applyLocale",
        event: "changeLocale",
        init: function () {
          var locale = qx.core.Environment.get("locale");

          if (!locale || locale === "") {
            return qx.core.Environment.get("locale.default");
          }

          var variant = qx.core.Environment.get("locale.variant");

          if (variant !== "") {
            locale += "_" + variant;
          }

          return locale;
        }()
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      __defaultLocale__P_87_3: qx.core.Environment.get("locale.default"),
      __locale__P_87_4: null,
      __language__P_87_5: null,
      __translations__P_87_0: null,
      __locales__P_87_1: null,
      __clientLocale__P_87_2: null,

      /**
       * Get the language code of the current locale
       *
       * This is the first part of a locale definition. The language for "de_DE" would be "de"
       *
       * @return {String} language code
       */
      getLanguage: function getLanguage() {
        return this.__language__P_87_5;
      },

      /**
       * Get the territory code of the current locale
       *
       * This is the second part of a locale definition. The territory for "de_DE" would be "DE"
       *
       * @return {String} territory code
       */
      getTerritory: function getTerritory() {
        return this.getLocale().split("_")[1] || "";
      },

      /**
       * Return the available application locales
       *
       * This corresponds to the LOCALES setting in config.json. Without argument,
       * it only returns the currently loaded locales, with an argument of true
       * all locales that went into the build. This is particularly interesting if
       * locales were generated as dedicated I18N parts, and have to be loaded
       * explicitly before being available.
       *
       * @param includeNonloaded {Boolean?null} include locales not yet loaded
       * @return {String[]} array of available locales
       */
      getAvailableLocales: function getAvailableLocales(includeNonloaded) {
        var locales = [];

        for (var locale in this.__locales__P_87_1) {
          if (locale != this.__defaultLocale__P_87_3) {
            if (this.__locales__P_87_1[locale] === null && !includeNonloaded) {
              continue; // skip not yet loaded locales
            }

            locales.push(locale);
          }
        }

        return locales;
      },

      /**
       * Extract the language part from a locale.
       *
       * @param locale {String} locale to be used
       * @return {String} language
       */
      __extractLanguage__P_87_6: function __extractLanguage__P_87_6(locale) {
        var language;

        if (locale == null) {
          return null;
        }

        var pos = locale.indexOf("_");

        if (pos == -1) {
          language = locale;
        } else {
          language = locale.substring(0, pos);
        }

        return language;
      },
      // property apply
      _applyLocale: function _applyLocale(value, old) {
        {
          if (!(value in this.__locales__P_87_1 || value == this.__clientLocale__P_87_2)) {
            qx.log.Logger.warn("Locale: " + value + " not available.");
          }
        }
        this.__locale__P_87_4 = value;
        this.__language__P_87_5 = this.__extractLanguage__P_87_6(value);
      },

      /**
       * Add a translation to the translation manager.
       *
       * If <code>languageCode</code> already exists, its map will be updated with
       * <code>translationMap</code> (new keys will be added, existing keys will be
       * overwritten).
       *
       * @param languageCode {String} language code of the translation like <i>de, de_AT, en, en_GB, fr, ...</i>
       * @param translationMap {Map} mapping of message identifiers to message strings in the target
       *                             language, e.g. <i>{"greeting_short" : "Hello"}</i>. Plural forms
       *                             are separate keys.
       */
      addTranslation: function addTranslation(languageCode, translationMap) {
        var catalog = this.__translations__P_87_0;

        if (catalog[languageCode]) {
          for (var key in translationMap) {
            catalog[languageCode][key] = translationMap[key];
          }
        } else {
          catalog[languageCode] = translationMap;
        }
      },

      /**
       * Add a localization to the localization manager.
       *
       * If <code>localeCode</code> already exists, its map will be updated with
       * <code>localeMap</code> (new keys will be added, existing keys will be overwritten).
       *
       * @param localeCode {String} locale code of the translation like <i>de, de_AT, en, en_GB, fr, ...</i>
       * @param localeMap {Map} mapping of locale keys to the target locale values, e.g.
       *                        <i>{"cldr_date_format_short" : "M/d/yy"}</i>.
       */
      addLocale: function addLocale(localeCode, localeMap) {
        var catalog = this.__locales__P_87_1;

        if (catalog[localeCode]) {
          for (var key in localeMap) {
            catalog[localeCode][key] = localeMap[key];
          }
        } else {
          catalog[localeCode] = localeMap;
        }
      },

      /**
       * Translate a message using the current locale and apply format string to the arguments.
       *
       * Implements the lookup chain locale (e.g. en_US) -> language (e.g. en) ->
       * default locale (e.g. C). Localizes the arguments if possible and splices
       * them into the message. If qx.dynlocale is on, returns a {@link
       * LocalizedString}.
       *
       * @param messageId {String} message id (may contain format strings)
       * @param args {Object[]} array of objects, which are inserted into the format string
       * @param locale {String ? #locale} locale to be used; if not given, defaults to the value of {@link #locale}
       * @return {String | LocalizedString} translated message or localized string
       */
      translate: function translate(messageId, args, locale) {
        var catalog = this.__translations__P_87_0;
        return this.__lookupAndExpand__P_87_7(catalog, messageId, args, locale);
      },

      /**
       * Provide localization (CLDR) data.
       *
       * Implements the lookup chain locale (e.g. en_US) -> language (e.g. en) ->
       * default locale (e.g. C). Localizes the arguments if possible and splices
       * them into the message. If qx.dynlocale is on, returns a {@link
       * LocalizedString}.
       *
       * @param messageId {String} message id (may contain format strings)
       * @param args {Object[]} array of objects, which are inserted into the format string
       * @param locale {String ? #locale} locale to be used; if not given, defaults to the value of {@link #locale}
       * @return {String | LocalizedString} translated message or localized string
       */
      localize: function localize(messageId, args, locale) {
        var catalog = this.__locales__P_87_1;
        return this.__lookupAndExpand__P_87_7(catalog, messageId, args, locale);
      },

      /**
       * Look up an I18N key in a catalog and expand format strings.
       *
       * Implements the lookup chain locale (e.g. en_US) -> language (e.g. en) ->
       * default locale (e.g. C). Localizes the arguments if possible and splices
       * them into the message. If qx.dynlocale is on, returns a {@link
       * LocalizedString}.
       *
       * @param catalog {Map} map of I18N keys and their values
       * @param messageId {String} message id (may contain format strings)
       * @param args {Object[]} array of objects, which are inserted into the format string
       * @param locale {String ? #locale} locale to be used; if not given, defaults to the value of {@link #locale}
       * @return {String | LocalizedString} translated message or localized string
       */
      __lookupAndExpand__P_87_7: function __lookupAndExpand__P_87_7(catalog, messageId, args, locale) {
        {
          this.assertObject(catalog);
          this.assertString(messageId);
          this.assertArray(args);
        }
        var txt;

        if (!catalog) {
          return messageId;
        }

        if (locale) {
          var language = this.__extractLanguage__P_87_6(locale);
        } else {
          locale = this.__locale__P_87_4;
          language = this.__language__P_87_5;
        } // e.g. DE_at


        if (!txt && catalog[locale]) {
          txt = catalog[locale][messageId];
        } // e.g. DE


        if (!txt && catalog[language]) {
          txt = catalog[language][messageId];
        } // C


        if (!txt && catalog[this.__defaultLocale__P_87_3]) {
          txt = catalog[this.__defaultLocale__P_87_3][messageId];
        }

        if (!txt) {
          txt = messageId;
        }

        if (args.length > 0) {
          var translatedArgs = [];

          for (var i = 0; i < args.length; i++) {
            var arg = args[i];

            if (arg && arg.translate) {
              translatedArgs[i] = arg.translate();
            } else {
              translatedArgs[i] = arg;
            }
          }

          txt = qx.lang.String.format(txt, translatedArgs);
        }

        {
          txt = new qx.locale.LocalizedString(txt, messageId, args, catalog === this.__locales__P_87_1);
        }
        return txt;
      }
    }
  });
  qx.locale.Manager.$$dbClassInfo = $$dbClassInfo;
})();

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.table.Table": {
        "construct": true,
        "require": true
      },
      "qx.ui.treevirtual.SimpleTreeDataModel": {
        "construct": true
      },
      "qx.ui.treevirtual.SimpleTreeDataCellRenderer": {
        "construct": true
      },
      "qx.ui.treevirtual.DefaultDataCellRenderer": {
        "construct": true
      },
      "qx.ui.treevirtual.SimpleTreeDataRowRenderer": {
        "construct": true
      },
      "qx.ui.treevirtual.SelectionManager": {
        "construct": true
      },
      "qx.ui.table.columnmodel.Resize": {
        "construct": true
      },
      "qx.ui.treevirtual.pane.Scroller": {
        "construct": true
      },
      "qx.lang.Type": {
        "construct": true
      },
      "qx.ui.treevirtual.celleditor.NodeEditor": {
        "construct": true
      },
      "qx.ui.table.selection.Model": {
        "require": true
      },
      "qx.bom.element.Location": {},
      "qx.event.type.Dom": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2007 Derrell Lipman
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Derrell Lipman (derrell)
  
  ************************************************************************ */

  /**
   * A "virtual" tree
   * <p>
   *   A number of convenience methods are available in the following mixins:
   *   <ul>
   *     <li>{@link qx.ui.treevirtual.MNode}</li>
   *     <li>{@link qx.ui.treevirtual.MFamily}</li>
   *   </ul>
   * </p>
   */
  qx.Class.define("qx.ui.treevirtual.TreeVirtual", {
    extend: qx.ui.table.Table,

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param headings {Array | String}
     *   An array containing a list of strings, one for each column, representing
     *   the headings for each column.  As a special case, if only one column is
     *   to exist, the string representing its heading need not be enclosed in an
     *   array.
     *
     * @param custom {Map ? null}
     *   A map provided (typically) by subclasses, to override the various
     *   supplemental classes allocated within this constructor.  For normal
     *   usage, this parameter may be omitted.  Each property must be an object
     *   instance or a function which returns an object instance, as indicated by
     *   the defaults listed here:
     *
     *   <dl>
     *     <dt>initiallyHiddenColumns</dt>
     *       <dd>
     *         {Array?}
     *         A list of column numbers that should be initially invisible. Any
     *         column not mentioned will be initially visible, and if no array
     *         is provided, all columns will be initially visible.
     *       </dd>
     *     <dt>dataModel</dt>
     *       <dd>new qx.ui.treevirtual.SimpleTreeDataModel()</dd>
     *     <dt>treeDataCellRenderer</dt>
     *       <dd>
     *         Instance of {@link qx.ui.treevirtual.SimpleTreeDataCellRenderer}.
     *         Custom data cell renderer for the tree column.
     *       </dd>
     *     <dt>treeColumn</dt>
     *       <dd>
     *         The column number in which the tree is to reside, i.e., which
     *         column uses the SimpleTreeDataCellRenderer or a subclass of it.
     *       </dd>
     *     <dt>defaultDataCellRenderer</dt>
     *       <dd>
     *         Instance of {@link qx.ui.treevirtual.DefaultDataCellRenderer}.
     *         Custom data cell renderer for all columns other than the tree
     *         column.
     *       </dd>
     *     <dt>dataRowRenderer</dt>
     *       <dd>new qx.ui.treevirtual.SimpleTreeDataRowRenderer()</dd>
     *     <dt>selectionManager</dt>
     *       <dd><pre class='javascript'>
     *         function(obj)
     *         {
     *           return new qx.ui.treevirtual.SelectionManager(obj);
     *         }
     *       </pre></dd>
     *     <dt>tableColumnModel</dt>
     *       <dd><pre class='javascript'>
     *         function(obj)
     *         {
     *           return new qx.ui.table.columnmodel.Resize(obj);
     *         }
     *       </pre></dd>
     *     <dt>tablePaneScroller</dt>
     *       <dd>
     *         Instance of {@link qx.ui.treevirtual.pane.Scroller}.
     *         Custom table pane scroller for the tree
     *         <pre class='javascript'>
     *         function(obj)
     *         {
     *           return new qx.ui.table.columnmodel.Resize(obj);
     *         }
     *       </pre>
     *       </dd>
     *   </dl>
     */
    construct: function construct(headings, custom) {
      //
      // Allocate default objects if custom objects are not specified
      //
      if (!custom) {
        custom = {};
      }

      if (!custom.dataModel) {
        custom.dataModel = new qx.ui.treevirtual.SimpleTreeDataModel();
      }

      if (custom.treeColumn === undefined) {
        custom.treeColumn = 0;
        custom.dataModel.setTreeColumn(custom.treeColumn);
      }

      if (!custom.treeDataCellRenderer) {
        custom.treeDataCellRenderer = new qx.ui.treevirtual.SimpleTreeDataCellRenderer();
      }

      if (!custom.defaultDataCellRenderer) {
        custom.defaultDataCellRenderer = new qx.ui.treevirtual.DefaultDataCellRenderer();
      }

      if (!custom.dataRowRenderer) {
        custom.dataRowRenderer = new qx.ui.treevirtual.SimpleTreeDataRowRenderer();
      }

      if (!custom.selectionManager) {
        custom.selectionManager = function (obj) {
          return new qx.ui.treevirtual.SelectionManager(obj);
        };
      }

      if (!custom.tableColumnModel) {
        custom.tableColumnModel = function (obj) {
          return new qx.ui.table.columnmodel.Resize(obj);
        };
      }

      if (!custom.tablePaneScroller) {
        custom.tablePaneScroller = function (obj) {
          return new qx.ui.treevirtual.pane.Scroller(obj);
        };
      } // Specify the column headings.  We accept a single string (one single
      // column) or an array of strings (one or more columns).


      if (qx.lang.Type.isString(headings)) {
        headings = [headings];
      }

      custom.dataModel.setColumns(headings);
      custom.dataModel.setTreeColumn(custom.treeColumn); // Save a reference to the tree with the data model

      custom.dataModel.setTree(this); // Call our superclass constructor

      qx.ui.table.Table.constructor.call(this, custom.dataModel, custom); // Arrange to redisplay edited data following editing

      this.addListener("dataEdited", function (e) {
        this.getDataModel().setData();
      }, this); // By default, present the column visibility button only if there are
      // multiple columns.

      this.setColumnVisibilityButtonVisible(headings.length > 1); // Set sizes

      this.setRowHeight(16);
      this.setMetaColumnCounts(headings.length > 1 ? [1, -1] : [1]); // Overflow on trees is always hidden.  The internal elements scroll.

      this.setOverflow("hidden"); // Set the data cell render.  We use the SimpleTreeDataCellRenderer for the
      // tree column, and our DefaultDataCellRenderer for all other columns.

      var stdcr = custom.treeDataCellRenderer;
      var ddcr = custom.defaultDataCellRenderer;
      var tcm = this.getTableColumnModel();
      var treeCol = this.getDataModel().getTreeColumn();

      for (var i = 0; i < headings.length; i++) {
        tcm.setDataCellRenderer(i, i == treeCol ? stdcr : ddcr);
      } // Set the data row renderer.


      this.setDataRowRenderer(custom.dataRowRenderer); // Set the editor for the tree column, for use if allowNodeEdit is true

      tcm.setCellEditorFactory(treeCol, new qx.ui.treevirtual.celleditor.NodeEditor()); // Move the focus with the mouse.  This controls the ROW focus indicator.

      this.setFocusCellOnPointerMove(true); // In a tree we don't typically want a visible cell focus indicator

      this.setShowCellFocusIndicator(false); // Get the list of pane scrollers

      var scrollers = this._getPaneScrollerArr(); // For each scroller...


      for (var i = 0; i < scrollers.length; i++) {
        // Set the pane scrollers to handle the selection before
        // displaying the focus, so we can manipulate the selected icon.
        scrollers[i].setSelectBeforeFocus(true);
      }
    },

    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */
    events: {
      /**
       * Fired when a tree branch which already has content is opened.
       *
       * Event data: the node object from the data model (of the node
       * being opened) as described in
       * {@link qx.ui.treevirtual.SimpleTreeDataModel}
       */
      treeOpenWithContent: "qx.event.type.Data",

      /**
       * Fired when an empty tree branch is opened.
       *
       * Event data: the node object from the data model (of the node
       * being opened) as described in
       * {@link qx.ui.treevirtual.SimpleTreeDataModel}
       */
      treeOpenWhileEmpty: "qx.event.type.Data",

      /**
       * Fired when a tree branch is closed.
       *
       * Event data: the node object from the data model (of the node
       * being closed) as described in
       * {@link qx.ui.treevirtual.SimpleTreeDataModel}
       */
      treeClose: "qx.event.type.Data",

      /**
       * Fired when the selected rows change.
       *
       * Event data: An array of node objects (the selected rows' nodes)
       * from the data model.  Each node object is described in
       * {@link qx.ui.treevirtual.SimpleTreeDataModel}
       */
      changeSelection: "qx.event.type.Data"
    },

    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */
    statics: {
      /**
       * Selection Modes {int}
       *
       *   NONE
       *     Nothing can ever be selected.
       *
       *   SINGLE
       *     Allow only one selected item.
       *
       *   SINGLE_INTERVAL
       *     Allow one contiguous interval of selected items.
       *
       *   MULTIPLE_INTERVAL
       *     Allow any set of selected items, whether contiguous or not.
       *
       *   MULTIPLE_INTERVAL_TOGGLE
       *     Like MULTIPLE_INTERVAL, but clicking on an item toggles its selection state.
       */
      SelectionMode: {
        NONE: qx.ui.table.selection.Model.NO_SELECTION,
        SINGLE: qx.ui.table.selection.Model.SINGLE_SELECTION,
        SINGLE_INTERVAL: qx.ui.table.selection.Model.SINGLE_INTERVAL_SELECTION,
        MULTIPLE_INTERVAL: qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION,
        MULTIPLE_INTERVAL_TOGGLE: qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION_TOGGLE
      }
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /**
       * Whether a click on the open/close button should also cause selection of
       * the row.
       */
      openCloseClickSelectsRow: {
        check: "Boolean",
        init: false
      },
      appearance: {
        refine: true,
        init: "treevirtual"
      },
      allowNodeEdit: {
        check: "Boolean",
        init: false
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      /**
       * Return the data model for this tree.
       *
       * @return {qx.ui.table.ITableModel} The data model.
       */
      getDataModel: function getDataModel() {
        return this.getTableModel();
      },

      /**
       * Set whether lines linking tree children shall be drawn on the tree.
       * Note that not all themes support tree lines.  As of the time of this
       * writing, the Classic theme supports tree lines (and uses +/- icons
       * which lend themselves to tree lines), while the Modern theme, which
       * uses right-facing and downward-facing arrows instead of +/-, does not.
       *
       * @param b {Boolean}
       *   <i>true</i> if tree lines should be shown; <i>false</i> otherwise.
       *
       */
      setUseTreeLines: function setUseTreeLines(b) {
        var dataModel = this.getDataModel();
        var treeCol = dataModel.getTreeColumn();
        var dcr = this.getTableColumnModel().getDataCellRenderer(treeCol);
        dcr.setUseTreeLines(b); // Inform the listeners

        if (dataModel.hasListener("dataChanged")) {
          var data = {
            firstRow: 0,
            lastRow: dataModel.getRowCount() - 1,
            firstColumn: 0,
            lastColumn: dataModel.getColumnCount() - 1
          };
          dataModel.fireDataEvent("dataChanged", data);
        }
      },

      /**
       * Get whether lines linking tree children shall be drawn on the tree.
       *
       * @return {Boolean}
       *   <i>true</i> if tree lines are in use;
       *   <i>false</i> otherwise.
       */
      getUseTreeLines: function getUseTreeLines() {
        var treeCol = this.getDataModel().getTreeColumn();
        var dcr = this.getTableColumnModel().getDataCellRenderer(treeCol);
        return dcr.getUseTreeLines();
      },

      /**
       * Set whether the open/close button should be displayed on a branch,
       * even if the branch has no children.
       *
       * @param b {Boolean}
       *   <i>true</i> if the open/close button should be shown;
       *   <i>false</i> otherwise.
       *
       */
      setAlwaysShowOpenCloseSymbol: function setAlwaysShowOpenCloseSymbol(b) {
        var dataModel = this.getDataModel();
        var treeCol = dataModel.getTreeColumn();
        var dcr = this.getTableColumnModel().getDataCellRenderer(treeCol);
        dcr.setAlwaysShowOpenCloseSymbol(b); // Inform the listeners

        if (dataModel.hasListener("dataChanged")) {
          var data = {
            firstRow: 0,
            lastRow: dataModel.getRowCount() - 1,
            firstColumn: 0,
            lastColumn: dataModel.getColumnCount() - 1
          };
          dataModel.fireDataEvent("dataChanged", data);
        }
      },

      /**
       * Set whether drawing of first-level tree-node lines are disabled even
       * if drawing of tree lines is enabled.
       *
       * @param b {Boolean}
       *   <i>true</i> if first-level tree lines should be disabled;
       *   <i>false</i> for normal operation.
       *
       */
      setExcludeFirstLevelTreeLines: function setExcludeFirstLevelTreeLines(b) {
        var dataModel = this.getDataModel();
        var treeCol = dataModel.getTreeColumn();
        var dcr = this.getTableColumnModel().getDataCellRenderer(treeCol);
        dcr.setExcludeFirstLevelTreeLines(b); // Inform the listeners

        if (dataModel.hasListener("dataChanged")) {
          var data = {
            firstRow: 0,
            lastRow: dataModel.getRowCount() - 1,
            firstColumn: 0,
            lastColumn: dataModel.getColumnCount() - 1
          };
          dataModel.fireDataEvent("dataChanged", data);
        }
      },

      /**
       * Get whether drawing of first-level tree lines should be disabled even
       * if drawing of tree lines is enabled.
       * (See also {@link #getUseTreeLines})
       *
       * @return {Boolean}
       *   <i>true</i> if tree lines are in use;
       *   <i>false</i> otherwise.
       */
      getExcludeFirstLevelTreeLines: function getExcludeFirstLevelTreeLines() {
        var treeCol = this.getDataModel().getTreeColumn();
        var dcr = this.getTableColumnModel().getDataCellRenderer(treeCol);
        return dcr.getExcludeFirstLevelTreeLines();
      },

      /**
       * Set whether the open/close button should be displayed on a branch,
       * even if the branch has no children.
       *
       * @return {Boolean}
       *   <i>true</i> if tree lines are in use;
       *   <i>false</i> otherwise.
       */
      getAlwaysShowOpenCloseSymbol: function getAlwaysShowOpenCloseSymbol() {
        var treeCol = this.getDataModel().getTreeColumn();
        var dcr = this.getTableColumnModel().getDataCellRenderer(treeCol);
        return dcr.getAlwaysShowOpenCloseSymbol();
      },

      /**
       * Returns the position of the open/close button for a node
       *
       * @return {Object} The position of the open/close button within the tree row
       */
      getOpenCloseButtonPosition: function getOpenCloseButtonPosition(node) {
        var treeCol = this.getDataModel().getTreeColumn();
        var dcr = this.getTableColumnModel().getDataCellRenderer(treeCol);
        var rowPos = dcr.getOpenCloseButtonPosition(this, node); // Get the order of the columns

        var tcm = this.getTableColumnModel();

        var columnPositions = tcm._getColToXPosMap(); // Calculate the position of the beginning of the tree column


        var left = qx.bom.element.Location.getLeft(this.getContentElement().getDomElement());

        for (var i = 0; i < columnPositions[treeCol].visX; i++) {
          left += tcm.getColumnWidth(columnPositions[i].visX);
        }

        rowPos.left += left;
        return rowPos;
      },

      /**
       * Set the selection mode.
       *
       * @param mode {Integer}
       *   The selection mode to be used.  It may be any of:
       *     <pre>
       *       qx.ui.treevirtual.TreeVirtual.SelectionMode.NONE:
       *          Nothing can ever be selected.
       *
       *       qx.ui.treevirtual.TreeVirtual.SelectionMode.SINGLE
       *          Allow only one selected item.
       *
       *       qx.ui.treevirtual.TreeVirtual.SelectionMode.SINGLE_INTERVAL
       *          Allow one contiguous interval of selected items.
       *
       *       qx.ui.treevirtual.TreeVirtual.SelectionMode.MULTIPLE_INTERVAL
       *          Allow any selected items, whether contiguous or not.
       *     </pre>
       *
       */
      setSelectionMode: function setSelectionMode(mode) {
        this.getSelectionModel().setSelectionMode(mode);
      },

      /**
       * Get the selection mode currently in use.
       *
       * @return {Integer}
       *   One of the values documented in {@link #setSelectionMode}
       */
      getSelectionMode: function getSelectionMode() {
        return this.getSelectionModel().getSelectionMode();
      },

      /**
       * Obtain the entire hierarchy of labels from the root down to the
       * specified node.
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the hierarchy is desired.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.)
       *
       * @return {Array}
       *   The returned array contains one string for each label in the
       *   hierarchy of the node specified by the parameter.  Element 0 of the
       *   array contains the label of the root node, element 1 contains the
       *   label of the node immediately below root in the specified node's
       *   hierarchy, etc., down to the last element in the array contain the
       *   label of the node referenced by the parameter.
       */
      getHierarchy: function getHierarchy(nodeReference) {
        var _this = this;

        var components = [];
        var node;
        var nodeId;

        if (_typeof(nodeReference) == "object") {
          node = nodeReference;
          nodeId = node.nodeId;
        } else if (typeof nodeReference == "number") {
          nodeId = nodeReference;
        } else {
          throw new Error("Expected node object or node id");
        }

        function addHierarchy(nodeId) {
          // If we're at the root...
          if (!nodeId) {
            // ... then we're done
            return;
          } // Get the requested node


          var node = _this.getDataModel().getData()[nodeId]; // Add its label to the hierarchy components


          components.unshift(node.label); // Call recursively to our parent node.

          addHierarchy(node.parentNodeId);
        }

        addHierarchy(nodeId);
        return components;
      },

      /**
       * Return the nodes that are currently selected.
       *
       * @return {Array}
       *   An array containing the nodes that are currently selected.
       */
      getSelectedNodes: function getSelectedNodes() {
        return this.getDataModel().getSelectedNodes();
      },

      /**
       * Event handler. Called when a key was pressed.
       *
       * We handle the Enter key to toggle opened/closed tree state.  All
       * other keydown events are passed to our superclass.
       *
       * @param evt {Map}
       *   The event.
       *
       */
      _onKeyDown: function _onKeyDown(evt) {
        if (!this.getEnabled()) {
          return;
        }

        var identifier = evt.getKeyIdentifier();
        var consumed = false;
        var modifiers = evt.getModifiers();

        if (modifiers == 0) {
          switch (identifier) {
            case "Enter":
              // Get the data model
              var dm = this.getDataModel();
              var focusedCol = this.getFocusedColumn();
              var treeCol = dm.getTreeColumn();

              if (focusedCol == treeCol) {
                // Get the focused node
                var focusedRow = this.getFocusedRow();
                var node = dm.getNode(focusedRow);

                if (!node.bHideOpenClose && node.type != qx.ui.treevirtual.SimpleTreeDataModel.Type.LEAF) {
                  dm.setState(node, {
                    bOpened: !node.bOpened
                  });
                }

                consumed = true;
              }

              break;

            case "Left":
              this.moveFocusedCell(-1, 0);
              break;

            case "Right":
              this.moveFocusedCell(1, 0);
              break;
          }
        } else if (modifiers == qx.event.type.Dom.CTRL_MASK) {
          switch (identifier) {
            case "Left":
              // Get the data model
              var dm = this.getDataModel(); // Get the focused node

              var focusedRow = this.getFocusedRow();
              var treeCol = dm.getTreeColumn();
              var node = dm.getNode(focusedRow); // If it's an open branch and open/close is allowed...

              if (node.type == qx.ui.treevirtual.SimpleTreeDataModel.Type.BRANCH && !node.bHideOpenClose && node.bOpened) {
                // ... then close it
                dm.setState(node, {
                  bOpened: !node.bOpened
                });
              } // Reset the focus to the current node


              this.setFocusedCell(treeCol, focusedRow, true);
              consumed = true;
              break;

            case "Right":
              // Get the data model
              var dm = this.getDataModel(); // Get the focused node

              focusedRow = this.getFocusedRow();
              treeCol = dm.getTreeColumn();
              node = dm.getNode(focusedRow); // If it's a closed branch and open/close is allowed...

              if (node.type == qx.ui.treevirtual.SimpleTreeDataModel.Type.BRANCH && !node.bHideOpenClose && !node.bOpened) {
                // ... then open it
                dm.setState(node, {
                  bOpened: !node.bOpened
                });
              } // Reset the focus to the current node


              this.setFocusedCell(treeCol, focusedRow, true);
              consumed = true;
              break;
          }
        } else if (modifiers == qx.event.type.Dom.SHIFT_MASK) {
          switch (identifier) {
            case "Left":
              // Get the data model
              var dm = this.getDataModel(); // Get the focused node

              var focusedRow = this.getFocusedRow();
              var treeCol = dm.getTreeColumn();
              var node = dm.getNode(focusedRow); // If we're not at the top-level already...

              if (node.parentNodeId) {
                // Find out what rendered row our parent node is at
                var rowIndex = dm.getRowFromNodeId(node.parentNodeId); // Set the focus to our parent

                this.setFocusedCell(this._focusedCol, rowIndex, true);
              }

              consumed = true;
              break;

            case "Right":
              // Get the data model
              var dm = this.getDataModel(); // Get the focused node

              focusedRow = this.getFocusedRow();
              treeCol = dm.getTreeColumn();
              node = dm.getNode(focusedRow); // If we're on a branch and open/close is allowed...

              if (node.type == qx.ui.treevirtual.SimpleTreeDataModel.Type.BRANCH && !node.bHideOpenClose) {
                // ... then first ensure the branch is open
                if (!node.bOpened) {
                  dm.setState(node, {
                    bOpened: !node.bOpened
                  });
                } // If this node has children...


                if (node.children.length > 0) {
                  // ... then move the focus to the first child
                  this.moveFocusedCell(0, 1);
                }
              }

              consumed = true;
              break;
          }
        } // Was this one of our events that we handled?


        if (consumed) {
          // Yup.  Don't propagate it.
          evt.preventDefault();
          evt.stopPropagation();
        } else {
          // It's not one of ours.  Let our superclass handle this event
          qx.ui.treevirtual.TreeVirtual.superclass.prototype._onKeyDown.call(this, evt);
        }
      },

      /**
       * Event handler. Called when the selection has changed.
       *
       * @param evt {Map}
       *   The event.
       *
       */
      _onSelectionChanged: function _onSelectionChanged(evt) {
        // Clear the old list of selected nodes
        this.getDataModel()._clearSelections(); // If selections are allowed, pass an event to our listeners


        if (this.getSelectionMode() != qx.ui.treevirtual.TreeVirtual.SelectionMode.NONE) {
          var selectedNodes = this._calculateSelectedNodes(); // Get the now-focused


          this.fireDataEvent("changeSelection", selectedNodes);
        } // Call the superclass method


        qx.ui.treevirtual.TreeVirtual.superclass.prototype._onSelectionChanged.call(this, evt);
      },

      /**
       * Calculate and return the set of nodes which are currently selected by
       * the user, on the screen.  In the process of calculating which nodes
       * are selected, the nodes corresponding to the selected rows on the
       * screen are marked as selected by setting their <i>bSelected</i>
       * property to true, and all previously-selected nodes have their
       * <i>bSelected</i> property reset to false.
       *
       * @return {Array}
       *   An array of nodes matching the set of rows which are selected on the
       *   screen.
       */
      _calculateSelectedNodes: function _calculateSelectedNodes() {
        // Create an array of nodes that are now selected
        var stdcm = this.getDataModel();
        var selectedRanges = this.getSelectionModel().getSelectedRanges();
        var selectedNodes = [];
        var node;

        for (var i = 0; i < selectedRanges.length; i++) {
          for (var j = selectedRanges[i].minIndex; j <= selectedRanges[i].maxIndex; j++) {
            node = stdcm.getNode(j);
            stdcm.setState(node, {
              bSelected: true
            });
            selectedNodes.push(node);
          }
        }

        return selectedNodes;
      },

      /**
       * Set the overflow mode.
       *
       * @param s {String}
       *   Overflow mode.  The only allowable mode is "hidden".
       *
       *
       * @throws {Error}
       *   Error if tree overflow mode is other than "hidden"
       */
      setOverflow: function setOverflow(s) {
        if (s != "hidden") {
          throw new Error("Tree overflow must be hidden.  The internal elements of it will scroll.");
        }
      }
    }
  });
  qx.ui.treevirtual.TreeVirtual.$$dbClassInfo = $$dbClassInfo;
})();

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2007 Derrell Lipman
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Derrell Lipman (derrell)
  
  ************************************************************************ */

  /**
   * Utility functions for working with nodes.  These methods allow reference
   * to a node by either the object itself or the object's node id.
   */
  qx.Mixin.define("qx.ui.treevirtual.MNode", {
    members: {
      /**
       * Get a node object given its node id.
       *
       * @param nodeReference {Object | Integer}
       *   The node to have its opened/closed state toggled.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.).
       *
       * @return {Object}
       *   If the nodeReference is a node object itself, that same node object
       *   is returned (identity).  Otherwise, the node object is looked up
       *   using the specified node id.
       */
      nodeGet: function nodeGet(nodeReference) {
        if (_typeof(nodeReference) == "object") {
          return nodeReference;
        } else if (typeof nodeReference == "number") {
          return this.getTableModel().getData()[nodeReference];
        } else {
          throw new Error("Expected node object or node id");
        }
      },

      /**
       * Toggle the opened state of the node: if the node is opened, close
       * it; if it is closed, open it.
       *
       * @param nodeReference {Object | Integer}
       *   The node to have its opened/closed state toggled.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.)
       *
       */
      nodeToggleOpened: function nodeToggleOpened(nodeReference) {
        var node;
        var nodeId;

        if (_typeof(nodeReference) == "object") {
          node = nodeReference;
          nodeId = node.nodeId;
        } else if (typeof nodeReference == "number") {
          nodeId = nodeReference;
          node = this.getTableModel().getData()[nodeId];
        } else {
          throw new Error("Expected node object or node id");
        }

        this.getTableModel().setState(nodeId, {
          bOpened: !node.bOpened
        });
      },

      /**
       * Set state attributes of a tree node.
       *
       * @param nodeReference {Object | Integer}
       *   The node for which attributes are being set.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.)
       *
       * @param attributes {Map}
       *   Map with the node properties to be set.  The map may contain any of
       *   the properties described in
       *   {@link qx.ui.treevirtual.SimpleTreeDataModel}
       *
       */
      nodeSetState: function nodeSetState(nodeReference, attributes) {
        var nodeId;

        if (_typeof(nodeReference) == "object") {
          nodeId = nodeReference.nodeId;
        } else if (typeof nodeReference == "number") {
          nodeId = nodeReference;
        } else {
          throw new Error("Expected node object or node id");
        }

        this.getTableModel().setState(nodeId, attributes);
      },

      /**
       * Set the label for a node.
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the label is being set.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.)
       *
       * @param label {String}
       *   The new label for the specified node
       *
       */
      nodeSetLabel: function nodeSetLabel(nodeReference, label) {
        this.nodeSetState(nodeReference, {
          label: label
        });
      },

      /**
       * Get the label for a node.
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the label is being retrieved.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.)
       *
       * @return {String}
       *   The label for the specified node
       */
      nodeGetLabel: function nodeGetLabel(nodeReference) {
        var node = this.nodeGet(nodeReference);
        return node.label;
      },

      /**
       * Set the selected state for a node.
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the selected state is being set.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.)
       *
       * @param b {Boolean}
       *   The new selected state for the specified node.
       *
       */
      nodeSetSelected: function nodeSetSelected(nodeReference, b) {
        this.nodeSetState(nodeReference, {
          bSelected: b
        });
      },

      /**
       * Get the selected state for a node.
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the selected state is being retrieved.  The node
       *   can be represented either by the node object, or the node id (as
       *   would have been returned by addBranch(), addLeaf(), etc.)
       *
       * @return {Boolean}
       *   The selected state for the specified node.
       */
      nodeGetSelected: function nodeGetSelected(nodeReference) {
        var node = this.nodeGet(nodeReference);
        return node.bSelected;
      },

      /**
       * Opens all nodes in the tree with minimal redraw
       */
      nodeOpenAll: function nodeOpenAll() {
        var model = this.getTableModel();
        model.getData().forEach(function (node) {
          if (node) {
            model.setState(node.nodeId, {
              bOpened: true
            }, true);
          }
        });
        model.setData();
      },

      /**
       * Closes all nodes in the tree with minimal redraw
       */
      nodeCloseAll: function nodeCloseAll() {
        var model = this.getTableModel();
        model.getData().forEach(function (node) {
          if (node) {
            model.setState(node.nodeId, {
              bOpened: false
            }, true);
          }
        });
        model.setData();
      },

      /**
       * Internal call to set the opened state for a node. (Note that this method has no effect
       * if the requested state is the same as the current state.)
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the opened state is being set.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.)
       *
       * @param opened {Boolean}
       *   The new opened state for the specified node.
       *
       * @param cascade {Boolean}
       *   Whether to descend the tree changing opened state of all children
       *
       * @param isRecursed {Boolean?}
       *   For internal use when cascading to determine outer level and call setData
       */
      _nodeSetOpenedInternal: function _nodeSetOpenedInternal(nodeReference, opened, cascade, isRecursed) {
        var _this = this;

        var node;

        if (_typeof(nodeReference) == "object") {
          node = nodeReference;
        } else if (typeof nodeReference == "number") {
          node = this.getTableModel().getData()[nodeReference];
        } else {
          throw new Error("Expected node object or node id");
        } // Only set new state if not already in the requested state, since
        // setting new state involves dispatching events.


        if (opened != node.bOpened) {
          this.getTableModel().setState(node.nodeId, {
            bOpened: opened
          }, true);
        }

        if (cascade) {
          node.children.forEach(function (child) {
            return _this.nodeSetOpened(child, opened, cascade, true);
          });
        }

        if (!cascade || !isRecursed) {
          this.getTableModel().setData();
        }
      },

      /**
       * Set the opened state for a node.  (Note that this method has no effect
       * if the requested state is the same as the current state.)
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the opened state is being set.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.)
       *
       * @param opened {Boolean}
       *   The new opened state for the specified node.
       *
       * @param cascade {Boolean}
       *   Whether to descend the tree changing opened state of all children
       */
      nodeSetOpened: function nodeSetOpened(nodeReference, opened, cascade) {
        this._nodeSetOpenedInternal(nodeReference, opened, cascade, false);
      },

      /**
       * Get the opened state for a node.
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the opened state is being retrieved.  The node can
       *   be represented either by the node object, or the node id (as would
       *   have been returned by addBranch(), addLeaf(), etc.)
       *
       * @return {Boolean}
       *   The opened state for the specified node.
       */
      nodeGetOpened: function nodeGetOpened(nodeReference) {
        var node = this.nodeGet(nodeReference);
        return node.bOpened;
      },

      /**
       * Set the hideOpenClose state for a node.
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the hideOpenClose state is being set.  The node
       *   can be represented either by the node object, or the node id (as
       *   would have been returned by addBranch(), addLeaf(), etc.)
       *
       * @param b {Boolean}
       *   The new hideOpenClose state for the specified node.
       *
       */
      nodeSetHideOpenClose: function nodeSetHideOpenClose(nodeReference, b) {
        this.nodeSetState(nodeReference, {
          bHideOpenClose: b
        });
      },

      /**
       * Get the hideOpenClose state for a node.
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the hideOpenClose state is being retrieved.  The
       *   node can be represented either by the node object, or the node id (as
       *   would have been returned by addBranch(), addLeaf(), etc.)
       *
       * @return {Boolean}
       *   The new hideOpenClose state for the specified node.
       */
      nodeGetHideOpenClose: function nodeGetHideOpenClose(nodeReference) {
        var node = this.nodeGet(nodeReference);
        return node.bHideOpenClose;
      },

      /**
       * Set the icon for a node when in its unselected (normal) state.
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the icon is being set.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.)
       *
       * @param path {String}
       *   The path to the icon to be used when the node is not selected
       *
       */
      nodeSetIcon: function nodeSetIcon(nodeReference, path) {
        this.nodeSetState(nodeReference, {
          icon: path
        });
      },

      /**
       * Get the icon for a node when in its unselected (normal) state.
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the icon is being retrieved.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.)
       *
       * @return {String}
       *   The path to the icon to be used when the node is not selected, if a
       *   path has been previously provided (i.e. not using the default icon).
       */
      nodeGetIcon: function nodeGetIcon(nodeReference) {
        var node = this.nodeGet(nodeReference);
        return node.icon;
      },

      /**
       * Set the icon for a node when in its selected state.
       * <p>
       * NOTE: As of 13 Mar 2009, this feature is disabled by default, by
       *       virtue of the fact that the tree's "alwaysUpdateCells" property
       *       has a setting of 'false' now instead of 'true'. Setting this
       *       property to true allows the icon to change upon selection, but
       *       causes problems such as single clicks not always selecting a
       *       row, and, in IE, double click operations failing
       *       completely. (For more information, see bugs 605 and 2021.) To
       *       re-enable the option to have an unique icon that is displayed
       *       when the node is selected, issue
       *       <code>tree.setAlwaysUpdateCells(true);</code>
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the icon is being set.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.)
       *
       * @param path {String}
       *   The path to the icon to be used when the node is selected
       *
       */
      nodeSetSelectedIcon: function nodeSetSelectedIcon(nodeReference, path) {
        this.nodeSetState(nodeReference, {
          iconSelected: path
        });
      },

      /**
       * Get the icon for a node when in its selected state.
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the icon is being retrieved.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.)
       *
       * @return {String}
       *   The path to the icon to be used when the node is selected, if a path
       *   has been previously provided (i.e. not using the default icon).
       */
      nodeGetSelectedIcon: function nodeGetSelectedIcon(nodeReference) {
        var node = this.nodeGet(nodeReference);
        return node.iconSelected;
      },

      /**
       * Set the cell style for a node
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the cell style is being set.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.)
       *
       * @param style {String}
       *   The CSS style to be applied for the tree column cell for this node,
       *   if a style has been previously provided (i.e. not using the default
       *   style).
       *
       */
      nodeSetCellStyle: function nodeSetCellStyle(nodeReference, style) {
        this.nodeSetState(nodeReference, {
          cellStyle: style
        });
      },

      /**
       * Get the cell style for a node
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the cell style is being retrieved.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.)
       *
       * @return {String}
       *   The CSS style being applied for the tree column cell for this node.
       */
      nodeGetCellStyle: function nodeGetCellStyle(nodeReference) {
        var node = this.nodeGet(nodeReference);
        return node.cellStyle;
      },

      /**
       * Set the label style for a node
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the label style is being set.  The node can be
       *   represented either by the node object, or the node id (as would have
       *   been returned by addBranch(), addLeaf(), etc.)
       *
       * @param style {String}
       *   The CSS style to be applied for the label for this node.
       *
       */
      nodeSetLabelStyle: function nodeSetLabelStyle(nodeReference, style) {
        this.nodeSetState(nodeReference, {
          labelStyle: style
        });
      },

      /**
       * Get the label style for a node
       *
       * @param nodeReference {Object | Integer}
       *   The node for which the label style is being retrieved.  The node can
       *   be represented either by the node object, or the node id (as would
       *   have been returned by addBranch(), addLeaf(), etc.)
       *
       * @return {String}
       *   The CSS style being applied for the label for this node, if a style
       *   has been previously provided (i.e. not using the default style).
       */
      nodeGetLabelStyle: function nodeGetLabelStyle(nodeReference) {
        var node = this.nodeGet(nodeReference);
        return node.cellStyle;
      }
    }
  });
  qx.ui.treevirtual.MNode.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This mixin redirects all children handling methods to a child widget of the
   * including class. This is e.g. used in {@link qx.ui.window.Window} to add
   * child widgets directly to the window pane.
   *
   * The including class must implement the method <code>getChildrenContainer</code>,
   * which has to return the widget, to which the child widgets should be added.
   */
  qx.Mixin.define("qx.ui.core.MRemoteChildrenHandling", {
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      /**
       * Forward the call with the given function name to the children container
       *
       * @param functionName {String} name of the method to forward
       * @param a1 {var?} first argument of the method to call
       * @param a2 {var?} second argument of the method to call
       * @param a3 {var?} third argument of the method to call
       * @return {var} The return value of the forward method
       */
      __forward__P_186_0: function __forward__P_186_0(functionName, a1, a2, a3) {
        var container = this.getChildrenContainer();

        if (container === this) {
          functionName = "_" + functionName;
        }

        return container[functionName](a1, a2, a3);
      },

      /**
       * Returns the children list
       *
       * @return {qx.ui.core.LayoutItem[]} The children array (Arrays are
       *   reference types, please do not modify them in-place)
       */
      getChildren: function getChildren() {
        return this.__forward__P_186_0("getChildren");
      },

      /**
       * Whether the widget contains children.
       *
       * @return {Boolean} Returns <code>true</code> when the widget has children.
       */
      hasChildren: function hasChildren() {
        return this.__forward__P_186_0("hasChildren");
      },

      /**
       * Adds a new child widget.
       *
       * The supported keys of the layout options map depend on the layout manager
       * used to position the widget. The options are documented in the class
       * documentation of each layout manager {@link qx.ui.layout}.
       *
       * @param child {qx.ui.core.LayoutItem} the item to add.
       * @param options {Map?null} Optional layout data for item.
       * @return {qx.ui.core.Widget} This object (for chaining support)
       */
      add: function add(child, options) {
        return this.__forward__P_186_0("add", child, options);
      },

      /**
       * Remove the given child item.
       *
       * @param child {qx.ui.core.LayoutItem} the item to remove
       * @return {qx.ui.core.Widget} This object (for chaining support)
       */
      remove: function remove(child) {
        return this.__forward__P_186_0("remove", child);
      },

      /**
       * Remove all children.
       * @return {Array} An array containing the removed children.
       */
      removeAll: function removeAll() {
        return this.__forward__P_186_0("removeAll");
      },

      /**
       * Returns the index position of the given item if it is
       * a child item. Otherwise it returns <code>-1</code>.
       *
       * This method works on the widget's children list. Some layout managers
       * (e.g. {@link qx.ui.layout.HBox}) use the children order as additional
       * layout information. Other layout manager (e.g. {@link qx.ui.layout.Grid})
       * ignore the children order for the layout process.
       *
       * @param child {qx.ui.core.LayoutItem} the item to query for
       * @return {Integer} The index position or <code>-1</code> when
       *   the given item is no child of this layout.
       */
      indexOf: function indexOf(child) {
        return this.__forward__P_186_0("indexOf", child);
      },

      /**
       * Add a child at the specified index
       *
       * This method works on the widget's children list. Some layout managers
       * (e.g. {@link qx.ui.layout.HBox}) use the children order as additional
       * layout information. Other layout manager (e.g. {@link qx.ui.layout.Grid})
       * ignore the children order for the layout process.
       *
       * @param child {qx.ui.core.LayoutItem} item to add
       * @param index {Integer} Index, at which the item will be inserted
       * @param options {Map?null} Optional layout data for item.
       */
      addAt: function addAt(child, index, options) {
        this.__forward__P_186_0("addAt", child, index, options);
      },

      /**
       * Add an item before another already inserted item
       *
       * This method works on the widget's children list. Some layout managers
       * (e.g. {@link qx.ui.layout.HBox}) use the children order as additional
       * layout information. Other layout manager (e.g. {@link qx.ui.layout.Grid})
       * ignore the children order for the layout process.
       *
       * @param child {qx.ui.core.LayoutItem} item to add
       * @param before {qx.ui.core.LayoutItem} item before the new item will be inserted.
       * @param options {Map?null} Optional layout data for item.
       */
      addBefore: function addBefore(child, before, options) {
        this.__forward__P_186_0("addBefore", child, before, options);
      },

      /**
       * Add an item after another already inserted item
       *
       * This method works on the widget's children list. Some layout managers
       * (e.g. {@link qx.ui.layout.HBox}) use the children order as additional
       * layout information. Other layout manager (e.g. {@link qx.ui.layout.Grid})
       * ignore the children order for the layout process.
       *
       * @param child {qx.ui.core.LayoutItem} item to add
       * @param after {qx.ui.core.LayoutItem} item, after which the new item will be inserted
       * @param options {Map?null} Optional layout data for item.
       */
      addAfter: function addAfter(child, after, options) {
        this.__forward__P_186_0("addAfter", child, after, options);
      },

      /**
       * Remove the item at the specified index.
       *
       * This method works on the widget's children list. Some layout managers
       * (e.g. {@link qx.ui.layout.HBox}) use the children order as additional
       * layout information. Other layout manager (e.g. {@link qx.ui.layout.Grid})
       * ignore the children order for the layout process.
       *
       * @param index {Integer} Index of the item to remove.
       * @return {qx.ui.core.LayoutItem} The removed item
       */
      removeAt: function removeAt(index) {
        return this.__forward__P_186_0("removeAt", index);
      }
    }
  });
  qx.ui.core.MRemoteChildrenHandling.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This mixin redirects the layout manager to a child widget of the
   * including class. This is e.g. used in {@link qx.ui.window.Window} to configure
   * the layout manager of the window pane instead of the window directly.
   *
   * The including class must implement the method <code>getChildrenContainer</code>,
   * which has to return the widget, to which the layout should be set.
   */
  qx.Mixin.define("qx.ui.core.MRemoteLayoutHandling", {
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      /**
       * Set a layout manager for the widget. A a layout manager can only be connected
       * with one widget. Reset the connection with a previous widget first, if you
       * like to use it in another widget instead.
       *
       * @param layout {qx.ui.layout.Abstract} The new layout or
       *     <code>null</code> to reset the layout.
       */
      setLayout: function setLayout(layout) {
        this.getChildrenContainer().setLayout(layout);
      },

      /**
       * Get the widget's layout manager.
       *
       * @return {qx.ui.layout.Abstract} The widget's layout manager
       */
      getLayout: function getLayout() {
        return this.getChildrenContainer().getLayout();
      }
    }
  });
  qx.ui.core.MRemoteLayoutHandling.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This mixin defines the <code>contentPadding</code> property, which is used
   * by widgets like the window or group box, which must have a property, which
   * defines the padding of an inner pane.
   *
   * The including class must implement the method
   * <code>_getContentPaddingTarget</code>, which must return the widget on which
   * the padding should be applied.
   */
  qx.Mixin.define("qx.ui.core.MContentPadding", {
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /** Top padding of the content pane */
      contentPaddingTop: {
        check: "Integer",
        init: 0,
        apply: "_applyContentPadding",
        themeable: true
      },

      /** Right padding of the content pane */
      contentPaddingRight: {
        check: "Integer",
        init: 0,
        apply: "_applyContentPadding",
        themeable: true
      },

      /** Bottom padding of the content pane */
      contentPaddingBottom: {
        check: "Integer",
        init: 0,
        apply: "_applyContentPadding",
        themeable: true
      },

      /** Left padding of the content pane */
      contentPaddingLeft: {
        check: "Integer",
        init: 0,
        apply: "_applyContentPadding",
        themeable: true
      },

      /**
       * The 'contentPadding' property is a shorthand property for setting 'contentPaddingTop',
       * 'contentPaddingRight', 'contentPaddingBottom' and 'contentPaddingLeft'
       * at the same time.
       *
       * If four values are specified they apply to top, right, bottom and left respectively.
       * If there is only one value, it applies to all sides, if there are two or three,
       * the missing values are taken from the opposite side.
       */
      contentPadding: {
        group: ["contentPaddingTop", "contentPaddingRight", "contentPaddingBottom", "contentPaddingLeft"],
        mode: "shorthand",
        themeable: true
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    /* eslint-disable @qooxdoo/qx/no-refs-in-members */
    members: {
      /**
       * @type {Map} Maps property names of content padding to the setter of the padding
       *
       * @lint ignoreReferenceField(__contentPaddingSetter)
       */
      __contentPaddingSetter__P_191_0: {
        contentPaddingTop: "setPaddingTop",
        contentPaddingRight: "setPaddingRight",
        contentPaddingBottom: "setPaddingBottom",
        contentPaddingLeft: "setPaddingLeft"
      },

      /**
       * @type {Map} Maps property names of content padding to the themed setter of the padding
       *
       * @lint ignoreReferenceField(__contentPaddingThemedSetter)
       */
      __contentPaddingThemedSetter__P_191_1: {
        contentPaddingTop: "setThemedPaddingTop",
        contentPaddingRight: "setThemedPaddingRight",
        contentPaddingBottom: "setThemedPaddingBottom",
        contentPaddingLeft: "setThemedPaddingLeft"
      },

      /**
       * @type {Map} Maps property names of content padding to the resetter of the padding
       *
       * @lint ignoreReferenceField(__contentPaddingResetter)
       */
      __contentPaddingResetter__P_191_2: {
        contentPaddingTop: "resetPaddingTop",
        contentPaddingRight: "resetPaddingRight",
        contentPaddingBottom: "resetPaddingBottom",
        contentPaddingLeft: "resetPaddingLeft"
      },
      // property apply
      _applyContentPadding: function _applyContentPadding(value, old, name, variant) {
        var target = this._getContentPaddingTarget();

        if (value == null) {
          var resetter = this.__contentPaddingResetter__P_191_2[name];
          target[resetter]();
        } else {
          // forward the themed sates if case the apply was invoked by a theme
          if (variant == "setThemed" || variant == "resetThemed") {
            var setter = this.__contentPaddingThemedSetter__P_191_1[name];
            target[setter](value);
          } else {
            var setter = this.__contentPaddingSetter__P_191_0[name];
            target[setter](value);
          }
        }
      }
    }
  });
  qx.ui.core.MContentPadding.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.locale.Manager": {
        "construct": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.dynlocale": {
          "load": true
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Mixin handling the valid and required properties for the form widgets.
   */
  qx.Mixin.define("qx.ui.form.MForm", {
    construct: function construct() {
      {
        qx.locale.Manager.getInstance().addListener("changeLocale", this.__onChangeLocale__P_200_0, this);
      }
    },
    properties: {
      /**
       * Flag signaling if a widget is valid. If a widget is invalid, an invalid
       * state will be set.
       */
      valid: {
        check: "Boolean",
        init: true,
        apply: "_applyValid",
        event: "changeValid"
      },

      /**
       * Flag signaling if a widget is required.
       */
      required: {
        check: "Boolean",
        init: false,
        event: "changeRequired"
      },

      /**
       * Message which is shown in an invalid tooltip.
       */
      invalidMessage: {
        check: "String",
        init: "",
        event: "changeInvalidMessage"
      },

      /**
       * Message which is shown in an invalid tooltip if the {@link #required} is
       * set to true.
       */
      requiredInvalidMessage: {
        check: "String",
        nullable: true,
        event: "changeInvalidMessage"
      }
    },
    members: {
      // apply method
      _applyValid: function _applyValid(value, old) {
        value ? this.removeState("invalid") : this.addState("invalid");
      },

      /**
       * Locale change event handler
       *
       * @signature function(e)
       * @param e {Event} the change event
       */
      __onChangeLocale__P_200_0: qx.core.Environment.select("qx.dynlocale", {
        "true": function _true(e) {
          // invalid message
          var invalidMessage = this.getInvalidMessage();

          if (invalidMessage && invalidMessage.translate) {
            this.setInvalidMessage(invalidMessage.translate());
          } // required invalid message


          var requiredInvalidMessage = this.getRequiredInvalidMessage();

          if (requiredInvalidMessage && requiredInvalidMessage.translate) {
            this.setRequiredInvalidMessage(requiredInvalidMessage.translate());
          }
        },
        "false": null
      })
    },
    destruct: function destruct() {
      {
        qx.locale.Manager.getInstance().removeListener("changeLocale", this.__onChangeLocale__P_200_0, this);
      }
    }
  });
  qx.ui.form.MForm.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Interface": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Form interface for all form widgets. It includes the API for enabled,
   * required and valid states.
   */
  qx.Interface.define("qx.ui.form.IForm", {
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */
    events: {
      /** Fired when the enabled state was modified */
      changeEnabled: "qx.event.type.Data",

      /** Fired when the valid state was modified */
      changeValid: "qx.event.type.Data",

      /** Fired when the invalidMessage was modified */
      changeInvalidMessage: "qx.event.type.Data",

      /** Fired when the required was modified */
      changeRequired: "qx.event.type.Data"
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      /*
      ---------------------------------------------------------------------------
        ENABLED PROPERTY
      ---------------------------------------------------------------------------
      */

      /**
       * Set the enabled state of the widget.
       *
       * @param enabled {Boolean} The enabled state.
       */
      setEnabled: function setEnabled(enabled) {
        return arguments.length == 1;
      },

      /**
       * Return the current set enabled state.
       *
       * @return {Boolean} If the widget is enabled.
       */
      getEnabled: function getEnabled() {},

      /*
      ---------------------------------------------------------------------------
        REQUIRED PROPERTY
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the required state of a widget.
       *
       * @param required {Boolean} A flag signaling if the widget is required.
       */
      setRequired: function setRequired(required) {
        return arguments.length == 1;
      },

      /**
       * Return the current required state of the widget.
       *
       * @return {Boolean} True, if the widget is required.
       */
      getRequired: function getRequired() {},

      /*
      ---------------------------------------------------------------------------
        VALID PROPERTY
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the valid state of the widget.
       *
       * @param valid {Boolean} The valid state of the widget.
       */
      setValid: function setValid(valid) {
        return arguments.length == 1;
      },

      /**
       * Returns the valid state of the widget.
       *
       * @return {Boolean} If the state of the widget is valid.
       */
      getValid: function getValid() {},

      /*
      ---------------------------------------------------------------------------
        INVALID MESSAGE PROPERTY
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the invalid message of the widget.
       *
       * @param message {String} The invalid message.
       */
      setInvalidMessage: function setInvalidMessage(message) {
        return arguments.length == 1;
      },

      /**
       * Returns the invalid message of the widget.
       *
       * @return {String} The current set message.
       */
      getInvalidMessage: function getInvalidMessage() {},

      /*
      ---------------------------------------------------------------------------
        REQUIRED INVALID MESSAGE PROPERTY
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the invalid message if required of the widget.
       *
       * @param message {String} The invalid message.
       */
      setRequiredInvalidMessage: function setRequiredInvalidMessage(message) {
        return arguments.length == 1;
      },

      /**
       * Returns the invalid message if required of the widget.
       *
       * @return {String} The current set message.
       */
      getRequiredInvalidMessage: function getRequiredInvalidMessage() {}
    }
  });
  qx.ui.form.IForm.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.MRemoteChildrenHandling": {
        "require": true
      },
      "qx.ui.core.MRemoteLayoutHandling": {
        "require": true
      },
      "qx.ui.core.MContentPadding": {
        "require": true
      },
      "qx.ui.form.MForm": {
        "require": true
      },
      "qx.ui.form.IForm": {
        "require": true
      },
      "qx.ui.layout.Canvas": {
        "construct": true
      },
      "qx.ui.container.Composite": {},
      "qx.ui.basic.Atom": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
       * Martin Wittemann (martinwittemann)
       * Jonathan Weiß (jonathan_rass)
  
  ************************************************************************ */

  /**
   * Group boxes are used to group a set of form elements.
   *
   * @childControl frame {qx.ui.container.Composite} frame for the content widgets
   * @childControl legend {qx.ui.basic.Atom} legend to show at top of the groupbox
   */
  qx.Class.define("qx.ui.groupbox.GroupBox", {
    extend: qx.ui.core.Widget,
    include: [qx.ui.core.MRemoteChildrenHandling, qx.ui.core.MRemoteLayoutHandling, qx.ui.core.MContentPadding, qx.ui.form.MForm],
    implement: [qx.ui.form.IForm],

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param legend {String?""} The group boxes legend
     * @param icon {String?""} The icon of the legend
     */
    construct: function construct(legend, icon) {
      qx.ui.core.Widget.constructor.call(this);

      this._setLayout(new qx.ui.layout.Canvas()); // Sub widgets


      this._createChildControl("frame");

      this._createChildControl("legend"); // Processing parameters


      if (legend != null) {
        this.setLegend(legend);
      }

      if (icon != null) {
        this.setIcon(icon);
      }
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "groupbox"
      },

      /**
       * Label of the legend sub widget. Set if the given string is
       * valid. Otherwise the legend sub widget is not being displayed.
       */
      legend: {
        check: "String",
        apply: "_applyLegend",
        event: "changeLegend",
        nullable: true
      },

      /**
       * Property for setting the position of the legend.
       */
      legendPosition: {
        check: ["top", "middle"],
        init: "middle",
        apply: "_applyLegendPosition",
        themeable: true
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    /* eslint-disable @qooxdoo/qx/no-refs-in-members */
    members: {
      // overridden

      /**
       * @lint ignoreReferenceField(_forwardStates)
       */
      _forwardStates: {
        invalid: true
      },
      // overridden
      _createChildControlImpl: function _createChildControlImpl(id, hash) {
        var control;

        switch (id) {
          case "frame":
            control = new qx.ui.container.Composite();

            this._add(control, {
              left: 0,
              top: 6,
              right: 0,
              bottom: 0
            });

            break;

          case "legend":
            control = new qx.ui.basic.Atom();
            control.addListener("resize", this._repositionFrame, this);

            this._add(control, {
              left: 0,
              right: 0
            });

            break;
        }

        return control || qx.ui.groupbox.GroupBox.superclass.prototype._createChildControlImpl.call(this, id);
      },

      /**
       * Returns the element, to which the content padding should be applied.
       *
       * @return {qx.ui.core.Widget} The content padding target.
       */
      _getContentPaddingTarget: function _getContentPaddingTarget() {
        return this.getChildControl("frame");
      },

      /*
      ---------------------------------------------------------------------------
        LEGEND HANDLING
      ---------------------------------------------------------------------------
      */
      // property apply
      _applyLegend: function _applyLegend(value, old) {
        var control = this.getChildControl("legend");

        if (value !== null) {
          control.setLabel(value);
          control.show();
        } else {
          control.exclude();
        }
      },

      /**
       * Apply method for applying the legend position. It calls the
       * {@link #_repositionFrame} method.
       */
      _applyLegendPosition: function _applyLegendPosition(e) {
        if (this.getChildControl("legend").getBounds()) {
          this._repositionFrame();
        }
      },

      /**
       * Repositions the frame of the group box dependent on the
       * {@link #legendPosition} property.
       */
      _repositionFrame: function _repositionFrame() {
        var legend = this.getChildControl("legend");
        var frame = this.getChildControl("frame"); // get the current height of the legend

        var height = legend.getBounds().height; // check for the property legend position

        if (this.getLegendPosition() == "middle") {
          frame.setLayoutProperties({
            top: Math.round(height / 2)
          });
        } else if (this.getLegendPosition() == "top") {
          frame.setLayoutProperties({
            top: height
          });
        }
      },

      /*
      ---------------------------------------------------------------------------
        GETTER FOR SUB WIDGETS
      ---------------------------------------------------------------------------
      */

      /**
       * The children container needed by the {@link qx.ui.core.MRemoteChildrenHandling}
       * mixin
       *
       * @return {qx.ui.container.Composite} pane sub widget
       */
      getChildrenContainer: function getChildrenContainer() {
        return this.getChildControl("frame");
      },

      /*
      ---------------------------------------------------------------------------
        SETTER/GETTER
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the icon of the legend sub widget.
       *
       * @param icon {String} source of the new icon of the legend sub widget
       */
      setIcon: function setIcon(icon) {
        this.getChildControl("legend").setIcon(icon);
      },

      /**
       * Accessor method for the icon of the legend sub widget
       *
       * @return {String} source of the new icon of the legend sub widget
       */
      getIcon: function getIcon() {
        return this.getChildControl("legend").getIcon();
      }
    }
  });
  qx.ui.groupbox.GroupBox.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-5.js.map?dt=1656842855105
qx.$$packageData['5'] = {
  "locales": {},
  "resources": {},
  "translations": {
    "en": {}
  }
};
