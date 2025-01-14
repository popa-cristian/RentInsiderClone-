// Detect request animation frame
var logging = false;
if (logging)
    console.log("start of script");
var scroll = window.requestAnimationFrame ||
             // IE Fallback
             function(callback){ window.setTimeout(callback, 1000/60)};
var elementsToShow = document.querySelectorAll('.show-on-scroll'); 

function loop() {
    var elementsToShow = document.querySelectorAll('.show-on-scroll');
    if (logging)
        console.log("loop start");
    Array.prototype.forEach.call(elementsToShow, function(element){
        if (logging)
            console.log("checking element: " + element);
      if (isElementInViewport(element)) {
        element.classList.add('is-visible');
        if (logging)
            console.log(element + "visible");
      } else {
        element.classList.remove('is-visible');
        if (logging)
            console.log(element + "not visible");
      }
    });

    scroll(loop);
}

// Call the loop for the first time
loop();

// V1 Helper function from: http://stackoverflow.com/a/7557433/274826 
function isElementInViewport(el) {
    // special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
      el = el[0];
    }
    var rect = el.getBoundingClientRect();
    return (
      (rect.top <= 0
        && rect.bottom >= 0)
      ||
      (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight))
      ||
      (rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
    );
  }

 /*v0
const callback = function(entries) {
    entries.forEach(entry => {
      entry.target.classList.toggle("is-visible");
    });
  };
  
  const observer = new IntersectionObserver(callback);
  
  const targets = document.querySelectorAll(".show-on-scroll");
  targets.forEach(function(target) {
    observer.observe(target);
  });*/

/* V2 
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)

    );
}
*/
function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
}