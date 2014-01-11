(function() {
// wrap everything in a closure to as to not leak any logic to the global scope

// jquery extension to get variables from a querystring

	$.extend({
		getUrlVars: function () {
			var vars = [],
					hash;
			var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

			for (var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}

			return vars;
		},

		getUrlVar: function (name) {
			return $.getUrlVars()[name];
		}
	});

	// variables

	var anyquery = false;
	var fdnq = decodeURIComponent($.getUrlVar('fdnq'));
	var fdop = decodeURIComponent($.getUrlVar('fdop'));
	var fdtq = decodeURIComponent($.getUrlVar('fdtq'));
	var fdall = decodeURIComponent($.getUrlVar('fdall'));

	// function definitions

	function drawVisualization () {
		var search_url = 'https://spreadsheets.google.com/a/google.com/tq?key=0AhUJB3GWy1KvdDlDclZQQW9RSWV2THVPMU9vckd6UFE';

		if (fdtq === 'undefined') {
			fdtq = '';
		}

		if (fdnq == 'undefined') {
			fdnq = '';
		}

		if (fdall) {
			var querystring = "select *";
		} else {
			var querystring = "select A,B,C,D,E where ";

			if (fdtq != '' && fdnq === '') {
				querystring = querystring + "E like '%" + fdtq + "%'";
			} else if (fdtq === '' && fdnq != '') {
				querystring = querystring + "A" + fdop + fdnq;
			} else {
				querystring = querystring + "E like '%" + fdtq + "%'" + " and " + "A" + fdop + fdnq;
			}
		}

		querystring = encodeURIComponent(querystring);
		search_url = search_url + "&tq=" + querystring;
		search_url = search_url.replace(/#&tq/, '&tq');
		var query = new google.visualization.Query(search_url);
		query.send(handleQueryResponse);
	}

	function handleQueryResponse (response) {
		if (response.isError()) {
			('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
			return;
		}
		var data = response.getDataTable();
		var control1_use = new google.visualization.ControlWrapper({
			'controlType': 'StringFilter',
			'containerId': 'control1',
			'page': 'disable' ,
			'options': {
				'filterColumnLabel': 'AASH CERT #',
				'matchType': 'any',
				'ui': {
					'label': 'Type in new number',
					'cssClass': 'custom-stringfilter',
					'allowMultiple': false,
					'allowTyping': false
				}
			}
		});
		var classes = {
			headerRow: 'header',
			tableRow: 'row',
			hoverTableRow: 'hoverRow',
			oddTableRow: 'oddRow',
			selectedTableRow: 'selectedRow',
			tableCell: 'cell',
			headderCell: 'headCell'
		};
		var table = new google.visualization.ChartWrapper({
			'chartType': 'Table',
			'containerId': 'chart1',
			'options': {
				'cssClassNames': classes,
				'allowHtml': 'true'
			}
		});
		var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard')).bind([control1_use], [table]).draw(data);
		$('div#dashboard').show();
	}

	function fd_refresh () {
		var qs = '';
		var fdop = $('#sheet_op').val();
		var fdnq = $('#range_num').val();
		var fdtq = $('#search_text').val();
		var sURL = window.location.href;

		sURL = sURL.replace(/(fdtq=.*&|fdtq=.*$)/gi, '');
		sURL = sURL.replace(/(fdnq=.*&|fdnq=.*$)/gi, '');
		sURL = sURL.replace(/(fdop=.*&|fdop=.*$)/gi, '');
		sURL = sURL.replace(/(fdall=.*&|fdall=.*$)/gi, '');
		sURL = sURL.replace(/&$/, '');

		var found = sURL.search('\\?');

		if (found == -1) {
			qs = "?";
		}

		if (fdnq == "Enter a number") {
			fdnq = ''
		}

		if (fdtq == "Ex: 99999") {
			fdtq = ''
		}

		if (fdnq == '' && fdtq == '') {
			var allrecs = true;
		}

		if (allrecs) {
			// qs = qs + "fdall=true";
		} else {
			qs = qs + "&fdop=" + encodeURIComponent(fdop) + "&fdnq=" + encodeURIComponent(fdnq) + "&fdtq=" + encodeURIComponent(fdtq);
		}[]

		sURL = sURL + qs;

		window.location.replace(sURL);
	}

	// not sure what's going on after this
	// or above either actually

	if (fdall != 'undefined') {
		fdall = true;
	} else {
		fdall = false;
	}

	if (fdtq != 'undefined' || fdnq != 'undefined' || fdall == true) {
		anyquery = true;
		google.setOnLoadCallback(drawVisualization);
	} else {
		fdtq = 'Ex: 99999';
		fdnq = 'Enter a number';
	}

	$(document).ready(function () {
		if (anyquery == false) {
			$('#dashboard').hide();
		}

		$('#search_text').val(fdtq);
		$('#range_num').val(fdnq);

		$('#range_num')
			.focus(function () {
				if ($(this).val() == 'Enter a number') {
					$(this).val('');
				}
			})
			.blur(function () {
				if ($(this).val() == '') {
					$(this).val('Enter a number');
				}
			});

		$('#search_text')
			.focus(function () {
				if ($(this).val() == 'Ex: 99999') {
					$(this).val('');
				}
			})
			.blur(function () {
				if ($(this).val() == '') {
					$(this).val('Ex: 99999');
				}
			});

		$('#submit_cert').submit(function(e){
			$('#search_text').prop('disabled', true);
			e.preventDefault();
			fd_refresh();
		});
	});

})();
