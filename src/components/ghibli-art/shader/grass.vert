varying vec2 vUv;
varying vec2 cloudUV;

varying vec3 vColor;
uniform float uTime;

attribute vec3 aTerrain;

void main() {
  vUv = uv;
  cloudUV = uv;
  vColor = color;
  vec3 cpos = position;

  float waveSize = 10.0f;
  float tipDistance = 0.3f;
  float centerDistance = 0.1f;

  if (color.x > 0.6f) {
    cpos.x += sin((uTime * 2.) + (uv.x * waveSize)) * tipDistance;
  }else if (color.x > 0.0f) {
    cpos.x += sin((uTime * 2.) + (uv.x * waveSize)) * centerDistance;
  }
  cpos.y += aTerrain.y;

  cloudUV.x += uTime / 20.;
  cloudUV.y += uTime / 10.;

  vec4 worldPosition = vec4(cpos, 1.);
  vec4 mvPosition = projectionMatrix * modelViewMatrix * vec4(cpos, 1.0);
  gl_Position = mvPosition;
}