varying vec3 vModelPosition;
varying vec3 vNormal;
uniform float uTime;

void main()
{
    float stripes = mod((vModelPosition.y + uTime * 0.2) * 30., 1.0);
    stripes = pow(stripes, 3.0);
    
    vec3 viewDirection = normalize(vModelPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing)
        normal *= -1.;

    float fresnel = dot(viewDirection, normal) + 1.;
    fresnel = pow(fresnel, 2.);

    float holographic = stripes * fresnel;
    holographic += fresnel * 1.25;

    gl_FragColor = vec4(vec3(1.0), holographic);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}