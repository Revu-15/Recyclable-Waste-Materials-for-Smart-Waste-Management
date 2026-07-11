# Recycling Instructions and Environmental Tips mapping for all 10 classes

WASTE_CLASSES_DETAILS = {
    'Plastic': {
        'instructions': 'Rinse the plastic container to remove food residue. Check the recycling symbol on the bottom (typically PET #1 and HDPE #2 are widely accepted). Place it in the blue recycling bin.',
        'recommendation': 'Clean thoroughly, dry, and place in plastic recycling container. Do not recycle thin plastic bags or wrappers locally; take them to dedicated grocery drop-offs.',
        'environmental_tip': 'Recycling 1 ton of plastic saves approximately 5.774 kWh of electricity, 16.3 barrels of oil, and 30 cubic yards of landfill space.',
        'xai_explanation': 'The model identified plastic characteristics such as glossy reflection, container lip geometries, or smooth surfaces typically associated with PET/HDPE packaging materials.'
    },
    'Paper': {
        'instructions': 'Ensure the paper is clean and dry. Newspaper, office paper, and magazines are highly recyclable. Discard paper heavily soiled with food or grease.',
        'recommendation': 'Keep flat and dry, place in the paper recycling bin. Shredded paper should be placed in paper bags to avoid wind litter.',
        'environmental_tip': 'Recycling 1 ton of paper saves 17 mature trees, 7,000 gallons of water, 3 barrels of oil, and 4,000 kilowatt-hours of electricity.',
        'xai_explanation': 'The model detected paper characteristics such as thin edges, fibrous textures, high reflectivity differences (typical of print and white pages), and lack of specularity.'
    },
    'Cardboard': {
        'instructions': 'Flatten all boxes to save space. Remove packaging tape, bubble wrap, and plastic liners. Keep it dry.',
        'recommendation': 'Flatten and stack together, then place in the cardboard bin. Do not include grease-stained cardboard (like pizza boxes).',
        'environmental_tip': 'Recycling cardboard uses 75% of the energy required to make new cardboard and reduces sulfur dioxide emissions by half.',
        'xai_explanation': 'The model identified cardboard based on brown/kraft color gradients, thick structural edges, corrugated interior lines, and matte light scattering.'
    },
    'Glass': {
        'instructions': 'Rinse glass bottles and jars clean. Metal lids should be recycled separately. You can leave paper labels on.',
        'recommendation': 'Rinse and drop in the designated glass recycling container. Do NOT recycle window glass, mirrors, or Pyrex as they have different melting points.',
        'environmental_tip': 'Glass can be recycled infinitely without losing quality. Using recycled glass cullet saves energy because it melts at a lower temperature than raw materials.',
        'xai_explanation': 'The model highlighted high-contrast specular reflections, translucent refraction boundaries, and curved bottle shapes characteristic of glass.'
    },
    'Metal': {
        'instructions': 'Rinse aluminum and steel/tin cans. Put the lids inside the cans so they don\'t cut anyone. Clean aluminum foil is also recyclable.',
        'recommendation': 'Wash off food remains and place in the metal recycling bin. Scrap metal should be taken to a local recycling yard.',
        'environmental_tip': 'Recycling aluminum saves 95% of the energy needed to make new aluminum from bauxite ore. Aluminum can be recycled repeatedly.',
        'xai_explanation': 'The model detected metallic sheen, specular highlighting, and thin metallic cylinder configurations common to aluminum beverage/food cans.'
    },
    'Organic Waste': {
        'instructions': 'Do not place in standard recycling. Organic waste includes food scraps, fruit peels, coffee grounds, and yard trimmings. Place in the compost bin.',
        'recommendation': 'Deposit in your home compost pile, green organic waste bin, or local community composting facility.',
        'environmental_tip': 'Composting organic waste prevents it from decomposing anaerobically in landfills, which otherwise produces methane—a greenhouse gas 28x more potent than CO2.',
        'xai_explanation': 'The model identified organic shapes, biological textures (seeds, leaves, pulp), and organic patterns typical of food items or plants.'
    },
    'Clothes': {
        'instructions': 'Ensure garments are clean and dry. Do not put in curbside recycling bins. Recycle through clothing donation banks or textile drop-off locations.',
        'recommendation': 'Donate wearable clothes to charities. Drop unwearable/torn textiles at specialized clothing recycling boxes for fiber recovery.',
        'environmental_tip': 'Recycling textiles reduces the environmental footprint of fashion, saving massive amounts of water and pesticides used in cotton farming, and reducing landfill mass.',
        'xai_explanation': 'The model recognized fabric patterns, folds, stitching seams, and soft, non-rigid geometries characteristic of textiles and garments.'
    },
    'Battery': {
        'instructions': 'Batteries contain hazardous materials and heavy metals. Tape the terminals of lithium/button batteries. Place in specialized battery collection bins.',
        'recommendation': 'Do NOT throw in standard trash or recycling bins. Take to an electronics retailer, home improvement store, or toxic waste drop-off.',
        'environmental_tip': 'Recycling batteries prevents toxic metals (mercury, lead, cadmium, nickel) from leaching into groundwater and recycles valuable minerals like lithium and cobalt.',
        'xai_explanation': 'The model recognized cylindrical metallic batteries, button-cell outlines, or distinct manufacturer color codings on small battery devices.'
    },
    'Electronic Waste': {
        'instructions': 'E-waste includes computers, phones, cables, and appliances. Remove any personal data. Take them to designated electronic recycling drop-offs.',
        'recommendation': 'Return to manufacturer buyback programs, donate functioning units, or take non-functional devices to certified e-waste recyclers.',
        'environmental_tip': 'E-waste represents 2% of trash in landfills but 70% of toxic waste. Recycling recovers precious metals (gold, silver, copper) and prevents lead/mercury poisoning.',
        'xai_explanation': 'The model highlighted circuit board traces, electrical pins, ports, plastic casings, and electronic component silhouettes.'
    },
    'Trash': {
        'instructions': 'This item is not recyclable or compostable locally. Put it in the black landfill bin. Minimize usage of these single-use items in the future.',
        'recommendation': 'Dispose of in the general landfill container. Consider seeking sustainable reusable alternatives to reduce trash production.',
        'environmental_tip': 'Landfilled trash contributes to long-term landfill expansion, plastic fragmentation into microplastics, and long-lasting chemical pollution.',
        'xai_explanation': 'The model detected non-standard composite textures, heavily soiled items, or mixed materials that lack clean recyclable structures.'
    }
}

def get_waste_details(class_name, confidence=1.0):
    details = WASTE_CLASSES_DETAILS.get(class_name, {
        'instructions': 'Check with your local recycling authority for proper disposal guidelines.',
        'recommendation': 'Dispose of according to local municipal guidelines.',
        'environmental_tip': 'Reducing waste at the source is the most effective way to protect the environment.',
        'xai_explanation': 'The model classified this material based on general visual features.'
    })
    
    # Generate custom response template
    return {
        'class': class_name,
        'confidence': f"{confidence:.2f}%",
        'instructions': details['instructions'],
        'recommendation': details['recommendation'],
        'environmental_tip': details['environmental_tip'],
        'xai_explanation': details['xai_explanation']
    }
