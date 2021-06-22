<template>
  <div class="home">
    <h1>2D Engine Documentation</h1>
    <div class="home__links">
      <a href="guide">Guide</a>
      <a href="reference">Reference</a>
    </div>
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
.home {
  text-align: center;
}

.home img, canvas {
    margin: 24px;
}

.home canvas {
      width: 400px;
    height: 400px;
}

.home__links {
  display: flex;
  justify-content: space-around;
  max-width: 300px;
  margin: auto;
}

.home__links a{
  margin: 15px;
  padding: 15px;
  border-radius: 10px;
  min-width: 100px;
  background-color: #f8c62d;
  color: black;
}
</style>
