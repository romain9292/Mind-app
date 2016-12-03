angular.module('starter.filters', ['firebase'])

//Filter to display the date on activities page in a more friendly way

.filter('friendlyDate', function() {
        return function(date) {
    		return moment(date).format('LLLL');
    	};
});