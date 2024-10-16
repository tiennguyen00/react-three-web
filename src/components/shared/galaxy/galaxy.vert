uniform float uSize;
uniform float uTime;
attribute float aScale;
attribute vec3 aRandomness;
varying vec3 vColor;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Rotate
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
  angle += angleOffset;
  modelPosition.x = sin(angle) * distanceToCenter;
  modelPosition.z = cos(angle) * distanceToCenter;

  modelPosition.xyz += aRandomness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  gl_PointSize = uSize * aScale;
  // this below code for creating Size attenuation effect
  gl_PointSize *= (1.0 / -viewPosition.z);

  vColor = color;
}