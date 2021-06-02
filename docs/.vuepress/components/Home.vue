<template>
  <div class="home">
    <h1>2D Engine Documentation</h1>
    <div>
      The BIMData.io 2D Engine is a performant WebGL based 2D renderer that is able to draw from a simple lines to an entire building with a huge amount of object.
    </div>
    <img :src="$withBase('/assets/img/building.gif')">
    <div>
      The simple API allow to quickly add addons like texts, additional shapes and so on.
    </div>
    <img :src="$withBase('/assets/img/plugins.gif')">
    <div>
      Drawn shapes are dynamics and can be edited on the fly.
    </div>
    <img :src="$withBase('/assets/img/plugin.measures.gif')">
    <div>
      <b>Try it !</b>
    </div>
    <div>
      Mouse move on the following canvas:
    </div>
    <canvas id="canvas" style="background-color: #f4f4f4"></canvas>
  </div>
</template>

<script>
import { onMounted } from "vue"

import makeViewer from "@bimdata/2d-engine"

export default {
  setup() {
    function addObjects(canvas) {
            /**
       * @type { E2D.Viewer }
       */
      const viewer = makeViewer({ canvas })

      const arc = viewer.scene.addObject({
        textureTint: 0xFFFF00,
        texture: "solid",
        textureOpacity: 0.3,
        lineWidth: 4,
        geometry: [
          {
            type: "arc",
            x: 200,
            y: 200,
            radius: 200
          }
        ]
      });

      const line = viewer.scene.addObject({
        lineColor: 0x000000,
        lineWidth: 4,
        lineDash: [5, 10, 15],
        geometry: [
          [
                200, 200,
                200, 200
          ],
        ]
      });

      viewer.camera.fitView({minX: 0, minY: 0, maxX: 400, minY: 400})
      viewer.ui.disconnect()
      canvas.addEventListener("mousemove", e => {
        // console.log("mousemove")
        const point = line.geometry.getShape().points[1]
        const circle = arc.geometry.getShape()

        const canvasPosX = e.offsetX / window.devicePixelRatio
        const canvasPosY = e.offsetY / window.devicePixelRatio

        point.x = canvasPosX
        point.y = canvasPosY

        const {length, sub} = viewer.utils.vector2D

        circle.radius = length(sub({x: canvasPosX, y: canvasPosY}, { x: 200, y: 200}))
      })
      }

    onMounted(() => {
      addObjects(document.getElementById("canvas"))
    })
  },
}
</script>

<style lang="scss">
.home {
  text-align: center;
  img, canvas {
    margin: 24px;
  }
  canvas {
    width: 400px;
    height: 400px;
  }
}
</style>
