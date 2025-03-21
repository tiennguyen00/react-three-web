uniform float uProgress;
uniform vec3 uMouse;
uniform float uTime;
float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}
void main() {
    // Normally, a 3D model would provide vUv from the vertex shader.
    // However, in this case, we’re not rendering a model—we are working in screen space.
    // That’s why we use gl_FragCoord.xy / resolution.xy:
    vec2 vUv = gl_FragCoord.xy / resolution.xy;
    
    float offset = rand(vUv);
    vec3 position = texture2D( uCurrentPosition, vUv ).xyz;
    vec3 velocity = texture2D( uCurrentVelocity, vUv ).xyz;

    position += velocity;

    gl_FragColor = vec4( position, 1.);
}