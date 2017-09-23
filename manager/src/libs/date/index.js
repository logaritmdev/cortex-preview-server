module.exports = {

	iso: function(value) {

		if (value == null) {
			return null
		}

		value = new Date(value)
		value.setMilliseconds(0)

		return value.toISOString()
	}

}