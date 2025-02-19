import type { Root } from './test_model';

const ROOT: Root = {
  id: 1,
  name: 'Root',
  children: [
    {
      id: 2,
      name: 'Child 1',
      children: [
        {
          id: 3,
          name: 'Child 1.1',
          value: "true",
          children: [
            {
              id: 4,
              name: 'Child 1.1.1',
              children: [
                {
                  id: 5,
                  name: 'Child 1.1.1.1',
                  children: [
                    {
                      id: 11,
                      name: 'ほげほげ',
                      value: "true",
                      children: [],
                    }
                  ]
                },
                {
                  id: 6,
                  name: 'Child 1.1.1.1.1',
                  children: [
                    {
                      id: 7,
                      name: 'Child 1.1.1.1.1.1',
                      children: [
                        {
                          id: 8,
                          name: 'Child 1.1.1.1.1.1.1',
                          children: [
                            {
                              id: 9,
                              name: 'Child 1.1.1.1.1.1.1.1',
                              children: [
                                {
                                  id: 10,
                                  name: 'Child 1.1.1.1.1.1.1.1.1',
                                  children: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
