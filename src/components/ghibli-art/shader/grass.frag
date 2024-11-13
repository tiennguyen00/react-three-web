uniform sampler2D uTextures[4];

varying vec2 vUv;
varying vec2 cloudUV;
varying vec3 vColor;

void main() {
  float contrast = 1.2;
  float brightness = .1;
  vec3 color = texture2D(uTextures[0], vUv).rgb * contrast;
  color = color + vec3(brightness, brightness, brightness);
  color = mix(color, texture2D(uTextures[1], cloudUV).rgb, 0.4);
  gl_FragColor = vec4(color, 1.);
  // #include <tonemapping_fragment>
  // #include <colorspace_fragment>
}