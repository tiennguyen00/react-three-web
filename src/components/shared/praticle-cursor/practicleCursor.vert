uniform vec2 uResolution;

void main()
{
    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    // Explain the projectedPosition: 4x4 matrix that transforms the camera space coordinates (after being transformed by mv) into the clip space coordinates. 3D -> 2D.
    
    vec4 projectedPosition = projectionMatrix * viewPosition;
    // gl_Position is a built-in variable in GLSL, represented the final position of vertex in clip space (2D screen)
    gl_Position = projectedPosition;

    // Point size

    gl_PointSize = 0.3 * uResolution.y;
    // viewPosition.z is a negative value
    gl_PointSize *= (1.0 / - viewPosition.z);
}