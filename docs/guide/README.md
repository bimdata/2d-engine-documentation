---
next: /reference/index.html
---


# Guide

## Install

### npm

```bash
npm i @bimdata/2d-engine
```

```javascript
import makeViewer from "@bimdata/2d-engine";
```

### script tag

```html
<script src="https://www.unpkg.com/@bimdata/2d-engine@1.0.2"></script>
```

Add `makeViewer` available on the window object.

Or on script type module:

```html
<script type="module">
  import makeViewer from "https://www.unpkg.com/@bimdata/2d-engine@1.0.2/dist/2d-engine.esm.js";

  // have fun
</script>
```

## Quick Start

This simple example shows how to load the engine with two simple objects and interact (select, highlight) with them.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>BIMData 2D Engine</title>
    <style>
      * {
        margin: 0px;
        padding: 0px;
      }
    </style>
  </head>

  <body style="background-color: gainsboro;">
    <canvas id="canvas2d" style="width: 100vw; height: 100vh;"></canvas>

    <script type="module">
      import makeViewer from "https://www.unpkg.com/@bimdata/2d-engine@1.0.2/dist/2d-engine.esm.js";

      const canvas = document.getElementById("canvas2d");

      const viewer = makeViewer({ canvas });

      // Select object on click, fitview on right-click.
      viewer.picker.on("pick", ({ object, rightClick }) => {
        if (rightClick) {
          viewer.camera.fitView(object.geometry.bounds);
        } else {
          object.selected = !object.selected;
        }
      });

      // Highlight object on hover.
      viewer.picker.on("hover", ({ object }) => {
        object.highlighted = true;
      });
      viewer.picker.on("hover-out", ({ object }) => {
        object.highlighted = false;
      });
      viewer.canvas.addEventListener("mouseleave", () => {
        const highlightedObjectIds = viewer.scene.highlightedObjects.map(
          o => o.id
        );
        viewer.scene.unhighlightObjects(highlightedObjectIds);
      });

      // Add a model with two simple objects. A line and a circle.
      const model = viewer.scene.addModel({
        objects: [
          {
            lineWidth: 2,
            lineOpacity: 0.8,
            lineColor: 0x0000ff,
            geometry: [
              [0, 0, 50, 50],
              [0, 50, 50, 0],
            ],
          },
          {
            textureOpacity: 0.5,
            texture: "solid",
            textureTint: 0xff00ff,
            geometry: [
              {
                type: "arc",
                x: 25,
                y: 25,
                radius: 20,
              },
            ],
          },
        ],
      });

      // Fit view the model once loaded.
      viewer.camera.fitView(model.bounds);
    </script>
  </body>
</html>
```

The result:

![simple example](/2d-engine-documentation/assets/img/simpleExample.gif)

:::tip
[Try it online !](https://codepen.io/bimdata/pen/poeLjyd)
:::
