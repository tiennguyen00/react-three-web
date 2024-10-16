varying vec3 vModelPosition;
varying vec3 vNormal;
/**
Explain the basic props in veer
- position: is the local space (relative to the origin's object)
- modalMatrix: localspace -> worldspace. Transforms the vertex from local space (object’s coordinate system) to world space (the scene’s coordinate system).
- viewMatrix: worldspace -> cameraspace. In camera space, the camera is considered to be at the origin (0, 0, 0), facing forward. The viewMatrix adjusts all the objects’ world positions so they’re rendered as if seen from the camera’s point of view.
- projectionMatrix: cameraspace -> clipspace (3D -> 2D). A 3D object must be projected onto the flat 2D screen. The projectionMatrix handles things like perspective distortion (making faraway objects look smaller 
*/

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vec4 modelNormal = modelMatrix * vec4(normal, 0.);

    vModelPosition = modelPosition.xyz;
    // Each vertex in a 3D model has an associated normal vector, which points perpendicularly from the surface.
    vNormal = modelNormal.xyz;
}