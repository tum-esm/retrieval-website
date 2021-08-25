import generateDayObject from './generate-day-object';

describe('generateDayObject', () => {
    it('should work for empty lists', () => {
        generateDayObject([]);
        expect(generateDayObject([])).toMatchObject({});
    });

    it('should work for non empty lists', () => {
        const list1 = ['20210801', '20200801', '20210803', '20210701'];
        const list2 = ['20210803', '20210701', '20210801', '20200801'];
        const result = {
            '2020': {
                '08': ['01'],
            },
            '2021': {
                '07': ['01'],
                '08': ['01', '03'],
            },
        };
        expect(generateDayObject(list1)).toMatchObject(result);
        expect(generateDayObject(list2)).toMatchObject(result);
    });
});
