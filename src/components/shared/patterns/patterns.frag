varying vec2 vUv;


// make a random number using a pair of numbers
// output give the random number between 0, 1
float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);

  float strength = length(vUv);
  gl_FragColor = vec4(vec3(strength), 1.0);
}