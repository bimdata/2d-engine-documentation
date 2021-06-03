# Reference

## Init factory

2D Engine is created using a factory you get as default export from the package:

```javascript
import makeViewer from "@bimdata/2d-engine"; // webpack / rollup

const canvas = document.getElementById("canvas");
const viewer = makeViewer({ canvas });
```

`canvas` is mandatory and another properties can be passed to customized the 2D Engine behavior:

| Property    | Type                | Description                                                                               |
| :---------- | :------------------ | :---------------------------------------------------------------------------------------- |
| `canvas`    | `HTMLCanvasElement` | **Required**.                                                                             |
| `autoStart` | `boolean`           | **Default** = `true`. If false, you must call `viewer.ticker.start()` to start rendering. |

The factory returns the `viewer` with the following interface:

```typescript
interface Viewer extends {
  canvas: HTMLCanvasElement;
  scene: Scene;
  ui: UI;
  camera: Camera;
  destroy(): void;
  renderer: Renderer;
  settings: Settings;
  ticker: Ticker;
  picker: Picker;
  utils: {
    vector2D: Vector2DUtils;
  };
}
```

## Scene

The viewer scene is where model and objects lives. You can add/remove models and objects and getters and setters allow read/write objects in batch.

It has the following interface:

```typescript
interface Scene extends Readonly<EventHandler> {
  readonly viewer: Viewer;
  readonly textureManager: TextureManager;
  readonly styles: { default: Style; selected: Style; highlight: Style };

  // Models
  readonly models: Model[];
  readonly modelsMap: Map<number, Model>;
  addModel(modelData: ModelData): Model;
  removeModel(id: number): boolean;

  // Objects
  readonly objects: SceneObject[];
  readonly objectsMap: Map<number, SceneObject>;
  addObject(objectData: SceneObjectData, model?: Model): SceneObject;
  removeObject(objectId: number): boolean;

  // Objects setters
  showObjects(ids: number[]): void;
  hideObjects(ids: number[]): void;
  selectObjects(ids: number[]): void;
  deselectObjects(ids: number[]): void;
  highlightObjects(ids: number[]): void;
  unhighlightObjects(ids: number[]): void;
  setObjectsPickable(ids: number[]): void;
  setObjectsUnpickable(ids: number[]): void;

  // Object getters
  readonly shownObjects: SceneObject[];
  readonly hiddenObjects: SceneObject[];
  readonly selectedObjects: SceneObject[];
  readonly unselectedObjects: SceneObject[];
  readonly highlightedObjects: SceneObject[];
  readonly unhighlightedObjects: SceneObject[];
  readonly pickableObjects: SceneObject[];
  readonly unpickableObjects: SceneObject[];
}
```

It also contains styles and the texture manager.

### Styles

