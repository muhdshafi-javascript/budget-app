# budget-app
## Modules Pattern
In JavaScript, code encapsulation can be achieved using Modules Patterns. In addition, it is used to create private and public properties. 
**here are some of the benefits:**
- Freeze the scoping.
- Code encapsulation.
- Creating private or public scope.
- Creating a namespace.
- Creating public and private encapsulation.
**Implementation in ES5**
- Using Object literals and IIFE, the closure feature in javascript make it possible to encapsulate the private data/method.
- in ES5, IIFE is necessary to create a function scope that prevented *var* declarations from polluting the global namespace when implementing the  module pattern.
- from ES6 onwards, we can simply use a blocked scope instead of IIFE.
```javascript
var budgetController = (function () {
    var x = 23;
    var add = function (a) {
        return x + a;
    }

    return {
        publicTest: function (input) {
            console.log(add(input));
        }
    };
})();

budgetController.publicTest(100);
```
## events
DOM events are dispatched from the document to the target element (the capturing phase), and then bubble from the target element back to the document.

### event bubbling 
when any event is triggred on any DOM element, the exact event triggred on all of its parent element as well one after another, till the html element.
### target element
a property on the even object which stores the actual element on which the event triggerd first.
### event Delegation
Instead of attaching event handler on each element, do it on the parent, this technique is called event delegtion.  
scenarios where *event delagation* is useful are  
  - when we have an element with large number of child elements, such as list of items with delete button in it.
  - when we want to attach an event handler which is not yet in the DOM when the page is loaded.  
### preventDefault and stopPropagation  
**stopPropagation()** stops the further bubbling up of the event through the DOM.
**preventDefault()** prevent from the browser's default action to the event.

```javascript
<!DOCTYPE html>
<html>
<body>
    <div id='c1'>
        <h1>Container 1</h1>
        <div id='c2'>
            <h2>Container 2</h2>
            <div id='c3'>
                <h3>Container 3</h3>
                <a id='myAnchor' href="https://www.youtube.com/">Click here to go to Youtube</a>
            </div>
        </div>
    </div>
    <script>

        document.getElementById('c1').addEventListener('click', function (event) {
            console.log('clicked on H1');
            //event.stopPropagation();
        });

        document.getElementById('c2').addEventListener('click', function (event) {
            console.log('clicked on H2');
            //event.stopPropagation();
        });

        document.getElementById('c3').addEventListener('click', function (event) {
            console.log('clicked on H3');
            //event.preventDefault();
            //event.stopPropagation();
        });

    </script>
</body>
</html>
```
### Bubble VS Capture
- Event bubbling and capturing are two ways of event propagation in the HTML DOM, when an event occurs in an element inside another element, and both elements have registered a handle for that event.
- With capturing, the event is first captured by the outermost element and propagated to the inner elements.
- With bubbling, the event is first captured and handled by the innermost element and then propagated to outer elements.


  
 ## TODO
- querySelectorAll()
- Convert UIElelmentList to Array using slice() of Array
- private fields in Javascript
- DOM traversal (.parent.prent etc)
- Number.prototype.toFixed() 
- Number.prototype.toLocaleString()
- Date.prototype.toLocaleString()



