export const now = () => new Date().getTime();

export const localDB = {
	get  : function(key) {
		var entry = JSON.parse(localStorage.getItem(key)||"0");
		if (!entry) return null;
		if (entry.ttl && entry.ttl + entry.now < now()) {
			localStorage.removeItem(key);
			return null;
		}
		return entry.value;
	},
	set : function( key, value, ttl ) {
		localStorage.setItem( key, JSON.stringify({
			ttl   : ttl || 0,
			now   : now(),
			value : value
		}) );
	}
};
