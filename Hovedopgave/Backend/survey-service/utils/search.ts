import { Op } from 'sequelize';

export const search = (value: string, keys: string[]) => {
    let where = {};

    if (value) {
        const searchValue = value.trim().split(/\s+/);
        const result: unknown[] = [];

        searchValue.forEach((e: string) => {
            keys.forEach((key: string) => {
                result.push({ [key]: { [Op.iLike]: `%${e}%` } });
            });
        });

        where = {
            ...where,
            [Op.or]: result,
        };
    }

    return where;
};

export const searchFilters = () => {
    const test = '5';
};
