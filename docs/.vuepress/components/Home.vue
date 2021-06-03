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
  </div>
</template>


<style>
.home img, canvas {
    margin: 24px;

}

.home canvas {
      width: 400px;
    height: 400px;
}
</style>
