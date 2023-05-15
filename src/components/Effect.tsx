const Effect = () => {
  return (
    <>
      <fog attach="fog" args={["#add8e6", 2, 28]} />
      {/* <EffectComposer disableNormalPass>
          <Bloom mipmapBlur luminanceThreshold={1} />
          <ToneMapping
            adaptive
            resolution={256}
            middleGrey={0.4}
            maxLuminance={16.0}
            averageLuminance={1.0}
            adaptationRate={1.0}
          />
        </EffectComposer> */}
    </>
  );
};

export default Effect;
