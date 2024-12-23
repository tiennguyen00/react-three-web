uniform vec2 uResolution;
uniform sampler2D uTexture;
varying vec2 vUv;
varying float vColor;
uniform sampler2D uDisplacementTexture;
attribute float aIntensity;
attribute float aAngle;

void main()
{
     // Displacement
    vec3 newPosition = position;
    float displacementIntensity = texture(uDisplacementTexture, uv).r;
    displacementIntensity = smoothstep(0.2, 0.5, displacementIntensity);

    vec3 displacement = vec3(cos(aAngle) * 0.5, sin(aAngle) * 0.5, 1.0);
    displacement=normalize(displacement);
    displacement *= displacementIntensity;
    displacement *= 3.0;
    displacement *= aIntensity;

    newPosition += displacement;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    // Explain the projectedPosition: 4x4 matrix that transforms the camera space coordinates (after being transformed by mv) into the clip space coordinates. 3D -> 2D.
    
    vec4 projectedPosition = projectionMatrix * viewPosition;
    // gl_Position is a built-in variable in GLSL, represented the final position of vertex in clip space (2D screen)
    gl_Position = projectedPosition;

    // Picture:
    vec4 color = texture2D(uTexture, uv);
    float pictureIntensity = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
    vColor = pow(pictureIntensity, 2.0);

    // Point size
    gl_PointSize = 0.15 * uResolution.y * pictureIntensity;
    // viewPosition.z is a negative value
    gl_PointSize *= (1.0 / - viewPosition.z);

    vUv = uv;
}