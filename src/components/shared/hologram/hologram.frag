varying vec3 vModelPosition;
varying vec3 vNormal;
uniform float uTime;

void main()
{
    float stripes = mod((vModelPosition.y + uTime * 0.02) * 20.0, 1.0);
    stripes = pow(stripes, 3.0);
    
    vec3 viewDirection = normalize(vModelPosition - cameraPosition);
    float fresnel = dot(viewDirection, vNormal) + 1.;

    gl_FragColor = vec4(vec3(1.0), fresnel);
    // #include <tonemapping_fragment>
    // #include <colorspace_fragment>
}