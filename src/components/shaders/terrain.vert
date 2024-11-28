varying vec2 vUv;

float getElevation(vec2 position)
{
    float elevation = 0.0;
    return elevation;
}


void main() {
  float elevation = getElevation(csm_Position.xz)
  csm_Position.y += elevation;
  vUv = uv;
}