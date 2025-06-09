interface PaginationParams {
    page: number;
    size: number;
}

export const getPagination = ({ page, size }: PaginationParams) => {
    const limit = size ? +size : 4;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

export const getPagingData = (data: any, { page, size }: PaginationParams) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / size);
    const hasNextPage = currentPage + 1 < totalPages;
    const hasPreviousPage = currentPage !== 0;
    return {
        items,
        pageInfo: {
            totalItems,
            totalPages,
            currentPage,
            hasNextPage,
            hasPreviousPage,
        },
    };
};

export const paginate = (query: any, { page, size }: PaginationParams) => {
    const offset = page * size;
    const limit = size;

    return {
        ...query,
        offset,
        limit,
    };
};
