require('font-awesome-webpack');

let _model, _options, _res;

let orderBy = 'company_name';

let $table, $tr, $th, $td, $thead, $tbody, $icon;

class CTableView {

    constructor(model, options) {
        _model = model;
        _options = options;

        $table = document.createElement('table');
        $tr = document.createElement('tr');
        $th = document.createElement('th');
        $td = document.createElement('td');
        $thead = document.createElement('thead');
        $tbody = document.createElement('tbody');
        $icon = document.createElement('i');

        this._render(orderBy);
    }

    _render(order) {
        let self = this;
        orderBy = order;

        $table.classList.add('c-table');

        _model.get(_options.url, order).then((response) => {
            _res = response;
            let table = self._buildTable(_res);

            _options.el.innerHTML = '';
            _options.el.appendChild(table);
        });

        document.querySelector('body').addEventListener('click', this._triggerSortItems.bind(this));
    }

    _buildTable(list) {
        let table = $table.cloneNode(false);
        let tbody = $tbody.cloneNode(false);
        let columns = this._addColumnHeaders(list, table);

        list.forEach((item, rowIndex) => {
            let tr = $tr.cloneNode(false);

            if (rowIndex % 2 === 0) {
                tr.classList.add('even');
            } else {
                tr.classList.add('odd');
            }

            columns.forEach((col, columnIndex) => {
                let td = $td.cloneNode(false);
                let cellValue = list[rowIndex][columns[columnIndex]];

                td.appendChild(document.createTextNode(cellValue || ''));
                tr.appendChild(td);
                tbody.appendChild(tr);
            });

            table.appendChild(tbody);

        });

        return table;
    }

    _addColumnHeaders(list, table) {
        let columnSet = [];
        let thead = $thead.cloneNode(false);
        let tr = $tr.cloneNode(false);

        for (let i = 0, l = list.length; i < l; i++) {
            for (let key in list[i]) {
                let k = key.replace(/_/g, ' ');

                if (list[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
                    columnSet.push(key);
                    let th = $th.cloneNode(false);
                    let icon = $icon.cloneNode(false);
                    let span = document.createElement('span');

                    span.appendChild(document.createTextNode(k));
                    th.appendChild(span);
                    icon.classList.add('fa');

                    if (key === orderBy) {
                        icon.classList.add('fa-angle-down');
                    } else {
                        icon.classList.add('fa-angle-up');
                    }

                    th.appendChild(icon);
                    tr.appendChild(th);
                    thead.appendChild(tr);
                }
            }
        }

        table.appendChild(thead);

        return columnSet;
    }

    _triggerSortItems(event) {
        if (event.target.tagName.toLowerCase() === 'th') {
            this._render(event.target.textContent.replace(/ /g, '_'));
        }

        event.preventDefault();
    }

}

export default CTableView;
