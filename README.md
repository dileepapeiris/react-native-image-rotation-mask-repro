# React Native iOS: `Image` is clipped to its final size during rotation

Reproducer for a React Native iOS bug, made from the
[community reproducer template](https://github.com/react-native-community/reproducer-react-native).
React Native 0.88.1, iPhone 17 Pro simulator, iOS 26.5, Xcode 27.2, 11/24/26.

An `<Image>` inside a view that clips (`overflow: 'hidden'`) is clipped to its final size for the
whole duration of a layout animation. During a landscape to portrait rotation the green item it sits
in shrinks smoothly, but the image jumps to the final portrait width on the first frame, so the green
background is visible on its right until the animation ends.

The same bug reaches any library that hosts a `UIImageView` in a clipping view. It was first
reported through `expo-image` in [expo/expo#54040](https://github.com/expo/expo/issues/54040).

## Run

```sh
cd ReproducerApp
yarn
yarn ios
```

In the simulator turn on Device > Slow Animations, then rotate with Cmd+Right and Cmd+Left.

## What the screen shows

- `Image, resizeMode cover`: three green items, each with an `<Image resizeMode="cover">` filling it.
- `View (control)`: the same items with a plain magenta `<View>` instead of an image.

## Result

| Moment | Image row | View row |
| --- | --- | --- |
| Portrait at rest | correct | correct |
| Landscape at rest | correct | correct |
| Rotating landscape to portrait | image already at portrait width, green gap on the right of each item | resizes smoothly |
| Rotating portrait to landscape | no gap (the image grows into space the item already covers) | resizes smoothly |

## With the fix

Branch [`fix/ios-image-view-mask-animation`](https://github.com/dileepapeiris/react-native/tree/fix/ios-image-view-mask-animation)
reuses the mask layer React Native installs on the image view and copies the `bounds.size` animation
UIKit put on the image view's layer onto the mask path, so the mask follows the view. Tested here by
patching `node_modules/react-native` and building React Native from source
(`RCT_USE_PREBUILT_RNCORE=0 pod install`; the template uses the prebuilt core by default).

| Moment | Image row | View row |
| --- | --- | --- |
| Rotating landscape to portrait | fills its item through the whole animation | unchanged |
| Portrait and landscape at rest | identical to before | unchanged |

- `media/before-after-0.2s.png`: the same moment without and with the fix.
- `media/fixed-landscape-to-portrait-0.2s.png`, `media/fixed-landscape-to-portrait-frames.png`,
  `media/fixed-landscape-to-portrait-slow.gif`, `media/fixed-landscape-to-portrait-slow.mp4`: the fixed run.

## Media

All recordings use Slow Animations, so the 0.4 s rotation takes about 3.3 s.

- `media/landscape-to-portrait-0.2s.png`: 0.2 s into the rotation to portrait, turned upright.
- `media/landscape-to-portrait-frames.png`: one frame every 0.5 s of the same rotation.
- `media/landscape-to-portrait-slow.gif` and `media/landscape-to-portrait-slow.mp4`: the full rotation.
- `media/portrait-at-rest.png`, `media/landscape-at-rest.png`: both orientations at rest.

## Cause

`RCTViewComponentView.invalidateLayer` installs a new `CAShapeLayer` mask on every `UIImageView`
subview of a clipping view, with a path equal to the subview's bounds at layout time. UIKit animates
the image view's bounds during the rotation, but the mask is a fresh layer already at the final path,
so the image is clipped to the final size from the first frame. The mask is installed even when the
view has no border radius.
