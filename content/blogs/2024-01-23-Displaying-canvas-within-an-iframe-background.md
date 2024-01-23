---
layout: post
title: Displaying canvas within an iframe background
date: 2024-01-23
---
# Displaying canvas within an iframe background

Despite my embedded background, I find joy in experimenting with JavaScript and the canvas element. Creating simple animations, games, or simulations is a delight, especially with the fantastic creative framework [p5.js](https://p5js.org/). It provides a wonderfully simple and intuitive way to interact with the canvas. It's an excellent starting point, even for crafting straightforward GUIs for devices connected through WiFi, Bluetooth, or even serial connections!

But let's get straight to the point. Recently, I wanted to design a canvas where the background was another webpage. Specifically, I aimed for my canvas to be an `iframe` DOM element. While styling the elements with CSS is relatively straightforward, I quickly encountered some challenges with event listeners.

## Sample App
To illustrate the issue, let's create a simple webpage where we have an iframe in the background.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
            z-index: -1;
        }

        canvas {
            position: absolute;
        }
    </style>

    <script>
        let canvas;
        function setup() { canvas = createCanvas(windowWidth, windowHeight); }
        function draw() {
            clear();
            stroke("red");
            ellipse(mouseX, mouseY, 100);
        } 
    </script>
</head>
<body>
    <iframe src="https://en.wikipedia.org/wiki/Domestic_pigeon" frameborder="0"></iframe>
</body>
</html>
```

In this code snippet, we set up a basic HTML structure with an embedded iframe loading the Wikipedia page on domestic pigeons. The script in the head initializes the canvas using p5.js, creating a red ellipse that follows the mouse cursor. This sets the stage for the discussion on the challenges encountered when trying to interact with elements within the iframe.

## Adding Event Listeners
Usually, when we want to trigger any action when the mouse is moved or a button is pressed, we add an event listener to the element. The p5 framework has built-in functions that we can implement ourselves. Let's bind key presses and releases to introduce the ability to change the applied pointer-events CSS selector at runtime. This allows us to activate pointer events on the canvas when a key is pressed.

```js
function keyPressed() {
    console.log("keyPressed");
    canvas.style("pointer-events", "auto");
}

function keyReleased() {
    console.log("keyReleased");
    canvas.style("pointer-events", "none");
}
```

These JavaScript functions utilize p5.js to respond to key presses and releases. When a key is pressed, it logs a message and enables pointer events on the canvas, and when a key is released, it logs another message and disables pointer events.

## The Problem
Upon reloading the page and pressing any button, it seems like we've regained control! However, try left-clicking on the webpage loaded in the iframe. The events suddenly stop triggering, with no visible logs in the console, and the ellipse stops moving.

To debug this problem, let's add a few additional lines of JS.

```html
<script>
    window.onblur = function () {
        console.log("Lost focus");
    };

    window.onfocus = function () {
        console.log("Focused");
    };
</script>
```

These lines introduce event listeners that log messages when the window gains or loses focus, helping us understand the issue. Upon interacting with the iframe, you'll notice logs indicating the loss and regain of focus.

## The Solution
To resolve this issue, we can subscribe to a cycling event to periodically change the focus back to the parent window.

```html
<script>
    function checkFocus() {
        if (document.activeElement == document.getElementsByTagName("iframe")[0]) {
            window.focus();
        }
    }

    window.setInterval(checkFocus, 300); 
</script>
```

This JavaScript snippet continuously checks if the focus is on the iframe and refocuses on the parent window if needed. After adding this snippet, we can now click any button to trigger the keyPressed and keyReleased functions.