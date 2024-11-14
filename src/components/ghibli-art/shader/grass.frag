uniform sampler2D uTextures[4];
uniform float uBrightness;
uniform float uContrast;

varying vec2 vUv;
varying vec2 cloudUV;
varying vec3 vColor;

void main() {
  vec3 color = texture2D(uTextures[0], vUv).rgb * uContrast;
  color = color + vec3(uBrightness, uBrightness, uBrightness);
  // color = mix(color, texture2D(uTextures[1], cloudUV).rgb, 0.4);
  gl_FragColor = vec4(color, 1.);
  // #include <tonemapping_fragment>
  // #include <colorspace_fragment>
}