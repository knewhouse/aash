$(document).ready(function(){

	function cellEntries(json, dest) {
		var table = document.createElement('table');
		var thead = document.createElement('thead');
		var tbody = document.createElement('tbody');
		var thr, tr, i, entry;
		var entries = json.feed.entry;
		var cols = json.feed.gs$colCount.$t;

		for (i = 0; i <cols; i++) {
			entry = json.feed.entry[i];
			if (entry.gs$cell.col == '1') {
				if (thr != null) {
					tbody.appendChild(thr);
				}
				thr = document.createElement('tr');
			}
			var th = document.createElement('th');
			th.appendChild(document.createTextNode(entry.content.$t));
			thr.appendChild(th);
		}
		for (i = cols; i < json.feed.entry.length; i++) {
			entry = json.feed.entry[i];
			if (entry.gs$cell.col == '1') {
				if (tr != null) {
					tbody.appendChild(tr);
				}
				tr = document.createElement('tr');
			}
			var td = document.createElement('td');
			td.appendChild(document.createTextNode(entry.content.$t));
			tr.appendChild(td);
		}
		$(thead).append(thr);
		$(tbody).append(tr);
		$(table).append(thead);
		$(table).append(tbody);
		$(dest).append(table);
		$(dest + ' table').dataTable();
	}

	function importGSS(json){
		cellEntries(json, '#Destination');
	}

});
//You can then call back the function with ... where #Destination is the <div> you want to add the HTML table to.
