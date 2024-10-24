varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
/**
Explain the basic props in veer
- position: is the local space (relative to the origin's object)
- modalMatrix: localspace -> worldspace. Transforms the vertex from local space (object’s coordinate system) to world space (the scene’s coordinate system).
- viewMatrix: worldspace -> cameraspace. In camera space, the camera is considered to be at the origin (0, 0, 0), facing forward. The viewMatrix adjusts all the objects’ world positions so they’re rendered as if seen from the camera’s point of view.
- projectionMatrix: cameraspace -> clipspace (3D -> 2D). A 3D object must be projected onto the flat 2D screen. The projectionMatrix handles things like perspective distortion (making faraway objects look smaller 
*/

float random2D(vec2 value)
{
    return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Glitch
    float glitchTime = uTime + modelPosition.y;
    float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) +  sin(glitchTime * 8.76);
    // glitchStrength /= 3.0;
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength);
    glitchStrength *= 0.25;

    // Randomine value return value range from 0 -> 1.
    modelPosition.x += (random2D(modelPosition.xz + uTime) - .5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - .5) * glitchStrength;

    // Final position
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Model normal
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // Varyings
    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
}