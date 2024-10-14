varying vec3 vModelPosition;


void main()
{
    // Final color
    gl_FragColor = vec4(vModelPosition, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}