Styles define how objects are drawn by default when they are visible, selected and highlighted. It can be customized by changing the default styles (WARNING: updating styles.default won't affect already loaded objects) or loading objects with non default style.

A style has the following interface:

```typescript
interface Style {
  // TEXTURE
  texture?: string;
  textureTint?: number;
  textureOpacity?: number;
  // LINE
  lineWidth?: number;
  lineColor?: number;
  lineOpacity?: number;
  lineDash?: number[];
}
```

You can change `textureTint` and `lineColor` using hexadecimal numbers.

```javascript
viewer.scene.styles.default.textureTint = 0xff0000; // For red. (RGB)
```

`textureOpacity` and `lineOpacity` are numbers between 0 and 1.

`lineDash` is an array of numbers describing the dash pattern you want to use. See [here](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash#parameters) for more informations.

### Texture Manager

The Texture Manager has the following interface:

```typescript
interface TextureManager {
  textureMatrix: TextureMatrix;
  load(
    name: string,
    src: string,
    width?: number,
    height?: number
  ): Nullable<Object>;
}

// and the interface of the texture matrix
interface TextureMatrix {
  rotate(angle: number): void;
  scale(x: number, y?: number): void;
  translate(x: number, y: number): void;
}
```

The viewer only have "solid" texture built in but it is possible to load more:

```javascript
await viewer.scene.textureManager.load(
  "myTextureName",
  "./my/textures/folder/myTexture.png"
);
```

NOTE: this is async code and must be awaited in order to the texture to ba available in the viewer.

This is what you can get: (wall are textured using a cross hatch texture)

<img :src="$withBase('/assets/img/wallTextureRaw.png')" alt="wall texture raw" width="400" height="300"/>

Notice that the textrure is aligned with the axis. If the model is not aligned with the axis, you can use the Texture Manager textureMatrix to rotate the textures.

```javascript
viewer.scene.textureManager.textureMatrix.rotate(30);
```

<img :src="$withBase('/assets/img/wallTextureRotated.png')" alt="wall texture rotated" width="400" height="300"/>

### Model and Objects

`model` and `object` have the following interfaces:

```typescript
interface Model {
  readonly id: number;
  readonly scene: Scene;
  readonly objects: SceneObject[];
  addObject(objectData: SceneObjectData): SceneObject;
  removeObject(objectId: number): boolean;

  // Related with its objects gemetries
  readonly bounds: Bounds;
  readonly center: Point;
}

interface SceneObject {
  readonly id: number;
  readonly scene: Scene;
  readonly model: Model;
  readonly geometry: Geometry;

  // Scene state properties
  visible: boolean;
  selected: boolean;
  highlighted: boolean;
  pickable: boolean;

  // User custom properties
  readonly uuid?: string;
  readonly area?: number;
  readonly zIndex?: number;
  readonly type?: string;
}
```

Objects have geometries. An object geometry have the following interface:

```typescript
interface Geometry {
  readonly shapes: Shape[];
  getShape(index?: number): Shape | undefined;
  addShape(shape: ShapeData | PointsData, index?: number): Shape;
  removeShape(index?: number): Shape | undefined;
  readonly bounds: Bounds;
  readonly center: Point;
}
```

The viewer handle two shape types: `line` and `arc`.

```typescript
interface Line {
  readonly type: ShapeType.line;
  readonly points: Point[];
  getPoint(index?: number): Point | undefined;
  addPoint(point: Point, index?: number): Point;
  removePoint(index?: number): Point | undefined;
}

interface Arc {
  readonly type: ShapeType.arc;
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  anticlockwise?: boolean;
}
```

When adding objects on a scene, shapes can be provide to object using the geometry property. By default, array of numbers will be displayed as lines.

```javascript
const model = viewer.scene.addModel({
  objects: [
    {
      geometry: [
        [0, 0, 50, 50], // a line
        {
          type: "line", // another line
          points: [0, 50, 50, 0],
        },
        {
          type: "arc", // a default arc => full circle
          x: 25,
          y: 25,
          radius: 20,
        },
      ],
    },
  ],
});
```

:::tip
Geometries can be edited on the fly. To see how, [try it here](https://codepen.io/bimdata/pen/qBroOoW).
:::

### Events

The following events are emitted by the 2D Engine scene :

- "model-added", payload: the added model.
- "model-removed", payload: the removed model.
- "object-added", payload: the added object.
- "object-removed", payload: the removed object.
- "object-update", payload: { object, property, value?, oldValue? }. No value and oldValue for the "geometry" property.

Events can be listened using `scene.on`:

```javascript
viewer.scene.on("model-added", model =>
  console.log(`A model is loaded with the id ${model.id}`)
);
```

## UI

The UI is the only component connected to a DOM element, listening to events. It has the following interface:

```typescript
interface UI extends EventHandler<UIHandlerEvents> {
  connect(el: HTMLElement): void;
  disconnect(): boolean;
}
```

The `camera` and the `picker` listen to the UI events. Disconnecting the UI will make them not reactive to user interactions.

### Events

- "click", payload: { position, keys }
- "right-click", payload: { position, keys }
- "move", payload: { position, keys }
- "drag", payload: { dx, dy, keys }
- "scroll", payload: { position, dx, dy, keys }
- "exit", no payload, when the mouse leave `el`.

## Camera

The camera is binded on the mouse events. It has the following interface:

```typescript
interface Camera extends Readonly<EventHandler> {
  fitView(bbox: number[] | Bounds): void;
  controller: CameraController;
  translate(dx: number, dy: number): void;
  scale(factor: number, position: Point): void;
  rotate(angle: number, position: Point): void;
  transform: PIXIMatrix;
  getPosition(): Point;
  getRotation(): number;
  getScale(): Point;
}
```

It is possible to customise the camera behaviour by changing the properties of the `camera.controller` that has the following interface:

```typescript
interface CameraController {
  translatable: boolean;
  rotatable: boolean;
  scallable: boolean;
}
```

All properties are `true` by default.

## Picker

The picker allows to get objects under the mouse pointer.

```typescript
interface Picker extends Readonly<EventHandler> {
  pick(x: number, y: number): SceneObject | undefined;
}
```

You may be mainly interseted by the picker events:

- "pick", payload : { object, position, keys, rightClick: boolean }
- "pick-nothing", payload: { position, keys, rightClick: boolean }
- "hover-surface", payload: { object, position }
- "hover", payload: { object, position }
- "hover-out", payload: { object, position }
- "hover-off", payload: { position }

```javascript
viewer.camera.controller.on("pick", ({ object }) => {
  object.selected = !object.selected;
});
```

## Settings

Settings are predefined values/keys that define the 2D Engine behaviour. It has the following interface:

```typescript
interface Settings extends Readonly<EventHandler> {
  rotateKey: string; // default "shift"
  scaleSpeed: number; // default 0.002
  rotateSpeed: number; // default 0.1
  maxScale: number; // default 100
  minScale: number; // default 0.1
  fitViewRatio: number; // 1
  pickingOrder: string; // default "area"
}
```

`pickingOrder` property only accept "area" or "zIndex". It represents the object property used to sort objects before draw and will influence the way objects can be picked.

## Ticker

Use `viewer.ticker.start/stop()` to start or stop the rendering.

Use `viewer.ticker.add/addOnce(name: string, callBack: Function)` to schedule a callback on the next tick. The callback will be called with `dt`, the delta time since the next tick. WARNING: adding many tasks with the same name will overide the previous tasks and only the last added will be called on the next tick. This can be used to do not overdue a callback that must be done only once per tick.

## Renderer

Renderer emits events you can use for addons:

- "resize", payload: { dx: number, dy: number }. Emited when the renderer resizes.
- "pre-draw". Emited before the draw phase.
- "post-draw". Emited after the draw phase.

## Vector2DUtils

It exposes some methods to work with 2D vectors:

```typescript
interface Vector2DUtils {
  distance(v1: Vector2D, v2: Vector2D): number;
  sub(v1: Vector2D, v2: Vector2D): Vector2D;
  add(v1: Vector2D, v2: Vector2D): Vector2D;
  normalize(v: Vector2D): Vector2D;
  length(v: Vector2D): number;
  dot(v1: Vector2D, v2: Vector2D): number;
  cross(v1: Vector2D, v2: Vector2D): number;
  rotateAround(v: Vector2D, center: Vector2D, angle: number): Vector2D;
  angle(v1: Vector2D, v2: Vector2D): number;
}
```