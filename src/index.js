export default class QueryBuilder {
    constructor() {
        this.filters = {};
        this.sort = [];
    }

    addFilter(name, value) {
        this.filters = {
            ...this.filters,
            [name]: this.filters[name] ? [...this.filters[name], value] : [value]
        };
    }

    addSort(column, direction = "asc") {
        const index = this.sort.findIndex(item => item.name === column);

        const newSort = {
            name: column,
            direction: direction === "asc" ? "" : "-"
        };

        if (index === -1) {
            this.sort.push(newSort);
        } else {
            this.sort = [
                ...this.sort.slice(0, index),
                ...this.sort.slice(index + 1),
                {
                    name: column,
                    direction: direction === "asc" ? "" : "-"
                }
            ];
        }
    }

    removeSort(column) {
        const index = this.sort.findIndex(item => (item.name = column));

        if (index !== -1) {
            this.sort = [...this.sort.slice(0, index), ...this.sort.slice(index + 1)];
        }
    }

    build() {
        const query = [];

        // Filters
        query.push(
            Object.keys(this.filters)
                .map(filter => {
                    const joinedValues = this.filters[filter].join(",");
                    return `filter[${filter}]=${joinedValues}`;
                })
                .join("&")
        );

        // Sorts
        if (this.sort.length > 0) {
            query.push(
                "sort=" +
                this.sort
                    .map(item => `${item.direction}${item.name}`)
                    .reverse()
                    .join(",")
            );
        }

        return query.join("&");
    }
}