<ResponsiveChoropleth
    data={data}
    features={geoFeatures.features}
    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    domain={[0, 1000000]}
    unknownColor="#666666"
    label="properties.name"
    valueFormat=".2s"
    projectionScale={150}
    projectionTranslation={[0.5, 0.5]}
    projectionRotation={[0, 0, 0]}
    enableGraticule={true}
    graticuleLineColor="rgba(0, 0, 0, .2)"
    graticuleLineWidth={0.5}
    borderWidth={0.5}
    borderColor="#152538"
    projectionType="equalEarth"
    fillColor="blues"
    isInteractive={true}
    onMouseEnter={() => {}}
    onMouseMove={() => {}}
    onMouseLeave={() => {}}
    onClick={() => {}}
    layers={['graticule', 'features']}
    role="application"
    match="match"
    value="value"
    colors="nivo"
/> 