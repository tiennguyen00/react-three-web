uniform vec2 uResolution;
uniform float uSize;
uniform sampler2D uParticlesTexture;
uniform vec3 uPointer;
attribute vec2 aParticlesUv;
attribute vec3 aColor;
attribute float aSize;

varying vec3 vColor;

void main()
{
    vec4 particle = texture(uParticlesTexture, aParticlesUv);

    // Final position
    vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    float sizeIn = smoothstep(0.0, 0.1, particle.a);
    float sizeOut = 1.0 - smoothstep(0.7, 1.0, particle.a);
    float size = min(sizeIn, sizeOut);
    gl_PointSize = uSize * uResolution.y * aSize * size;
    gl_PointSize *= (1.0 / - viewPosition.z);

    float distanceVal = distance(uPointer, particle.xyz);
    if(distanceVal < 0.5) 
        gl_PointSize *= 0.1;
    

    // Varyings
    vColor = aColor;
}