varying vec2 vUv;
varying float vColor;

void main()
{
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - vec2(0.5));

    if(distanceToCenter > 0.5)
      discard;
    
    gl_FragColor = vec4(vec3(1.0), vColor);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}