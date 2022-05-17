export default function defineComponent({ name, template, schema }) {
	name('bridge:rotate_on_place')
	schema({
		properties: {
			rotation_from: {
				type: 'string',
				enum: ['player', 'block_face'],
			},
		},
	})

	template(({ rotation_from = 'player' }, { create }) => {
		const rotationLookup = [
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 180.0],
			[90.0, 0.0, 0.0],
			[-90.0, 0.0, 0.0],
			[0.0, 0.0, -90.0],
		]
		create(
			{
				'parv:direction': [0, 1, 2, 3, 4, 5],
			},
			'minecraft:block/description/properties'
		)

		create(
			{
				permutations: rotationLookup.map((rotation, i) => ({
					condition: `query.block_property('parv:direction') == ${i}`,
					components: {
						'minecraft:rotation': rotation,
					},
				})),
			},
			'minecraft:block'
		)

		create(
			{
				'minecraft:on_player_placing': {
					event: 'parv:onplace',
				},
			},
			'minecraft:block/components'
		)

		create(
			{
				'parv:onplace': {
					set_block_property: {
						'parv:direction':
							rotation_from === 'player'
								? 'query.cardinal_facing'
								: 'query.block_face',
					},
				},
			},
			'minecraft:block/events'
		)
	})
}
