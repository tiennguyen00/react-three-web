varying vec2 vUv;
uniform float time;
attribute vec2 uvRef;

uniform sampler2D uTexture;
uniform sampler2D uVelocity;
varying vec3 vNormal;

void main() {

    vUv = uv;
    vNormal = normal;
    vec4 color = texture2D( uTexture, uvRef );
    vec4 velocity = texture2D( uVelocity, uvRef );
    vec3 newpos = color.xyz + position.y * velocity.xyz * 1000.;
    // newpos.x += 1.;
    // newpos.z += sin( time + position.x*10. ) * 0.5;
    mat4 instanceMat = instanceMatrix;

    instanceMat[3].x = newpos.x;
    instanceMat[3].y = newpos.y;
    instanceMat[3].z = newpos.z;
    
    
    vec4 mvPosition = modelViewMatrix * instanceMat * vec4( position, 1.0 );

    gl_Position = projectionMatrix * mvPosition;

}
