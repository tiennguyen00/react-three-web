uniform sampler2D uTexture;
varying vec2 vUv;
varying float vElevation;
varying float vTime;


void main() {
  float angle = mod(atan(vUv.x + vTime*0.1, vUv.y + vTime*0.1), 1.0);
  float strength = 1.0 - angle; 
  vec4 textureColor = texture2D(uTexture, vUv);
  // textureColor.rgb *= vElevation * 2.0 + 0.5 ;
  // textureColor.rgb += strength;
  gl_FragColor = textureColor;
}